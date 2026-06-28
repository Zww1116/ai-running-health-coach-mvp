import { createServer } from 'node:http';
import {
  buildOllamaNutritionRequest,
  normalizeNutritionEstimate,
  parseOllamaNutritionResponse,
} from './ollamaNutrition.js';

const host = process.env.LOCAL_AI_HOST || '127.0.0.1';
const port = Number(process.env.LOCAL_AI_PORT || 8787);
const ollamaUrl = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';
const ollamaModel = process.env.OLLAMA_MODEL || 'qwen2.5vl';
const maxBodyBytes = 16 * 1024 * 1024;

const server = createServer(async (request, response) => {
  if (request.method === 'OPTIONS') {
    sendJson(response, 204, {});
    return;
  }

  if (request.method !== 'POST' || request.url !== '/api/nutrition/estimate') {
    sendJson(response, 404, { error: '未找到本地 AI 接口。' });
    return;
  }

  try {
    const body = await readJsonBody(request);
    if (!body.imageBase64) {
      sendJson(response, 400, { error: '请上传饮食图片后再识别。' });
      return;
    }

    const ollamaResponse = await fetch(`${ollamaUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        buildOllamaNutritionRequest({
          imageBase64: body.imageBase64,
          mimeType: body.mimeType,
          model: ollamaModel,
        }),
      ),
    });

    if (!ollamaResponse.ok) {
      sendJson(response, 502, {
        error: `Ollama 响应失败：HTTP ${ollamaResponse.status}。请确认已执行 ollama pull ${ollamaModel}。`,
      });
      return;
    }

    const payload = await ollamaResponse.json();
    const rawEstimate = parseOllamaNutritionResponse(payload?.message?.content);
    sendJson(response, 200, normalizeNutritionEstimate(rawEstimate, body.fileName));
  } catch (error) {
    const message = error instanceof Error ? error.message : '本地饮食图片识别失败。';
    const isConnectionError = message.includes('fetch failed') || message.includes('ECONNREFUSED');
    sendJson(response, isConnectionError ? 503 : 500, {
      error: isConnectionError
        ? `无法连接 Ollama。请先安装 Ollama，执行 ollama pull ${ollamaModel}，并保持 ollama serve 运行。`
        : message,
    });
  }
});

server.listen(port, host, () => {
  console.log(`Local AI server listening at http://${host}:${port}`);
});

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';

    request.on('data', (chunk) => {
      body += chunk;
      if (Buffer.byteLength(body) > maxBodyBytes) {
        reject(new Error('图片太大，请使用 10MB 以内的饮食图片。'));
        request.destroy();
      }
    });

    request.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch {
        reject(new Error('请求内容不是有效 JSON。'));
      }
    });

    request.on('error', reject);
  });
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  });
  if (statusCode === 204) {
    response.end();
    return;
  }
  response.end(JSON.stringify(payload));
}
