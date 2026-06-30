import { useEffect, useMemo, useState } from 'react';
import { Activity, Bot, Database, Sparkles } from 'lucide-react';
import { getCurrentSession, sendLoginOtp, signOut, subscribeToAuth } from './auth/supabaseAuth';
import { generateCoachAnalysis } from './ai/expertEngine';
import { AuthPanel } from './components/AuthPanel';
import { ExpertReports } from './components/ExpertReports';
import { HeadCoachPlan } from './components/HeadCoachPlan';
import { HistoryList } from './components/HistoryList';
import { PrivacyPanel } from './components/PrivacyPanel';
import { RecordForm } from './components/RecordForm';
import { RuleAgentAnalysis } from './components/RuleAgentAnalysis';
import { WeeklyOverview } from './components/WeeklyOverview';
import { sampleProfile, sampleRecords } from './data/sampleData';
import { createOptionalSupabaseClient } from './integrations/supabaseClient';
import { createBrowserStorageAdapter } from './storage/localStore';
import { createRecordRepository } from './storage/recordRepository';
import { downloadRecordsExport } from './storage/exportRecords';
import { createSupabaseRecordStore } from './storage/supabaseRecordStore';

export default function App() {
  const supabase = useMemo(() => createOptionalSupabaseClient(), []);
  const supabaseClient = supabase.client;
  const storage = useMemo(() => createBrowserStorageAdapter(sampleRecords), []);
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

  function addRecord(record) {
    setRecords((current) => {
      const withoutSameDate = current.filter((item) => item.date !== record.date);
      return [...withoutSameDate, record].sort((a, b) => a.date.localeCompare(b.date));
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
  }

  function handleClearLocal() {
    repository.clearLocal();
    if (storageMode === 'local') {
      setRecords([]);
    }
    setSyncState((current) => ({
      ...current,
      message:
        storageMode === 'cloud'
          ? '已清除本机浏览器缓存，云端记录不受影响。'
          : '已清除本机浏览器记录。',
    }));
  }

  async function handleDeleteCloud() {
    try {
      const result = await repository.deleteCloudRecords();
      setSyncState((current) => ({ ...current, message: result.message }));
    } catch (error) {
      setSyncState((current) => ({ ...current, message: error.message }));
    }
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
        <PrivacyPanel
          mode={storageMode}
          records={records}
          onExport={handleExport}
          onClearLocal={handleClearLocal}
          onDeleteCloud={handleDeleteCloud}
        />
        <WeeklyOverview analysis={analysis} monthlyRunningKm={sampleProfile.runningMonthlyKm} />
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="grid gap-5">
            <HeadCoachPlan report={analysis.headCoach} riskLevel={analysis.riskLevel} />
            <RuleAgentAnalysis />
            <ExpertReports specialists={analysis.specialists} />
            <RecordForm onAddRecord={addRecord} onResetData={resetData} />
          </div>
          <HistoryList records={records} />
        </div>
      </div>
    </main>
  );
}

function Badge({ icon, text }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2">
      {icon}
      {text}
    </span>
  );
}
