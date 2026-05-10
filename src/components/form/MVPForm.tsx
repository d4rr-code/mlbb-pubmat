import { useState } from 'react';
import { useMatchStore } from '../../store/matchStore';
import { Star } from 'lucide-react';
import heroData from '../../data/heroes.json';
import type { Hero } from '../../types/match';

export function MVPForm() {
  const match = useMatchStore((s) => s.match);
  const updateMVP = useMatchStore((s) => s.updateMVP);
  const [showPicker, setShowPicker] = useState(false);

  const mvp = match.mvp ?? {
    playerName: '',
    teamId: 'teamA' as const,
    hero: null,
    kills: 0,
    deaths: 0,
    assists: 0,
    damageDealt: undefined,
    damageTaken: undefined,
  };

  const update = (partial: Partial<typeof mvp>) => updateMVP({ ...mvp, ...partial });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <Star size={16} color="var(--gold)" fill="var(--gold)" />
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 16, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          MVP Selection
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label className="label">Player Name</label>
          <input
            className="input-dark"
            placeholder="e.g. Kairi"
            value={mvp.playerName}
            onChange={(e) => update({ playerName: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Team</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className={`card-option${mvp.teamId === 'teamA' ? ' selected' : ''}`}
              style={{ flex: 1, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 14 }}
              onClick={() => update({ teamId: 'teamA' })}
            >
              {match.teamA.name || 'Team A'}
            </button>
            <button
              className={`card-option${mvp.teamId === 'teamB' ? ' selected' : ''}`}
              style={{ flex: 1, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 14 }}
              onClick={() => update({ teamId: 'teamB' })}
            >
              {match.teamB.name || 'Team B'}
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="label">MVP Hero</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            onClick={() => setShowPicker(true)}
            style={{
              width: 60,
              height: 60,
              borderRadius: 10,
              background: mvp.hero ? mvp.hero.color : 'rgba(255,255,255,0.05)',
              border: mvp.hero ? 'none' : '1px dashed rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: 16,
              fontWeight: 800,
              fontFamily: "'Barlow Condensed', sans-serif",
              color: mvp.hero ? '#000' : 'var(--text-muted)',
              flexShrink: 0,
            }}
          >
            {mvp.hero ? mvp.hero.name.slice(0, 3).toUpperCase() : '+'}
          </div>
          <div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 16, color: '#e5e7eb' }}>
              {mvp.hero ? mvp.hero.name : 'No hero selected'}
            </div>
            <button className="btn-ghost" style={{ padding: '4px 0', fontSize: 13 }} onClick={() => setShowPicker(true)}>
              {mvp.hero ? 'Change hero' : 'Pick hero'}
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="label">KDA Stats</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { key: 'kills', label: 'Kills', color: '#22c55e' },
            { key: 'deaths', label: 'Deaths', color: '#ef4444' },
            { key: 'assists', label: 'Assists', color: '#f59e0b' },
          ].map(({ key, label, color }) => (
            <div key={key}>
              <label className="label" style={{ color }}>{label}</label>
              <input
                type="number"
                min={0}
                className="input-dark"
                style={{ textAlign: 'center', fontSize: 24, fontFamily: "'Bebas Neue', sans-serif", borderColor: `${color}44` }}
                value={mvp[key as 'kills' | 'deaths' | 'assists']}
                onChange={(e) => update({ [key]: Math.max(0, parseInt(e.target.value) || 0) })}
              />
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label className="label">Damage Dealt (optional)</label>
          <input
            type="number"
            min={0}
            className="input-dark"
            placeholder="e.g. 150000"
            value={mvp.damageDealt ?? ''}
            onChange={(e) => update({ damageDealt: e.target.value ? parseInt(e.target.value) : undefined })}
          />
        </div>
        <div>
          <label className="label">Damage Taken (optional)</label>
          <input
            type="number"
            min={0}
            className="input-dark"
            placeholder="e.g. 80000"
            value={mvp.damageTaken ?? ''}
            onChange={(e) => update({ damageTaken: e.target.value ? parseInt(e.target.value) : undefined })}
          />
        </div>
      </div>

      {/* Fake hero picker tied to game 0 / teamA but we override after */}
      {showPicker && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={() => setShowPicker(false)}
        >
          <div
            className="glass animate-fade-in"
            style={{ width: 520, maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 18, textTransform: 'uppercase' }}>
                Pick MVP Hero
              </span>
            </div>
            <div style={{ overflowY: 'auto', padding: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {(heroData as Hero[]).map((hero) => (
                  <button
                    key={hero.id}
                    onClick={() => { update({ hero }); setShowPicker(false); }}
                    style={{
                      background: `${hero.color}15`,
                      border: `1px solid ${hero.color}40`,
                      borderRadius: 8,
                      padding: '10px 8px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <div style={{ width: 44, height: 44, borderRadius: 8, background: hero.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 14, color: '#000' }}>
                      {hero.name.slice(0, 3).toUpperCase()}
                    </div>
                    <span style={{ fontSize: 11, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, color: '#e5e7eb', textAlign: 'center' }}>{hero.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
