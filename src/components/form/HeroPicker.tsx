import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import heroData from '../../data/heroes.json';
import type { Hero, HeroClass, HeroRole } from '../../types/match';
import { useMatchStore } from '../../store/matchStore';

const ROLES: HeroClass[] = ['Marksman', 'Fighter', 'Mage', 'Tank', 'Assassin', 'Support'];
const LANE_ROLES: HeroRole[] = ['Gold', 'EXP', 'Jungle', 'Roam', 'Mid'];
const ROLE_COLORS: Record<HeroClass, string> = {
  Marksman: '#f472b6',
  Fighter: '#fb923c',
  Mage: '#a78bfa',
  Tank: '#94a3b8',
  Assassin: '#67e8f9',
  Support: '#86efac',
};

interface HeroPickerProps {
  gameIndex: number;
  teamSide: 'teamA' | 'teamB';
  playerIndex: number;
  onClose: () => void;
}

export function HeroPickerModal({ gameIndex, teamSide, playerIndex, onClose }: HeroPickerProps) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<HeroClass | 'All'>('All');
  const updateGame = useMatchStore((s) => s.updateGame);
  const match = useMatchStore((s) => s.match);

  const heroes = heroData as Hero[];
  const filtered = useMemo(
    () =>
      heroes.filter(
        (h) =>
          (roleFilter === 'All' || h.role === roleFilter) &&
          h.name.toLowerCase().includes(search.toLowerCase())
      ),
    [search, roleFilter]
  );

  const selectHero = (hero: Hero) => {
    const game = match.games[gameIndex];
    const draft = teamSide === 'teamA' ? [...game.teamADraft] : [...game.teamBDraft];
    draft[playerIndex] = { ...draft[playerIndex], hero };
    if (teamSide === 'teamA') {
      updateGame(gameIndex, { teamADraft: draft });
    } else {
      updateGame(gameIndex, { teamBDraft: draft });
    }
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.75)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        className="glass animate-fade-in"
        style={{ width: 520, maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 18, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Pick Hero — {teamSide === 'teamA' ? 'Team A' : 'Team B'} · Game {gameIndex + 1} · {LANE_ROLES[playerIndex]}
          </span>
          <button className="btn-ghost" style={{ padding: '4px 8px' }} onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: '12px 20px 8px', display: 'flex', gap: 10 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              className="input-dark"
              style={{ paddingLeft: 34 }}
              placeholder="Search hero..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* Role filters */}
        <div style={{ padding: '0 20px 12px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(['All', ...ROLES] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              style={{
                padding: '4px 12px',
                borderRadius: 20,
                border: `1px solid ${r === roleFilter ? (r === 'All' ? 'var(--accent)' : ROLE_COLORS[r as HeroClass]) : 'rgba(255,255,255,0.1)'}`,
                background: r === roleFilter ? (r === 'All' ? 'rgba(0,245,255,0.1)' : `${ROLE_COLORS[r as HeroClass]}22`) : 'transparent',
                color: r === roleFilter ? (r === 'All' ? 'var(--accent)' : ROLE_COLORS[r as HeroClass]) : 'var(--text-muted)',
                fontSize: 12,
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Hero grid */}
        <div style={{ overflowY: 'auto', padding: '0 20px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {filtered.map((hero) => {
              const color = hero.color;
              return (
                <button
                  key={hero.id}
                  onClick={() => selectHero(hero as Hero)}
                  style={{
                    background: `${color}15`,
                    border: `1px solid ${color}40`,
                    borderRadius: 8,
                    padding: '10px 8px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${color}30`;
                    e.currentTarget.style.borderColor = color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `${color}15`;
                    e.currentTarget.style.borderColor = `${color}40`;
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 8,
                      background: color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 800,
                      fontSize: 14,
                      color: '#000',
                    }}
                  >
                    {hero.name.slice(0, 3).toUpperCase()}
                  </div>
                  <span style={{ fontSize: 11, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, color: '#e5e7eb', textAlign: 'center', lineHeight: 1.2 }}>
                    {hero.name}
                  </span>
                  <span style={{ fontSize: 10, color: ROLE_COLORS[hero.role as HeroClass] ?? 'var(--text-muted)', fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {hero.role}
                  </span>
                </button>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>No heroes found</div>
          )}
        </div>
      </div>
    </div>
  );
}
