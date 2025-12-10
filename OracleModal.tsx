import React, { useEffect, useState, useRef } from 'react';
import { ModuleData } from '../types';
import { X, ChevronRight, Terminal, Activity } from 'lucide-react';
import { generateMissionBriefing } from '../services/geminiService';

interface SystemModalProps {
  quest: ModuleData | null;
  onClose: () => void;
}

const SystemModal: React.FC<SystemModalProps> = ({ quest, onClose }) => {
  const [log, setLog] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [streamedText, setStreamedText] = useState('');
  const [isReady, setIsReady] = useState(false);
  const textEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (quest) {
      setLoading(true);
      setLog('');
      setStreamedText('');
      setIsReady(false);
      
      const descText = Array.isArray(quest.description) 
        ? quest.description.join('. ') 
        : quest.description;
      
      generateMissionBriefing(quest.title, descText).then((text) => {
        setLog(text);
        setLoading(false);
      });
    }
  }, [quest]);

  // Smooth text streaming
  useEffect(() => {
    if (!loading && log) {
      let i = 0;
      const speed = 25; 
      const interval = setInterval(() => {
        setStreamedText(log.slice(0, i + 1));
        i++;
        if (i > log.length) {
          clearInterval(interval);
          setIsReady(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }
  }, [loading, log]);

  // Auto-scroll to bottom of text
  useEffect(() => {
    textEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [streamedText]);

  const handleExecute = () => {
    if (quest?.actionUrl) {
      window.open(quest.actionUrl, '_blank');
    }
    onClose();
  };

  if (!quest) return null;

  const ThemeIcon = quest.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/80 backdrop-blur-md animate-[unfold_0.3s_ease-out] cursor-default">
      <div 
        className="relative w-full max-w-4xl bg-[#09090b] border border-white/10 rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row"
        style={{ boxShadow: `0 0 50px -10px rgba(6,182,212,0.1)` }}
      >
        
        {/* Left Sidebar - Visual */}
        <div className="w-full md:w-80 bg-gradient-to-b from-gray-900 via-black to-black border-b md:border-b-0 md:border-r border-white/10 relative overflow-hidden flex flex-col items-center justify-center p-8 shrink-0">
            {/* Grid background pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
            
            <div className="relative z-10 p-8 rounded-2xl bg-white/5 border border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.05)] mb-6 group">
               <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
               <ThemeIcon className="relative w-16 h-16 text-gray-200 group-hover:text-cyan-400 transition-colors duration-500" />
            </div>
            
            <div className="relative z-10 text-center space-y-2">
                <h3 className="font-tech text-4xl font-bold text-white tracking-widest uppercase">{quest.title}</h3>
                <div className="flex items-center justify-center gap-2">
                   <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse"></div>
                   <span className="text-[10px] font-mono text-cyan-500 tracking-[0.2em] uppercase">Security Level: {quest.level}</span>
                </div>
            </div>
        </div>

        {/* Right Content - Terminal */}
        <div className="flex-1 flex flex-col min-h-[400px] relative bg-black/50">
           {/* Terminal Header */}
           <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
             <div className="flex items-center gap-3">
               <Terminal className="w-4 h-4 text-gray-500" />
               <span className="font-mono text-xs text-gray-400">root@vibe-os:~/{quest.id}</span>
             </div>
             <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors cursor-pointer hover:rotate-90 duration-300">
               <X className="w-5 h-5" />
             </button>
           </div>

           {/* Terminal Body */}
           <div className="flex-1 p-8 overflow-y-auto font-mono text-sm leading-7 text-gray-300">
              <div className="mb-4 text-green-500 font-bold flex items-center gap-2">
                 <span className="text-gray-500">{'>'}</span> INITIALIZING PROTOCOL...
              </div>

              {loading ? (
                <div className="flex items-center gap-2 text-cyan-500 animate-pulse">
                   <Activity className="w-4 h-4" />
                   <span>Establishing Secure Uplink...</span>
                </div>
              ) : (
                <div className="whitespace-pre-wrap">
                   <span className="text-gray-500 mr-2">$</span>
                   <span className="text-cyan-100">{streamedText}</span>
                   <span className="inline-block w-2 h-4 bg-cyan-500 ml-1 animate-[flicker_1s_infinite]"></span>
                </div>
              )}
              <div ref={textEndRef} />
           </div>

           {/* Action Bar */}
           <div className="p-6 border-t border-white/10 bg-white/5">
              <div className="flex items-center justify-between gap-4">
                 <div className="hidden md:flex flex-col">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">Status</span>
                    <span className={`text-xs font-bold ${isReady ? 'text-green-500' : 'text-yellow-500'}`}>
                       {isReady ? 'READY TO EXECUTE' : 'AWAITING RESPONSE...'}
                    </span>
                 </div>

                 <button 
                    onClick={handleExecute}
                    disabled={!isReady && !quest.actionUrl}
                    className={`
                      relative group flex-1 md:flex-none md:w-64 py-4 rounded-xl font-bold tracking-widest transition-all duration-300 overflow-hidden cursor-none
                      ${isReady 
                          ? 'bg-white text-black hover:bg-cyan-400 shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                          : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/10'
                      }
                    `}
                 >
                    <div className="relative z-10 flex items-center justify-center gap-3">
                       <span>EXECUTE</span>
                       <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isReady ? 'group-hover:translate-x-1' : ''}`} />
                    </div>
                 </button>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default SystemModal;
