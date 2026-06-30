function hasSignedInUser(session) {
  return Boolean(session?.user?.id);
}

export function createRecordRepository({ localStore, cloudStore, getSession }) {
  async function getMode() {
    const session = await getSession();
    return hasSignedInUser(session) && cloudStore ? 'cloud' : 'local';
  }

  return {
    async mode() {
      return getMode();
    },

    async load() {
      const mode = await getMode();
      if (mode === 'cloud') {
        const records = await cloudStore.load();
        localStore.save(records);
        return {
          records,
          mode,
          message: '已从云端同步记录。',
        };
      }

      return {
        records: localStore.load(),
        mode,
        message: '当前为本机记录模式。',
      };
    },

    async save(records) {
      localStore.save(records);
      const mode = await getMode();
      if (mode === 'cloud') {
        await cloudStore.save(records);
        return {
          mode,
          message: '已保存到本机并同步到云端。',
        };
      }

      return {
        mode,
        message: '已保存到本机浏览器。',
      };
    },

    async deleteCloudRecords() {
      const mode = await getMode();
      if (mode !== 'cloud') {
        return {
          mode,
          message: '当前未登录云端账号，无云端记录可删除。',
        };
      }

      await cloudStore.deleteAll();
      return {
        mode,
        message: '已删除当前账号的云端记录。',
      };
    },

    clearLocal() {
      localStore.clear();
      return {
        mode: 'local',
        message: '已清除本机浏览器记录。',
      };
    },
  };
}
