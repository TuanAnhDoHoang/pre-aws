import React, { useState, useEffect } from 'react';
import SidebarLeft from './components/SidebarLeft';
import CanvasArea from './components/CanvasArea';
import PropertyPanel from './components/PropertyPanel';
import CostMonitor from './components/CostMonitor';
import CostEstimateModal from './components/CostEstimateModal';
import Footer from './components/Footer';
import { CloudNode, Connection, ServiceType, SERVICE_DEFINITIONS } from './types';
import { DesignPattern } from './patterns';

export default function App() {
  const [nodes, setNodes] = useState<CloudNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  
  // Design Pattern State
  const [activePattern, setActivePattern] = useState<DesignPattern | null>(null);

  // Layout parameters
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(280);
  const [rightSidebarWidth, setRightSidebarWidth] = useState(320);

  // Diagram settings
  const [gridSnap, setGridSnap] = useState(true);
  const [zoom, setZoom] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCostModalOpen, setIsCostModalOpen] = useState(false);
  const [region, setRegion] = useState('ap-southeast-1');

  // Open Monitor
  const [openMonitor, setOpenMonitor] = useState(false);

  const [selectedServiceType, setSelectedServiceType] = useState<ServiceType | null>(null);

  // Open Monitor automatically when simulation is started, close when stopped
  useEffect(() => {
    if (isPlaying) {
      setOpenMonitor(true);
    } else {
      setOpenMonitor(false);
    }
  }, [isPlaying]);

  const handleSelectServiceType = (type: ServiceType | null) => {
    setSelectedServiceType(type);
    if (type !== null) {
      setSelectedNodeId(null);
      setRightCollapsed(false);
    }
  };

  const handleSelectNode = (nodeId: string | null) => {
    setSelectedNodeId(nodeId);
    if (nodeId !== null) {
      setSelectedServiceType(null);
    }
  };

  // Computed displayed nodes and connections
  const displayedNodes = activePattern ? activePattern.nodes : nodes;
  const displayedConnections = activePattern ? activePattern.connections : connections;

  // Retrieve the currently selected node
  const selectedNode = displayedNodes.find((n) => n.id === selectedNodeId) || null;

  // Add node from clicking "+" button in the info view of right sidebar
  const handleAddNode = (type: ServiceType) => {
    // Generate a unique ID
    const id = `node_${type}_${Date.now()}`;
    const def = SERVICE_DEFINITIONS[type];
    
    // Spawn in the center area, offset slightly to avoid stacking
    const offset = (nodes.length % 5) * 15;
    const x = 400 + offset;
    const y = 300 + offset;

    const newNode: CloudNode = {
      id,
      type,
      name: `${def.label} ${nodes.filter((n) => n.type === type).length + 1}`,
      x,
      y,
      properties: { ...def.defaultProperties },
      status: 'active', // Default to active checkmark
    };

    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(id);
    setSelectedServiceType(null); // Clear selected template after adding
  };

  // Add node at exact drop coordinates
  const handleAddNodeAtCoordinates = (type: ServiceType, x: number, y: number) => {
    const id = `node_${type}_${Date.now()}`;
    const def = SERVICE_DEFINITIONS[type];

    const newNode: CloudNode = {
      id,
      type,
      name: `${def.label} ${nodes.filter((n) => n.type === type).length + 1}`,
      x,
      y,
      properties: { ...def.defaultProperties },
      status: 'active',
    };

    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(id);
  };

  // Dragging node coordinate update callback
  const handleUpdateNodeCoordinates = (nodeId: string, x: number, y: number) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, x, y } : n))
    );
  };

  // Update properties of a node
  const handleUpdateNodeProperties = (nodeId: string, updatedProps: Record<string, any>) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, properties: updatedProps } : n))
    );
  };

  // Update node name
  const handleUpdateNodeName = (nodeId: string, name: string) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, name } : n))
    );
  };

  // Delete node and clean up its connections
  const handleDeleteNode = (nodeId: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    setConnections((prev) => prev.filter((c) => c.from !== nodeId && c.to !== nodeId));
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
  };

  // Add a new connection line
  const handleAddConnection = (
    fromId: string,
    toId: string,
    fromPort?: 'top' | 'bottom',
    toPort?: 'top' | 'bottom'
  ) => {
    // Prevent self connection
    if (fromId === toId) return;

    // Check if duplicate connection already exists on the same ports
    const duplicate = connections.some(
      (c) =>
        c.from === fromId &&
        c.to === toId &&
        c.fromPort === fromPort &&
        c.toPort === toPort
    );
    if (duplicate) return;

    const id = `conn_${Date.now()}`;
    const newConnection: Connection = {
      id,
      from: fromId,
      to: toId,
      fromPort: fromPort || 'bottom',
      toPort: toPort || 'top',
    };
    setConnections((prev) => [...prev, newConnection]);
  };

  // Delete an existing connection line
  const handleDeleteConnection = (connId: string) => {
    setConnections((prev) => prev.filter((c) => c.id !== connId));
  };

  // Pattern Event Handlers
  const handleSelectPattern = (pattern: DesignPattern | null) => {
    setActivePattern(pattern);
    setSelectedNodeId(null);
    setSelectedServiceType(null);
  };

  const handleCopyPattern = () => {
    if (!activePattern) return;

    // Deep clone nodes and map their IDs to avoid collisions
    const idMapping: Record<string, string> = {};
    const clonedNodes = activePattern.nodes.map((node) => {
      const newId = `node_${node.type}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      idMapping[node.id] = newId;
      return {
        ...node,
        id: newId,
        properties: { ...node.properties }, // Deep copy properties
      };
    });

    // Deep clone connections mapping endpoint IDs to new node IDs
    const clonedConnections = activePattern.connections
      .filter((conn) => idMapping[conn.from] && idMapping[conn.to])
      .map((conn) => {
        const newId = `conn_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        return {
          ...conn,
          id: newId,
          from: idMapping[conn.from],
          to: idMapping[conn.to],
        };
      });

    setNodes(clonedNodes);
    setConnections(clonedConnections);
    setActivePattern(null); // Exit pattern-preview mode and edit this imported setup!
    setSelectedNodeId(null);
  };

  // Zoom control modifiers
  const handleZoomIn = () => setZoom((prev) => Math.min(1.5, prev + 0.1));
  const handleZoomOut = () => setZoom((prev) => Math.max(0.6, prev - 0.1));
  const handleZoomReset = () => setZoom(1.0);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#E4E3E0] text-[#141414] font-sans antialiased selection:bg-[#F27D26] selection:text-white">
      {/* Top navbar header omitted as workbench has full side-anchors */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left sidebar: Draggable cloud services */}
        <SidebarLeft
          selectedServiceType={selectedServiceType}
          onSelectServiceType={handleSelectServiceType}
          collapsed={leftCollapsed}
          onToggleCollapse={() => setLeftCollapsed(!leftCollapsed)}
          width={leftSidebarWidth}
          onWidthChange={setLeftSidebarWidth}
          setCollapsed={setLeftCollapsed}
        />

        {/* Left Expand Trigger Button (Floating on edge when collapsed) */}
        {leftCollapsed && (
          <button
            onClick={() => {
              setLeftCollapsed(false);
              if (leftSidebarWidth < 40) {
                setLeftSidebarWidth(280);
              }
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-12 bg-[#F27D26] text-white border-t border-b border-r border-[#141414] rounded-none shadow-none z-40 flex items-center justify-center hover:bg-[#D66311] transition-all cursor-pointer"
            title="Mở thư viện AWS"
          >
            <span className="material-symbols-outlined text-xs">chevron_right</span>
          </button>
        )}

        {/* Central interactive design canvas area */}
        <div className="flex-1 h-full relative flex flex-col min-w-0 bg-[#E4E3E0]">
          <CanvasArea
            nodes={displayedNodes}
            connections={displayedConnections}
            selectedNodeId={selectedNodeId}
            onSelectNode={handleSelectNode}
            onUpdateNodeCoordinates={handleUpdateNodeCoordinates}
            onAddNodeAtCoordinates={handleAddNodeAtCoordinates}
            onAddConnection={handleAddConnection}
            onDeleteConnection={handleDeleteConnection}
            isPlaying={isPlaying}
            gridSnap={gridSnap}
            zoom={zoom}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onZoomReset={handleZoomReset}
            onZoomChange={setZoom}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
            onOpenCostEstimate={() => setIsCostModalOpen(true)}
            openMonitor={openMonitor}
            onToggleMonitor={() => setOpenMonitor(!openMonitor)}
            region={region}
            onRegionChange={setRegion}
            isReadOnly={activePattern !== null}
            viewingPatternName={activePattern ? activePattern.name : null}
            currentPatternId={activePattern ? activePattern.id : null}
            onSelectPattern={handleSelectPattern}
            onCopyPattern={handleCopyPattern}
            onExitPatternView={() => handleSelectPattern(null)}
            workspaceNodes={nodes}
            workspaceConnections={connections}
          />

          {/* Floating real-time simulation cost details overlay */}
          {openMonitor && (
            <CostMonitor
              nodes={displayedNodes}
              isPlaying={isPlaying}
              onClose={() => setOpenMonitor(false)}
              region={region}
            />
          )}
        </div>

        {/* Right Expand Trigger Button (Floating on edge when collapsed) */}
        {rightCollapsed && (
          <button
            onClick={() => {
              setRightCollapsed(false);
              if (rightSidebarWidth < 40) {
                setRightSidebarWidth(320);
              }
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-12 bg-[#F27D26] text-white border-t border-b border-l border-[#141414] rounded-none shadow-none z-40 flex items-center justify-center hover:bg-[#D66311] transition-all cursor-pointer"
            title="Mở Terraform"
          >
            <span className="material-symbols-outlined text-xs">chevron_left</span>
          </button>
        )}

        {/* Right property panel: Terraform config generation & download */}
        <PropertyPanel
          selectedNode={selectedNode}
          nodes={displayedNodes}
          connections={displayedConnections}
          onUpdateNodeProperties={handleUpdateNodeProperties}
          onUpdateNodeName={handleUpdateNodeName}
          onDeleteNode={handleDeleteNode}
          onDeleteConnection={handleDeleteConnection}
          collapsed={rightCollapsed}
          onToggleCollapse={() => setRightCollapsed(!rightCollapsed)}
          width={rightSidebarWidth}
          onWidthChange={setRightSidebarWidth}
          setCollapsed={setRightCollapsed}
          onCloseEdit={() => handleSelectNode(null)}
          selectedServiceType={selectedServiceType}
          onAddNode={handleAddNode}
          onClearSelectedServiceType={() => setSelectedServiceType(null)}
          region={region}
          isReadOnly={activePattern !== null}
        />
      </div>

      {/* Footer status bar */}
      <Footer
        gridSnap={gridSnap}
        onToggleGridSnap={() => setGridSnap(!gridSnap)}
        nodesCount={displayedNodes.length}
      />

      {/* Monthly operational cost detailed estimator modal */}
      <CostEstimateModal
        nodes={displayedNodes}
        isOpen={isCostModalOpen}
        onClose={() => setIsCostModalOpen(false)}
        region={region}
      />
    </div>
  );
}

