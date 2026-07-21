import React, { useState, useRef, useEffect } from 'react';

export interface RegionOption {
  value: string;
  label: string;
  shortLabel: string;
  flag: string;
  location: string;
}

export const REGION_OPTIONS: RegionOption[] = [
  { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)', shortLabel: 'Singapore', flag: '🇸🇬', location: 'ap-southeast-1' },
  { value: 'us-east-1', label: 'US East (N. Virginia)', shortLabel: 'N. Virginia', flag: '🇺🇸', location: 'us-east-1' },
  { value: 'us-west-2', label: 'US West (Oregon)', shortLabel: 'Oregon', flag: '🇺🇸', location: 'us-west-2' },
  { value: 'eu-west-1', label: 'Europe (Ireland)', shortLabel: 'Ireland', flag: '🇮🇪', location: 'eu-west-1' },
  { value: 'ap-northeast-1', label: 'Asia Pacific (Tokyo)', shortLabel: 'Tokyo', flag: '🇯🇵', location: 'ap-northeast-1' },
  { value: 'ap-east-1', label: 'Asia Pacific (Hong Kong)', shortLabel: 'Hong Kong', flag: '🇭🇰', location: 'ap-east-1' },
];

interface RegionSelectorProps {
  currentRegion: string;
  onRegionChange: (region: string) => void;
}

export default function RegionSelector({ currentRegion, onRegionChange }: RegionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = REGION_OPTIONS.find(opt => opt.value === currentRegion) || REGION_OPTIONS[0];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const preventPropagation = (e: React.UIEvent | React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="relative inline-block text-left"
      ref={dropdownRef}
      onWheel={preventPropagation}
      onMouseDown={preventPropagation}
      onMouseUp={preventPropagation}
      onClick={preventPropagation}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-[#F1F0ED] hover:bg-white text-on-surface border border-[#141414] rounded-none shadow-none hover:scale-102 active:scale-98 transition-all font-sans cursor-pointer uppercase text-xs font-black tracking-wider"
        title="Chọn Vùng AWS (AWS Region)"
      >
        <span className="text-sm select-none pointer-events-none">{selectedOption.flag}</span>
        <span className="font-sans font-black text-xs text-on-surface tracking-wider">Vùng: {selectedOption.shortLabel}</span>
        <span className="material-symbols-outlined text-[14px] font-bold select-none leading-none">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1 w-64 bg-[#F1F0ED] border border-[#141414] rounded-none z-50 shadow-none overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="px-3 py-1.5 bg-[#E4E3E0] border-b border-[#141414] text-[9px] font-extrabold text-on-surface/60 uppercase tracking-widest">
            Chọn vùng AWS chính
          </div>
          {/* Options */}
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {REGION_OPTIONS.map((option) => {
              const isSelected = option.value === currentRegion;
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    onRegionChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-left border-b border-[#141414]/10 last:border-b-0 transition-all font-sans text-xs cursor-pointer ${
                    isSelected
                      ? 'bg-[#F27D26]/10 text-[#F27D26] font-black'
                      : 'text-on-surface hover:bg-black/5 hover:text-[#F27D26]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">{option.flag}</span>
                    <div className="flex flex-col">
                      <span className="font-bold tracking-tight">{option.label}</span>
                      <span className="font-mono text-[9px] text-on-surface-variant/70 leading-none mt-0.5">{option.location}</span>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="material-symbols-outlined text-sm font-black text-[#F27D26]">
                      check
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
