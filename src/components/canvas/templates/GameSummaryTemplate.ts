import type { MatchData } from '../../../types/match';
import { drawBackground, drawRoundedRect, drawHeroIcon, withAlpha } from '../../../utils/canvasHelpers';

export async function renderGameSummary(
  ctx: CanvasRenderingContext2D,
  match: MatchData,
  W: number,
  H: number
) {
  const { theme, teamA, teamB, games, visibility } = match;
  const accent = theme.accentColor;
  const secondary = theme.secondaryColor;
  const font = theme.fontFamily === 'Bebas Neue' ? "'Bebas Neue'" : `'${theme.fontFamily}', sans-serif`;

  drawBackground(ctx, W, H, theme);

  // Header
  const headerH = H * 0.1;
  ctx.fillStyle = withAlpha(accent, 0.08);
  ctx.fillRect(0, 0, W, headerH);
  ctx.fillStyle = accent;
  ctx.fillRect(0, headerH - 2, W, 2);

  ctx.font = `800 ${H * 0.034}px ${font}`;
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText((match.tournamentName || 'TOURNAMENT').toUpperCase(), W / 2, headerH * 0.38);

  ctx.font = `600 ${H * 0.022}px ${font}`;
  ctx.fillStyle = withAlpha(accent, 0.9);
  ctx.fillText(`${match.stage.toUpperCase()}  ·  ${match.format}  ·  ${match.date}`, W / 2, headerH * 0.72);

  // Scoreline
  const scoreY = headerH + H * 0.01;
  const scoreH = H * 0.12;
  const scoreGrad = ctx.createLinearGradient(0, scoreY, W, scoreY);
  scoreGrad.addColorStop(0, withAlpha(accent, 0.12));
  scoreGrad.addColorStop(0.5, withAlpha('#ffffff', 0.02));
  scoreGrad.addColorStop(1, withAlpha(secondary, 0.12));
  ctx.fillStyle = scoreGrad;
  ctx.fillRect(0, scoreY, W, scoreH);

  ctx.font = `800 ${scoreH * 0.4}px ${font}`;
  ctx.fillStyle = withAlpha('#ffffff', 0.9);
  ctx.textAlign = 'left';
  ctx.fillText((teamA.name || 'TEAM A').toUpperCase(), W * 0.05, scoreY + scoreH / 2);

  ctx.font = `900 ${scoreH * 0.58}px ${font}`;
  ctx.fillStyle = accent;
  ctx.textAlign = 'center';
  ctx.fillText(String(teamA.score), W * 0.37, scoreY + scoreH / 2);

  ctx.font = `500 ${scoreH * 0.3}px ${font}`;
  ctx.fillStyle = withAlpha('#ffffff', 0.3);
  ctx.fillText('VS', W / 2, scoreY + scoreH / 2);

  ctx.font = `900 ${scoreH * 0.58}px ${font}`;
  ctx.fillStyle = secondary;
  ctx.fillText(String(teamB.score), W * 0.63, scoreY + scoreH / 2);

  ctx.font = `800 ${scoreH * 0.4}px ${font}`;
  ctx.fillStyle = withAlpha('#ffffff', 0.9);
  ctx.textAlign = 'right';
  ctx.fillText((teamB.name || 'TEAM B').toUpperCase(), W * 0.95, scoreY + scoreH / 2);

  // ── PER-GAME CARDS ──
  const cardsStartY = scoreY + scoreH + H * 0.02;
  const cardCount = games.length;
  const cardH = (H - cardsStartY - H * 0.06) / Math.min(cardCount, 5);
  const cardPad = H * 0.008;

  games.slice(0, 5).forEach((game, gi) => {
    const cy = cardsStartY + gi * cardH;
    const winnerA = game.winner === 'teamA';
    const winColor = winnerA ? accent : secondary;

    // Card BG
    drawRoundedRect(ctx, W * 0.02, cy + cardPad, W * 0.96, cardH - cardPad * 2, 8,
      withAlpha(winColor, 0.05), withAlpha(winColor, 0.2), 1);

    // Game label
    ctx.font = `800 ${cardH * 0.28}px ${font}`;
    ctx.fillStyle = winColor;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`GAME ${game.gameNumber}`, W * 0.04, cy + cardH / 2);

    // Winner tag
    const winnerName = winnerA ? teamA.name : teamB.name;
    ctx.font = `700 ${cardH * 0.22}px ${font}`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(`${winnerName.toUpperCase()} WIN`, W / 2, cy + cardH / 2);

    // Duration
    if (game.duration) {
      ctx.font = `600 ${cardH * 0.2}px ${font}`;
      ctx.fillStyle = withAlpha('#ffffff', 0.5);
      ctx.fillText(game.duration, W / 2, cy + cardH * 0.72);
    }

    // Hero icons
    if (visibility.showHeroIcons) {
      const iconSize = Math.min(cardH * 0.55, W * 0.055);
      const totalIcons = 5;
      const iconGap = iconSize * 0.15;
      const rowW = totalIcons * (iconSize + iconGap) - iconGap;

      // Team A icons (left)
      const leftStart = W * 0.22;
      game.teamADraft.forEach((draft, di) => {
        if (!draft.hero) return;
        const ix = leftStart + di * (iconSize + iconGap);
        const iy = cy + (cardH - iconSize) / 2;
        drawHeroIcon(ctx, ix, iy, iconSize, draft.hero.color, draft.hero.name);
      });

      // Team B icons (right)
      const rightEnd = W * 0.78;
      game.teamBDraft.forEach((draft, di) => {
        if (!draft.hero) return;
        const ix = rightEnd - rowW + di * (iconSize + iconGap);
        const iy = cy + (cardH - iconSize) / 2;
        drawHeroIcon(ctx, ix, iy, iconSize, draft.hero.color, draft.hero.name);
      });
    }

    // Win/loss side indicator
    const pillW = W * 0.015;
    const pillH = cardH * 0.5;
    drawRoundedRect(ctx, W * 0.025, cy + (cardH - pillH) / 2, pillW, pillH, pillW / 2, winColor);
  });

  // Footer
  ctx.font = `600 ${H * 0.018}px ${font}`;
  ctx.fillStyle = withAlpha('#ffffff', 0.25);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText('MLBB PUBMAT GENERATOR', W / 2, H * 0.985);
}
