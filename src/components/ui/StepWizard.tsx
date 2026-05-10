import { useMatchStore } from '../../store/matchStore';

const STEPS = [
  { label: 'Tournament', icon: '🏆' },
  { label: 'Teams', icon: '⚔️' },
  { label: 'Heroes', icon: '🦸' },
  { label: 'MVP', icon: '⭐' },
  { label: 'Style', icon: '🎨' },
];

export function StepWizard() {
  const currentStep = useMatchStore((s) => s.currentStep);
  const setStep = useMatchStore((s) => s.setStep);

  return (
    <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        {STEPS.map((step, i) => {
          const isActive = i === currentStep;
          const isDone = i < currentStep;
          const cls = isActive ? 'step-active' : isDone ? 'step-complete' : 'step-pending';

          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <button
                onClick={() => setStep(i)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  flex: '0 0 auto',
                }}
              >
                <div
                  className={cls}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    transition: 'all 0.2s',
                    fontWeight: 700,
                  }}
                >
                  {isDone ? '✓' : step.icon}
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: isActive ? 'var(--accent)' : isDone ? 'var(--accent)' : 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {step.label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    marginTop: -16,
                    background: isDone
                      ? 'linear-gradient(90deg, var(--accent), rgba(0,245,255,0.3))'
                      : 'rgba(255,255,255,0.06)',
                    transition: 'background 0.3s',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
