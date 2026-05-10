import type { MatchData } from '../../../types/match';
import {
  drawBackground, drawRoundedRect, drawHeroIcon, drawImage, withAlpha
} from '../../../utils/canvasHelpers';

export async function renderScoreboard(
  ctx: CanvasRenderingContext2D,
  match: MatchData,
  W: number,
  H: number
) {
  const { theme, teamA, teamB, visibility } = match;
  const accent = theme.accentColor;
  const secondary = theme.secondaryColor;

  drawBackground(ctx, W, H, theme);

  const font = theme.fontFamily === 'Bebas Neue' ? "'Bebas Neue'" : `'${theme.fontFamily}', sans-serif`;

  // Tournament banner top
  const bannerH = H * 0.1;
  const bannerGrad = ctx.createLinearGradient(0, 0, W, 0);
  bannerGrad.addColorStop(0, withAlpha(accent, 0.15));
  bannerGrad.addColorStop(0.5, withAlpha(accent, 0.05));
  bannerGrad.addColorStop(1, withAlpha(secondary, 0.15));
  ctx.fillStyle = bannerGrad;
  ctx.fillRect(0, 0, W, bannerH);

  // Accent line
  ctx.fillStyle = accent;
  ctx.fillRect(0, bannerH - 3, W, 3);

  // Tournament name
  if (match.tournamentName) {
    ctx.font = `700 ${H * 0.032}px ${font}`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(match.tournamentName.toUpperCase(), W / 2, bannerH * 0.4);
  }
  // Stage + date
  ctx.font = `600 ${H * 0.022}px ${font}`;
  ctx.fillStyle = withAlpha(accent, 0.9);
  ctx.textAlign = 'center';
  ctx.fillText(
    `${match.stage.toUpperCase()}  ·  ${match.date}`,
    W / 2, bannerH * 0.72
  );

  // Tournament logo
  if (match.tournamentLogo) {
    const logoSize = bannerH * 0.6;
    await drawImage(ctx, match.tournamentLogo, W / 2 - logoSize / 2, bannerH * 0.2, logoSize, logoSize, logoSize * 0.1);
  }

  // ── TEAM LOGOS ──
  const logoZone = H * 0.35;
  const logoY = bannerH + (logoZone - H * 0.25) / 2;
  const logoSize = H * 0.22;
  const teamALogoX = W * 0.1;
  const teamBLogoX = W * 0.9 - logoSize;

  // Team A glow
  ctx.shadowColor = accent;
  ctx.shadowBlur = 40;
  if (teamA.logo) {
    await drawImage(ctx, teamA.logo, teamALogoX, logoY, logoSize, logoSize, logoSize * 0.12);
  } else {
    drawRoundedRect(ctx, teamALogoX, logoY, logoSize, logoSize, logoSize * 0.12,
      withAlpha(accent, 0.15), accent, 2);
    ctx.shadowBlur = 0;
    ctx.font = `800 ${logoSize * 0.35}px ${font}`;
    ctx.fillStyle = accent;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText((teamA.name || 'A').slice(0, 3).toUpperCase(), teamALogoX + logoSize / 2, logoY + logoSize / 2);
  }
  ctx.shadowBlur = 0;

  // Team B glow
  ctx.shadowColor = secondary;
  ctx.shadowBlur = 40;
  if (teamB.logo) {
    await drawImage(ctx, teamB.logo, teamBLogoX, logoY, logoSize, logoSize, logoSize * 0.12);
  } else {
    drawRoundedRect(ctx, teamBLogoX, logoY, logoSize, logoSize, logoSize * 0.12,
      withAlpha(secondary, 0.15), secondary, 2);
    ctx.shadowBlur = 0;
    ctx.font = `800 ${logoSize * 0.35}px ${font}`;
    ctx.fillStyle = secondary;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText((teamB.name || 'B').slice(0, 3).toUpperCase(), teamBLogoX + logoSize / 2, logoY + logoSize / 2);
  }
  ctx.shadowBlur = 0;

  // ── SCORE CENTER ──
  const scoreY = bannerH + logoZone * 0.5;
  const scoreSize = H * 0.16;

  // VS divider BG
  const vsBg = ctx.createRadialGradient(W / 2, scoreY, 0, W / 2, scoreY, W * 0.15);
  vsBg.addColorStop(0, withAlpha(accent, 0.1));
  vsBg.addColorStop(1, 'transparent');
  ctx.fillStyle = vsBg;
  ctx.fillRect(0, bannerH, W, logoZone);

  // Score A
  ctx.shadowColor = accent;
  ctx.shadowBlur = 20;
  ctx.font = `900 ${scoreSize}px ${font}`;
  ctx.fillStyle = accent;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(teamA.score), W * 0.35, scoreY);
  ctx.shadowBlur = 0;

  // Dash
  ctx.font = `400 ${scoreSize * 0.6}px ${font}`;
  ctx.fillStyle = withAlpha('#ffffff', 0.3);
  ctx.fillText('—', W / 2, scoreY);

  // Score B
  ctx.shadowColor = secondary;
  ctx.shadowBlur = 20;
  ctx.font = `900 ${scoreSize}px ${font}`;
  ctx.fillStyle = secondary;
  ctx.fillText(String(teamB.score), W * 0.65, scoreY);
  ctx.shadowBlur = 0;

  // Team names
  const nameY = bannerH + logoZone * 0.88;
  ctx.font = `700 ${H * 0.035}px ${font}`;
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText((teamA.name || 'TEAM A').toUpperCase(), W * 0.22, nameY);
  ctx.fillText((teamB.name || 'TEAM B').toUpperCase(), W * 0.78, nameY);

  // ── WINNER BANNER ──
  const winner = teamA.score > teamB.score ? teamA : teamB.score > teamA.score ? teamB : null;
  const winnerColor = teamA.score > teamB.score ? accent : secondary;
  if (winner) {
    const wBannerY = bannerH + logoZone;
    const wBannerH = H * 0.06;
    const wGrad = ctx.createLinearGradient(0, wBannerY, W, wBannerY);
    wGrad.addColorStop(0, 'transparent');
    wGrad.addColorStop(0.3, withAlpha(winnerColor, 0.2));
    wGrad.addColorStop(0.7, withAlpha(winnerColor, 0.2));
    wGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = wGrad;
    ctx.fillRect(0, wBannerY, W, wBannerH);
    ctx.font = `800 ${H * 0.026}px ${font}`;
    ctx.fillStyle = winnerColor;
    ctx.textAlign = 'center';
    ctx.fillText(`🏆  ${winner.name.toUpperCase()}  WINS`, W / 2, wBannerY + wBannerH / 2);
  }

  // ── HERO ICONS (games) ──
  if (visibility.showHeroIcons && match.games.length > 0) {
    const heroZoneY = bannerH + logoZone + H * 0.07;
    const heroZoneH = H * 0.28;
    const iconSize = Math.min(W / (match.format === 'BO1' ? 8 : 12), H * 0.065);
    const gap = iconSize * 0.2;

    ctx.font = `600 ${H * 0.02}px ${font}`;
    ctx.fillStyle = withAlpha('#ffffff', 0.4);
    ctx.textAlign = 'center';
    ctx.fillText(match.format, W / 2, heroZoneY - H * 0.015);

    match.games.forEach((game, gi) => {
      const gamesWithData = match.games.filter(
        (g) => g.teamADraft.some((p) => p.hero) || g.teamBDraft.some((p) => p.hero)
      );
      if (!gamesWithData.includes(game)) return;

      const gameRowH = heroZoneH / Math.min(match.games.length, 3);
      const rowY = heroZoneY + gi * gameRowH;

      // Game label
      ctx.font = `600 ${H * 0.018}px ${font}`;
      ctx.fillStyle = withAlpha(accent, 0.7);
      ctx.textAlign = 'left';
      ctx.fillText(`G${game.gameNumber}`, W * 0.04, rowY + gameRowH / 2);

      // Winner indicator
      const winnerBadge = game.winner === 'teamA' ? accent : secondary;
      ctx.fillStyle = winnerBadge;
      ctx.font = `700 ${H * 0.016}px ${font}`;
      ctx.fillText('W', W * 0.04, rowY + gameRowH / 2 + H * 0.022);

      // Team A heroes (left side)
      game.teamADraft.forEach((draft, di) => {
        if (!draft.hero) return;
        const hx = W * 0.09 + di * (iconSize + gap);
        const hy = rowY + (gameRowH - iconSize) / 2;
        drawHeroIcon(ctx, hx, hy, iconSize, draft.hero.color, draft.hero.name);
        if (visibility.showPlayerNames && draft.playerName) {
          ctx.font = `500 ${iconSize * 0.28}px ${font}`;
          ctx.fillStyle = withAlpha('#ffffff', 0.6);
          ctx.textAlign = 'center';
          ctx.fillText(draft.playerName.slice(0, 8), hx + iconSize / 2, hy + iconSize + iconSize * 0.18);
        }
      });

      // Team B heroes (right side)
      game.teamBDraft.forEach((draft, di) => {
        if (!draft.hero) return;
        const hx = W * 0.91 - (5 - di) * (iconSize + gap);
        const hy = rowY + (gameRowH - iconSize) / 2;
        drawHeroIcon(ctx, hx, hy, iconSize, draft.hero.color, draft.hero.name);
        if (visibility.showPlayerNames && draft.playerName) {
          ctx.font = `500 ${iconSize * 0.28}px ${font}`;
          ctx.fillStyle = withAlpha('#ffffff', 0.6);
          ctx.textAlign = 'center';
          ctx.fillText(draft.playerName.slice(0, 8), hx + iconSize / 2, hy + iconSize + iconSize * 0.18);
        }
      });

      // Divider between heroes
      ctx.strokeStyle = withAlpha('#ffffff', 0.06);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(W * 0.08, rowY + gameRowH);
      ctx.lineTo(W * 0.92, rowY + gameRowH);
      ctx.stroke();
    });
  }

  // ── MVP BADGE ──
  if (visibility.showMVPBadge && match.mvp) {
    const mvp = match.mvp;
    const badgeX = W * 0.03;
    const badgeY = H * 0.88;
    const badgeW = W * 0.94;
    const badgeH = H * 0.08;
    drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, 10,
      withAlpha(accent, 0.08), withAlpha(accent, 0.3), 1);

    ctx.font = `800 ${H * 0.022}px ${font}`;
    ctx.fillStyle = accent;
    ctx.textAlign = 'left';
    ctx.fillText('⭐ MVP', badgeX + 20, badgeY + badgeH / 2 - H * 0.01);

    ctx.font = `600 ${H * 0.02}px ${font}`;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(mvp.playerName.toUpperCase(), badgeX + W * 0.1, badgeY + badgeH / 2 - H * 0.01);

    if (mvp.hero) {
      ctx.font = `500 ${H * 0.018}px ${font}`;
      ctx.fillStyle = withAlpha(accent, 0.8);
      ctx.fillText(mvp.hero.name, badgeX + W * 0.1, badgeY + badgeH / 2 + H * 0.018);
    }

    if (visibility.showStats) {
      const kda = `${mvp.kills}/${mvp.deaths}/${mvp.assists}`;
      ctx.font = `700 ${H * 0.022}px ${font}`;
      ctx.fillStyle = accent;
      ctx.textAlign = 'right';
      ctx.fillText(kda, badgeX + badgeW - 20, badgeY + badgeH / 2);
      ctx.font = `500 ${H * 0.016}px ${font}`;
      ctx.fillStyle = withAlpha('#ffffff', 0.5);
      ctx.fillText('KDA', badgeX + badgeW - 20, badgeY + badgeH / 2 + H * 0.02);
    }
  }

  // Footer branding
  ctx.font = `600 ${H * 0.018}px ${font}`;
  ctx.fillStyle = withAlpha('#ffffff', 0.25);
  ctx.textAlign = 'center';
  ctx.fillText('MLBB PUBMAT GENERATOR', W / 2, H * 0.975);
}
