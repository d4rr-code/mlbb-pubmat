import type { MatchData } from '../types/match';

export function buildFileName(match: MatchData, ext = 'png'): string {
  const tournament = match.tournamentName.replace(/\s+/g, '_') || 'Tournament';
  const a = match.teamA.name.replace(/\s+/g, '') || 'TeamA';
  const b = match.teamB.name.replace(/\s+/g, '') || 'TeamB';
  const date = match.date.replace(/-/g, '');
  return `${tournament}_${a}vs${b}_${date}.${ext}`;
}

export function downloadCanvas(canvas: HTMLCanvasElement, filename: string, type: 'png' | 'jpg' = 'png') {
  const mime = type === 'jpg' ? 'image/jpeg' : 'image/png';
  const quality = type === 'jpg' ? 0.92 : undefined;
  const url = canvas.toDataURL(mime, quality);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
}

export function getCanvasDimensions(aspectRatio: '1:1' | '9:16'): [number, number] {
  return aspectRatio === '9:16' ? [1080, 1920] : [1080, 1080];
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
