const FIT_EPOCH_OFFSET_SECONDS = 631065600;

const headerAliases = {
  date: ['date', 'activitydate', 'starttime', 'time', '日期', '开始时间'],
  activityType: ['activitytype', 'type', 'sport', 'workouttype', '运动类型', '类型'],
  name: ['name', 'title', 'activityname', 'workoutname', '名称', '标题'],
  distanceKm: ['distancekm', 'distance', 'distance(km)', '距离km', '距离'],
  duration: ['duration', 'time', 'elapsedtime', 'movingtime', '运动时间', '持续时间', '时长'],
  pace: ['avgpace', 'averagepace', 'pace', '配速', '平均配速'],
  avgHr: ['avghr', 'averagehr', 'averageheartrate', 'heartrate', '平均心率', '心率'],
  cadence: ['cadence', 'avgcadence', 'averagecadence', '步频', '平均步频'],
  rpe: ['rpe', 'effort', 'perceivedeffort', '体感强度'],
};

export function parseCorosActivityFile({ fileName, content }) {
  const extension = fileName.split('.').pop()?.toLowerCase();

  if (extension === 'csv') return parseCorosTrainingHubCsv(String(content));
  if (extension === 'gpx') return parseGpx(String(content), fileName);
  if (extension === 'tcx') return parseTcx(String(content), fileName);
  if (extension === 'fit') return parseFit(content, fileName);

  throw new Error('暂不支持该文件类型，请上传支持 FIT、TCX、GPX 或 CSV 文件。');
}

export function parseCorosTrainingHubCsv(csvText) {
  const rows = parseCsv(csvText);
  if (rows.length < 2) {
    throw new Error('COROS CSV 至少需要包含表头和一条运动记录。');
  }

  const headers = rows[0].map(normalizeHeader);
  const records = rows
    .slice(1)
    .filter((row) => row.some((cell) => cell.trim()))
    .map((row) => toRecord(headers, row));

  if (!records.length) {
    throw new Error('没有找到可解析的 COROS 运动记录。');
  }

  const latest = records.sort((a, b) => getTime(b.date) - getTime(a.date))[0];
  const typeText = `${latest.activityType} ${latest.name}`.toLowerCase();

  if (isStrength(typeText)) {
    return {
      source: 'COROS Training Hub CSV',
      activityType: 'strength',
      patch: {
        date: latest.date,
        strengthTrained: true,
        strengthFocus: latest.name || latest.activityType || 'COROS 力量训练',
        strengthMinutes: parseDurationMinutes(latest.duration),
      },
    };
  }

  return buildRunningImport({
    source: 'COROS Training Hub CSV',
    fileName: latest.name || latest.activityType || '跑步记录',
    date: latest.date,
    distanceKm: parseNumber(latest.distanceKm),
    durationMin: parseDurationMinutes(latest.duration),
    avgHeartRate: parseNumber(latest.avgHr),
    cadence: parseNumber(latest.cadence),
    runningType: mapRunningType(typeText),
    pace: formatPace(latest.pace),
    notePrefix: 'COROS 文件导入',
  }, { rpe: parseNumber(latest.rpe) || 4 });
}

function parseGpx(text, fileName) {
  const points = [...text.matchAll(/<trkpt[^>]*lat=["']([^"']+)["'][^>]*lon=["']([^"']+)["'][^>]*>([\s\S]*?)<\/trkpt>/gi)]
    .map((match) => ({
      lat: Number(match[1]),
      lon: Number(match[2]),
      time: extractFirst(match[3], /<time>(.*?)<\/time>/i),
      hr: parseNumber(extractFirst(match[3], /<(?:[^:>]+:)?hr>(.*?)<\/(?:[^:>]+:)?hr>/i)),
    }))
    .filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lon));

  if (points.length < 2) {
    throw new Error('GPX 文件解析失败：没有找到足够的跑步轨迹点。');
  }

  const distanceKm = round(points.slice(1).reduce((total, point, index) => total + haversineKm(points[index], point), 0), 2);
  const durationMin = durationBetweenMinutes(points[0].time, points[points.length - 1].time);
  const avgHeartRate = average(points.map((point) => point.hr).filter(Boolean));

  return buildRunningImport({
    source: 'COROS GPX',
    fileName,
    date: toDate(points[0].time),
    distanceKm,
    durationMin,
    avgHeartRate,
    cadence: 0,
    runningType: 'easy',
    notePrefix: 'COROS GPX 导入',
  });
}

function parseTcx(text, fileName) {
  const timeValues = extractAll(text, /<Time>(.*?)<\/Time>/gi);
  const distanceMeters = extractAll(text, /<DistanceMeters>(.*?)<\/DistanceMeters>/gi).map(parseNumber);
  const heartRates = extractAll(text, /<HeartRateBpm>\s*<Value>(.*?)<\/Value>\s*<\/HeartRateBpm>/gi).map(parseNumber);
  const totalTimeSeconds = parseNumber(extractFirst(text, /<TotalTimeSeconds>(.*?)<\/TotalTimeSeconds>/i));
  const lapDistanceMeters = parseNumber(extractFirst(text, /<Lap[\s\S]*?<DistanceMeters>(.*?)<\/DistanceMeters>/i));

  const distanceKm = round((Math.max(...distanceMeters, lapDistanceMeters, 0)) / 1000, 2);
  const durationMin = totalTimeSeconds ? Math.round(totalTimeSeconds / 60) : durationBetweenMinutes(timeValues[0], timeValues[timeValues.length - 1]);

  if (!distanceKm || !durationMin) {
    throw new Error('TCX 文件解析失败：没有找到跑步距离或时长。');
  }

  return buildRunningImport({
    source: 'COROS TCX',
    fileName,
    date: toDate(timeValues[0] || extractFirst(text, /<Id>(.*?)<\/Id>/i)),
    distanceKm,
    durationMin,
    avgHeartRate: average(heartRates.filter(Boolean)),
    cadence: 0,
    runningType: 'easy',
    notePrefix: 'COROS TCX 导入',
  });
}

function parseFit(content, fileName) {
  const view = new DataView(toArrayBuffer(content));
  const headerSize = view.getUint8(0);
  const dataSize = view.getUint32(4, true);
  const definitions = new Map();
  let offset = headerSize;
  const end = headerSize + dataSize;

  while (offset < end) {
    const recordHeader = view.getUint8(offset);
    offset += 1;
    const localMessageType = recordHeader & 0x0f;

    if (recordHeader & 0x40) {
      const hasDeveloperFields = Boolean(recordHeader & 0x20);
      offset += 1;
      const architecture = view.getUint8(offset);
      offset += 1;
      const littleEndian = architecture === 0;
      const globalMessageNumber = readUint(view, offset, 2, littleEndian);
      offset += 2;
      const fieldCount = view.getUint8(offset);
      offset += 1;
      const fields = [];

      for (let index = 0; index < fieldCount; index += 1) {
        fields.push({
          number: view.getUint8(offset),
          size: view.getUint8(offset + 1),
          type: view.getUint8(offset + 2),
        });
        offset += 3;
      }

      if (hasDeveloperFields) {
        const devFieldCount = view.getUint8(offset);
        offset += 1 + devFieldCount * 3;
      }

      definitions.set(localMessageType, { globalMessageNumber, fields, littleEndian });
      continue;
    }

    const definition = definitions.get(localMessageType);
    if (!definition) {
      throw new Error('FIT 文件解析失败：找不到数据字段定义。');
    }

    const values = {};
    for (const field of definition.fields) {
      values[field.number] = readFitValue(view, offset, field, definition.littleEndian);
      offset += field.size;
    }

    if (definition.globalMessageNumber === 20) {
      return fitSessionToRunningImport(values, fileName);
    }
  }

  throw new Error('FIT 文件解析失败：当前 MVP 仅支持包含 session 汇总的 FIT 跑步文件。可先导出 TCX/GPX。');
}

function fitSessionToRunningImport(values, fileName) {
  const startTime = Number(values[2] ?? 0);
  const distanceKm = round(Number(values[5] ?? 0) / 100000, 2);
  const durationMin = Math.round(Number(values[13] ?? 0) / 1000 / 60);
  const avgHeartRate = Number(values[33] ?? 0);

  if (!distanceKm || !durationMin) {
    throw new Error('FIT 文件解析失败：没有找到跑步距离或时长。');
  }

  return buildRunningImport({
    source: 'COROS FIT',
    fileName,
    date: new Date((startTime + FIT_EPOCH_OFFSET_SECONDS) * 1000).toISOString().slice(0, 10),
    distanceKm,
    durationMin,
    avgHeartRate,
    cadence: 0,
    runningType: 'easy',
    notePrefix: 'COROS FIT 导入',
  });
}

function buildRunningImport(input, options = {}) {
  const pace = input.pace || paceFrom(input.durationMin, input.distanceKm);
  return {
    source: input.source,
    activityType: 'running',
    patch: {
      date: input.date,
      runningKm: input.distanceKm,
      runningType: input.runningType,
      runningDurationMin: input.durationMin,
      runningPace: pace,
      runningAvgHr: input.avgHeartRate,
      runningCadence: input.cadence,
      runningRpe: options.rpe ?? 4,
      runningNote: `${input.notePrefix}：${input.fileName}`,
    },
  };
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      row.push(cell.trim());
      cell = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') index += 1;
      row.push(cell.trim());
      rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += char;
    }
  }

  if (cell || row.length) {
    row.push(cell.trim());
    rows.push(row);
  }

  return rows.filter((item) => item.length && item.some(Boolean));
}

function toRecord(headers, row) {
  return Object.fromEntries(
    Object.keys(headerAliases).map((key) => [key, valueFor(headers, row, key)]),
  );
}

function valueFor(headers, row, key) {
  const aliases = headerAliases[key].map(normalizeHeader);
  const index = headers.findIndex((header) => aliases.includes(header));
  return index >= 0 ? row[index] ?? '' : '';
}

function normalizeHeader(header) {
  return header.toLowerCase().replace(/[\s_（）()/-]/g, '');
}

function getTime(dateText) {
  const parsed = Date.parse(dateText);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function isStrength(typeText) {
  return typeText.includes('strength') || typeText.includes('gym') || typeText.includes('力量');
}

function mapRunningType(typeText) {
  if (typeText.includes('marathon')) return 'marathon-pace';
  if (typeText.includes('tempo') || typeText.includes('threshold') || typeText.includes('节奏')) return 'tempo';
  if (typeText.includes('interval') || typeText.includes('repeat') || typeText.includes('间歇')) return 'interval';
  if (typeText.includes('long') || typeText.includes('长距离')) return 'long';
  if (typeText.includes('rest') || typeText.includes('休息')) return 'rest';
  return 'easy';
}

function parseDurationMinutes(value) {
  if (!value) return 0;
  if (!value.includes(':')) return Math.round(parseNumber(value));

  const parts = value.split(':').map(Number);
  if (parts.some(Number.isNaN)) return 0;

  if (parts.length === 3) {
    return Math.round(parts[0] * 60 + parts[1] + parts[2] / 60);
  }

  if (parts.length === 2) {
    return Math.round(parts[0] + parts[1] / 60);
  }

  return 0;
}

function parseNumber(value) {
  const parsed = Number(String(value ?? '').replace(/[^\d.-]/g, ''));
  return Number.isNaN(parsed) ? 0 : parsed;
}

function formatPace(value) {
  return String(value ?? '').replace(/\/km|min\/km/gi, '').trim();
}

function extractFirst(text, pattern) {
  return pattern.exec(text)?.[1] ?? '';
}

function extractAll(text, pattern) {
  return [...text.matchAll(pattern)].map((match) => match[1]);
}

function toDate(value) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString().slice(0, 10) : parsed.toISOString().slice(0, 10);
}

function durationBetweenMinutes(start, end) {
  const startTime = Date.parse(start);
  const endTime = Date.parse(end);
  if (Number.isNaN(startTime) || Number.isNaN(endTime)) return 0;
  return Math.round((endTime - startTime) / 60000);
}

function haversineKm(a, b) {
  const radiusKm = 6371;
  const dLat = toRadians(b.lat - a.lat);
  const dLon = toRadians(b.lon - a.lon);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * radiusKm * Math.asin(Math.sqrt(h));
}

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function average(values) {
  if (!values.length) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function paceFrom(durationMin, distanceKm) {
  if (!durationMin || !distanceKm) return '';
  const totalSeconds = Math.round((durationMin * 60) / distanceKm);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function round(value, digits) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function toArrayBuffer(content) {
  if (content instanceof ArrayBuffer) return content;
  if (ArrayBuffer.isView(content)) return content.buffer.slice(content.byteOffset, content.byteOffset + content.byteLength);
  throw new Error('FIT 文件解析失败：请上传二进制 FIT 文件。');
}

function readFitValue(view, offset, field, littleEndian) {
  if (field.size === 1) return view.getUint8(offset);
  return readUint(view, offset, field.size, littleEndian);
}

function readUint(view, offset, size, littleEndian) {
  if (size === 2) return view.getUint16(offset, littleEndian);
  if (size === 4) return view.getUint32(offset, littleEndian);

  let value = 0;
  for (let index = 0; index < size; index += 1) {
    const byte = view.getUint8(offset + (littleEndian ? index : size - 1 - index));
    value += byte * 256 ** index;
  }
  return value;
}
