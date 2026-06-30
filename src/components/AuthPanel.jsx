import { LogOut, Mail, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

export function AuthPanel({ authState, syncState, onSendOtp, onSignOut }) {
  const [email, setEmail] = useState('');
  const isCloudReady = authState.supabaseStatus === 'configured';
  const signedInEmail = authState.session?.user?.email;

  async function submit(event) {
    event.preventDefault();
    await onSendOtp(email);
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">账号与云端同步</p>
          <h2 className="mt-1 flex items-center gap-2 text-lg font-semibold text-ink">
            <ShieldCheck size={18} className="text-moss" />
            {signedInEmail ? '已登录云端账号' : isCloudReady ? '登录后开启云端记录' : '本机记录模式'}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {signedInEmail
              ? `当前账号：${signedInEmail}`
              : isCloudReady
                ? '使用邮箱验证码登录后，记录会同步到你的 Supabase 私有数据行。'
                : '未配置 Supabase，记录只保存在当前浏览器。'}
          </p>
          {syncState.message && <p className="mt-2 text-xs text-slate-500">{syncState.message}</p>}
        </div>

        {signedInEmail ? (
          <button
            type="button"
            onClick={onSignOut}
            className="inline-flex min-h-10 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <LogOut size={16} />
            退出登录
          </button>
        ) : (
          <form onSubmit={submit} className="grid min-w-full gap-2 sm:min-w-80">
            <label className="grid gap-1 text-sm text-slate-600">
              邮箱
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={!isCloudReady}
                placeholder="name@example.com"
                className="min-h-10 rounded-md border border-slate-200 px-3 text-sm text-ink outline-none focus:border-coral focus:ring-2 focus:ring-coral/20 disabled:bg-slate-50"
              />
            </label>
            <button
              type="submit"
              disabled={!isCloudReady || !email}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-ink px-3 text-sm font-semibold text-white hover:bg-moss disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <Mail size={16} />
              发送登录验证码
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
