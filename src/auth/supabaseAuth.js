export async function getCurrentSession(client) {
  if (!client) return null;
  const { data, error } = await client.auth.getSession();
  if (error) throw new Error(error.message);
  return data.session;
}

export async function sendLoginOtp(client, email) {
  if (!client) throw new Error('未配置 Supabase，无法发送登录验证码。');
  const { error } = await client.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.href,
    },
  });
  if (error) throw new Error(error.message);
}

export async function signOut(client) {
  if (!client) return;
  const { error } = await client.auth.signOut();
  if (error) throw new Error(error.message);
}

export function subscribeToAuth(client, callback) {
  if (!client) return () => {};
  const { data } = client.auth.onAuthStateChange((_event, session) => callback(session));
  return () => data.subscription.unsubscribe();
}
