import React, { useRef, useState } from 'react';
import { ModuleData } from '../types';
import { ArrowUpRight } from 'lucide-react';

const THEME_STYLES = {
  cyan: {
    border: 'group-hover:border-cyan-400/50',
    text: 'text-cyan-400',
    bg: 'bg-cyan-950/20',
    hoverBg: 'group-hover:bg-cyan-900/30',
    shadow: 'shadow-[0_0_0_1px_rgba(6,182,212,0.1)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]',
    highlight: 'from-cyan-400/20 to-transparent',
    iconBg: 'group-hover:bg-cyan-400/20 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]'
  },
  violet: {
    border: 'group-hover:border-violet-400/50',
    text: 'text-violet-400',
    bg: 'bg-violet-950/20',
    hoverBg: 'group-hover:bg-violet-900/30',
    shadow: 'shadow-[0_0_0_1px_rgba(139,92,246,0.1)] group-hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]',
    highlight: 'from-violet-400/20 to-transparent',
    iconBg: 'group-hover:bg-violet-400/20 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]'
  },
  rose: {
    border: 'group-hover:border-rose-400/50',
    text: 'text-rose-400',
    bg: 'bg-rose-950/20',
    hoverBg: 'group-hover:bg-rose-900/30',
    shadow: 'shadow-[0_0_0_1px_rgba(244,63,94,0.1)] group-hover:shadow-[0_0_30px_rgba(244,63,94,0.3)]',
    highlight: 'from-rose-400/20 to-transparent',
    iconBg: 'group-hover:bg-rose-400/20 group-hover:shadow-[0_0_20px_rgba(244,63,94,0.4)]'
  },
  amber: {
    border: 'group-hover:border-amber-400/50',
    text: 'text-amber-400',
    bg: 'bg-amber-950/20',
    hoverBg: 'group-hover:bg-amber-900/30',
    shadow: 'shadow-[0_0_0_1px_rgba(245,158,11,0.1)] group-hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]',
    highlight: 'from-amber-400/20 to-transparent',
    iconBg: 'group-hover:bg-amber-400/20 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]'
  }
};

const ModuleCard: React.FC<{ data: ModuleData; onSelect: (data: ModuleData) => void; index: number }> = ({ data, onSelect, index }) => {
  const theme = THEME_STYLES[data.colorTheme];
  const Icon = data.icon;
  const cardRef = useRef<HTMLDivElement>(null);
  
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Enhanced Desktop 3D rotation sensitivity
    const rotateX = ((y - centerY) / centerY) * -12; // Increased max rotation
    const rotateY = ((x - centerX) / centerX) * 12;
    
    // Spotlight position
    const spotX = (x / rect.width) * 100;
    const spotY = (y / rect.height) * 100;

    setRotation({ x: rotateX, y: rotateY });
    setSpotlight({ x: spotX, y: spotY, opacity: 1 });
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Smooth return to center
    setRotation({ x: 0, y: 0 });
    setSpotlight(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      className="relative perspective-[1200px] hover:z-50"
      style={{ 
        animation: `springUp 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards`,
        animationDelay: `${index * 80}ms`,
        opacity: 0,
      }}
    >
      <div 
        ref={cardRef}
        onClick={() => onSelect(data)}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`
          relative h-full w-full rounded-2xl border border-white/10
          backdrop-blur-md transition-all duration-200 ease-out
          cursor-none overflow-hidden group
          ${theme.bg} ${theme.hoverBg} ${theme.border} ${theme.shadow}
        `}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(${isHovered ? 1.05 : 1}, ${isHovered ? 1.05 : 1}, 1)`,
          transformStyle: 'preserve-3d',
          willChange: 'transform'
        }}
      >
        {/* Dynamic Spotlight / Glare Effect */}
        <div 
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(800px circle at ${spotlight.x}% ${spotlight.y}%, rgba(255,255,255,0.1) 0%, transparent 40%)`,
            opacity: spotlight.opacity
          }}
        />

        {/* Diagonal Gradient Sheen */}
        <div 
          className={`pointer-events-none absolute inset-0 z-0 bg-gradient-to-br ${theme.highlight} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
          style={{ transform: 'translateZ(1px)' }}
        />

        <div className="relative z-10 p-8 flex flex-col h-full justify-between" style={{ transform: 'translateZ(20px)' }}>
          
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className={`
              p-3.5 rounded-xl bg-black/40 border border-white/10 ${theme.text} 
              transition-all duration-300 group-hover:scale-110 group-hover:rotate-6
              ${theme.iconBg}
            `}
            style={{ transform: 'translateZ(10px)' }}
            >
               <Icon className="w-6 h-6" />
            </div>
            
            <div 
              className="flex flex-col items-end"
              style={{ transform: 'translateZ(15px)' }}
            >
               <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 border border-white/5 backdrop-blur-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 group-hover:text-green-400 transition-colors tracking-widest font-mono-tech">
                    SEC: {data.level.substring(0,3)}
                  </span>
               </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="mb-4 space-y-4">
            <h3 
              className="font-tech text-3xl font-bold text-white tracking-wide group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all drop-shadow-lg"
              style={{ transform: 'translateZ(30px)' }}
            >
              {data.title}
            </h3>
            
            <div 
              className="h-0.5 w-12 bg-white/10 group-hover:w-full transition-all duration-500 ease-out group-hover:bg-gradient-to-r group-hover:from-white/50 group-hover:to-transparent"
              style={{ transform: 'translateZ(25px)' }}
            />
            
            <div style={{ transform: 'translateZ(20px)' }}>
              {Array.isArray(data.description) ? (
                <ul className="text-gray-400 text-sm font-mono space-y-2 opacity-80 group-hover:opacity-100 transition-opacity">
                  {data.description.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className={`text-[10px] mt-1 ${theme.text}`}>►</span>
                      <span className="group-hover:text-gray-200 transition-colors">{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-sm font-mono whitespace-pre-line leading-relaxed opacity-80 group-hover:opacity-100 group-hover:text-gray-200 transition-colors">
                   {data.description}
                </p>
              )}
            </div>
          </div>

          {/* Footer Stats & Action */}
          <div className="mt-auto space-y-4" style={{ transform: 'translateZ(20px)' }}>
            {data.stats.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {data.stats.map((stat, i) => (
                  <div key={i} className="bg-black/30 rounded px-3 py-2 border border-white/5 group-hover:border-white/20 transition-colors">
                      <div className="text-[9px] text-gray-500 uppercase tracking-widest">{stat.label}</div>
                      <div className="font-mono text-xs text-gray-200">{stat.value}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-white/5 group-hover:border-white/20 transition-colors">
              <span className={`text-xs font-bold tracking-[0.2em] ${theme.text} opacity-50 group-hover:opacity-100 transition-all duration-300`}>
                 ACCESS_GRANTED
              </span>
              <div className="bg-white/5 p-1.5 rounded-full group-hover:bg-white/20 transition-colors">
                 <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ModuleCard;
