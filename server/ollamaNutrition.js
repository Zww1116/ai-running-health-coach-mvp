const nutritionPrompt = [
  '你是一名运动营养师，请根据这张日常饮食图片估算营养数据。',
  '只返回 JSON，不要返回 Markdown 或解释文字。',
  'JSON 字段必须包含 foods, calories, protein, carbs, fat, hydration, confidence, notes。',
  'calories 单位 kcal；protein, carbs, fat 单位 g；hydration 单位 L。',
  '如果无法确定，请给出保守估计，并把 confidence 设为 low。',
].join('\n');

export function buildOllamaNutritionRequest({ imageBase64, mimeType, model }) {
  return {
    model,
    stream: false,
    messages: [
      {
        role: 'user',
        content: `${nutritionPrompt}\n图片 MIME 类型：${mimeType || 'unknown'}`,
        images: [stripDataUrlPrefix(imageBase64)],
      },
    ],
  };
}

export function parseOllamaNutritionResponse(content) {
  const cleaned = String(content ?? '')
    .trim()
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) {
      throw new Error('Ollama 没有返回可解析的营养 JSON。');
    }
    return JSON.parse(cleaned.slice(start, end + 1));
  }
}

export function normalizeNutritionEstimate(raw, fileName = '') {
  const foods = Array.isArray(raw?.foods) ? raw.foods.map(String).filter(Boolean) : [];
  const calories = toNumber(raw?.calories);
  const protein = toNumber(raw?.protein);
  const carbs = toNumber(raw?.carbs);
  const fat = toNumber(raw?.fat);
  const hydration = toNumber(raw?.hydration);
  const confidence = String(raw?.confidence || 'medium');
  const notes = String(raw?.notes || '请结合实际份量手动校正。');

  return {
    source: 'Ollama 本地识别',
    fileName,
    summary: buildSummary(foods, notes, confidence),
    patch: {
      calories,
      protein,
      carbs,
      hydration,
    },
    details: {
      fat,
      confidence,
      foods,
      notes,
    },
  };
}

function stripDataUrlPrefix(value) {
  return String(value ?? '').replace(/^data:[^;]+;base64,/, '');
}

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.round(number * 10) / 10 : 0;
}

function buildSummary(foods, notes, confidence) {
  const foodText = foods.length > 0 ? foods.slice(0, 4).join('、') : '图片中的食物';
  return `${foodText}；可信度 ${confidence}。${notes}`;
}
