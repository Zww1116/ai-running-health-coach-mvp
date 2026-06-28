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

  return {
    source: 'COROS Training Hub CSV',
    activityType: 'running',
    patch: {
      date: latest.date,
      runningKm: parseNumber(latest.distanceKm),
      runningType: mapRunningType(typeText),
      runningDurationMin: parseDurationMinutes(latest.duration),
      runningPace: formatPace(latest.pace),
      runningAvgHr: parseNumber(latest.avgHr),
      runningCadence: parseNumber(latest.cadence),
      runningRpe: parseNumber(latest.rpe) || 4,
      runningNote: `COROS 文件导入：${latest.name || latest.activityType || '跑步记录'}`,
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
