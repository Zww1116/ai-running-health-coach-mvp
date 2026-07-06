import { describe, expect, it } from 'vitest';
import { dataCenterSections, manualRecordTypes } from '../features/dataCenter/dataCenterConfig';

describe('data center configuration', () => {
  it('defines the four V2 data collection entrances in order', () => {
    expect(dataCenterSections.map((section) => section.id)).toEqual([
      'coros',
      'sleep',
      'nutrition',
      'manual',
    ]);
  });

  it('lists all manual record types required by the data center', () => {
    expect(manualRecordTypes.map((type) => type.id)).toEqual([
      'running',
      'strength',
      'nutrition',
      'sleep',
      'pain',
      'cycle',
    ]);
  });
});
