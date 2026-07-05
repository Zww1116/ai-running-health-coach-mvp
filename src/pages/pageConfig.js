export const appPages = [
  {
    id: 'today',
    title: '今日决策台',
    purpose: '获取数据 → 多专家分析 → 总教练决策',
  },
  {
    id: 'records',
    title: '记录中心',
    purpose: '手动补充训练、饮食、睡眠、经期和疼痛',
  },
  {
    id: 'import',
    title: '数据导入中心',
    purpose: '导入 COROS 文件、图片和未来平台数据',
  },
  {
    id: 'analysis',
    title: '多专家分析',
    purpose: '查看每个专家 Agent 的独立判断',
  },
  {
    id: 'settings',
    title: '设置中心',
    purpose: '管理数据、备份、同步和升级入口',
  },
];

export function getDefaultPageId() {
  return appPages[0].id;
}

export function getPageById(pageId) {
  return appPages.find((page) => page.id === pageId) ?? appPages[0];
}
