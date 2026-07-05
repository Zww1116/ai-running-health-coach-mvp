import { describe, expect, it } from 'vitest';
import { syncLatestCorosRunning, syncLatestCorosStrength } from '../integrations/corosClient';
import { requestAiCoachAnalysis } from '../integrations/openaiClient';
import { parseCorosActivityFile, parseCorosTrainingHubCsv } from '../integrations/corosFileParser';
import { syncHealthRecords } from '../integrations/supabaseClient';
import { getNutritionVisionMode } from '../integrations/nutritionVisionClient';
import { syncLatestCorosSleepRecovery, syncLatestTerraRecovery } from '../integrations/recoverySyncClient';
import { uploadRecordAttachment } from '../integrations/supabaseStorageClient';
import {
  buildOllamaNutritionRequest,
  normalizeNutritionEstimate,
  parseOllamaNutritionResponse,
} from '../../server/ollamaNutrition';

describe('data import adapters', () => {
  it('maps the latest COROS running activity into marathon-focused form fields', async () => {
    const result = await syncLatestCorosRunning();

    expect(result.source).toBe('COROS');
    expect(result.patch).toEqual({
      runningKm: 16.2,
      runningType: 'marathon-pace',
      runningDurationMin: 82,
      runningPace: '5:04',
      runningAvgHr: 152,
      runningCadence: 178,
      runningRpe: 6,
      runningNote: 'COROS 同步：上次马拉松配速跑',
    });
  });

  it('maps the latest COROS strength activity into strength form fields', async () => {
    const result = await syncLatestCorosStrength();

    expect(result.source).toBe('COROS');
    expect(result.patch).toEqual({
      strengthTrained: true,
      strengthFocus: '跑者下肢力量 + 核心',
      strengthMinutes: 46,
    });
  });

  it('reports OpenAI integration status without throwing when no API is configured', async () => {
    const result = await requestAiCoachAnalysis();

    expect(result).toEqual({
      provider: 'OpenAI',
      status: 'not_configured',
      message: '当前 MVP 使用规则版 Agent；配置后端 API 后可升级为 OpenAI 多 Agent。',
    });
  });

  it('reports Supabase integration status without throwing when no project is configured', async () => {
    const result = await syncHealthRecords();

    expect(result).toEqual({
      provider: 'Supabase/PostgreSQL',
      status: 'not_configured',
      message: 'Supabase is not configured. Records are stored in localStorage.',
    });
  });

  it('keeps sleep recovery API sync disabled until a real provider is configured', async () => {
    await expect(syncLatestCorosSleepRecovery()).resolves.toMatchObject({
      provider: 'COROS',
      status: 'not_configured',
    });
    await expect(syncLatestTerraRecovery()).resolves.toMatchObject({
      provider: 'Terra',
      status: 'not_configured',
    });
  });

  it('keeps record attachment cloud uploads disabled in the local-image phase', async () => {
    await expect(uploadRecordAttachment()).resolves.toMatchObject({
      provider: 'Supabase Storage',
      status: 'not_configured',
    });
  });

  it('normalizes local Ollama nutrition JSON into form fields', () => {
    const raw = parseOllamaNutritionResponse(`\`\`\`json
{
  "foods": ["米饭", "鸡胸肉", "西兰花"],
  "calories": 680,
  "protein": 38,
  "carbs": 82,
  "fat": 18,
  "hydration": 0.6,
  "confidence": "medium",
  "notes": "训练日午餐，碳水和蛋白较均衡。"
}
\`\`\``);
    const result = normalizeNutritionEstimate(raw, 'lunch.jpg');

    expect(result.source).toBe('Ollama 本地识别');
    expect(result.fileName).toBe('lunch.jpg');
    expect(result.summary).toContain('米饭');
    expect(result.patch).toEqual({
      calories: 680,
      protein: 38,
      carbs: 82,
      hydration: 0.6,
    });
    expect(result.details).toMatchObject({
      fat: 18,
      confidence: 'medium',
      foods: ['米饭', '鸡胸肉', '西兰花'],
    });
  });

  it('builds an Ollama vision request without a data URL prefix', () => {
    const request = buildOllamaNutritionRequest({
      imageBase64: 'data:image/jpeg;base64,abc123',
      mimeType: 'image/jpeg',
      model: 'qwen2.5vl',
    });

    expect(request.model).toBe('qwen2.5vl');
    expect(request.stream).toBe(false);
    expect(request.messages[0].images).toEqual(['abc123']);
    expect(request.messages[0].content).toContain('JSON');
  });

  it('uses local nutrition vision on localhost and disables it on public preview without a cloud API', () => {
    expect(getNutritionVisionMode('http://127.0.0.1:5173', '')).toEqual({
      mode: 'local',
      endpoint: 'http://127.0.0.1:8787/api/nutrition/estimate',
    });
    expect(getNutritionVisionMode('https://ai-health-demo.vercel.app', '')).toEqual({
      mode: 'public-preview-disabled',
      endpoint: '',
    });
    expect(getNutritionVisionMode('https://ai-health-demo.vercel.app', '/api/nutrition/estimate')).toEqual({
      mode: 'cloud',
      endpoint: '/api/nutrition/estimate',
    });
  });

  it('parses the latest running activity from a COROS Training Hub CSV export', () => {
    const csv = [
      'Date,Activity Type,Name,Distance (km),Duration,Avg Pace,Avg HR,Cadence,RPE',
      '2026-06-20,Run,Easy aerobic,8.0,00:43:00,5:22,142,174,4',
      '2026-06-28,Run,Marathon pace block,16.2,01:22:00,5:04,152,178,6',
    ].join('\n');

    const result = parseCorosTrainingHubCsv(csv);

    expect(result).toEqual({
      source: 'COROS Training Hub CSV',
      activityType: 'running',
      patch: {
        date: '2026-06-28',
        runningKm: 16.2,
        runningType: 'marathon-pace',
        runningDurationMin: 82,
        runningPace: '5:04',
        runningAvgHr: 152,
        runningCadence: 178,
        runningRpe: 6,
        runningNote: 'COROS 文件导入：Marathon pace block',
      },
    });
  });

  it('parses a strength activity from a COROS Training Hub CSV export', () => {
    const csv = [
      'Date,Activity Type,Name,Duration',
      '2026-06-28,Strength,Lower body strength,00:46:00',
    ].join('\n');

    const result = parseCorosTrainingHubCsv(csv);

    expect(result).toEqual({
      source: 'COROS Training Hub CSV',
      activityType: 'strength',
      patch: {
        date: '2026-06-28',
        strengthTrained: true,
        strengthFocus: 'Lower body strength',
        strengthMinutes: 46,
      },
    });
  });

  it('parses a GPX running file into editable form fields', () => {
    const gpx = `<?xml version="1.0"?>
<gpx><trk><name>Morning Run</name><trkseg>
<trkpt lat="31.2304" lon="121.4737"><time>2026-07-04T00:00:00Z</time><extensions><gpxtpx:hr>140</gpxtpx:hr></extensions></trkpt>
<trkpt lat="31.2376" lon="121.4737"><time>2026-07-04T00:05:00Z</time><extensions><gpxtpx:hr>150</gpxtpx:hr></extensions></trkpt>
</trkseg></trk></gpx>`;

    const result = parseCorosActivityFile({ fileName: 'run.gpx', content: gpx });

    expect(result).toMatchObject({
      source: 'COROS GPX',
      activityType: 'running',
      patch: {
        date: '2026-07-04',
        runningDurationMin: 5,
        runningAvgHr: 145,
        runningRpe: 4,
      },
    });
    expect(result.patch.runningKm).toBeGreaterThan(0.7);
    expect(result.patch.runningPace).toMatch(/\d+:\d{2}/);
  });

  it('parses a TCX running file into editable form fields', () => {
    const tcx = `<?xml version="1.0"?>
<TrainingCenterDatabase><Activities><Activity Sport="Running"><Id>2026-07-04T00:00:00Z</Id>
<Lap StartTime="2026-07-04T00:00:00Z"><TotalTimeSeconds>1800</TotalTimeSeconds><DistanceMeters>5000</DistanceMeters>
<Track>
<Trackpoint><Time>2026-07-04T00:00:00Z</Time><DistanceMeters>0</DistanceMeters><HeartRateBpm><Value>140</Value></HeartRateBpm></Trackpoint>
<Trackpoint><Time>2026-07-04T00:30:00Z</Time><DistanceMeters>5000</DistanceMeters><HeartRateBpm><Value>160</Value></HeartRateBpm></Trackpoint>
</Track></Lap></Activity></Activities></TrainingCenterDatabase>`;

    const result = parseCorosActivityFile({ fileName: 'run.tcx', content: tcx });

    expect(result).toEqual({
      source: 'COROS TCX',
      activityType: 'running',
      patch: {
        date: '2026-07-04',
        runningKm: 5,
        runningType: 'easy',
        runningDurationMin: 30,
        runningPace: '6:00',
        runningAvgHr: 150,
        runningCadence: 0,
        runningRpe: 4,
        runningNote: 'COROS TCX 导入：run.tcx',
      },
    });
  });

  it('parses a FIT session summary into editable form fields', () => {
    const result = parseCorosActivityFile({ fileName: 'run.fit', content: createMinimalFitSession() });

    expect(result).toEqual({
      source: 'COROS FIT',
      activityType: 'running',
      patch: {
        date: '2026-07-04',
        runningKm: 10,
        runningType: 'easy',
        runningDurationMin: 50,
        runningPace: '5:00',
        runningAvgHr: 152,
        runningCadence: 0,
        runningRpe: 4,
        runningNote: 'COROS FIT 导入：run.fit',
      },
    });
  });

  it('gives a clear message for unsupported COROS file types', () => {
    expect(() => parseCorosActivityFile({ fileName: 'run.xlsx', content: '' })).toThrow(
      '支持 FIT、TCX、GPX 或 CSV 文件',
    );
  });
});

function createMinimalFitSession() {
  const bytes = [];
  const push = (...values) => bytes.push(...values);
  const u16 = (value) => push(value & 0xff, (value >> 8) & 0xff);
  const u32 = (value) => push(value & 0xff, (value >> 8) & 0xff, (value >> 16) & 0xff, (value >> 24) & 0xff);

  push(14, 0x10);
  u16(0);
  u32(0);
  push(0x2e, 0x46, 0x49, 0x54);
  u16(0);

  const dataStart = bytes.length;
  push(0x40, 0, 0);
  u16(20);
  push(4);
  push(2, 4, 0x86);
  push(5, 4, 0x86);
  push(13, 4, 0x86);
  push(33, 1, 0x02);

  push(0x00);
  u32(Math.round(new Date('2026-07-04T00:00:00Z').getTime() / 1000 - 631065600));
  u32(1000000);
  u32(3000000);
  push(152);

  const dataSize = bytes.length - dataStart;
  bytes[4] = dataSize & 0xff;
  bytes[5] = (dataSize >> 8) & 0xff;
  bytes[6] = (dataSize >> 16) & 0xff;
  bytes[7] = (dataSize >> 24) & 0xff;

  push(0, 0);
  return new Uint8Array(bytes).buffer;
}
