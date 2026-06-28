export async function estimateNutritionFromMealImage(file) {
  const visionMode = getNutritionVisionMode(window.location.origin, import.meta.env.VITE_NUTRITION_API_URL);
  if (visionMode.mode === 'public-preview-disabled') {
    throw new Error('公网预览版暂不启用饮食图片识别。你仍可手动填写营养数据；本地版可启动 Ollama 后使用图片识别。');
  }

  const imageBase64 = await fileToDataUrl(file);
  const response = await fetch(visionMode.endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageBase64,
      mimeType: file?.type ?? '',
      fileName: file?.name ?? '',
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || '本地饮食图片识别失败。');
  }
  return payload;
}

export function getNutritionVisionMode(origin, configuredEndpoint) {
  const endpoint = String(configuredEndpoint || '').trim();
  if (endpoint) {
    return { mode: 'cloud', endpoint };
  }

  if (isLocalOrigin(origin)) {
    return {
      mode: 'local',
      endpoint: 'http://127.0.0.1:8787/api/nutrition/estimate',
    };
  }

  return {
    mode: 'public-preview-disabled',
    endpoint: '',
  };
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('请先选择饮食图片。'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('饮食图片读取失败。'));
    reader.readAsDataURL(file);
  });
}

function isLocalOrigin(origin) {
  return /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/i.test(String(origin || ''));
}
