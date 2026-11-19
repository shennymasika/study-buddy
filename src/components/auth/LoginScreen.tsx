import { useState, type FormEvent } from 'react';
import { GraduationCap, LockKeyhole, Mail, UserRound } from 'lucide-react';
import robot from '../../assets/robot.png';

type LocalProfile = { username: string; student_id: string; email: string; salt: string; password_hash: string };
type SignedInUser = { username: string; student_id: string; local_only: true };
type Props = { onSignedIn: (user?: SignedInUser) => void };

const PROFILES_KEY = 'studyBuddyProfiles';
const ACTIVE_USER_KEY = 'studyBuddyLocalUser';

async function passwordHash(password: string, salt: string) {
  const bytes = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

function readProfiles(): LocalProfile[] {
  try { return JSON.parse(localStorage.getItem(PROFILES_KEY) || '[]'); }
  catch { return []; }
}

export function LoginScreen({ onSignedIn }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [identifier, setIdentifier] = useState('');
  const [username, setUsername] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setBusy(true);
    const payload = mode === 'login'
      ? { action: 'login', identifier, password }
      : { action: 'register', username, student_id: studentId, email, password };

    try {
      const response = await fetch('login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || 'Could not sign in. Please try again.');
      onSignedIn();
    } catch (err) {
      // The Vite frontend can run without PHP. In that case, keep profiles in this browser.
      // If the PHP API returned a JSON error, surface it instead of using local mode.
      const message = err instanceof Error ? err.message : '';
      if (message && (message.includes('Invalid Student') || message.includes('Database') || message.includes('already exists') || message.includes('fill in'))) {
        setError(message);
        return;
      }
      try {
        const profiles = readProfiles();
        if (mode === 'register') {
          if (profiles.some(profile => profile.student_id.toLowerCase() === studentId.toLowerCase() || profile.email.toLowerCase() === email.toLowerCase())) {
            throw new Error('An account with that student ID or email already exists in this browser.');
          }
          const salt = crypto.randomUUID();
          const profile: LocalProfile = { username, student_id: studentId, email, salt, password_hash: await passwordHash(password, salt) };
          localStorage.setItem(PROFILES_KEY, JSON.stringify([...profiles, profile]));
          const localUser: SignedInUser = { username, student_id: studentId, local_only: true };
          localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(localUser));
          onSignedIn(localUser);
          return;
        }
        const profile = profiles.find(item => item.student_id.toLowerCase() === identifier.toLowerCase() || item.email.toLowerCase() === identifier.toLowerCase());
        if (!profile || await passwordHash(password, profile.salt) !== profile.password_hash) throw new Error('Incorrect student ID/email or password.');
        const localUser: SignedInUser = { username: profile.username, student_id: profile.student_id, local_only: true };
        localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(localUser));
        onSignedIn(localUser);
      } catch (localError) {
        setError(localError instanceof Error ? localError.message : 'Could not sign in.');
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-10 bg-[#f0f6ff]">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <img src={robot} alt="Study Buddy robot" className="w-24 h-24 object-contain mx-auto mb-2" />
          <h1 className="text-3xl font-black text-[#1e3a8a]">Welcome to Study Buddy</h1>
          <p className="text-sm text-slate-500 mt-1">Sign in to save your learning progress.</p>
        </div>

        <div className="bg-white rounded-[26px] p-6 sm:p-8 border-2 border-[#dbeafe] border-b-4 border-b-[#bfdbfe] shadow-lg">
          <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
            <button type="button" onClick={() => { setMode('login'); setError(''); }} className={`flex-1 py-2.5 rounded-lg text-sm font-extrabold ${mode === 'login' ? 'bg-blue-600 text-white shadow' : 'text-slate-500'}`}>Sign in</button>
            <button type="button" onClick={() => { setMode('register'); setError(''); }} className={`flex-1 py-2.5 rounded-lg text-sm font-extrabold ${mode === 'register' ? 'bg-blue-600 text-white shadow' : 'text-slate-500'}`}>Create account</button>
          </div>

          {error && <div role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</div>}

          <form onSubmit={submit} className="space-y-4">
            {mode === 'register' ? <>
              <label className="block text-xs font-black uppercase tracking-wide text-slate-600">Your name
                <span className="mt-1.5 flex items-center gap-2 rounded-xl border-2 border-slate-200 px-3 focus-within:border-blue-400"><UserRound className="w-4 h-4 text-slate-400"/><input required value={username} onChange={e => setUsername(e.target.value)} className="w-full py-3 text-sm outline-none" placeholder="Jane Doe" /></span>
              </label>
              <label className="block text-xs font-black uppercase tracking-wide text-slate-600">Student ID
                <input required value={studentId} onChange={e => setStudentId(e.target.value)} className="mt-1.5 w-full rounded-xl border-2 border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-400" placeholder="STU1020" />
              </label>
              <label className="block text-xs font-black uppercase tracking-wide text-slate-600">Email
                <span className="mt-1.5 flex items-center gap-2 rounded-xl border-2 border-slate-200 px-3 focus-within:border-blue-400"><Mail className="w-4 h-4 text-slate-400"/><input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full py-3 text-sm outline-none" placeholder="you@example.com" /></span>
              </label>
            </> : <label className="block text-xs font-black uppercase tracking-wide text-slate-600">Student ID or email
              <span className="mt-1.5 flex items-center gap-2 rounded-xl border-2 border-slate-200 px-3 focus-within:border-blue-400"><Mail className="w-4 h-4 text-slate-400"/><input required value={identifier} onChange={e => setIdentifier(e.target.value)} className="w-full py-3 text-sm outline-none" placeholder="STU1020 or you@example.com" /></span>
            </label>}
            <label className="block text-xs font-black uppercase tracking-wide text-slate-600">Password
              <span className="mt-1.5 flex items-center gap-2 rounded-xl border-2 border-slate-200 px-3 focus-within:border-blue-400"><LockKeyhole className="w-4 h-4 text-slate-400"/><input required minLength={mode === 'register' ? 8 : undefined} type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full py-3 text-sm outline-none" placeholder={mode === 'register' ? 'At least 8 characters' : 'Your password'} /></span>
            </label>
            <button disabled={busy} className="w-full rounded-xl border-b-4 border-blue-800 bg-blue-600 py-3.5 text-base font-black text-white transition hover:bg-blue-700 disabled:opacity-60">
              {busy ? 'Please wait…' : mode === 'login' ? 'Sign in to Study Buddy' : 'Create my account'}
            </button>
          </form>
          <p className="mt-5 text-center text-xs text-slate-400">Your account keeps your XP, streak, and hearts saved.</p>
        </div>
        <div className="mt-4 flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-900"><GraduationCap className="h-4 w-4"/> Computer Studies Quest · IST1020</div>
      </div>
    </div>
  );
}
