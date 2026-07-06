import { useEffect, useMemo, useState } from 'react';
import { generateCoachAnalysis } from './ai/expertEngine';
import { getCurrentSession, sendLoginOtp, signOut, subscribeToAuth } from './auth/supabaseAuth';
import { AppShell } from './components/AppShell';
import { buildRecordFromForm, initialForm } from './components/recordFormModel';
import { sampleProfile, sampleRecords } from './data/sampleData';
import { createOptionalSupabaseClient } from './integrations/supabaseClient';
import { AnalysisPage } from './pages/AnalysisPage';
import { getDefaultPageId, getPageById } from './pages/pageConfig';
import { ImportPage } from './pages/ImportPage';
import { RecordsPage } from './pages/RecordsPage';
import { SettingsPage } from './pages/SettingsPage';
import { TodayPage } from './pages/TodayPage';
import { downloadRecordsExport } from './storage/exportRecords';
import { createLocalImageStore } from './storage/localImageStore';
import { createBrowserStorageAdapter } from './storage/localStore';
import { createRecordRepository } from './storage/recordRepository';
import { createLocalBackupStore, getStorageEstimate, parseRecordsImport } from './storage/settingsData';
import { createSupabaseRecordStore } from './storage/supabaseRecordStore';

export default function App() {
  const supabase = useMemo(() => createOptionalSupabaseClient(), []);
  const supabaseClient = supabase.client;
  const storage = useMemo(() => createBrowserStorageAdapter(sampleRecords), []);
  const backupStore = useMemo(() => createLocalBackupStore(), []);
  const cloudStore = useMemo(() => {
    if (!supabaseClient) return null;
    return createSupabaseRecordStore({
      client: supabaseClient,
      getUser: async () => {
        const { data, error } = await supabaseClient.auth.getUser();
        if (error) throw new Error(error.message);
        return data.user;
      },
    });
  }, [supabaseClient]);
  const repository = useMemo(
    () =>
      createRecordRepository({
        localStore: storage,
        cloudStore,
        getSession: () => getCurrentSession(supabaseClient),
      }),
    [cloudStore, storage, supabaseClient],
  );
  const [activePageId, setActivePageId] = useState(getDefaultPageId());
  const [records, setRecords] = useState(sampleRecords);
  const [session, setSession] = useState(null);
  const [storageMode, setStorageMode] = useState('local');
  const [syncState, setSyncState] = useState({
    message: supabase.message,
    isReady: false,
  });
  const [settingsMessage, setSettingsMessage] = useState('');
  const [storageEstimate, setStorageEstimate] = useState(null);
  const analysis = useMemo(() => generateCoachAnalysis(sampleProfile, records), [records]);
  const activePage = getPageById(activePageId);

  useEffect(() => {
    let active = true;

    getCurrentSession(supabaseClient)
      .then((currentSession) => {
        if (active) setSession(currentSession);
      })
      .catch((error) => {
        if (active) setSyncState((current) => ({ ...current, message: error.message }));
      });

    return subscribeToAuth(supabaseClient, (nextSession) => {
      setSession(nextSession);
    });
  }, [supabaseClient]);

  useEffect(() => {
    let active = true;
    setSyncState((current) => ({ ...current, isReady: false }));

    repository
      .load()
      .then((result) => {
        if (!active) return;
        setRecords(result.records);
        setStorageMode(result.mode);
        setSyncState({ message: result.message, isReady: true });
      })
      .catch((error) => {
        if (!active) return;
        setRecords(storage.load());
        setStorageMode('local');
        setSyncState({
          message: `云端同步失败，已显示本机记录：${error.message}`,
          isReady: true,
        });
      });

    return () => {
      active = false;
    };
  }, [repository, session, storage]);

  useEffect(() => {
    if (!syncState.isReady) return;

    repository
      .save(records)
      .then((result) => {
        setStorageMode(result.mode);
        setSyncState((current) => ({ ...current, message: result.message }));
      })
      .catch((error) => {
        storage.save(records);
        setStorageMode('local');
        setSyncState((current) => ({
          ...current,
          message: `云端保存失败，已保存到本机：${error.message}`,
        }));
      });
  }, [records, repository, storage, syncState.isReady]);

  useEffect(() => {
    refreshStorageEstimate();
  }, [records]);

  function addRecord(record) {
    setRecords((current) => {
      const withoutSameDate = current.filter((item) => item.date !== record.date);
      return [...withoutSameDate, record].sort((a, b) => a.date.localeCompare(b.date));
    });
  }

  function saveSleepRecord({ date, sleep, attachments = [] }) {
    setRecords((current) => {
      const existing = current.find((item) => item.date === date);
      const base = existing ?? buildRecordFromForm({ ...initialForm, date, attachments: [] });
      const merged = {
        ...base,
        id: date,
        date,
        sleep,
        attachments: mergeAttachments(base.attachments, attachments),
      };
      const withoutSameDate = current.filter((item) => item.date !== date);
      return [...withoutSameDate, merged].sort((a, b) => a.date.localeCompare(b.date));
    });
  }

  function resetData() {
    setRecords(sampleRecords);
  }

  async function handleSendOtp(email) {
    try {
      await sendLoginOtp(supabaseClient, email);
      setSyncState((current) => ({ ...current, message: '登录验证码已发送，请检查邮箱。' }));
    } catch (error) {
      setSyncState((current) => ({ ...current, message: error.message }));
    }
  }

  async function handleSignOut() {
    try {
      await signOut(supabaseClient);
      setSession(null);
      setSyncState((current) => ({ ...current, message: '已退出云端账号，当前使用本机记录。' }));
    } catch (error) {
      setSyncState((current) => ({ ...current, message: error.message }));
    }
  }

  function handleExport() {
    downloadRecordsExport(records);
    setSettingsMessage('已导出当前记录 JSON。');
  }

  async function handleImport(file) {
    try {
      const text = await file.text();
      const imported = parseRecordsImport(text);
      setRecords(imported);
      setSettingsMessage(`已导入 ${imported.length} 条记录。`);
    } catch (error) {
      setSettingsMessage(error instanceof Error ? error.message : '导入失败，请检查 JSON 文件。');
    }
  }

  function handleCreateBackup() {
    const backup = backupStore.save(records);
    setSettingsMessage(`已创建本地备份：${backup.exportedAt.slice(0, 10)}。`);
    refreshStorageEstimate();
  }

  function handleRestoreBackup() {
    const backup = backupStore.load();
    if (!backup) {
      setSettingsMessage('当前浏览器还没有本地备份。');
      return;
    }

    setRecords(backup.records);
    setSettingsMessage(`已恢复本地备份：${backup.exportedAt.slice(0, 10)}。`);
  }

  async function handleClearAll() {
    const confirmed = window.confirm(
      '确认清空所有数据吗？这会删除当前浏览器记录、本地备份、本地图片缓存；云端模式下也会删除当前账号云端记录。',
    );
    if (!confirmed) return;

    try {
      if (storageMode === 'cloud') {
        await repository.deleteCloudRecords();
      }
      repository.clearLocal();
      backupStore.clear();
      await createLocalImageStore().clearAll();
      setRecords([]);
      setSettingsMessage('已清空所有数据，可以从 0 开始记录。');
      refreshStorageEstimate();
    } catch (error) {
      setSettingsMessage(error instanceof Error ? error.message : '清空数据失败。');
    }
  }

  function handleFactoryReset() {
    const confirmed = window.confirm('确认恢复出厂设置吗？这会把当前记录替换为系统示例模板。');
    if (!confirmed) return;

    setRecords(sampleRecords);
    setSettingsMessage('已恢复出厂示例模板。');
  }

  function handleUpgradeDatabase() {
    setSettingsMessage('数据库升级入口已预留：后续可执行 Supabase migration、Storage bucket 和 RLS 策略升级。');
  }

  async function refreshStorageEstimate() {
    const estimate = await getStorageEstimate();
    setStorageEstimate(estimate);
  }

  return (
    <AppShell activePageId={activePage.id} onChangePage={setActivePageId} profile={sampleProfile}>
      {activePage.id === 'today' && (
        <TodayPage
          analysis={analysis}
          monthlyRunningKm={sampleProfile.runningMonthlyKm}
          records={records}
        />
      )}
      {activePage.id === 'records' && (
        <RecordsPage
          records={records}
          onAddRecord={addRecord}
          onResetData={resetData}
          onSaveSleepRecord={saveSleepRecord}
        />
      )}
      {activePage.id === 'import' && <ImportPage onAddRecord={addRecord} />}
      {activePage.id === 'analysis' && <AnalysisPage analysis={analysis} />}
      {activePage.id === 'settings' && (
        <SettingsPage
          authState={{ session, supabaseStatus: supabase.status }}
          syncState={syncState}
          settingsMessage={settingsMessage}
          mode={storageMode}
          records={records}
          storageEstimate={storageEstimate}
          onSendOtp={handleSendOtp}
          onSignOut={handleSignOut}
          onExport={handleExport}
          onImport={handleImport}
          onCreateBackup={handleCreateBackup}
          onRestoreBackup={handleRestoreBackup}
          onClearAll={handleClearAll}
          onFactoryReset={handleFactoryReset}
          onRefreshStorage={refreshStorageEstimate}
          onUpgradeDatabase={handleUpgradeDatabase}
        />
      )}
    </AppShell>
  );
}

function mergeAttachments(existing = [], incoming = []) {
  const byId = new Map();
  [...existing, ...incoming].forEach((item) => {
    if (item?.id) byId.set(item.id, item);
  });
  return [...byId.values()];
}
