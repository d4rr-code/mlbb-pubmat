import { useMatchStore } from '../../store/matchStore';
import { fileToBase64 } from '../../utils/exportHelpers';
import { Upload, X } from 'lucide-react';

function TeamCard({
  label,
  team,
  color,
  onUpdate,
}: {
  label: string;
  team: { name: string; logo?: string; score: number };
  color: string;
  onUpdate: (d: Partial<typeof team>) => void;
}) {
  const handleLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const b64 = await fileToBase64(file);
    onUpdate({ logo: b64 });
  };

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${color}33`,
        borderRadius: 12,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <div style={{ width: 3, height: 20, background: color, borderRadius: 2 }} />
        <span
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: 14,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color,
          }}
        >
          {label}
        </span>
      </div>

      <div>
        <label className="label">Team Name</label>
        <input
          className="input-dark"
          placeholder="e.g. ECHO PH"
          value={team.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          style={{ borderColor: team.name ? `${color}44` : undefined }}
        />
      </div>

      <div>
        <label className="label">Score</label>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            className="btn-secondary"
            style={{ width: 36, height: 36, padding: 0, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => onUpdate({ score: Math.max(0, team.score - 1) })}
          >
            −
          </button>
          <div
            style={{
              flex: 1,
              textAlign: 'center',
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 40,
              color,
              lineHeight: 1,
            }}
          >
            {team.score}
          </div>
          <button
            className="btn-secondary"
            style={{ width: 36, height: 36, padding: 0, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => onUpdate({ score: team.score + 1 })}
          >
            +
          </button>
        </div>
      </div>

      <div>
        <label className="label">Team Logo (optional)</label>
        {team.logo ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img
              src={team.logo}
              alt="logo"
              style={{
                width: 56,
                height: 56,
                objectFit: 'contain',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'rgba(255,255,255,0.05)',
              }}
            />
            <button className="btn-ghost" onClick={() => onUpdate({ logo: undefined })}>
              <X size={13} /> Remove
            </button>
          </div>
        ) : (
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 14px',
              border: '1px dashed rgba(255,255,255,0.12)',
              borderRadius: 8,
              cursor: 'pointer',
              color: 'var(--text-muted)',
              fontSize: 13,
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = color)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
          >
            <Upload size={14} />
            Upload logo
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogo} />
          </label>
        )}
      </div>
    </div>
  );
}

export function TeamInput() {
  const match = useMatchStore((s) => s.match);
  const updateTeamA = useMatchStore((s) => s.updateTeamA);
  const updateTeamB = useMatchStore((s) => s.updateTeamB);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <TeamCard
        label="Team A"
        team={match.teamA}
        color="var(--accent)"
        onUpdate={updateTeamA}
      />
      <TeamCard
        label="Team B"
        team={match.teamB}
        color={match.theme.secondaryColor}
        onUpdate={updateTeamB}
      />
    </div>
  );
}
