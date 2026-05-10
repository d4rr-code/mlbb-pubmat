import { useEffect, useRef, useCallback } from 'react';
import type { MatchData } from '../../types/match';
import { renderScoreboard } from './templates/ScoreboardTemplate';
import { renderMVP } from './templates/MVPTemplate';
import { renderGameSummary } from './templates/GameSummaryTemplate';
import { getCanvasDimensions } from '../../utils/exportHelpers';

export function useCanvasRenderer(match: MatchData, scale = 1) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const render = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const [w, h] = getCanvasDimensions(match.aspectRatio);
    canvas.width = w * scale;
    canvas.height = h * scale;
    ctx.scale(scale, scale);

    ctx.clearRect(0, 0, w, h);

    if (match.template === 'scoreboard') {
      await renderScoreboard(ctx, match, w, h);
    } else if (match.template === 'mvp') {
      await renderMVP(ctx, match, w, h);
    } else {
      await renderGameSummary(ctx, match, w, h);
    }
  }, [match, scale]);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(render, 150);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [render]);

  return { canvasRef, render };
}
