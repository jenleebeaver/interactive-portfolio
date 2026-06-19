import { useEffect, useRef } from 'react';

export function PaperTexture() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 512;
    const H = 512;
    canvas.width = W;
    canvas.height = H;

    const imageData = ctx.createImageData(W, H);
    const data = imageData.data;

    // Generate paper grain — warm sepia tones, not neutral gray
    for (let i = 0; i < data.length; i += 4) {
      // Multi-octave noise for paper texture
      const grain = Math.random();
      const coarse = Math.random() > 0.997 ? 0.6 : 0; // rare dark specks like ink spots
      const value = grain * 0.85 + coarse;

      // Warm sepia tint: push red/green up, blue down (aged paper coloring)
      data[i]     = Math.min(255, value * 210 + 30); // R — warm
      data[i + 1] = Math.min(255, value * 170 + 15); // G — mid-warm
      data[i + 2] = Math.min(255, value * 100 + 10); // B — muted
      data[i + 3] = Math.round(value * 18);           // A — very subtle
    }

    // Add faint horizontal striations (newsprint fiber direction)
    for (let y = 0; y < H; y++) {
      if (Math.random() > 0.92) {
        const lineAlpha = Math.random() * 8;
        for (let x = 0; x < W; x++) {
          const idx = (y * W + x) * 4;
          data[idx + 3] = Math.min(255, data[idx + 3] + lineAlpha);
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }, []);

  return (
    <>
      {/* Tiling grain canvas */}
      <div
        className="fixed inset-0 pointer-events-none z-[6]"
        style={{
          backgroundImage: `url("data:image/svg+xml,<svg/>")`,
        }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{
            imageRendering: 'auto',
            opacity: 1,
            mixBlendMode: 'screen',
            backgroundRepeat: 'repeat',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>

      {/* Warm sepia wash — 1940s aged paper cast */}
      <div
        className="fixed inset-0 pointer-events-none z-[5]"
        style={{
          background: 'rgba(148, 100, 38, 0.045)',
          mixBlendMode: 'screen',
        }}
      />

      {/* Secondary warm overlay — amber highlight */}
      <div
        className="fixed inset-0 pointer-events-none z-[5]"
        style={{
          background: 'rgba(200, 140, 40, 0.022)',
        }}
      />
    </>
  );
}
