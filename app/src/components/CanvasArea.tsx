import React, { useState, useRef, useEffect } from 'react';
import { CloudNode, Connection, ServiceType, SERVICE_DEFINITIONS } from '../types';
import { calculateNodeCost, isHourlyUnit } from '../utils';
import AwsIcon from './AwsIcons';
import RegionSelector from './RegionSelector';
import PatternSelector from './PatternSelector';
import { DesignPattern } from '../patterns';

interface CanvasAreaProps {
  nodes: CloudNode[];
  connections: Connection[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
  onUpdateNodeCoordinates: (nodeId: string, x: number, y: number) => void;
  onAddNodeAtCoordinates: (type: ServiceType, x: number, y: number) => void;
  onAddConnection: (
    fromId: string,
    toId: string,
    fromPort?: 'top' | 'bottom',
    toPort?: 'top' | 'bottom'
  ) => void;
  onDeleteConnection: (connId: string) => void;
  isPlaying: boolean;
  gridSnap: boolean;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onZoomChange?: (zoom: number) => void;
  onTogglePlay: () => void;
  onOpenCostEstimate: () => void;
  openMonitor?: boolean;
  onToggleMonitor?: () => void;
  region: string;
  onRegionChange: (region: string) => void;

  // Pattern features
  isReadOnly: boolean;
  viewingPatternName: string | null;
  currentPatternId: string | null;
  onSelectPattern: (pattern: DesignPattern | null) => void;
  onCopyPattern: () => void;
  onExitPatternView: () => void;
  workspaceNodes: CloudNode[];
  workspaceConnections: Connection[];
}

export default function CanvasArea({
  nodes,
  connections,
  selectedNodeId,
  onSelectNode,
  onUpdateNodeCoordinates,
  onAddNodeAtCoordinates,
  onAddConnection,
  onDeleteConnection,
  isPlaying,
  gridSnap,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onZoomChange,
  onTogglePlay,
  onOpenCostEstimate,
  openMonitor = false,
  onToggleMonitor,
  region,
  onRegionChange,

  // Pattern features
  isReadOnly,
  viewingPatternName,
  currentPatternId,
  onSelectPattern,
  onCopyPattern,
  onExitPatternView,
  workspaceNodes,
  workspaceConnections,
}: CanvasAreaProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; nodeX: number; nodeY: number }>({
    mouseX: 0,
    mouseY: 0,
    nodeX: 0,
    nodeY: 0,
  });

  // Infinite/Open Canvas pan and zoom state
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const panStartRef = useRef<{ mouseX: number; mouseY: number; panX: number; panY: number; hasMoved: boolean }>({
    mouseX: 0,
    mouseY: 0,
    panX: 0,
    panY: 0,
    hasMoved: false,
  });

  const isWheelZoomingRef = useRef(false);

  // Connector tool state
  const [isConnectingMode, setIsConnectingMode] = useState(false);
  const [connectSourceId, setConnectSourceId] = useState<string | null>(null);
  const [connectSourcePort, setConnectSourcePort] = useState<'top' | 'bottom'>('bottom');
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  
  // Selected connection line to support deletion
  const [selectedConnId, setSelectedConnId] = useState<string | null>(null);

  const getNodePrice = (node: CloudNode) => {
    const price = node.pricing;
    if (price?.status === 'ok') {
      return price;
    }
    return {
      price: 0,
      unit: 'USD/giờ',
      display: price?.status === 'loading' ? 'Đang tải...' : '0.00 USD/giờ',
      status: price?.status || 'error',
    };
  };

  // Initialize panning to center the 800x600 coordinates once canvas dimensions are available
  useEffect(() => {
    if (!isInitialized && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const initialPanX = rect.width / 2 - 400 * zoom;
        const initialPanY = rect.height / 2 - 300 * zoom;
        setPan({ x: initialPanX, y: initialPanY });
        setIsInitialized(true);
      }
    }
  }, [isInitialized, zoom]);

  // Sync zoom updates from button triggers (centers on the viewport center)
  const lastZoomRef = useRef(zoom);
  useEffect(() => {
    if (canvasRef.current && isInitialized) {
      const rect = canvasRef.current.getBoundingClientRect();
      const cX = rect.width / 2;
      const cY = rect.height / 2;
      
      const oldZoom = lastZoomRef.current;
      const newZoom = zoom;
      
      if (oldZoom !== newZoom) {
        if (isWheelZoomingRef.current) {
          isWheelZoomingRef.current = false;
        } else {
          setPan((prev) => {
            const nextX = cX - ((cX - prev.x) * newZoom) / oldZoom;
            const nextY = cY - ((cY - prev.y) * newZoom) / oldZoom;
            return { x: nextX, y: nextY };
          });
        }
      }
    }
    lastZoomRef.current = zoom;
  }, [zoom, isInitialized]);

  // Handle Canvas mouse move to update connecting preview line coordinates
  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isConnectingMode && connectSourceId && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      
      const x = Math.round((clientX - pan.x) / zoom);
      const y = Math.round((clientY - pan.y) / zoom);
      
      setMousePos({ x, y });
    }
  };

  // Handle Drag Over for Sidebar items
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  // Handle Drop from Sidebar
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (isReadOnly) return;
    const type = e.dataTransfer.getData('text/plain') as ServiceType;
    if (!type || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    
    // Translate client coordinates relative to active pan/zoom to get precise world coordinates
    let x = Math.round((clientX - pan.x) / zoom);
    let y = Math.round((clientY - pan.y) / zoom);

    if (gridSnap) {
      x = Math.round(x / 20) * 20;
      y = Math.round(y / 20) * 20;
    }

    onAddNodeAtCoordinates(type, x, y);
  };

  // Mouse wheel handler to zoom towards the mouse pointer
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!canvasRef.current || !onZoomChange) return;

    const zoomFactor = 1.05;
    const direction = e.deltaY < 0 ? 1 : -1;
    
    const oldZoom = zoom;
    let newZoom = oldZoom;
    if (direction > 0) {
      newZoom = Math.min(2.0, oldZoom * zoomFactor);
    } else {
      newZoom = Math.max(0.4, oldZoom / zoomFactor);
    }
    
    if (newZoom === oldZoom) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mX = e.clientX - rect.left;
    const mY = e.clientY - rect.top;
    
    // Reverse transform current screen mouse coordinate to world coordinates
    const worldX = (mX - pan.x) / oldZoom;
    const worldY = (mY - pan.y) / oldZoom;
    
    // Re-adjust pan so mouse coordinates remain stationary under the new zoom level
    const nextPanX = mX - worldX * newZoom;
    const nextPanY = mY - worldY * newZoom;
    
    isWheelZoomingRef.current = true;
    setPan({ x: nextPanX, y: nextPanY });
    onZoomChange(newZoom);
  };

  // Node Dragging Mouse Handlers
  const handleNodeMouseDown = (e: React.MouseEvent, node: CloudNode) => {
    e.stopPropagation();
    onSelectNode(node.id);
    setSelectedConnId(null);

    if (isReadOnly) return;

    if (isConnectingMode) {
      if (!connectSourceId) {
        setConnectSourceId(node.id);
        setConnectSourcePort('bottom');
      } else if (connectSourceId !== node.id) {
        const clickY = mousePos ? mousePos.y : node.y;
        const targetPort = clickY < node.y ? 'top' : 'bottom';
        onAddConnection(connectSourceId, node.id, connectSourcePort, targetPort);
        setConnectSourceId(null);
        setIsConnectingMode(false);
        setMousePos(null);
      }
      return;
    }

    setDraggingNodeId(node.id);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      nodeX: node.x,
      nodeY: node.y,
    };
  };

  // Node movement loop
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggingNodeId) return;

      const deltaX = (e.clientX - dragStartRef.current.mouseX) / zoom;
      const deltaY = (e.clientY - dragStartRef.current.mouseY) / zoom;

      let newX = dragStartRef.current.nodeX + deltaX;
      let newY = dragStartRef.current.nodeY + deltaY;

      // Relax bounds for the infinite canvas space (e.g. -10000 to 10000)
      newX = Math.max(-10000, Math.min(10000, newX));
      newY = Math.max(-10000, Math.min(10000, newY));

      if (gridSnap) {
        newX = Math.round(newX / 20) * 20;
        newY = Math.round(newY / 20) * 20;
      }

      onUpdateNodeCoordinates(draggingNodeId, newX, newY);
    };

    const handleMouseUp = () => {
      if (draggingNodeId) {
        setDraggingNodeId(null);
      }
    };

    if (draggingNodeId) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingNodeId, gridSnap, zoom]);

  // Global keydown event to delete the selected connection using Backspace or Delete
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isReadOnly) return;
      if (selectedConnId) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          e.preventDefault();
          onDeleteConnection(selectedConnId);
          setSelectedConnId(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedConnId, onDeleteConnection]);

  // Click on Canvas background to clear selections
  const handleCanvasClick = () => {
    onSelectNode(null);
    setSelectedConnId(null);
    setConnectSourceId(null);
    setIsConnectingMode(false);
    setMousePos(null);
  };

  // Canvas Mouse Down: initiates draw.io empty space panning or middle-button drag panning
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    const isBackground = 
      e.target === canvasRef.current || 
      (e.target as HTMLElement).classList.contains('canvas-grid') ||
      (e.target as HTMLElement).id === 'zoom-container';

    const isMiddleClick = e.button === 1;
    const isLeftClick = e.button === 0;

    if ((isLeftClick && isBackground) || isMiddleClick) {
      e.preventDefault();
      setIsPanning(true);
      panStartRef.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        panX: pan.x,
        panY: pan.y,
        hasMoved: false,
      };
    }
  };

  const handleCanvasClickRef = useRef(handleCanvasClick);
  useEffect(() => {
    handleCanvasClickRef.current = handleCanvasClick;
  });

  // Pan interaction loop
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isPanning) return;
      
      const dx = e.clientX - panStartRef.current.mouseX;
      const dy = e.clientY - panStartRef.current.mouseY;
      
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        panStartRef.current.hasMoved = true;
      }
      
      setPan({
        x: panStartRef.current.panX + dx,
        y: panStartRef.current.panY + dy,
      });
    };

    const handleMouseUp = () => {
      if (isPanning) {
        setIsPanning(false);
        // Treat as clicks only if mouse did not perform dragging/panning
        if (!panStartRef.current.hasMoved) {
          handleCanvasClickRef.current();
        }
      }
    };

    if (isPanning) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isPanning]);

  // Customized local reset that centres both zoom and pan offset
  const handleZoomReset = () => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const initialPanX = rect.width / 2 - 400 * 1.0;
      const initialPanY = rect.height / 2 - 300 * 1.0;
      setPan({ x: initialPanX, y: initialPanY });
    }
    onZoomReset();
  };

  const toggleConnectingMode = () => {
    setIsConnectingMode(!isConnectingMode);
    setConnectSourceId(null);
    setMousePos(null);
  };

  // Render connections lines
  const renderLines = () => {
    return connections.map((conn) => {
      const fromNode = nodes.find((n) => n.id === conn.from);
      const toNode = nodes.find((n) => n.id === conn.to);

      if (!fromNode || !toNode) return null;

      const isSelected = selectedConnId === conn.id;

      // Draw standard line using ports if defined, defaulting to bottom -> top
      const fromPort = conn.fromPort || 'bottom';
      const toPort = conn.toPort || 'top';

      const fromX = fromNode.x;
      const fromY = fromPort === 'top' ? fromNode.y - 32 : fromNode.y + 32;
      const toX = toNode.x;
      const toY = toPort === 'bottom' ? toNode.y + 32 : toNode.y - 32;

      // Control points for a beautiful smooth Bezier curve (S-shape curve)
      const dy = Math.max(20, Math.abs(toY - fromY) * 0.5);
      const fromControlY = fromPort === 'top' ? fromY - dy : fromY + dy;
      const toControlY = toPort === 'bottom' ? toY + dy : toY - dy;
      
      const pathData = `M ${fromX} ${fromY} C ${fromX} ${fromControlY}, ${toX} ${toControlY}, ${toX} ${toY}`;

      return (
        <g key={conn.id} className="pointer-events-auto">
          {/* Invisible thick path for easier clicking */}
          <path
            d={pathData}
            fill="none"
            stroke="transparent"
            strokeWidth="16"
            className="cursor-pointer pointer-events-auto"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedConnId(conn.id);
              onSelectNode(null);
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              if (isReadOnly) return;
              onDeleteConnection(conn.id);
              setSelectedConnId(null);
            }}
          />
          {/* Rendered HCL Bezier Line */}
          <path
            d={pathData}
            fill="none"
            stroke={isSelected ? '#F27D26' : '#141414'}
            strokeWidth={isSelected ? '3.5' : '2'}
            className="transition-all pointer-events-auto cursor-pointer hover:stroke-[#F27D26]"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedConnId(conn.id);
              onSelectNode(null);
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              if (isReadOnly) return;
              onDeleteConnection(conn.id);
              setSelectedConnId(null);
            }}
          />
          
          {/* Animated dashes for active simulation */}
          {isPlaying && (
            <path
              d={pathData}
              fill="none"
              stroke="#F27D26"
              strokeWidth="2.5"
              className="animate-traffic pointer-events-none"
            />
          )}

          {/* Delete connection button on selected line */}
          {isSelected && !isReadOnly && (
            <foreignObject
              x={(fromX + toX) / 2 - 12}
              y={(fromY + toY) / 2 - 12}
              width="24"
              height="24"
              className="pointer-events-auto z-40"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteConnection(conn.id);
                  setSelectedConnId(null);
                }}
                className="w-6 h-6 bg-red-600 text-white rounded-none border border-[#141414] flex items-center justify-center shadow-none hover:bg-red-700 active:scale-90 transition-all cursor-pointer"
                title="Xóa đường kết nối (Tháo)"
              >
                <span className="material-symbols-outlined text-xs font-black">close</span>
              </button>
            </foreignObject>
          )}
        </g>
      );
    });
  };

  // Render preview connection line while dragging/connecting with snapping support
  const renderPreviewLine = () => {
    if (!isConnectingMode || !connectSourceId || !mousePos) return null;
    const sourceNode = nodes.find((n) => n.id === connectSourceId);
    if (!sourceNode) return null;

    const fromX = sourceNode.x;
    const fromY = connectSourcePort === 'top' ? sourceNode.y - 32 : sourceNode.y + 32;

    // Detect if mouse is near another node to snap
    const hoverCandidate = nodes.find(
      (n) =>
        n.id !== connectSourceId &&
        Math.abs(mousePos.x - n.x) < 55 &&
        Math.abs(mousePos.y - n.y) < 55
    );

    let toX = mousePos.x;
    let toY = mousePos.y;
    let hoverPort: 'top' | 'bottom' = 'top';

    if (hoverCandidate) {
      toX = hoverCandidate.x;
      hoverPort = mousePos.y < hoverCandidate.y ? 'top' : 'bottom';
      toY = hoverPort === 'top' ? hoverCandidate.y - 32 : hoverCandidate.y + 32;
    }

    const dy = Math.max(20, Math.abs(toY - fromY) * 0.5);
    const fromControlY = connectSourcePort === 'top' ? fromY - dy : fromY + dy;
    const toControlY = hoverCandidate
      ? hoverPort === 'bottom'
        ? toY + dy
        : toY - dy
      : toY < fromY
      ? toY + dy
      : toY - dy;

    const pathData = `M ${fromX} ${fromY} C ${fromX} ${fromControlY}, ${toX} ${toControlY}, ${toX} ${toY}`;

    return (
      <path
        d={pathData}
        fill="none"
        stroke="#F27D26"
        strokeWidth="2.5"
        strokeDasharray="5 5"
        className="animate-pulse"
      />
    );
  };

  return (
    <main
      ref={canvasRef}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleCanvasMouseMove}
      onWheel={handleWheel}
      className={`flex-1 relative overflow-hidden flex items-center justify-center h-full select-none bg-[#E4E3E0] ${
        isPanning ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* Top Banner Notice when viewing pattern */}
      {isReadOnly && (
        <div className="absolute top-0 left-0 right-0 h-10 bg-[#F27D26] text-white px-4 border-b border-[#141414] font-sans flex items-center justify-between z-30 shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined font-black text-sm animate-pulse">visibility</span>
            <span className="text-[10px] font-black tracking-wider uppercase">
              Đang xem mẫu: <span className="underline">{viewingPatternName || 'Mẫu thiết kế'}</span> (Chỉ xem - Không thể chỉnh sửa)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onCopyPattern}
              className="bg-white text-neutral-950 hover:bg-[#141414] hover:text-white border border-[#141414] px-3 py-1 font-sans font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer shadow-none active:scale-95"
            >
              Sử dụng / Copy mẫu này
            </button>
            <button
              onClick={onExitPatternView}
              className="bg-transparent text-white hover:underline px-2 py-1 text-[10px] font-black uppercase tracking-wider cursor-pointer font-sans font-bold"
            >
              Thoát xem
            </button>
          </div>
        </div>
      )}

      {/* Floating Left: Region Selector, Pattern Selector & Cost Estimate button */}
      <div className={`absolute ${isReadOnly ? 'top-14' : 'top-4'} left-4 z-20 flex flex-col gap-2 transition-all duration-150`}>
        <div className="flex items-center gap-2">
          <RegionSelector currentRegion={region} onRegionChange={onRegionChange} />
          <PatternSelector
            currentPatternId={currentPatternId}
            onSelectPattern={onSelectPattern}
            onCopyPattern={(p) => {
              // Trigger copying this design pattern
              onCopyPattern();
            }}
            currentNodes={workspaceNodes}
            currentConnections={workspaceConnections}
          />
          <button
            onClick={onOpenCostEstimate}
            className="flex items-center gap-2 px-4 py-2 bg-[#F1F0ED] hover:bg-white text-on-surface border border-[#141414] rounded-none shadow-none hover:scale-102 active:scale-98 transition-all font-sans cursor-pointer uppercase text-xs font-black tracking-wider"
          >
            <span className="material-symbols-outlined text-sm text-[#F27D26] font-bold">payments</span>
            <span>Ước tính chi phí</span>
          </button>
        </div>

        {isConnectingMode && (
          <div className="bg-[#F27D26] text-white border border-[#141414] px-3 py-1.5 rounded-none text-xs font-bold animate-pulse flex items-center gap-1.5 shadow-none max-w-[240px] uppercase tracking-wider">
            <span className="material-symbols-outlined text-sm animate-spin">sync</span>
            {connectSourceId ? 'Chọn thiết bị đích...' : 'Chọn thiết bị nguồn...'}
          </div>
        )}
      </div>

      {/* Floating Right: Play/Simulation controls */}
      <div className={`absolute ${isReadOnly ? 'top-14' : 'top-4'} right-4 z-20 flex items-center gap-2 transition-all duration-150`}>
        {isPlaying && onToggleMonitor && (
          <button
            onClick={onToggleMonitor}
            className={`flex items-center gap-2 px-4 py-2 border border-[#141414] rounded-none shadow-none transition-all active:scale-95 cursor-pointer font-sans font-black text-xs uppercase tracking-widest ${
              openMonitor
                ? 'bg-[#F27D26] text-white hover:bg-[#D66311]'
                : 'bg-white text-[#141414] hover:bg-[#F27D26]/10'
            }`}
            title={openMonitor ? 'Ẩn bảng giám sát chi phí' : 'Hiện bảng giám sát chi phí'}
          >
            <span className="material-symbols-outlined text-sm font-bold">monitoring</span>
            <span>{openMonitor ? 'Ẩn GS' : 'Hiện GS'}</span>
          </button>
        )}
        <button
          onClick={onTogglePlay}
          className={`flex items-center gap-2 px-6 py-2 border border-[#141414] rounded-none shadow-none text-white transition-all active:scale-95 cursor-pointer font-sans font-black text-xs uppercase tracking-widest ${
            isPlaying
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-[#141414] hover:bg-[#F27D26]'
          }`}
        >
          <span className="material-symbols-outlined text-base">
            {isPlaying ? 'stop' : 'play_arrow'}
          </span>
          <span>{isPlaying ? 'Dừng' : 'Mô phỏng'}</span>
        </button>
      </div>

      {/* Main interactive SVG + nodes container (Zoomable & Pannable) */}
      <div
        id="zoom-container"
        className="absolute inset-0 shrink-0"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
        }}
      >
        {/* Infinite Grid Background Layer inside the pannable canvas wrapper */}
        <div
          className="canvas-grid absolute cursor-grab"
          style={{
            left: '-20000px',
            top: '-20000px',
            width: '40000px',
            height: '40000px',
            zIndex: 0,
          }}
        />

        {/* SVG connection lines rendering layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible" style={{ overflow: 'visible' }}>
          {renderLines()}
          {renderPreviewLine()}
        </svg>

        {/* Nodes Layer */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {nodes.map((node) => {
            const def = SERVICE_DEFINITIONS[node.type];
            const isSelected = selectedNodeId === node.id;
            const isConnectSource = connectSourceId === node.id;
            const isConnectTargetCandidate = isConnectingMode && connectSourceId && !isConnectSource;
            const isComputeActive = isPlaying && node.status === 'active';

            return (
              <div
                key={node.id}
                onMouseDown={(e) => handleNodeMouseDown(e, node)}
                className={`absolute flex flex-col items-center group cursor-grab active:cursor-grabbing pointer-events-auto p-1 select-none transition-all ${
                  isSelected ? 'scale-102' : 'hover:scale-102'
                }`}
                style={{
                  left: `${node.x - 40}px`,
                  top: `${node.y - 40}px`,
                  width: '80px',
                }}
              >
                {/* Visual Connection Candidate Badge */}
                {isConnectTargetCandidate && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#F27D26] text-white px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider whitespace-nowrap border border-[#141414] animate-bounce z-30">
                    Kết nối
                  </div>
                )}

                {/* Visual Icon card box */}
                <div
                  className={`w-16 h-16 bg-white border-2 flex items-center justify-center transition-all duration-300 relative rounded-none ${
                    isSelected
                      ? 'border-[#F27D26] shadow-[4px_4px_0px_0px_#141414]'
                      : isConnectSource
                      ? 'border-[#141414] bg-[#F27D26]/20 scale-102 animate-pulse shadow-none'
                      : isConnectTargetCandidate
                      ? 'border-[#F27D26] border-dashed bg-orange-50 scale-102 animate-pulse shadow-none hover:bg-[#F27D26]/10'
                      : 'border-[#141414] shadow-none group-hover:shadow-[4px_4px_0px_0px_#141414]'
                  } ${isComputeActive ? 'node-active-glow' : ''}`}
                >
                  <AwsIcon type={node.type} className="w-11 h-11 select-none pointer-events-none" />

                  {/* Active Simulation Green Dot indicator */}
                  {node.status === 'active' && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-600 rounded-none border border-[#141414] flex items-center justify-center shadow-none">
                      <span className="material-symbols-outlined text-[10px] text-white font-black">
                        check
                      </span>
                    </div>
                  )}

                  {/* Connection point dot / button on hover (Normal Mode) */}
                  {!isConnectingMode && !isReadOnly && (
                    <>
                      {/* Top Port Connection Trigger */}
                      <button
                        onMouseDown={(e) => {
                          e.stopPropagation(); // Don't drag the node
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsConnectingMode(true);
                          setConnectSourceId(node.id);
                          setConnectSourcePort('top');
                        }}
                        className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border border-[#141414] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-[#F27D26] hover:text-white transition-all shadow-md cursor-pointer z-30"
                        title="Nối liên kết từ cổng TRÊN (Top Port)"
                      >
                        <span className="material-symbols-outlined text-[12px] font-black font-sans">arrow_upward</span>
                      </button>

                      {/* Bottom Port Connection Trigger */}
                      <button
                        onMouseDown={(e) => {
                          e.stopPropagation(); // Don't drag the node
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsConnectingMode(true);
                          setConnectSourceId(node.id);
                          setConnectSourcePort('bottom');
                        }}
                        className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border border-[#141414] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-[#F27D26] hover:text-white transition-all shadow-md cursor-pointer z-30"
                        title="Nối liên kết từ cổng DƯỚI (Bottom Port)"
                      >
                        <span className="material-symbols-outlined text-[12px] font-black font-sans">arrow_downward</span>
                      </button>
                    </>
                  )}

                  {/* Active Connection Source Port Indicator */}
                  {isConnectingMode && connectSourceId === node.id && (
                    <div
                      className={`absolute w-3.5 h-3.5 bg-[#F27D26] border border-[#141414] rounded-full z-30 animate-ping left-1/2 -translate-x-1/2 ${
                        connectSourcePort === 'top' ? '-top-1.5' : '-bottom-1.5'
                      }`}
                    />
                  )}

                  {/* Target Candidate Ports (Connecting Mode) */}
                  {isConnectTargetCandidate && !isReadOnly && (
                    <>
                      {/* Top Port Target */}
                      <button
                        onMouseDown={(e) => {
                          e.stopPropagation();
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddConnection(connectSourceId!, node.id, connectSourcePort, 'top');
                          setConnectSourceId(null);
                          setIsConnectingMode(false);
                          setMousePos(null);
                        }}
                        className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-orange-100 border-2 border-[#F27D26] text-[#F27D26] rounded-full flex items-center justify-center hover:bg-[#F27D26] hover:text-white transition-all shadow-md cursor-pointer z-30 animate-pulse"
                        title="Kết nối tới cổng TRÊN"
                      >
                        <span className="material-symbols-outlined text-[12px] font-black font-sans">+</span>
                      </button>

                      {/* Bottom Port Target */}
                      <button
                        onMouseDown={(e) => {
                          e.stopPropagation();
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddConnection(connectSourceId!, node.id, connectSourcePort, 'bottom');
                          setConnectSourceId(null);
                          setIsConnectingMode(false);
                          setMousePos(null);
                        }}
                        className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-orange-100 border-2 border-[#F27D26] text-[#F27D26] rounded-full flex items-center justify-center hover:bg-[#F27D26] hover:text-white transition-all shadow-md cursor-pointer z-30 animate-pulse"
                        title="Kết nối tới cổng DƯỚI"
                      >
                        <span className="material-symbols-outlined text-[12px] font-black font-sans">+</span>
                      </button>
                    </>
                  )}
                </div>

                {/* Subtitle/Text under resource node */}
                <span className="mt-2 text-[11px] font-black text-on-surface text-center tracking-tight truncate w-full px-1 uppercase">
                  {node.name}
                </span>

                {/* Temporary tiny badge showing current hourly rate */}
                <span className="text-[9px] font-serif italic text-on-surface-variant/80">
                  {(() => {
                    const price = getNodePrice(node);
                    return isHourlyUnit(price.unit)
                      ? `$${price.price.toFixed(3)}/h`
                      : price.display;
                  })()}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Zoom Toolbar overlay (Bottom Left) */}
      <div className="absolute bottom-6 left-6 flex flex-col gap-2 z-20">
        <div className="flex flex-col bg-white rounded-none shadow-none border border-[#141414]">
          <button
            onClick={onZoomIn}
            className="w-10 h-10 flex items-center justify-center hover:bg-[#F27D26]/10 hover:text-[#F27D26] active:scale-90 transition-all border-b border-[#141414] cursor-pointer"
            title="Phóng to"
          >
            <span className="material-symbols-outlined text-lg font-black">add</span>
          </button>
          <button
            onClick={onZoomOut}
            className="w-10 h-10 flex items-center justify-center hover:bg-[#F27D26]/10 hover:text-[#F27D26] active:scale-90 transition-all border-b border-[#141414] cursor-pointer"
            title="Thu nhỏ"
          >
            <span className="material-symbols-outlined text-lg font-black">remove</span>
          </button>
          <button
            onClick={handleZoomReset}
            className="w-10 h-10 flex items-center justify-center hover:bg-[#F27D26]/10 hover:text-[#F27D26] active:scale-90 transition-all cursor-pointer"
            title="Vừa màn hình & Căn giữa"
          >
            <span className="material-symbols-outlined text-lg font-black">fit_screen</span>
          </button>
        </div>
      </div>
    </main>
  );
}
