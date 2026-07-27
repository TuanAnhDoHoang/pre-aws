import { CloudNode, Connection } from '../types';
import { DesignPattern, saveCustomPattern } from '../patterns';

export interface DiagramData {
  id: string;
  name: string;
  description?: string;
  region: string;
  nodes: CloudNode[];
  connections: Connection[];
  createdAt: string;
  updatedAt: string;
  source?: 'local' | 'server';
}

const LOCAL_DIAGRAMS_KEY = 'cloud_architecture_saved_diagrams';
const DEFAULT_SERVER_URL = 'http://localhost:5000';

/**
 * Lưu sơ đồ vào localStorage (Cục bộ)
 */
export function saveDiagramLocal(
  name: string,
  region: string,
  nodes: CloudNode[],
  connections: Connection[],
  description?: string,
  id?: string
): DiagramData {
  const diagramId = id || `diagram_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const diagram: DiagramData = {
    id: diagramId,
    name: name.trim() || 'Sơ đồ chưa đặt tên',
    description: description?.trim() || '',
    region,
    nodes: JSON.parse(JSON.stringify(nodes)),
    connections: JSON.parse(JSON.stringify(connections)),
    createdAt: now,
    updatedAt: now,
    source: 'local',
  };

  const existing = getLocalDiagrams();
  const index = existing.findIndex((d) => d.id === diagramId);
  if (index >= 0) {
    diagram.createdAt = existing[index].createdAt;
    existing[index] = diagram;
  } else {
    existing.unshift(diagram);
  }

  localStorage.setItem(LOCAL_DIAGRAMS_KEY, JSON.stringify(existing));
  return diagram;
}

/**
 * Lấy danh sách tất cả các sơ đồ đã lưu cục bộ
 */
export function getLocalDiagrams(): DiagramData[] {
  try {
    const raw = localStorage.getItem(LOCAL_DIAGRAMS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Lỗi khi đọc danh sách sơ đồ từ localStorage:', err);
    return [];
  }
}

/**
 * Xóa sơ đồ lưu cục bộ theo ID
 */
export function deleteLocalDiagram(id: string): void {
  const existing = getLocalDiagrams();
  const filtered = existing.filter((d) => d.id !== id);
  localStorage.setItem(LOCAL_DIAGRAMS_KEY, JSON.stringify(filtered));
}

/**
 * Gửi cấu trúc sơ đồ lên server (localhost:5000)
 */
export async function sendDiagramToServer(
  diagram: DiagramData,
  serverUrl: string = DEFAULT_SERVER_URL
): Promise<{ success: boolean; data?: DiagramData; message: string }> {
  try {
    const response = await fetch(`${serverUrl}/api/diagrams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(diagram),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server báo lỗi HTTP ${response.status}: ${errorText || response.statusText}`);
    }

    const result = await response.json();
    return {
      success: true,
      data: result.data || result,
      message: 'Đã gửi cấu trúc sơ đồ lên server (localhost:5000) thành công!',
    };
  } catch (err: any) {
    console.warn(`Không thể kết nối đến server tại ${serverUrl}:`, err);
    // Lưu tạm vào local như nguồn dự phòng
    saveDiagramLocal(diagram.name, diagram.region, diagram.nodes, diagram.connections, diagram.description, diagram.id);
    return {
      success: false,
      message: `Không kết nối được server (${err.message || 'Lỗi mạng'}). Đã lưu dự phòng vào Local Storage!`,
    };
  }
}

/**
 * Lấy danh sách sơ đồ từ server (localhost:5000)
 */
export async function fetchDiagramsFromServer(
  serverUrl: string = DEFAULT_SERVER_URL
): Promise<{ success: boolean; diagrams: DiagramData[]; message: string }> {
  try {
    const response = await fetch(`${serverUrl}/api/diagrams`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const list: DiagramData[] = Array.isArray(data) ? data : data.diagrams || [];
    return {
      success: true,
      diagrams: list.map((d) => ({ ...d, source: 'server' })),
      message: `Đã tải ${list.length} sơ đồ từ server thành công!`,
    };
  } catch (err: any) {
    console.warn(`Lỗi khi lấy danh sách sơ đồ từ server ${serverUrl}:`, err);
    return {
      success: false,
      diagrams: [],
      message: `Không thể kết nối server tại ${serverUrl}: ${err.message || 'Server không phản hồi'}`,
    };
  }
}

/**
 * Lấy sơ đồ cụ thể theo ID từ server (localhost:5000)
 */
export async function fetchDiagramByIdFromServer(
  id: string,
  serverUrl: string = DEFAULT_SERVER_URL
): Promise<{ success: boolean; diagram?: DiagramData; message: string }> {
  try {
    const response = await fetch(`${serverUrl}/api/diagrams/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    const diagram: DiagramData = data.diagram || data;
    return {
      success: true,
      diagram: { ...diagram, source: 'server' },
      message: 'Tải sơ đồ từ server thành công!',
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Lỗi tải sơ đồ từ server: ${err.message}`,
    };
  }
}

/**
 * Xóa sơ đồ trên server (localhost:5000)
 */
export async function deleteDiagramOnServer(
  id: string,
  serverUrl: string = DEFAULT_SERVER_URL
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${serverUrl}/api/diagrams/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return {
      success: true,
      message: 'Đã xóa sơ đồ trên server!',
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Không thể xóa sơ đồ trên server: ${err.message}`,
    };
  }
}

/**
 * Lưu sơ đồ hiện tại thành một Mẫu thiết kế (Design Pattern)
 */
export function saveDiagramAsPattern(
  name: string,
  description: string,
  nodes: CloudNode[],
  connections: Connection[]
): DesignPattern {
  return saveCustomPattern(name, description, nodes, connections);
}
