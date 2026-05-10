import { useMatchStore } from '../../store/matchStore';
import { useCanvasRenderer } from './useCanvasRenderer';

const PREVIEW_WIDTH = 440;

export function CanvasPreview() {
  const match = useMatchStore((s) => s.match);
  const [w, h] = match.aspectRatio === '9:16' ? [1080, 1920] : [1080, 1080];
  const previewH = (PREVIEW_WIDTH / w) * h;

  const { canvasRef } = useCanvasRenderer(match, 1);

  return (
    <div style={{ width: PREVIEW_WIDTH, height: previewH, position: 'relative', overflow: 'hidden', borderRadius: 12 }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block', borderRadius: 12 }}
      />
    </div>
  );
}
