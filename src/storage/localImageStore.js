const DB_NAME = 'ai-health-local-images';
const STORE_NAME = 'record-images';
const DB_VERSION = 1;
const SUPPORTED_TYPES = ['coros', 'meal', 'body', 'sleep'];

export function normalizeAttachmentType(type) {
  return SUPPORTED_TYPES.includes(type) ? type : 'coros';
}

export function isLocalImageOnlyMode() {
  return true;
}

export function createImageAttachmentMeta({ file, type, id = crypto.randomUUID(), now = () => new Date() }) {
  return {
    id,
    type: normalizeAttachmentType(type),
    name: file.name,
    mimeType: file.type || 'application/octet-stream',
    size: file.size,
    createdAt: now().toISOString(),
    storage: 'indexeddb',
  };
}

export function createLocalImageStore(indexedDb = globalThis.indexedDB) {
  return {
    async save(file, type) {
      if (!indexedDb) {
        throw new Error('当前浏览器不支持本地图片存储。');
      }
      const meta = createImageAttachmentMeta({ file, type });
      const db = await openImageDb(indexedDb);
      await putImageRecord(db, { ...meta, blob: file });
      db.close();
      return meta;
    },

    async getBlob(id) {
      if (!indexedDb) return null;
      const db = await openImageDb(indexedDb);
      const record = await getImageRecord(db, id);
      db.close();
      return record?.blob ?? null;
    },

    async delete(id) {
      if (!indexedDb) return;
      const db = await openImageDb(indexedDb);
      await deleteImageRecord(db, id);
      db.close();
    },
  };
}

function openImageDb(indexedDb) {
  return new Promise((resolve, reject) => {
    const request = indexedDb.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function putImageRecord(db, record) {
  return runImageTransaction(db, 'readwrite', (store) => store.put(record));
}

function getImageRecord(db, id) {
  return runImageTransaction(db, 'readonly', (store) => store.get(id));
}

function deleteImageRecord(db, id) {
  return runImageTransaction(db, 'readwrite', (store) => store.delete(id));
}

function runImageTransaction(db, mode, action) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, mode);
    const request = action(transaction.objectStore(STORE_NAME));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.onerror = () => reject(transaction.error);
  });
}
