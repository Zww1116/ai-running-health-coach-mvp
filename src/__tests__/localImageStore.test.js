import { describe, expect, it } from 'vitest';
import { createImageAttachmentMeta, isLocalImageOnlyMode, normalizeAttachmentType } from '../storage/localImageStore';

describe('local image store helpers', () => {
  it('creates local-only attachment metadata without embedding image data', () => {
    const file = new File(['image-bytes'], 'sleep.png', { type: 'image/png' });
    const meta = createImageAttachmentMeta({
      file,
      type: 'sleep',
      id: 'img-1',
      now: () => new Date('2026-07-03T08:00:00.000Z'),
    });

    expect(meta).toEqual({
      id: 'img-1',
      type: 'sleep',
      name: 'sleep.png',
      mimeType: 'image/png',
      size: 11,
      createdAt: '2026-07-03T08:00:00.000Z',
      storage: 'indexeddb',
    });
    expect(meta.dataUrl).toBeUndefined();
  });

  it('limits attachment types to supported local categories', () => {
    expect(normalizeAttachmentType('coros')).toBe('coros');
    expect(normalizeAttachmentType('meal')).toBe('meal');
    expect(normalizeAttachmentType('body')).toBe('body');
    expect(normalizeAttachmentType('sleep')).toBe('sleep');
    expect(normalizeAttachmentType('unknown')).toBe('coros');
  });

  it('keeps this phase in local-image-only mode', () => {
    expect(isLocalImageOnlyMode()).toBe(true);
  });
});
