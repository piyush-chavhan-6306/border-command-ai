import type { Detection } from "@/types/surveillance";

let nextTrackId = 1;

interface ActiveTrack {
  trackId: number;
  type: Detection["type"];
  x: number;
  y: number;
  dx: number;
  dy: number;
  confidence: number;
  width: number;
  height: number;
  speed: number;
  heading: string;
}

const activeTracks: ActiveTrack[] = [];

const TARGET_TYPES: Detection["type"][] = ["Person", "Vehicle", "Car"];
const HEADINGS = ["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"];

function getHeading(dx: number, dy: number): string {
  if (Math.abs(dx) < 0.3 && dy < 0) return "North";
  if (Math.abs(dx) < 0.3 && dy > 0) return "South";
  if (dx > 0 && Math.abs(dy) < 0.3) return "East";
  if (dx < 0 && Math.abs(dy) < 0.3) return "West";
  if (dx > 0 && dy < 0) return "North-East";
  if (dx < 0 && dy < 0) return "North-West";
  if (dx > 0 && dy > 0) return "South-East";
  return "South-West";
}

function spawnTrack(canvasW: number, canvasH: number): ActiveTrack {
  const type = TARGET_TYPES[Math.floor(Math.random() * TARGET_TYPES.length)];
  const side = Math.floor(Math.random() * 4);
  let x = 0, y = 0, dx = 0, dy = 0;
  const speed = 0.5 + Math.random() * 1.5;

  switch (side) {
    case 0: x = Math.random() * canvasW; y = canvasH + 10; dx = (Math.random() - 0.5) * speed; dy = -speed; break;
    case 1: x = -10; y = canvasH * 0.5 + Math.random() * canvasH * 0.4; dx = speed; dy = (Math.random() - 0.5) * speed * 0.5; break;
    case 2: x = Math.random() * canvasW; y = canvasH * 0.4; dx = (Math.random() - 0.5) * speed * 0.3; dy = speed; break;
    case 3: x = canvasW + 10; y = canvasH * 0.5 + Math.random() * canvasH * 0.4; dx = -speed; dy = (Math.random() - 0.5) * speed * 0.5; break;
  }

  const w = type === "Person" ? 24 + Math.random() * 8 : 45 + Math.random() * 20;
  const h = type === "Person" ? 45 + Math.random() * 15 : 30 + Math.random() * 15;

  return {
    trackId: nextTrackId++,
    type,
    x,
    y,
    dx,
    dy,
    confidence: 0.75 + Math.random() * 0.24,
    width: w,
    height: h,
    speed: speed * 1.2,
    heading: getHeading(dx, dy),
  };
}

export function updateDetections(canvasW: number, canvasH: number): Detection[] {
  // Remove off-screen tracks
  for (let i = activeTracks.length - 1; i >= 0; i--) {
    const t = activeTracks[i];
    if (t.x < -50 || t.x > canvasW + 50 || t.y < -50 || t.y > canvasH + 50) {
      activeTracks.splice(i, 1);
    }
  }

  // Spawn new tracks (up to 4 max)
  if (activeTracks.length < 4 && Math.random() < 0.008) {
    activeTracks.push(spawnTrack(canvasW, canvasH));
  }

  // Update positions
  for (const t of activeTracks) {
    t.x += t.dx;
    t.y += t.dy;
    t.confidence = Math.max(0.7, Math.min(0.99, t.confidence + (Math.random() - 0.5) * 0.02));
    t.heading = getHeading(t.dx, t.dy);
  }

  return activeTracks.map((t) => ({
    trackId: t.trackId,
    type: t.type,
    x: t.x,
    y: t.y,
    width: t.width,
    height: t.height,
    confidence: t.confidence,
    speed: t.speed,
    heading: t.heading,
    dx: t.dx,
    dy: t.dy,
  }));
}

export function resetDetections() {
  activeTracks.length = 0;
  nextTrackId = 1;
}

export function getSnapshotUrl(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL("image/jpeg", 0.85);
}
