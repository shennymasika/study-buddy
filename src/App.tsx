import { useState } from 'react';
import { ComponentShowcase } from './components/showcase/ComponentShowcase';
import { QuestAppFlow } from './components/flow/QuestAppFlow';
import { Layers, Smartphone, GraduationCap } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'app' | 'showcase'>('app');

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
        {activeTab === 'app' ? <QuestAppFlow /> : <ComponentShowcase />}
      </main>
    </div>
  );
}

export default App;
