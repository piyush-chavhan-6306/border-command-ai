export interface Detection {
  trackId: number;
  type: "Person" | "Vehicle" | "Car" | "Animal";
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  speed: number;
  heading: string;
  dx: number;
  dy: number;
}

export interface SimulatedAlert {
  id: string;
  cameraId: string;
  severity: "critical" | "warning";
  targetLabel: string;
  targetTrackId: number;
  targetType: string;
  reason: string;
  timestamp: number;
  status: "new" | "acknowledged";
  confidence: number;
  speed: number;
  heading: string;
  summary: string;
  snapshotDataUrl?: string;
}

export interface DrawingPoint {
  x: number;
  y: number;
}

export interface BoundaryShape {
  id: string;
  name: string;
  type: "zone" | "tripwire";
  vertices: DrawingPoint[];
  direction?: string;
}
