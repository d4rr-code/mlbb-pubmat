import { useMatchStore } from '../../store/matchStore';
import { RotateCcw, Trash2, Clock } from 'lucide-react';

export function MatchHistory() {
  const history = useMatchStore((s) => s.history);
  const loadFromHistory = useMatchStore((s) => s.loadFromHistory);
  const clearHistory = useMatchStore((s) => s.clearHistory);

  if (history.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 20px', color: 'var(--text-muted)' }}>
        <Clock size={28} style={{ margin: '0 auto 10px', display: 'block', opacity: 0.4 }} />
        <p style={{ margin: 0, fontSize: 13 }}>No match history yet.<br />Export a pubmat to save it here.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
          Recent ({history.length})
        </span>
        <button className="btn-ghost" style={{ fontSize: 12, padding: '4px 8px', color: '#ef4444' }} onClick={clearHistory}>
          <Trash2 size={12} /> Clear all
        </button>
      </div>

      {history.map((m) => (
        <div
          key={m.id}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 8,
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 14, color: '#e5e7eb', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {m.teamA.name || 'Team A'} <span style={{ color: 'var(--accent)' }}>{m.teamA.score}–{m.teamB.score}</span> {m.teamB.name || 'Team B'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
              {m.tournamentName || 'No tournament'} · {m.date} · {m.format}
            </div>
          </div>
          <button
            className="btn-ghost"
            style={{ padding: '6px 10px', fontSize: 12, flexShrink: 0 }}
            onClick={() => loadFromHistory(m.id)}
          >
            <RotateCcw size={12} /> Load
          </button>
        </div>
      ))}
    </div>
  );
}
