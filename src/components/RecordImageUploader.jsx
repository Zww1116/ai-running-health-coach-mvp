import { useState } from 'react';
import { ImageUp, Trash2 } from 'lucide-react';
import { createLocalImageStore, normalizeAttachmentType } from '../storage/localImageStore';

const attachmentTypes = [
  { value: 'coros', label: 'COROS 运动截图' },
  { value: 'meal', label: '饮食照片' },
  { value: 'body', label: '体重/体脂截图' },
  { value: 'sleep', label: 'COROS 睡眠截图' },
];

export function RecordImageUploader({
  value = [],
  onChange,
  defaultType = 'coros',
  title = '训练截图/饮食图片上传',
}) {
  const [type, setType] = useState(normalizeAttachmentType(defaultType));
  const [message, setMessage] = useState('');

  async function uploadImages(event) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    const imageStore = createLocalImageStore();
    try {
      const metas = await Promise.all(files.map((file) => imageStore.save(file, type)));
      onChange([...value, ...metas]);
      setMessage(`已本地保存 ${metas.length} 张图片，不会上传服务器。`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '图片本地保存失败。');
    } finally {
      event.target.value = '';
    }
  }

  async function removeImage(id) {
    await createLocalImageStore().delete(id);
    onChange(value.filter((item) => item.id !== id));
    setMessage('已删除当前浏览器里的本地图片。');
  }

  return (
    <div className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 md:col-span-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-ink">{title}</h3>
          <p className="text-xs leading-5 text-slate-500">
            先保存在当前浏览器本地，后续可接 Supabase Storage。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={type}
            onChange={(event) => setType(normalizeAttachmentType(event.target.value))}
            className="min-h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-ink outline-none focus:border-coral focus:ring-2 focus:ring-coral/20"
          >
            {attachmentTypes.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <label className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-md bg-ink px-3 text-sm font-semibold text-white hover:bg-moss">
            <ImageUp size={16} />
            上传图片
            <input type="file" accept="image/*" multiple onChange={uploadImages} className="sr-only" />
          </label>
        </div>
      </div>

      {message && <p className="text-xs text-slate-500">{message}</p>}

      {value.length > 0 && (
        <div className="grid gap-2">
          {value.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              <span className="text-slate-700">
                {typeLabel(item.type)} · {item.name}
              </span>
              <button
                type="button"
                onClick={() => removeImage(item.id)}
                className="inline-flex items-center gap-1 text-xs font-medium text-coral hover:text-ink"
              >
                <Trash2 size={14} />
                删除
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function typeLabel(type) {
  return attachmentTypes.find((item) => item.value === type)?.label ?? '本地图片';
}
