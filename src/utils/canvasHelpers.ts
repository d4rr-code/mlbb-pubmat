import type { PubmatTheme } from '../types/match';

export function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

export function withAlpha(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function drawBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  theme: PubmatTheme
) {
  const [c1, c2] = theme.bgColors;

  if (theme.bgStyle === 'gradient') {
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, c1);
    grad.addColorStop(1, c2);
    ctx.fillStyle = grad;
  } else if (theme.bgStyle === 'pattern') {
    ctx.fillStyle = c1;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = c2;
    const grad2 = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 0.8);
    grad2.addColorStop(0, withAlpha(theme.accentColor, 0.15));
    grad2.addColorStop(1, 'transparent');
    ctx.fillStyle = grad2;
  } else {
    ctx.fillStyle = c1;
  }
  ctx.fillRect(0, 0, width, height);

  // Grid pattern overlay
  ctx.strokeStyle = withAlpha(theme.accentColor, 0.04);
  ctx.lineWidth = 1;
  const step = Math.round(width / 20);
  for (let x = 0; x <= width; x += step) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
  }
  for (let y = 0; y <= height; y += step) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
  }

  // Corner glow blobs
  const addGlow = (cx: number, cy: number, color: string) => {
    const r = ctx.createRadialGradient(cx, cy, 0, cx, cy, width * 0.5);
    r.addColorStop(0, withAlpha(color, 0.18));
    r.addColorStop(1, 'transparent');
    ctx.fillStyle = r;
    ctx.fillRect(0, 0, width, height);
  };
  addGlow(0, 0, theme.accentColor);
  addGlow(width, height, theme.secondaryColor);
}

export function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  r: number,
  fill?: string,
  stroke?: string,
  strokeWidth = 2
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = strokeWidth; ctx.stroke(); }
}

export function drawHeroIcon(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, size: number,
  color: string,
  label: string
) {
  drawRoundedRect(ctx, x, y, size, size, size * 0.2, color);
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.font = `bold ${size * 0.28}px 'Barlow Condensed', sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const abbr = label.slice(0, 3).toUpperCase();
  ctx.fillText(abbr, x + size / 2, y + size / 2);
}

export async function drawImage(
  ctx: CanvasRenderingContext2D,
  src: string,
  x: number, y: number, w: number, h: number,
  radius = 0
): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      if (radius > 0) {
        ctx.save();
        drawRoundedRect(ctx, x, y, w, h, radius);
        ctx.clip();
      }
      ctx.drawImage(img, x, y, w, h);
      if (radius > 0) ctx.restore();
      resolve();
    };
    img.onerror = () => resolve();
    img.src = src;
  });
}

export function measureText(ctx: CanvasRenderingContext2D, text: string, font: string): number {
  ctx.font = font;
  return ctx.measureText(text).width;
}
