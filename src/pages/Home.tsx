import { useNavigate } from 'react-router-dom';
import { Zap, Download, Clock } from 'lucide-react';

export function Home() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
      className="bg-grid"
    >
      {/* Background glow */}
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 300, background: 'radial-gradient(ellipse, rgba(0,245,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 640 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 20, border: '1px solid rgba(0,245,255,0.3)', background: 'rgba(0,245,255,0.05)', marginBottom: 24 }}>
          <Zap size={12} color="var(--accent)" fill="var(--accent)" />
          <span style={{ fontSize: 12, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)' }}>
            Grassroots MLBB Tournament Tool
          </span>
        </div>

        <h1
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 72,
            letterSpacing: '0.04em',
            margin: '0 0 16px',
            lineHeight: 1,
            background: 'linear-gradient(135deg, #00f5ff, #ffffff, #7c3aed)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          MLBB Pubmat<br />Generator
        </h1>

        <p style={{ fontSize: 18, color: '#9ca3af', marginBottom: 40, lineHeight: 1.6, fontFamily: "'Rajdhani', sans-serif" }}>
          Professional match-result graphics for your tournament — in under 2 minutes. No design experience required.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 60 }}>
          <button className="btn-primary" style={{ fontSize: 18, padding: '14px 36px' }} onClick={() => navigate('/create')}>
            Create Pubmat →
          </button>
        </div>

        {/* Features */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, textAlign: 'left' }}>
          {[
            { icon: Zap, title: 'Instant Preview', desc: 'Live canvas updates as you type match data' },
            { icon: Download, title: 'One-Click Export', desc: 'PNG or JPG for post or story formats' },
            { icon: Clock, title: 'Match History', desc: 'Last 10 matches saved for quick re-export' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass" style={{ padding: '16px 18px' }}>
              <Icon size={20} color="var(--accent)" style={{ marginBottom: 10 }} />
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 16, textTransform: 'uppercase', marginBottom: 6, color: '#e5e7eb' }}>{title}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
