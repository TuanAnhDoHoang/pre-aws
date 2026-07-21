import React, { useState } from 'react';
import { ServiceType, SERVICE_DEFINITIONS } from '../types';
import AwsIcon from './AwsIcons';

interface SidebarLeftProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  width: number;
  onWidthChange: (width: number) => void;
  setCollapsed: (collapsed: boolean) => void;
  selectedServiceType: ServiceType | null;
  onSelectServiceType: (type: ServiceType | null) => void;
}

export default function SidebarLeft({
  collapsed,
  onToggleCollapse,
  width,
  onWidthChange,
  setCollapsed,
  selectedServiceType,
  onSelectServiceType,
}: SidebarLeftProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Group services by category
  const categories: Record<'Compute' | 'Storage' | 'Database' | 'Networking', ServiceType[]> = {
    Compute: ['compute', 'lambda'],
    Storage: ['s3', 'ebs'],
    Database: ['rds', 'dynamodb'],
    Networking: ['vpc', 'cloudfront', 'tg'],
  };

  const handleDragStart = (e: React.DragEvent, type: ServiceType) => {
    e.dataTransfer.setData('text/plain', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);

    const startX = e.clientX;
    const startWidth = width;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      let newWidth = startWidth + deltaX;

      if (newWidth < 40) {
        newWidth = 0;
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }

      if (newWidth > 600) {
        newWidth = 600;
      }
      onWidthChange(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <aside
      className={`bg-surface-container-low border-r border-[#141414] flex flex-col h-full relative z-30 select-none custom-scrollbar ${
        isDragging ? '' : 'transition-[width] duration-150'
      }`}
      style={{ width: collapsed ? 0 : width, overflowX: 'hidden' }}
    >
      {!collapsed && (
        <div className="flex flex-col h-full min-w-[240px] w-full relative">
          {/* Header */}
          <div className="p-5 border-b border-[#141414] shrink-0 bg-[#E4E3E0]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary font-black text-2xl" style={{ fontVariationSettings: '"FILL" 1' }}>
                  cloud
                </span>
                <h2 className="font-extrabold text-xl text-on-surface tracking-tighter uppercase font-sans">
                  AWS CLOUD
                </h2>
              </div>
              <span className="font-serif italic text-xs text-on-surface-variant font-medium">Vol. 08</span>
            </div>
            <p className="text-on-surface-variant text-[11px] uppercase tracking-wider font-bold opacity-85">
              Kéo-thả hoặc click thiết bị
            </p>
          </div>

          {/* Service Library List */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 custom-scrollbar bg-[#E4E3E0]">
            {(Object.keys(categories) as Array<keyof typeof categories>).map((catName, catIdx) => (
              <div key={catName}>
                <div className="flex items-center justify-between border-b border-[#141414] pb-1.5 mb-3">
                  <h3 className="text-[11px] font-black text-on-surface uppercase tracking-widest">
                    {catName}
                  </h3>
                  <span className="font-serif italic text-xs text-on-surface/55">0{catIdx + 1}</span>
                </div>
                <div className="space-y-2">
                  {categories[catName].map((type) => {
                    const def = SERVICE_DEFINITIONS[type];
                    const isSelected = selectedServiceType === type;
                    return (
                      <div
                        key={type}
                        draggable
                        onDragStart={(e) => handleDragStart(e, type)}
                        onClick={() => onSelectServiceType(isSelected ? null : type)}
                        className={`group flex items-center gap-3 p-2 border rounded-none shadow-none cursor-grab transition-all active:cursor-grabbing ${
                          isSelected
                            ? 'bg-[#F27D26]/10 border-[#F27D26]'
                            : 'bg-white border-[#141414] hover:bg-[#F27D26]/10 hover:border-[#F27D26]'
                        }`}
                        title="Kéo vào canvas hoặc click để xem chi tiết và thêm"
                      >
                        <div className={`w-9 h-9 shrink-0 border rounded-none flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-[#F27D26]/20 border-[#F27D26]'
                            : 'bg-[#E4E3E0] border-[#141414] group-hover:bg-[#F27D26]/20 group-hover:border-[#F27D26]'
                        }`}>
                          <AwsIcon type={type} className="w-7 h-7 select-none pointer-events-none" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-on-surface leading-tight uppercase tracking-tight whitespace-nowrap truncate">
                            {def.label}
                          </p>
                          <p className="text-[10px] font-serif italic text-on-surface-variant/80 whitespace-nowrap truncate">
                            aws_{type === 'tg' ? 'lb_target_group' : type === 'compute' ? 'instance' : type === 'rds' ? 'db_instance' : type}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>          
        </div>
      )}

      {/* Resize Handle */}
      {!collapsed && (
        <div
          onMouseDown={handleMouseDown}
          className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-[#F27D26]/40 active:bg-[#F27D26] z-50 transition-colors border-r border-[#141414]/10"
          title="Kéo để chỉnh kích thước"
        />
      )}
    </aside>
  );
}
