import type { MatchData } from '../../../types/match';
import { drawBackground, drawRoundedRect, withAlpha } from '../../../utils/canvasHelpers';

export async function renderMVP(
  ctx: CanvasRenderingContext2D,
  match: MatchData,
  W: number,
  H: number
) {
  const { theme, mvp, teamA, teamB, visibility } = match;
  const accent = theme.accentColor;
  const secondary = theme.secondaryColor;
  const font = theme.fontFamily === 'Bebas Neue' ? "'Bebas Neue'" : `'${theme.fontFamily}', sans-serif`;

  drawBackground(ctx, W, H, theme);

  if (!mvp) {
    ctx.font = `600 ${H * 0.04}px ${font}`;
    ctx.fillStyle = withAlpha('#ffffff', 0.4);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('NO MVP SELECTED', W / 2, H / 2);
    return;
  }

  // Hero art bg (large colored rectangle with gradient)
  const heroColor = mvp.hero?.color ?? accent;
  const heroBg = ctx.createLinearGradient(0, 0, W, H);
  heroBg.addColorStop(0, withAlpha(heroColor, 0.2));
  heroBg.addColorStop(1, withAlpha(heroColor, 0.02));
  ctx.fillStyle = heroBg;
  ctx.fillRect(0, 0, W, H);

  // Large hero icon / art area
  const artSize = Math.min(W, H) * 0.45;
  const artX = W / 2 - artSize / 2;
  const artY = H * 0.1;
  drawRoundedRect(ctx, artX, artY, artSize, artSize, artSize * 0.15,
    withAlpha(heroColor, 0.25), withAlpha(heroColor, 0.5), 2);

  // Hero abbreviation in center
  ctx.font = `900 ${artSize * 0.32}px ${font}`;
  ctx.fillStyle = heroColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(
    (mvp.hero?.name ?? 'MVP').slice(0, 4).toUpperCase(),
    W / 2, artY + artSize / 2
  );

  // Glow on art
  ctx.shadowColor = heroColor;
  ctx.shadowBlur = 60;
  ctx.strokeStyle = heroColor;
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, artX, artY, artSize, artSize, artSize * 0.15, undefined, heroColor, 2);
  ctx.shadowBlur = 0;

  // ── PLAYER INFO ──
  const infoY = artY + artSize + H * 0.04;

  // MVP label
  const labelW = W * 0.3;
  const labelH = H * 0.05;
  const labelX = W / 2 - labelW / 2;
  drawRoundedRect(ctx, labelX, infoY, labelW, labelH, 6, accent);
  ctx.font = `800 ${labelH * 0.5}px ${font}`;
  ctx.fillStyle = '#000';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('⭐  MOST VALUABLE PLAYER', W / 2, infoY + labelH / 2);

  // Player name
  ctx.font = `900 ${H * 0.07}px ${font}`;
  ctx.fillStyle = '#ffffff';
  ctx.textBaseline = 'top';
  ctx.shadowColor = accent;
  ctx.shadowBlur = 20;
  ctx.fillText(mvp.playerName.toUpperCase(), W / 2, infoY + labelH + H * 0.02);
  ctx.shadowBlur = 0;

  // Hero name + role
  if (mvp.hero) {
    ctx.font = `600 ${H * 0.032}px ${font}`;
    ctx.fillStyle = withAlpha(accent, 0.9);
    ctx.fillText(`${mvp.hero.name}  ·  ${mvp.hero.role}`, W / 2, infoY + labelH + H * 0.1);
  }

  // Team badge
  const team = mvp.teamId === 'teamA' ? teamA : teamB;
  const teamColor = mvp.teamId === 'teamA' ? accent : secondary;
  ctx.font = `700 ${H * 0.025}px ${font}`;
  ctx.fillStyle = withAlpha(teamColor, 0.8);
  ctx.fillText(team.name.toUpperCase(), W / 2, infoY + labelH + H * 0.14);

  // ── KDA STATS ──
  if (visibility.showStats) {
    const statsY = H * 0.78;
    const statW = W * 0.26;
    const statH = H * 0.1;
    const gap = W * 0.04;
    const totalW = statW * 3 + gap * 2;
    const startX = W / 2 - totalW / 2;

    const stats = [
      { label: 'KILLS', value: mvp.kills, color: '#22c55e' },
      { label: 'DEATHS', value: mvp.deaths, color: '#ef4444' },
      { label: 'ASSISTS', value: mvp.assists, color: '#f59e0b' },
    ];

    stats.forEach((stat, i) => {
      const sx = startX + i * (statW + gap);
      drawRoundedRect(ctx, sx, statsY, statW, statH, 10,
        withAlpha(stat.color, 0.08), withAlpha(stat.color, 0.25), 1);

      ctx.font = `900 ${statH * 0.48}px ${font}`;
      ctx.fillStyle = stat.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(stat.value), sx + statW / 2, statsY + statH * 0.42);

      ctx.font = `600 ${statH * 0.22}px ${font}`;
      ctx.fillStyle = withAlpha('#ffffff', 0.5);
      ctx.fillText(stat.label, sx + statW / 2, statsY + statH * 0.8);
    });
  }

  // Tournament footer
  ctx.font = `700 ${H * 0.025}px ${font}`;
  ctx.fillStyle = withAlpha('#ffffff', 0.5);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  if (match.tournamentName) {
    ctx.fillText(match.tournamentName.toUpperCase(), W / 2, H * 0.965);
  }
  ctx.font = `500 ${H * 0.018}px ${font}`;
  ctx.fillStyle = withAlpha('#ffffff', 0.25);
  ctx.fillText('MLBB PUBMAT GENERATOR', W / 2, H * 0.985);
}
