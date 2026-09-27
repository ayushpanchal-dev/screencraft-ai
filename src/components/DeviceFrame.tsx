import React, { useState } from 'react';
import { DeviceConfig } from '../types';
import { getRenderableImageUrl } from '../utils/imageUrlUtils';
import { AlertCircle, Image as ImageIcon } from 'lucide-react';

interface DeviceFrameProps {
  imageSrc?: string;
  title?: string;
  config?: Partial<DeviceConfig>;
  className?: string;
  scale?: number;
  logoUrl?: string;
  appName?: string;
  tagline?: string;
  primaryColor?: string;
  isSplashMode?: boolean;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  imageSrc,
  title,
  config,
  className = '',
  scale = 1,
  logoUrl,
  appName,
  tagline,
  primaryColor = '#6366F1',
  isSplashMode = false,
}) => {
  const [hasError, setHasError] = useState(false);
  const resolvedSrc = imageSrc ? getRenderableImageUrl(imageSrc) : '';

  const deviceType = config?.deviceType || 'iphone';
  const color = config?.color || 'titanium';
  const showGlare = config?.showGlare ?? true;
  const showShadow = config?.showShadow ?? true;
  const notchType = config?.notchType || (deviceType === 'pixel' ? 'punchhole' : 'dynamic');
  const fitMode = config?.fitMode || 'contain';
  const showStatusBar = config?.showStatusBarOverlay ?? true;

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

  // Scaled dimensions so DOM layout container matches visual scale
  const baseWidth = 280;
  const baseHeight = 570;
  const scaledWidth = Math.round(baseWidth * scale);
  const scaledHeight = Math.round(baseHeight * scale);

  const renderContent = () => {
    // If explicitly splash mode or no image provided, render App/Flutter Splash Screen
    if (isSplashMode || (!resolvedSrc && !hasError)) {
      return (
        <div className="w-full h-full bg-slate-950 relative flex flex-col items-center justify-between p-6 pt-12 pb-10 text-center overflow-hidden select-none">
          {/* Ambient radial glow */}
          <div
            className="absolute inset-0 opacity-25 blur-2xl pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${primaryColor} 0%, rgba(15,23,42,0.9) 80%)`,
            }}
          />

          {/* Top Brand Tag */}
          <div className="z-10 pt-2">
            <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-slate-900/80 text-indigo-300 border border-indigo-500/30">
              Flutter Application
            </span>
          </div>

          {/* Center App Logo & Name */}
          <div className="z-10 space-y-3 my-auto flex flex-col items-center">
            {logoUrl && (
              <div
                className="w-16 h-16 rounded-2xl p-2.5 border border-slate-700/80 bg-slate-900 shadow-xl flex items-center justify-center transform hover:scale-105 transition"
                style={{ boxShadow: `0 10px 25px -5px ${primaryColor}40` }}
              >
                <img
                  src={logoUrl}
                  alt={appName || 'App Logo'}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <div className="space-y-1 max-w-[200px]">
              <h3 className="text-lg font-extrabold text-white tracking-tight truncate">
                {appName || 'Flutter Application'}
              </h3>
              {tagline && (
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight">
                  {tagline}
                </p>
              )}
            </div>
          </div>

          {/* Bottom Official Flutter Badge */}
          <div className="z-10 pt-2 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-400 bg-slate-900/90 px-3 py-1.5 rounded-full border border-slate-800">
            <svg className="w-4 h-4 text-sky-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.314 0L2.3 12 6.557 16.257 22.828 0h-8.514zM14.314 11.429L9.143 16.6 14.314 21.771h8.514l-5.171-5.171 5.171-5.171h-8.514z" />
            </svg>
            <span>Built with Flutter</span>
          </div>
        </div>
      );
    }

    if (resolvedSrc && !hasError) {
      return (
        <div className="w-full h-full relative flex items-center justify-center overflow-hidden bg-slate-950">
          <img
            src={resolvedSrc}
            alt={title || 'App screenshot'}
            className={`w-full h-full select-none ${
              fitMode === 'cover'
                ? 'object-cover object-top'
                : 'object-contain max-w-full max-h-full p-1'
            }`}
            draggable={false}
            onError={() => setHasError(true)}
          />
        </div>
      );
    }

    return (
      <div className="p-6 text-center text-slate-500 space-y-2 flex flex-col items-center justify-center h-full">
        <AlertCircle className="w-8 h-8 text-amber-500/80 mx-auto" />
        <p className="text-[11px] text-slate-400 font-medium leading-tight">
          Image could not be loaded. Ensure the URL is valid and set to public.
        </p>
      </div>
    );
  };

  return (
    <div className={`relative flex flex-col items-center justify-center max-w-full ${className}`}>
      <div
        className="relative transition-transform duration-300 flex justify-center"
        style={{
          width: `${scaledWidth}px`,
          height: title ? `${scaledHeight + 36}px` : `${scaledHeight}px`,
          maxWidth: '100%',
        }}
      >
        <div
          className="relative inline-block select-none origin-top"
          style={{ transform: `scale(${scale})` }}
        >
          {/* Outer Shadow glow */}
          {showShadow && (
            <div
              className="absolute inset-0 rounded-[48px] blur-2xl opacity-40 pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${primaryColor}66 0%, rgba(0,0,0,0.8) 100%)`,
                transform: 'translateY(16px) scale(0.95)',
              }}
            />
          )}

          {/* Outer Phone Chassis Body */}
          <div
            className={`relative p-[10px] ${borderRadius} ${metallicGradient} border-2 ${frameBorderColor} shadow-2xl overflow-hidden select-none`}
            style={{
              width: `${baseWidth}px`,
              height: `${baseHeight}px`,
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
            <div className={`relative w-full h-full bg-slate-950 overflow-hidden ${borderRadius} border border-black`}>
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
              {showStatusBar && (
                <div className="absolute top-0 inset-x-0 h-7 z-20 flex justify-between items-center px-5 text-[10px] font-semibold text-white/90 pointer-events-none">
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
              )}

              {/* Screenshot Content Area with Notch Top Safe Area Padding Inset */}
              <div
                className={`w-full h-full relative ${
                  notchType !== 'none' && !isSplashMode ? 'pt-6' : ''
                }`}
              >
                {renderContent()}

                {/* Screen Glass Glare Gloss Overlay */}
                {showGlare && (
                  <div
                    className="absolute inset-0 pointer-events-none z-10 opacity-25"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 100%)',
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
      </div>
    </div>
  );
};
