import { useMatchStore } from '../../store/matchStore';
import { DEFAULT_THEMES } from '../../data/defaultThemes';
import type { TemplateId, AspectRatio } from '../../types/match';

const TEMPLATES: { id: TemplateId; label: string; desc: string; icon: string }[] = [
  { id: 'scoreboard', label: 'Scoreboard', desc: 'Team logos, score, hero picks', icon: '🏟️' },
  { id: 'mvp', label: 'MVP Spotlight', desc: 'Player highlight with stats', icon: '⭐' },
  { id: 'summary', label: 'Game Summary', desc: 'Per-game breakdown cards', icon: '📋' },
];

const RATIOS: { id: AspectRatio; label: string; desc: string }[] = [
  { id: '1:1', label: 'Post (1:1)', desc: '1080 × 1080' },
  { id: '9:16', label: 'Story (9:16)', desc: '1080 × 1920' },
];

export function ThemeSelector() {
  const match = useMatchStore((s) => s.match);
  const updateTheme = useMatchStore((s) => s.updateTheme);
  const updateTemplate = useMatchStore((s) => s.updateTemplate);
  const updateAspectRatio = useMatchStore((s) => s.updateAspectRatio);
  const updateVisibility = useMatchStore((s) => s.updateVisibility);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Template */}
      <div>
        <label className="label">Template Layout</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              className={`card-option${match.template === t.id ? ' selected' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left' }}
              onClick={() => updateTemplate(t.id)}
            >
              <span style={{ fontSize: 24 }}>{t.icon}</span>
              <div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 16, color: match.template === t.id ? 'var(--accent)' : '#e5e7eb' }}>
                  {t.label}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Aspect ratio */}
      <div>
        <label className="label">Aspect Ratio</label>
        <div style={{ display: 'flex', gap: 10 }}>
          {RATIOS.map((r) => (
            <button
              key={r.id}
              className={`card-option${match.aspectRatio === r.id ? ' selected' : ''}`}
              style={{ flex: 1, textAlign: 'center' }}
              onClick={() => updateAspectRatio(r.id)}
            >
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 15, color: match.aspectRatio === r.id ? 'var(--accent)' : '#e5e7eb' }}>
                {r.label}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Color theme */}
      <div>
        <label className="label">Color Theme</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {DEFAULT_THEMES.map((theme) => {
            const isSelected = match.theme.id === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => updateTheme(theme)}
                style={{
                  background: `linear-gradient(135deg, ${theme.bgColors[0]}, ${theme.bgColors[1]})`,
                  border: `2px solid ${isSelected ? theme.accentColor : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 10,
                  padding: '12px 14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  transition: 'all 0.2s',
                  boxShadow: isSelected ? `0 0 16px ${theme.accentColor}44` : 'none',
                }}
              >
                <div style={{ display: 'flex', gap: 4 }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: theme.accentColor }} />
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: theme.secondaryColor }} />
                </div>
                <span style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                  fontSize: 13,
                  color: isSelected ? theme.accentColor : '#e5e7eb',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}>
                  {theme.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom accent color */}
      <div>
        <label className="label">Custom Accent Color</label>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input
            type="color"
            value={match.theme.accentColor}
            onChange={(e) => updateTheme({ ...match.theme, id: 'custom', name: 'Custom', accentColor: e.target.value })}
            style={{ width: 48, height: 40, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'none', cursor: 'pointer', padding: 2 }}
          />
          <span style={{ fontFamily: 'monospace', fontSize: 14, color: 'var(--text-muted)' }}>{match.theme.accentColor}</span>
        </div>
      </div>

      {/* Visibility toggles */}
      <div>
        <label className="label">Show / Hide Elements</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { key: 'showHeroIcons', label: 'Hero Icons' },
            { key: 'showPlayerNames', label: 'Player Names' },
            { key: 'showStats', label: 'MVP Stats' },
            { key: 'showMVPBadge', label: 'MVP Badge' },
          ].map(({ key, label }) => {
            const val = match.visibility[key as keyof typeof match.visibility];
            return (
              <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, color: '#e5e7eb' }}>{label}</span>
                <button
                  onClick={() => updateVisibility({ [key]: !val })}
                  style={{
                    width: 44,
                    height: 24,
                    borderRadius: 12,
                    background: val ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
                    border: 'none',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'background 0.2s',
                  }}
                >
                  <div style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: val ? '#000' : '#6b7280',
                    position: 'absolute',
                    top: 3,
                    left: val ? 23 : 3,
                    transition: 'left 0.2s',
                  }} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
