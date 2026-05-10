import { useState } from 'react';
import { Image, Smartphone, Loader } from 'lucide-react';
import { useMatchStore } from '../../store/matchStore';
import { buildFileName, downloadCanvas, getCanvasDimensions } from '../../utils/exportHelpers';
import { renderScoreboard } from '../canvas/templates/ScoreboardTemplate';
import { renderMVP } from '../canvas/templates/MVPTemplate';
import { renderGameSummary } from '../canvas/templates/GameSummaryTemplate';
import type { AspectRatio } from '../../types/match';

export function ExportPanel() {
  const match = useMatchStore((s) => s.match);
  const saveToHistory = useMatchStore((s) => s.saveToHistory);
  const [loading, setLoading] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const exportAs = async (type: 'png' | 'jpg', ratio: AspectRatio) => {
    const key = `${type}-${ratio}`;
    setLoading(key);
    setDone(false);

    const canvas = document.createElement('canvas');
    const [w, h] = getCanvasDimensions(ratio);
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    const matchForExport = { ...match, aspectRatio: ratio };
    if (matchForExport.template === 'scoreboard') await renderScoreboard(ctx, matchForExport, w, h);
    else if (matchForExport.template === 'mvp') await renderMVP(ctx, matchForExport, w, h);
    else await renderGameSummary(ctx, matchForExport, w, h);

    downloadCanvas(canvas, buildFileName(match, type), type);
    saveToHistory();

    setLoading(null);
    setDone(true);
    setTimeout(() => setDone(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 4 }}>
        Export
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {[
          { type: 'png' as const, ratio: '1:1' as const, label: 'PNG Post', icon: Image, sub: '1080×1080' },
          { type: 'jpg' as const, ratio: '1:1' as const, label: 'JPG Post', icon: Image, sub: '1080×1080' },
          { type: 'png' as const, ratio: '9:16' as const, label: 'PNG Story', icon: Smartphone, sub: '1080×1920' },
          { type: 'jpg' as const, ratio: '9:16' as const, label: 'JPG Story', icon: Smartphone, sub: '1080×1920' },
        ].map(({ type, ratio, label, icon: Icon, sub }) => {
          const key = `${type}-${ratio}`;
          const isLoading = loading === key;
          return (
            <button
              key={key}
              className="btn-secondary"
              style={{ flexDirection: 'column', gap: 4, padding: '12px 8px', alignItems: 'center' }}
              disabled={!!loading}
              onClick={() => exportAs(type, ratio)}
            >
              {isLoading ? <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Icon size={18} />}
              <span style={{ fontSize: 13 }}>{label}</span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>{sub}</span>
            </button>
          );
        })}
      </div>

      {done && (
        <div style={{ textAlign: 'center', color: '#22c55e', fontSize: 13, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}>
          ✓ Exported & saved to history
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
