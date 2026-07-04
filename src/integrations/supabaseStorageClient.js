export async function uploadRecordAttachment() {
  return {
    provider: 'Supabase Storage',
    status: 'not_configured',
    message: '当前阶段图片仅保存在当前浏览器；后续接入 Supabase Storage 后再启用上传。',
  };
}
