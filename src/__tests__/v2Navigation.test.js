import { describe, expect, it } from 'vitest';
import { appPages, getDefaultPageId, getPageById } from '../pages/pageConfig';

describe('V2 page navigation', () => {
  it('defines the first-round Personal AI Health OS pages in priority order', () => {
    expect(appPages.map((page) => page.id)).toEqual([
      'today',
      'records',
      'import',
      'analysis',
      'settings',
    ]);
  });

  it('uses today decision as the default page', () => {
    expect(getDefaultPageId()).toBe('today');
    expect(getPageById('today')).toMatchObject({
      title: '今日决策台',
      purpose: '获取数据 → 多专家分析 → 总教练决策',
    });
  });

  it('falls back to today when a page id is unknown', () => {
    expect(getPageById('missing').id).toBe('today');
  });

  it('uses data center as the data collection page title', () => {
    expect(getPageById('import')).toMatchObject({
      title: '数据中心',
      purpose: '集中采集 COROS、睡眠、饮食图片和手动记录',
    });
  });
});
