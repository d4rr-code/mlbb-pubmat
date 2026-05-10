import { useState } from 'react';
import { useMatchStore } from '../../store/matchStore';
import { HeroPickerModal } from './HeroPicker';
import { ChevronDown, ChevronUp } from 'lucide-react';

const LANE_ROLES = ['Gold', 'EXP', 'Jungle', 'Roam', 'Mid'] as const;
const ROLE_COLORS: Record<string, string> = {
  Gold: '#ffd700', EXP: '#22d3ee', Jungle: '#4ade80', Roam: '#a78bfa', Mid: '#f87171',
};

interface PickState { gameIndex: number; teamSide: 'teamA' | 'teamB'; playerIndex: number }

export function HeroesForm() {
  const match = useMatchStore((s) => s.match);
  const updateGame = useMatchStore((s) => s.updateGame);
  const [pickState, setPickState] = useState<PickState | null>(null);
  const [openGame, setOpenGame] = useState(0);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {match.games.map((game, gi) => (
        <div key={gi} className="glass" style={{ overflow: 'hidden' }}>
          {/* Game header */}
          <button
            onClick={() => setOpenGame(openGame === gi ? -1 : gi)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#e5e7eb',
            }}
          >
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 17, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Game {game.gameNumber}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: "'Barlow Condensed', sans-serif" }}>Winner:</span>
                <button
                  className={game.winner === 'teamA' ? 'btn-primary' : 'btn-secondary'}
                  style={{ padding: '4px 10px', fontSize: 12, background: game.winner === 'teamA' ? 'var(--accent)' : undefined }}
                  onClick={(e) => { e.stopPropagation(); updateGame(gi, { winner: 'teamA' }); }}
                >
                  {match.teamA.name || 'Team A'}
                </button>
                <button
                  className={game.winner === 'teamB' ? 'btn-primary' : 'btn-secondary'}
                  style={{ padding: '4px 10px', fontSize: 12, background: game.winner === 'teamB' ? match.theme.secondaryColor : undefined }}
                  onClick={(e) => { e.stopPropagation(); updateGame(gi, { winner: 'teamB' }); }}
                >
                  {match.teamB.name || 'Team B'}
                </button>
              </div>
              {openGame === gi ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
            </div>
          </button>

          {openGame === gi && (
            <div style={{ padding: '0 18px 18px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Duration */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <label className="label" style={{ margin: 0, whiteSpace: 'nowrap' }}>Duration</label>
                <input
                  className="input-dark"
                  placeholder="e.g. 18:42"
                  value={game.duration ?? ''}
                  onChange={(e) => updateGame(gi, { duration: e.target.value })}
                  style={{ maxWidth: 120 }}
                />
              </div>

              {/* Two columns: Team A | Team B */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {(['teamA', 'teamB'] as const).map((side) => {
                  const draft = side === 'teamA' ? game.teamADraft : game.teamBDraft;
                  const teamName = side === 'teamA' ? (match.teamA.name || 'Team A') : (match.teamB.name || 'Team B');
                  const color = side === 'teamA' ? 'var(--accent)' : match.theme.secondaryColor;

                  return (
                    <div key={side}>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 13, textTransform: 'uppercase', color, marginBottom: 8 }}>
                        {teamName}
                      </div>
                      {draft.map((player, pi) => (
                        <div key={pi} style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
                          <div
                            style={{
                              width: 38,
                              height: 38,
                              borderRadius: 6,
                              background: player.hero ? player.hero.color : 'rgba(255,255,255,0.05)',
                              border: player.hero ? 'none' : '1px dashed rgba(255,255,255,0.15)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              flexShrink: 0,
                              fontSize: 11,
                              fontWeight: 800,
                              fontFamily: "'Barlow Condensed', sans-serif",
                              color: player.hero ? '#000' : 'var(--text-muted)',
                              transition: 'all 0.15s',
                            }}
                            onClick={() => setPickState({ gameIndex: gi, teamSide: side, playerIndex: pi })}
                            title="Click to pick hero"
                          >
                            {player.hero ? player.hero.name.slice(0, 3).toUpperCase() : '+'}
                          </div>
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <div
                              style={{ fontSize: 10, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, color: ROLE_COLORS[LANE_ROLES[pi]] }}
                            >
                              {LANE_ROLES[pi]}
                            </div>
                            <input
                              className="input-dark"
                              placeholder="Player name"
                              value={player.playerName}
                              style={{ padding: '4px 8px', fontSize: 12, height: 26 }}
                              onChange={(e) => {
                                const newDraft = [...draft];
                                newDraft[pi] = { ...newDraft[pi], playerName: e.target.value };
                                updateGame(gi, side === 'teamA' ? { teamADraft: newDraft } : { teamBDraft: newDraft });
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ))}

      {pickState && (
        <HeroPickerModal
          gameIndex={pickState.gameIndex}
          teamSide={pickState.teamSide}
          playerIndex={pickState.playerIndex}
          onClose={() => setPickState(null)}
        />
      )}
    </div>
  );
}
