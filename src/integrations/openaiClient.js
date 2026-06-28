export async function requestAiCoachAnalysis() {
  return {
    provider: 'OpenAI',
    status: 'not_configured',
    message: '当前 MVP 使用规则版 Agent；配置后端 API 后可升级为 OpenAI 多 Agent。',
  };
}
