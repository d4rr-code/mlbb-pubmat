import { useState, useRef, useEffect } from 'react';
import { useMatchStore } from '../../store/matchStore';
import { fileToBase64 } from '../../utils/exportHelpers';
import { Upload, X, ChevronDown } from 'lucide-react';

const STAGES = [
  'Group Stage', 'Round of 16', 'Quarterfinals', 'Semifinals',
  'Grand Finals', 'Playoffs', 'Lower Bracket', 'Upper Bracket',
];

function CustomSelect({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255,255,255,0.05)',
          border: `1px solid ${open ? 'var(--accent)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: 8,
          color: '#e5e7eb',
          padding: '10px 14px',
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: 15,
          cursor: 'pointer',
          boxShadow: open ? '0 0 0 2px rgba(0,245,255,0.1)' : 'none',
          transition: 'border-color 0.2s',
        }}
      >
        <span>{value}</span>
        <ChevronDown
          size={14}
          color="var(--text-muted)"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}
        />
      </button>

      {open && (
        <ul
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 200,
            margin: 0,
            padding: '4px 0',
            listStyle: 'none',
            background: '#1a1a2e',
            border: '1px solid rgba(0,245,255,0.25)',
            borderRadius: 8,
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
            maxHeight: 240,
            overflowY: 'auto',
          }}
        >
          {options.map((opt) => (
            <li
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              style={{
                padding: '9px 14px',
                cursor: 'pointer',
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: 15,
                color: opt === value ? 'var(--accent)' : '#e5e7eb',
                background: opt === value ? 'rgba(0,245,255,0.08)' : 'transparent',
                transition: 'background 0.12s',
              }}
              onMouseEnter={(e) => { if (opt !== value) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = opt === value ? 'rgba(0,245,255,0.08)' : 'transparent'; }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function TournamentInfo() {
  const match = useMatchStore((s) => s.match);
  const updateTournament = useMatchStore((s) => s.updateTournament);

  const handleLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const b64 = await fileToBase64(file);
    updateTournament({ tournamentLogo: b64 });
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <label className="label">Tournament Name</label>
        <input
          className="input-dark"
          placeholder="e.g. MSC 2025 Online Qualifier"
          value={match.tournamentName}
          onChange={(e) => updateTournament({ tournamentName: e.target.value })}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label className="label">Stage / Round</label>
          <CustomSelect
            value={match.stage}
            options={STAGES}
            onChange={(v) => updateTournament({ stage: v })}
          />
        </div>
        <div>
          <label className="label">Custom Stage</label>
          <input
            className="input-dark"
            placeholder="Or type custom..."
            value={match.stage}
            onChange={(e) => updateTournament({ stage: e.target.value })}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label className="label">Date</label>
          <input
            type="date"
            className="input-dark"
            value={match.date}
            onChange={(e) => updateTournament({ date: e.target.value })}
            style={{ colorScheme: 'dark' }}
          />
        </div>
        <div>
          <label className="label">Time</label>
          <input
            type="time"
            className="input-dark"
            value={match.time}
            onChange={(e) => updateTournament({ time: e.target.value })}
            style={{ colorScheme: 'dark' }}
          />
        </div>
      </div>

      <div>
        <label className="label">Tournament Logo (optional)</label>
        {match.tournamentLogo ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img
              src={match.tournamentLogo}
              alt="logo"
              style={{ width: 64, height: 64, objectFit: 'contain', borderRadius: 8, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)' }}
            />
            <button className="btn-ghost" onClick={() => updateTournament({ tournamentLogo: undefined })}>
              <X size={14} /> Remove
            </button>
          </div>
        ) : (
          <label
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 16px',
              border: '1px dashed rgba(255,255,255,0.15)',
              borderRadius: 8, cursor: 'pointer',
              color: 'var(--text-muted)', fontSize: 14, transition: 'border-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)')}
          >
            <Upload size={16} />
            Click to upload logo (PNG, JPG)
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogo} />
          </label>
        )}
      </div>

      <div>
        <label className="label">Match Format</label>
        <div style={{ display: 'flex', gap: 10 }}>
          {(['BO1', 'BO3', 'BO5'] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => useMatchStore.getState().updateFormat(fmt)}
              className={`card-option${match.format === fmt ? ' selected' : ''}`}
              style={{
                flex: 1,
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: 20,
                color: match.format === fmt ? 'var(--accent)' : '#e5e7eb',
              }}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
