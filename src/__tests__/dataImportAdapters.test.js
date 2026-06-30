import { describe, expect, it } from 'vitest';
import { syncLatestCorosRunning, syncLatestCorosStrength } from '../integrations/corosClient';
import { requestAiCoachAnalysis } from '../integrations/openaiClient';
import { parseCorosTrainingHubCsv } from '../integrations/corosFileParser';
import { syncHealthRecords } from '../integrations/supabaseClient';
import { getNutritionVisionMode } from '../integrations/nutritionVisionClient';
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
});
