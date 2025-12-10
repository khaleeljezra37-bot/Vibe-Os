import React, { useState } from 'react';
import { Cpu, Layers } from 'lucide-react';
import { CORE_MODULES, UTILITY_MODULES } from './constants';
import { ModuleData } from './types';
import ModuleCard from './components/PixelCard';
import SystemModal from './components/OracleModal';
import { WelcomeScreen } from './components/WelcomeScreen';
import { VibeLogo } from './components/VibeLogo';
import CustomCursor from './components/CustomCursor';

export default function App() {
  const [started, setStarted] = useState(false);
  const [selected, setSelected] = useState<ModuleData | null>(null);

  if (!started) return (
    <>
      <CustomCursor />
      <WelcomeScreen onStart={() => setStarted(true)} />
    </>
  );

  return (
    <div className="min-h-screen text-white relative selection:bg-cyan-500/30 selection:text-cyan-100 cursor-none">
      <CustomCursor />
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-40 bg-black/40 backdrop-blur-md border-b border-white/5 px-8 py-4 flex justify-between items-center transition-all duration-500 hover:bg-black/60">
         <div className="flex items-center gap-2 cursor-pointer opacity-80 hover:opacity-100 transition-opacity" onClick={() => window.location.reload()}>
           <VibeLogo />
         </div>
         <div className="flex gap-8 text-[10px] font-bold tracking-[0.2em] text-gray-500 font-mono-tech">
           <div className="flex items-center gap-2">
             <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
             </span>
             <span className="text-green-500 text-shadow-green">ONLINE</span>
           </div>
           <span className="hover:text-cyan-400 transition-colors cursor-default">V.4.2.0-DESKTOP</span>
         </div>
      </nav>

      {/* Main Content */}
      <main className="pt-40 pb-24 max-w-[1400px] mx-auto px-8 lg:px-12">
        <div className="mb-24 animate-[springUp_1s_ease-out]">
           <h1 className="text-6xl md:text-8xl font-bold font-tech mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-600 tracking-tighter drop-shadow-lg cursor-default">
             COMMAND CENTER
           </h1>
           <p className="text-gray-400 font-mono-tech text-base max-w-2xl border-l-4 border-cyan-500 pl-6 py-2 bg-gradient-to-r from-cyan-900/10 to-transparent cursor-default">
             Welcome back, Operative. The system is operating at peak efficiency. 
             Select a module to engage protocols.
           </p>
        </div>

        <div className="space-y-24">
           {/* Core Modules Section */}
           <section>
              <div className="flex items-center gap-4 mb-10 group cursor-default">
                 <div className="p-3 rounded-lg bg-cyan-900/20 border border-cyan-500/30 group-hover:bg-cyan-900/40 transition-colors">
                    <Cpu className="text-cyan-400 w-6 h-6" />
                 </div>
                 <h2 className="text-2xl font-bold font-tech tracking-[0.15em] text-gray-200 group-hover:text-white transition-colors">CORE_MODULES</h2>
                 <div className="h-px bg-gradient-to-r from-cyan-500/50 to-transparent flex-1 ml-6" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                 {CORE_MODULES.map((m, i) => (
                    <ModuleCard key={m.id} data={m} index={i} onSelect={setSelected} />
                 ))}
              </div>
           </section>

           {/* Utility Modules Section */}
           <section>
              <div className="flex items-center gap-4 mb-10 group cursor-default">
                 <div className="p-3 rounded-lg bg-violet-900/20 border border-violet-500/30 group-hover:bg-violet-900/40 transition-colors">
                    <Layers className="text-violet-400 w-6 h-6" />
                 </div>
                 <h2 className="text-2xl font-bold font-tech tracking-[0.15em] text-gray-200 group-hover:text-white transition-colors">UTILITIES</h2>
                 <div className="h-px bg-gradient-to-r from-violet-500/50 to-transparent flex-1 ml-6" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                 {UTILITY_MODULES.map((m, i) => (
                    <ModuleCard key={m.id} data={m} index={i + 4} onSelect={setSelected} />
                 ))}
              </div>
           </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full bg-[#050505]/90 backdrop-blur-md border-t border-white/5 py-3 px-8 flex justify-between items-center text-[10px] text-gray-600 font-mono-tech uppercase z-30 cursor-default">
         <span>Secure Connection</span>
         <span>ID: {Math.random().toString(36).substr(2, 9).toUpperCase()} // ENCRYPTED</span>
      </footer>

      <SystemModal quest={selected} onClose={() => setSelected(null)} />
    </div>
  );
      }
