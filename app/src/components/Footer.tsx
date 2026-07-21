import React from 'react';

interface FooterProps {
  gridSnap: boolean;
  onToggleGridSnap: () => void;
  nodesCount: number;
}

export default function Footer({ gridSnap, onToggleGridSnap, nodesCount }: FooterProps) {
  return (
    <footer className="bg-[#E4E3E0] text-[#141414] shrink-0 w-full h-10 z-30 flex justify-between items-center px-6 border-t border-[#141414] select-none tracking-wider text-[10px] font-bold uppercase">
      {/* Left side info */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <span>v2.4.1</span>
          <span className="text-[#141414]/40">|</span>
          <span className="font-mono text-[10px]">1024 x 768</span>
          <span className="text-[#141414]/40">|</span>
          <button
            onClick={onToggleGridSnap}
            className="hover:text-[#F27D26] transition-colors cursor-pointer flex items-center gap-1 font-sans font-black"
            title="Click để bật/tắt bám lưới tọa độ"
          >
            Bám lưới: <span className={gridSnap ? 'text-[#F27D26]' : 'text-[#141414]/60 font-medium'}>
              {gridSnap ? 'Bật' : 'Tắt'}
            </span>
          </button>
        </div>

        {/* Dynamic target group health indicator */}
        <div className="flex items-center gap-1.5 border-l border-[#141414] pl-5">
          <div className="w-2.5 h-2.5 bg-green-600 rounded-none border border-[#141414]"></div>
          <span className="text-[10px] font-black text-[#141414]">
            {nodesCount > 0 ? 'MẠNG LƯỚI HOẠT ĐỘNG KHỎE MẠNH (6/6)' : 'HỆ THỐNG TRỐNG'}
          </span>
        </div>
      </div>

      {/* Right side links */}
      <div className="flex items-center gap-5 font-black">
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="hover:text-[#F27D26] transition-colors"
        >
          Tài liệu
        </a>
        <div className="h-3.5 w-[1px] bg-[#141414]"></div>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="hover:text-[#F27D26] transition-colors flex items-center gap-1.5"
        >
          Trạng thái API
          <span className="w-2.5 h-2.5 bg-green-600 border border-[#141414] rounded-none"></span>
        </a>
      </div>
    </footer>
  );
}
