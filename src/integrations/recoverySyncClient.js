export async function syncLatestCorosSleepRecovery() {
  return {
    provider: 'COROS',
    status: 'not_configured',
    message: '当前阶段不连接真实 COROS API；请先手动输入或上传睡眠截图。',
  };
}

export async function syncLatestTerraRecovery() {
  return {
    provider: 'Terra',
    status: 'not_configured',
    message: '当前阶段不连接真实 Terra API；后续可在服务端接入授权同步。',
  };
}
