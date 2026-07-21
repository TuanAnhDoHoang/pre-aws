import React, { useState, useRef, useEffect } from 'react';
import { DesignPattern, PRESET_PATTERNS, getCustomPatterns, saveCustomPattern, deleteCustomPattern } from '../patterns';
import { CloudNode, Connection } from '../types';

interface PatternSelectorProps {
  currentPatternId: string | null;
  onSelectPattern: (pattern: DesignPattern | null) => void;
  onCopyPattern: (pattern: DesignPattern) => void;
  currentNodes: CloudNode[];
  currentConnections: Connection[];
}

export default function PatternSelector({
  currentPatternId,
  onSelectPattern,
  onCopyPattern,
  currentNodes,
  currentConnections,
}: PatternSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customPatterns, setCustomPatterns] = useState<DesignPattern[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load custom patterns on mount and when dropdown opens
  const refreshCustomPatterns = () => {
    setCustomPatterns(getCustomPatterns());
  };

  useEffect(() => {
    refreshCustomPatterns();
  }, []);

  useEffect(() => {
    if (isOpen) {
      refreshCustomPatterns();
      setShowAddForm(false);
      setNewName('');
      setNewDesc('');
    }
  }, [isOpen]);

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

  const handleSelect = (pattern: DesignPattern) => {
    onSelectPattern(pattern);
    setIsOpen(false);
  };

  const handleClear = () => {
    onSelectPattern(null);
    setIsOpen(false);
  };

  const handleSavePattern = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    if (currentNodes.length === 0) {
      showToast('Sơ đồ hiện tại đang trống, không thể lưu mẫu!');
      return;
    }

    const saved = saveCustomPattern(newName.trim(), newDesc.trim(), currentNodes, currentConnections);
    refreshCustomPatterns();
    setShowAddForm(false);
    setNewName('');
    setNewDesc('');
    showToast(`Đã lưu mẫu "${saved.name}" thành công!`);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // prevent selecting
    if (confirm('Bạn có chắc muốn xóa mẫu thiết kế tùy chỉnh này?')) {
      deleteCustomPattern(id);
      refreshCustomPatterns();
      if (currentPatternId === id) {
        onSelectPattern(null);
      }
      showToast('Đã xóa mẫu tùy chỉnh!');
    }
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 3000);
  };

  const selectedPattern = [...PRESET_PATTERNS, ...customPatterns].find(p => p.id === currentPatternId);

  // Stop mouse wheel and drag events from bubbling to canvas zoom/pan
  const preventPropagation = (e: React.UIEvent | React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef} onWheel={preventPropagation} onMouseDown={preventPropagation} onMouseUp={preventPropagation}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 border border-[#141414] rounded-none shadow-none hover:scale-102 active:scale-98 transition-all font-sans cursor-pointer uppercase text-xs font-black tracking-wider ${
          currentPatternId 
            ? 'bg-[#F27D26] text-white hover:bg-[#D66311]' 
            : 'bg-[#F1F0ED] hover:bg-white text-on-surface'
        }`}
        title="Chọn hoặc tạo Mẫu Thiết Kế (Cloud Patterns)"
      >
        <span className="material-symbols-outlined text-sm font-bold select-none leading-none">
          schema
        </span>
        <span className="font-sans font-black text-xs tracking-wider">
          {selectedPattern ? `Mẫu: ${selectedPattern.name}` : 'Mẫu thiết kế (Pattern)'}
        </span>
        <span className="material-symbols-outlined text-[14px] font-bold select-none leading-none">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1 w-80 bg-[#F1F0ED] border border-[#141414] rounded-none z-50 shadow-none overflow-hidden animate-fade-in flex flex-col">
          {/* Header */}
          <div className="px-3 py-2 bg-[#E4E3E0] border-b border-[#141414] flex justify-between items-center shrink-0">
            <span className="text-[10px] font-extrabold text-on-surface/80 uppercase tracking-widest">
              Danh sách mẫu thiết kế
            </span>
            {currentPatternId && (
              <button
                onClick={handleClear}
                className="text-[10px] text-red-600 hover:text-red-800 font-bold uppercase tracking-wider underline cursor-pointer"
              >
                Thoát xem mẫu
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto custom-scrollbar flex-1">
            {!showAddForm ? (
              <div className="p-1 space-y-1">
                {/* Default Patterns */}
                <div className="px-2 py-1 text-[9px] font-extrabold text-on-surface/50 uppercase tracking-widest">
                  Mẫu AWS Mặc Định
                </div>
                {PRESET_PATTERNS.map((pattern) => {
                  const isSelected = pattern.id === currentPatternId;
                  return (
                    <div
                      key={pattern.id}
                      onClick={() => handleSelect(pattern)}
                      className={`group w-full p-2.5 text-left border border-[#141414]/10 hover:border-[#141414] rounded-none transition-all cursor-pointer flex flex-col gap-1 ${
                        isSelected ? 'bg-[#F27D26]/10 border-[#F27D26]' : 'hover:bg-black/5'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className={`text-xs font-black tracking-tight ${isSelected ? 'text-[#F27D26]' : 'text-on-surface'}`}>
                          {pattern.name}
                        </span>
                        <span className="text-[8px] px-1 py-0.5 bg-black/10 text-on-surface-variant font-bold rounded-none uppercase leading-none">
                          AWS
                        </span>
                      </div>
                      <p className="text-[10px] text-on-surface-variant/80 line-clamp-2 leading-relaxed">
                        {pattern.description}
                      </p>
                    </div>
                  );
                })}

                {/* Custom Patterns */}
                <div className="pt-2 px-2 py-1 text-[9px] font-extrabold text-on-surface/50 uppercase tracking-widest border-t border-[#141414]/10 mt-2">
                  Mẫu Của Tôi ({customPatterns.length})
                </div>
                {customPatterns.length === 0 ? (
                  <p className="text-[10px] italic text-on-surface-variant/60 px-2 py-1">
                    Chưa có mẫu tự thiết kế nào.
                  </p>
                ) : (
                  customPatterns.map((pattern) => {
                    const isSelected = pattern.id === currentPatternId;
                    return (
                      <div
                        key={pattern.id}
                        onClick={() => handleSelect(pattern)}
                        className={`group w-full p-2.5 text-left border border-[#141414]/10 hover:border-[#141414] rounded-none transition-all cursor-pointer flex flex-col gap-1 ${
                          isSelected ? 'bg-[#F27D26]/10 border-[#F27D26]' : 'hover:bg-black/5'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className={`text-xs font-black tracking-tight ${isSelected ? 'text-[#F27D26]' : 'text-on-surface'}`}>
                            {pattern.name}
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="text-[8px] px-1 py-0.5 bg-[#F27D26]/20 text-[#F27D26] font-bold rounded-none uppercase leading-none">
                              Tùy biến
                            </span>
                            <button
                              onClick={(e) => handleDelete(e, pattern.id)}
                              className="text-on-surface-variant/50 hover:text-red-600 p-0.5 rounded-none cursor-pointer"
                              title="Xóa mẫu này"
                            >
                              <span className="material-symbols-outlined text-[13px] font-bold">delete</span>
                            </button>
                          </div>
                        </div>
                        <p className="text-[10px] text-on-surface-variant/80 line-clamp-2 leading-relaxed">
                          {pattern.description}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              /* Add Pattern Form */
              <form onSubmit={handleSavePattern} className="p-3 space-y-3 border-t border-[#141414]/10">
                <div className="text-xs font-black uppercase text-on-surface">Tạo mẫu thiết kế mới</div>
                <p className="text-[10px] text-on-surface-variant/70 leading-relaxed">
                  Lưu lại toàn bộ các node dịch vụ và các kết nối hiện tại trên sơ đồ thành một mẫu thiết kế riêng để sử dụng lại sau này.
                </p>

                <div className="space-y-1">
                  <label className="block text-[9px] font-extrabold uppercase text-on-surface-variant tracking-wider">
                    Tên mẫu thiết kế *
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Ví dụ: High Availability Web Server..."
                    className="w-full px-2 py-1.5 bg-[#E4E3E0] border border-[#141414] rounded-none font-sans text-xs outline-none focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-extrabold uppercase text-on-surface-variant tracking-wider">
                    Mô tả ngắn gọn
                  </label>
                  <textarea
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Mô tả mục đích, kiến trúc..."
                    rows={2}
                    className="w-full px-2 py-1.5 bg-[#E4E3E0] border border-[#141414] rounded-none font-sans text-xs outline-none focus:bg-white transition-all resize-none"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 px-2 py-1.5 border border-[#141414] hover:bg-black/5 text-xs font-bold uppercase transition-all cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-2 py-1.5 bg-[#F27D26] text-white border border-[#141414] hover:bg-[#D66311] text-xs font-black uppercase transition-all cursor-pointer"
                  >
                    Lưu lại
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Bottom Action Footer */}
          {!showAddForm && (
            <div className="p-2 border-t border-[#141414] bg-[#E4E3E0] shrink-0">
              <button
                disabled={currentNodes.length === 0}
                onClick={() => {
                  if (currentNodes.length === 0) return;
                  setShowAddForm(true);
                }}
                className={`w-full flex items-center justify-center gap-1.5 py-2 border border-[#141414] text-xs uppercase font-black tracking-wider transition-all cursor-pointer ${
                  currentNodes.length === 0
                    ? 'opacity-40 cursor-not-allowed bg-black/5 text-on-surface-variant'
                    : 'bg-white hover:bg-[#F27D26] hover:text-white'
                }`}
                title={currentNodes.length === 0 ? "Vui lòng thêm dịch vụ vào sơ đồ trước khi lưu mẫu" : "Lưu sơ đồ hiện tại thành mẫu tùy chỉnh"}
              >
                <span className="material-symbols-outlined text-sm font-bold">add_circle</span>
                <span>Thêm Mẫu Mới (Save Custom)</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-14 left-4 z-[999] bg-[#141414] text-white border-2 border-white px-3 py-2 font-sans font-bold text-xs uppercase tracking-wide shadow-none animate-fade-in flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-[#F27D26]">info</span>
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
