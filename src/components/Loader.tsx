import React from 'react';

export default function Loader({ visible = true }: { visible?: boolean }) {
  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-b from-[#05060a] via-[#071014]/60 to-transparent transition-opacity duration-700 ${
        visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="w-full max-w-sm px-6 py-10 text-center">
        <div className="relative mx-auto w-28 h-28 mb-6">
          <div className="absolute inset-0 rounded-full loader-glow" />
          <div className="absolute inset-0 rounded-full flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-[#0A0D14] flex items-center justify-center text-cyan text-xl font-black shadow-[0_0_40px_rgba(0,194,255,0.25)]">HR</div>
          </div>

          <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full">
            <g className="opacity-90 stroke-cyan">
              <circle cx="60" cy="60" r="34" strokeWidth="1.5" className="loader-ring loader-ring-1" fill="none" />
              <circle cx="60" cy="60" r="46" strokeWidth="1" className="loader-ring loader-ring-2" fill="none" />
              <circle cx="60" cy="60" r="18" strokeWidth="0.8" className="loader-dot" cxr="18" />
            </g>
          </svg>
        </div>

        <h3 className="text-white font-display font-bold text-xl mb-2">Hamza Raies</h3>
        <p className="text-gray-400 text-sm mb-6">Building futuristic claims automation…</p>

        <div className="mx-auto w-full bg-white/6 rounded-full h-2 overflow-hidden max-w-xs">
          <div className="h-full bg-gradient-to-r from-cyan to-[#00E5FF] loader-progress" />
        </div>

        <div className="flex items-center justify-center gap-2 mt-4 opacity-80">
          <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
          <span className="text-gray-500 text-xs">Initializing modules</span>
        </div>
      </div>
    </div>
  );
}
