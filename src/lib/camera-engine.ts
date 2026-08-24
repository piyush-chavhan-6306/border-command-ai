// Simulated camera scene renderer
const COLORS = {
  sky: "#d4e6f1",
  horizon: "#a9cce3",
  ground: "#e8e8e0",
  fence: "#8b8682",
  road: "#6b6b6b",
  grass: "#8fbc8f",
};

interface SceneObject {
  type: string;
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void;
}

const sceneObjects: SceneObject[] = [
  {
    type: "sky",
    draw: (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, 0, h * 0.4);
      grad.addColorStop(0, "#b8d4e8");
      grad.addColorStop(1, "#d4e6f1");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h * 0.4);
    },
  },
  {
    type: "horizon",
    draw: (ctx, w, h) => {
      const y = h * 0.38;
      const grad = ctx.createLinearGradient(0, y - 20, 0, y + 20);
      grad.addColorStop(0, "#c5d8e8");
      grad.addColorStop(0.5, "#a8c4a0");
      grad.addColorStop(1, "#8fbc8f");
      ctx.fillStyle = grad;
      ctx.fillRect(0, y - 20, w, 40);
    },
  },
  {
    type: "mountains",
    draw: (ctx, w, h) => {
      ctx.fillStyle = "#95afc0";
      ctx.beginPath();
      ctx.moveTo(0, h * 0.38);
      ctx.lineTo(w * 0.15, h * 0.28);
      ctx.lineTo(w * 0.3, h * 0.35);
      ctx.lineTo(w * 0.5, h * 0.25);
      ctx.lineTo(w * 0.7, h * 0.33);
      ctx.lineTo(w * 0.85, h * 0.27);
      ctx.lineTo(w, h * 0.36);
      ctx.lineTo(w, h * 0.38);
      ctx.closePath();
      ctx.fill();
    },
  },
  {
    type: "ground",
    draw: (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, h * 0.4, 0, h);
      grad.addColorStop(0, "#8fbc8f");
      grad.addColorStop(0.3, "#c8c8b8");
      grad.addColorStop(1, "#a0a090");
      ctx.fillStyle = grad;
      ctx.fillRect(0, h * 0.4, w, h * 0.6);
    },
  },
  {
    type: "road",
    draw: (ctx, w, h) => {
      ctx.fillStyle = "#707070";
      ctx.beginPath();
      ctx.moveTo(w * 0.3, h * 0.42);
      ctx.lineTo(w * 0.7, h * 0.42);
      ctx.lineTo(w * 0.95, h);
      ctx.lineTo(w * 0.05, h);
      ctx.closePath();
      ctx.fill();
      // road lines
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.setLineDash([20, 15]);
      ctx.beginPath();
      ctx.moveTo(w * 0.5, h * 0.42);
      ctx.lineTo(w * 0.5, h);
      ctx.stroke();
      ctx.setLineDash([]);
    },
  },
  {
    type: "fence",
    draw: (ctx, w, h) => {
      ctx.strokeStyle = COLORS.fence;
      ctx.lineWidth = 2;
      const fenceY = h * 0.41;
      ctx.beginPath();
      ctx.moveTo(0, fenceY);
      ctx.lineTo(w, fenceY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, fenceY - 15);
      ctx.lineTo(w, fenceY - 15);
      ctx.stroke();
      // posts
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, fenceY + 5);
        ctx.lineTo(x, fenceY - 20);
        ctx.stroke();
      }
    },
  },
  {
    type: "trees",
    draw: (ctx, w, h, t) => {
      const treePositions = [w * 0.08, w * 0.22, w * 0.78, w * 0.92];
      for (const tx of treePositions) {
        const sway = Math.sin(t * 0.001 + tx * 0.01) * 2;
        // trunk
        ctx.fillStyle = "#6b4423";
        ctx.fillRect(tx - 3, h * 0.34, 6, h * 0.06);
        // canopy
        ctx.fillStyle = "#2d8a4e";
        ctx.beginPath();
        ctx.arc(tx + sway, h * 0.32, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#3a9d5e";
        ctx.beginPath();
        ctx.arc(tx + sway + 5, h * 0.3, 14, 0, Math.PI * 2);
        ctx.fill();
      }
    },
  },
  {
    type: "buildings",
    draw: (ctx, w, h) => {
      // building 1
      ctx.fillStyle = "#b0a898";
      ctx.fillRect(w * 0.4, h * 0.29, w * 0.08, h * 0.12);
      ctx.fillStyle = "#87ceeb";
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 2; col++) {
          ctx.fillRect(
            w * 0.41 + col * w * 0.03,
            h * 0.3 + row * h * 0.03,
            w * 0.02,
            h * 0.02
          );
        }
      }
      // building 2
      ctx.fillStyle = "#c0b0a0";
      ctx.fillRect(w * 0.52, h * 0.31, w * 0.06, h * 0.1);
    },
  },
];

export function drawScene(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  time: number
) {
  ctx.clearRect(0, 0, w, h);
  for (const obj of sceneObjects) {
    obj.draw(ctx, w, h, time);
  }
}

export function drawDetection(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  trackId: number,
  confidence: number,
  color: string
) {
  // Bounding box
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);

  // Semi-transparent fill
  ctx.fillStyle = color.replace("1)", "0.1)");
  ctx.fillRect(x, y, w, h);

  // Label background
  const labelText = `${label} #${trackId} (${Math.round(confidence * 100)}%)`;
  ctx.font = "bold 11px 'Inter', system-ui, sans-serif";
  const textWidth = ctx.measureText(labelText).width;

  ctx.fillStyle = color;
  ctx.fillRect(x, y - 20, textWidth + 10, 18);
  ctx.fillStyle = "#fff";
  ctx.fillText(labelText, x + 5, y - 6);

  // Corner markers
  const cornerLen = 8;
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  // top-left
  ctx.beginPath();
  ctx.moveTo(x, y + cornerLen);
  ctx.lineTo(x, y);
  ctx.lineTo(x + cornerLen, y);
  ctx.stroke();
  // top-right
  ctx.beginPath();
  ctx.moveTo(x + w - cornerLen, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w, y + cornerLen);
  ctx.stroke();
  // bottom-left
  ctx.beginPath();
  ctx.moveTo(x, y + h - cornerLen);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x + cornerLen, y + h);
  ctx.stroke();
  // bottom-right
  ctx.beginPath();
  ctx.moveTo(x + w - cornerLen, y + h);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x + w, y + h - cornerLen);
  ctx.stroke();
}

export function drawBoundaryOverlay(
  ctx: CanvasRenderingContext2D,
  vertices: { x: number; y: number }[],
  type: "zone" | "tripwire",
  color: string,
  isComplete: boolean
) {
  if (vertices.length === 0) return;

  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.setLineDash(type === "tripwire" ? [8, 4] : []);

  if (type === "zone") {
    ctx.beginPath();
    ctx.moveTo(vertices[0].x, vertices[0].y);
    for (let i = 1; i < vertices.length; i++) {
      ctx.lineTo(vertices[i].x, vertices[i].y);
    }
    if (isComplete) {
      ctx.closePath();
      ctx.fillStyle = color.replace(")", ", 0.08)").replace("rgb", "rgba");
      if (!color.includes("rgba")) {
        ctx.fillStyle = `${color}14`;
      }
      ctx.fill();
    }
    ctx.stroke();
  } else {
    // Tripwire - just a line
    ctx.beginPath();
    ctx.moveTo(vertices[0].x, vertices[0].y);
    for (let i = 1; i < vertices.length; i++) {
      ctx.lineTo(vertices[i].x, vertices[i].y);
    }
    ctx.stroke();
  }

  ctx.setLineDash([]);

  // Draw vertices
  for (let i = 0; i < vertices.length; i++) {
    const v = vertices[i];
    ctx.beginPath();
    ctx.arc(v.x, v.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}
