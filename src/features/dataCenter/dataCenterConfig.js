export const dataCenterSections = [
  {
    id: 'coros',
    title: 'COROS 数据导入',
    description: '上传 FIT / TCX / GPX / CSV 文件，先生成可复核草稿。',
  },
  {
    id: 'sleep',
    title: '睡眠与恢复',
    description: '手动记录睡眠结构，并上传 COROS 睡眠截图。',
  },
  {
    id: 'nutrition',
    title: '饮食图片',
    description: '上传饮食照片预览，保留未来 OCR / AI 识别入口。',
  },
  {
    id: 'manual',
    title: '手动记录',
    description: '补充跑步、力量、饮食、睡眠、疼痛和经期信息。',
  },
];

export const manualRecordTypes = [
  { id: 'running', label: '跑步' },
  { id: 'strength', label: '力量' },
  { id: 'nutrition', label: '饮食' },
  { id: 'sleep', label: '睡眠' },
  { id: 'pain', label: '疼痛' },
  { id: 'cycle', label: '经期' },
];
