import { useEffect, useState } from 'react';
import { ComponentShowcase } from './components/showcase/ComponentShowcase';
import { QuestAppFlow } from './components/flow/QuestAppFlow';
import { LoginScreen } from './components/auth/LoginScreen';
import { Layers, Smartphone, GraduationCap, LogOut } from 'lucide-react';

type User = { username: string; student_id?: string; local_only?: boolean };

function storedLocalUser(): User | null {
  try { return JSON.parse(localStorage.getItem('studyBuddyLocalUser') || 'null'); }
  catch { return null; }
}

export function App() {
  const [activeTab, setActiveTab] = useState<'app' | 'showcase'>('app');
  const phpUser = (window as Window & { PHP_USER?: User }).PHP_USER ?? null;
  const [user, setUser] = useState<User | null>(phpUser ?? storedLocalUser());
  const [checkingSession, setCheckingSession] = useState(!user);

  useEffect(() => {
    if (user) return;
    fetch('index.php?api=me', { credentials: 'same-origin' })
      .then(response => response.ok ? response.json() : null)
      .then(result => { if (result?.logged_in && result.user) setUser(result.user); })
      .catch(() => {})
      .finally(() => setCheckingSession(false));
  }, [user]);

  if (checkingSession) return <div className="min-h-screen flex items-center justify-center bg-[#f0f6ff] text-sm font-bold text-blue-900">Loading Study Buddy…</div>;
  if (!user) return <LoginScreen onSignedIn={(signedInUser) => signedInUser ? setUser(signedInUser) : window.location.reload()} />;

  function signOut() {
    if (user?.local_only) {
      localStorage.removeItem('studyBuddyLocalUser');
      setUser(null);
    } else {
      window.location.href = 'logout.php';
    }
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f1f5f9]">
      {/* Top Global Switcher Header */}
      <header className="bg-[#1e3a8a] text-white px-4 py-2.5 shadow-md z-40 sticky top-0 border-b border-[#1e40af]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#2563eb] text-white flex items-center justify-center font-black text-base shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-sm tracking-tight text-white block leading-tight">
                Study Buddy • Computer Studies Quest
              </span>
              <span className="text-[10px] font-semibold text-blue-200 block leading-tight">
                Pixel-Perfect Figma Prototype (IST1020)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-bold text-blue-100">
            <span>Hi, {user.username}</span>
            <button onClick={signOut} className="inline-flex items-center gap-1.5 rounded-lg bg-blue-800 px-3 py-2 text-white hover:bg-blue-700"><LogOut className="h-3.5 w-3.5"/> Sign out</button>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-[#172554] p-1 rounded-xl border border-blue-900">
            <button
              onClick={() => setActiveTab('app')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                activeTab === 'app'
                  ? 'bg-[#2563eb] text-white shadow-sm'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Figma App Flow</span>
            </button>

            <button
              onClick={() => setActiveTab('showcase')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                activeTab === 'showcase'
                  ? 'bg-[#2563eb] text-white shadow-sm'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Components & Robot</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'app' ? <QuestAppFlow studentName={user.username} /> : <ComponentShowcase />}
      </main>
    </div>
  );
}

export default App;
