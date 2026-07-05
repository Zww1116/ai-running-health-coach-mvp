import { useEffect, useMemo, useState } from 'react';
import { Activity, Bot, Database, Sparkles } from 'lucide-react';
import { getCurrentSession, sendLoginOtp, signOut, subscribeToAuth } from './auth/supabaseAuth';
import { generateCoachAnalysis } from './ai/expertEngine';
import { AuthPanel } from './components/AuthPanel';
import { ExpertReports } from './components/ExpertReports';
import { HeadCoachPlan } from './components/HeadCoachPlan';
import { HistoryList } from './components/HistoryList';
import { RecordForm } from './components/RecordForm';
import { SettingsCenter } from './components/SettingsCenter';
import { SleepRecoveryPage } from './components/SleepRecoveryPage';
import { RuleAgentAnalysis } from './components/RuleAgentAnalysis';
import { WeeklyOverview } from './components/WeeklyOverview';
import { buildRecordFromForm, initialForm } from './components/recordFormModel';
import { sampleProfile, sampleRecords } from './data/sampleData';
import { createOptionalSupabaseClient } from './integrations/supabaseClient';
import { createBrowserStorageAdapter } from './storage/localStore';
import { createLocalImageStore } from './storage/localImageStore';
import { createRecordRepository } from './storage/recordRepository';
import { downloadRecordsExport } from './storage/exportRecords';
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
          message: `云端保存失败，已保存在本机：${error.message}`,
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
    const confirmed = window.confirm('确认清空所有数据吗？这会删除当前浏览器记录、本地备份、本地图片缓存；云端模式下也会删除当前账号云端记录。');
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
    <main className="min-h-screen bg-[#f6f7f4] text-ink">
      <header className="border-b border-ink/10 bg-white">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-4 md:grid-cols-[minmax(0,1fr)_300px] md:items-center lg:px-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md bg-skysoft px-3 py-1 text-sm font-medium text-ink">
              <Sparkles size={15} />
              AI 运动健康管理 Web MVP
            </div>
            <h1 className="mt-3 max-w-4xl text-3xl font-semibold tracking-normal text-ink md:text-4xl">
              专属多专家Agent健康运动管理平台
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              本地记录跑步、力量、饮食、体重、睡眠、经期和疼痛状态；多专家规则引擎输出独立建议，总教练生成每日与每周方案。
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600">
              <Badge icon={<Activity size={15} />} text={sampleProfile.goal} />
              <Badge icon={<Bot size={15} />} text="规则版多专家 Agent" />
              <Badge icon={<Database size={15} />} text="localStorage 数据存储" />
            </div>
          </div>
          <img
            className="h-40 w-full rounded-lg object-cover md:h-48"
            src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=900&q=80"
            alt="女性跑者训练"
          />
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 lg:px-6">
        <AuthPanel
          authState={{ session, supabaseStatus: supabase.status }}
          syncState={syncState}
          onSendOtp={handleSendOtp}
          onSignOut={handleSignOut}
        />
        <SettingsCenter
          mode={storageMode}
          records={records}
          storageEstimate={storageEstimate}
          message={settingsMessage || syncState.message}
          onExport={handleExport}
          onImport={handleImport}
          onCreateBackup={handleCreateBackup}
          onRestoreBackup={handleRestoreBackup}
          onClearAll={handleClearAll}
          onFactoryReset={handleFactoryReset}
          onRefreshStorage={refreshStorageEstimate}
          onUpgradeDatabase={handleUpgradeDatabase}
        />
        <WeeklyOverview analysis={analysis} monthlyRunningKm={sampleProfile.runningMonthlyKm} />
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="grid gap-5">
            <HeadCoachPlan report={analysis.headCoach} riskLevel={analysis.riskLevel} />
            <RuleAgentAnalysis />
            <ExpertReports specialists={analysis.specialists} />
            <SleepRecoveryPage onSaveSleepRecord={saveSleepRecord} />
            <RecordForm onAddRecord={addRecord} onResetData={resetData} />
          </div>
          <HistoryList records={records} />
        </div>
      </div>
    </main>
  );
}

function mergeAttachments(existing = [], incoming = []) {
  const byId = new Map();
  [...existing, ...incoming].forEach((item) => {
    if (item?.id) byId.set(item.id, item);
  });
  return [...byId.values()];
}

function Badge({ icon, text }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2">
      {icon}
      {text}
    </span>
  );
}
