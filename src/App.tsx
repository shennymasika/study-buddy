import { useState } from 'react';
import { ComponentShowcase } from './components/showcase/ComponentShowcase';
import { QuestAppFlow } from './components/flow/QuestAppFlow';
import { Layers, Gamepad2, GraduationCap } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'showcase' | 'app'>('showcase');

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-100">
      {/* Top Universal App Navigation Bar */}
      <nav className="bg-slate-900 text-white px-4 py-2.5 shadow-md z-40 sticky top-0">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-400 to-sky-400 flex items-center justify-center text-slate-950 shadow-sm font-black text-base">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-sm tracking-tight text-white block leading-tight">
                Study Buddy • Computer Studies Quest
              </span>
              <span className="text-[10px] font-bold text-slate-400 block leading-tight">
                IST1020 Learning System Prototype
              </span>
            </div>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setActiveTab('showcase')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-black transition-all ${
                activeTab === 'showcase'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Reusable Components & States</span>
            </button>

            <button
              onClick={() => setActiveTab('app')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-black transition-all ${
                activeTab === 'app'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Full App Quest Flow</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'showcase' ? <ComponentShowcase /> : <QuestAppFlow />}
      </main>
    </div>
  );
}

export default App;
