import { useEffect, useState } from 'react';
import { Image } from 'lucide-react';
import { createLocalImageStore } from '../storage/localImageStore';
import { typeLabel } from './RecordImageUploader';

export function LocalImageGallery({ attachments = [] }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let active = true;
    const urls = [];

    async function loadImages() {
      const imageStore = createLocalImageStore();
      const loaded = await Promise.all(
        attachments.map(async (attachment) => {
          const blob = await imageStore.getBlob(attachment.id);
          if (!blob) return { attachment, url: '' };
          const url = URL.createObjectURL(blob);
          urls.push(url);
          return { attachment, url };
        }),
      );
      if (active) setItems(loaded);
    }

    loadImages();

    return () => {
      active = false;
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [attachments]);

  if (attachments.length === 0) return null;

  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-2 text-sm font-semibold text-ink">
        <Image size={16} className="text-coral" />
        本地图片
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map(({ attachment, url }) => (
          <figure key={attachment.id} className="overflow-hidden rounded-md border border-slate-200 bg-white">
            {url ? (
              <img src={url} alt={attachment.name} className="h-36 w-full object-cover" />
            ) : (
              <div className="flex h-36 items-center justify-center px-3 text-center text-xs text-slate-500">
                图片只保存在上传时的浏览器，本设备未找到原图。
              </div>
            )}
            <figcaption className="px-3 py-2 text-xs leading-5 text-slate-500">
              {typeLabel(attachment.type)} · {attachment.name}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
