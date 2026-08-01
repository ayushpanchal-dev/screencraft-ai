import React from 'react';
import { DeviceConfig } from '../types';

interface DeviceFrameProps {
  imageSrc: string;
  title?: string;
  config?: Partial<DeviceConfig>;
  className?: string;
  scale?: number;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  imageSrc,
  title,
  config,
  className = '',
  scale = 1,
}) => {
  const deviceType = config?.deviceType || 'iphone';
  const color = config?.color || 'titanium';
  const showGlare = config?.showGlare ?? true;
  const showShadow = config?.showShadow ?? true;
  const notchType = config?.notchType || (deviceType === 'pixel' ? 'punchhole' : 'dynamic');

  // Determine frame border and background colors
  let frameBorderColor = 'border-slate-800 bg-slate-900';
  let metallicGradient = 'bg-gradient-to-b from-slate-700 via-slate-800 to-slate-950';

  if (color === 'titanium') {
    frameBorderColor = 'border-slate-700 bg-slate-900';
    metallicGradient = 'bg-gradient-to-b from-zinc-600 via-zinc-800 to-zinc-950';
  } else if (color === 'black') {
    frameBorderColor = 'border-zinc-900 bg-zinc-950';
    metallicGradient = 'bg-gradient-to-b from-zinc-800 via-zinc-900 to-black';
  } else if (color === 'silver') {
    frameBorderColor = 'border-zinc-300 bg-zinc-900';
    metallicGradient = 'bg-gradient-to-b from-slate-200 via-zinc-400 to-zinc-700';
  } else if (color === 'purple') {
    frameBorderColor = 'border-purple-900 bg-slate-950';
    metallicGradient = 'bg-gradient-to-b from-purple-800 via-slate-900 to-zinc-950';
  } else if (color === 'gold') {
    frameBorderColor = 'border-amber-700 bg-zinc-900';
    metallicGradient = 'bg-gradient-to-b from-amber-600 via-amber-800 to-zinc-950';
  }

  // Corner radius according to device type
  let borderRadius = 'rounded-[44px]';
  if (deviceType === 'pixel') borderRadius = 'rounded-[38px]';
  if (deviceType === 'samsung') borderRadius = 'rounded-[28px]';
  if (deviceType === 'flat') borderRadius = 'rounded-[24px]';

  return (
    <div
      className={`relative inline-block transition-transform duration-300 ${className}`}
      style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
    >
      {/* Outer Shadow glow */}
      {showShadow && (
        <div
          className="absolute inset-0 rounded-[48px] blur-2xl opacity-40 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, rgba(0,0,0,0.8) 100%)',
            transform: 'translateY(16px) scale(0.95)',
          }}
        />
      )}

      {/* Outer Phone Chassis Body */}
      <div
        className={`relative p-[10px] ${borderRadius} ${metallicGradient} border-2 ${frameBorderColor} shadow-2xl overflow-hidden select-none`}
        style={{
          width: '280px',
          height: '570px',
          boxShadow: showShadow
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 1px 2px rgba(255,255,255,0.2)'
            : 'none',
        }}
      >
        {/* Antenna / Side button mockups */}
        <div className="absolute -left-[3px] top-[100px] w-[3px] h-[26px] bg-zinc-700 rounded-l" />
        <div className="absolute -left-[3px] top-[140px] w-[3px] h-[45px] bg-zinc-700 rounded-l" />
        <div className="absolute -left-[3px] top-[195px] w-[3px] h-[45px] bg-zinc-700 rounded-l" />
        <div className="absolute -right-[3px] top-[150px] w-[3px] h-[60px] bg-zinc-700 rounded-r" />

        {/* Inner Screen Display Box */}
        <div className={`relative w-full h-full bg-black overflow-hidden ${borderRadius} border border-black`}>
          {/* Front Camera Cutout / Notch / Island Styles */}
          {notchType === 'dynamic' && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[90px] h-[22px] bg-black rounded-full z-30 flex items-center justify-between px-2.5 shadow-md">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-800" />
              <div className="w-2 h-2 rounded-full bg-blue-950/80 animate-pulse" />
            </div>
          )}

          {(notchType === 'small' || notchType === 'notch') && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[55px] h-[16px] bg-black rounded-full z-30 flex items-center justify-between px-2 shadow-sm border border-zinc-900/60">
              <div className="w-2 h-2 rounded-full bg-zinc-900 border border-zinc-800" />
              <div className="w-1.5 h-1.5 rounded-full bg-blue-950/80" />
            </div>
          )}

          {(notchType === 'center' || notchType === 'punchhole') && (
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-30 border border-zinc-900 flex items-center justify-center shadow-sm">
              <div className="w-2 h-2 rounded-full bg-zinc-900 border border-zinc-800" />
            </div>
          )}

          {notchType === 'corner' && (
            <div className="absolute top-2.5 left-5 w-4 h-4 bg-black rounded-full z-30 border border-zinc-900 flex items-center justify-center shadow-sm">
              <div className="w-2 h-2 rounded-full bg-zinc-900 border border-zinc-800" />
            </div>
          )}

          {/* Status Bar */}
          <div className="absolute top-0 inset-x-0 h-8 z-20 flex justify-between items-center px-6 text-[10px] font-semibold text-white/90 pointer-events-none">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 20.3c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l2.7-2.7C10.02 19.61 11 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9z" />
              </svg>
              <div className="w-4 h-2 border border-white/80 rounded-[2px] p-[1px] flex items-center">
                <div className="w-full h-full bg-white rounded-[1px]" />
              </div>
            </div>
          </div>

          {/* Actual Screenshot Content */}
          <div className="w-full h-full relative">
            <img
              src={imageSrc}
              alt={title || 'App screenshot'}
              className="w-full h-full object-cover object-top select-none"
              draggable={false}
            />

            {/* Screen Glass Glare Gloss Overlay */}
            {showGlare && (
              <div
                className="absolute inset-0 pointer-events-none z-10 opacity-30"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 100%)',
                }}
              />
            )}
          </div>

          {/* Home Indicator Bar */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/70 rounded-full z-30" />
        </div>
      </div>

      {title && (
        <div className="text-center mt-3">
          <span className="text-xs font-medium text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700/50">
            {title}
          </span>
        </div>
      )}
    </div>
  );
};
