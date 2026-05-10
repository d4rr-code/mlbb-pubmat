import { useMatchStore } from '../store/matchStore';
import { StepWizard } from '../components/ui/StepWizard';
import { TournamentInfo } from '../components/form/TournamentInfo';
import { TeamInput } from '../components/form/TeamInput';
import { HeroesForm } from '../components/form/HeroesForm';
import { MVPForm } from '../components/form/MVPForm';
import { ThemeSelector } from '../components/form/ThemeSelector';
import { CanvasPreview } from '../components/canvas/CanvasPreview';
import { ExportPanel } from '../components/ui/ExportPanel';
import { MatchHistory } from '../components/ui/MatchHistory';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

const STEP_LABELS = ['Tournament', 'Teams', 'Heroes', 'MVP', 'Style'];
const STEP_FORMS = [TournamentInfo, TeamInput, HeroesForm, MVPForm, ThemeSelector];

export function Create() {
  const currentStep = useMatchStore((s) => s.currentStep);
  const setStep = useMatchStore((s) => s.setStep);
  const resetMatch = useMatchStore((s) => s.resetMatch);
  const match = useMatchStore((s) => s.match);

  const StepForm = STEP_FORMS[currentStep];
  const isLast = currentStep === STEP_FORMS.length - 1;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* LEFT PANEL — Form */}
      <div
        style={{
          width: 480,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid var(--border)',
          background: 'var(--bg-card)',
          overflow: 'hidden',
        }}
      >
        {/* App header */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: '0.08em', color: 'var(--accent)' }}>
              MLBB Pubmat Generator
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Esports Graphics · No design needed
            </div>
          </div>
          <button className="btn-ghost" style={{ fontSize: 12 }} onClick={resetMatch}>
            <RefreshCw size={13} /> Reset
          </button>
        </div>

        {/* Step wizard */}
        <div style={{ flexShrink: 0 }}>
          <StepWizard />
        </div>

        {/* Step form */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ margin: 0, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 22, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#e5e7eb' }}>
              {STEP_LABELS[currentStep]}
            </h2>
          </div>
          <StepForm />
        </div>

        {/* Navigation */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10, flexShrink: 0 }}>
          <button
            className="btn-secondary"
            disabled={currentStep === 0}
            onClick={() => setStep(currentStep - 1)}
            style={{ flex: 1 }}
          >
            <ChevronLeft size={16} /> Back
          </button>
          {!isLast ? (
            <button className="btn-primary" onClick={() => setStep(currentStep + 1)} style={{ flex: 2 }}>
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <div style={{ flex: 2 }}>
              <ExportPanel />
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL — Preview + History */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: 'var(--bg-base)',
        }}
        className="bg-grid"
      >
        {/* Preview area */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, overflow: 'hidden' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: 11, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
              Live Preview · {match.template} · {match.aspectRatio}
            </div>
            <div
              style={{
                boxShadow: `0 0 60px rgba(0,245,255,0.12), 0 24px 48px rgba(0,0,0,0.5)`,
                borderRadius: 12,
                overflow: 'hidden',
              }}
            >
              <CanvasPreview />
            </div>
          </div>
        </div>

        {/* History sidebar bottom */}
        <div
          style={{
            borderTop: '1px solid var(--border)',
            background: 'var(--bg-card)',
            padding: '16px 20px',
            maxHeight: 220,
            overflowY: 'auto',
          }}
        >
          <MatchHistory />
        </div>
      </div>
    </div>
  );
}
