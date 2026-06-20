import { useCallback, useEffect, useRef } from 'react';

/**
 * Lightweight confetti burst — pure canvas, zero deps.
 * Call `triggerConfetti()` to fire a 1-second burst of coloured particles.
 *
 * Usage:
 *   const fire = useRef(null);
 *   <ConfettiCanvas ref={fire} />
 *   <button onClick={() => fire.current?.()}>🎉</button>
 */

const COLORS = ['#2fa039', '#58bd61', '#f97a07', '#ffa31f', '#1c6623', '#8fd993', '#ffbf4a'];

function draw(ctx, w, h, particles) {
  ctx.clearRect(0, 0, w, h);
  for (const p of particles) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  }
}

export default function ConfettiCanvas() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);

  const trigger = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = (canvas.width = window.innerWidth);
    const h = (canvas.height = window.innerHeight);
    const cx = w / 2;
    const cy = h / 3;

    // Create particles
    const particles = Array.from({ length: 80 }, () => ({
      x: cx + (Math.random() - 0.5) * 200,
      y: cy,
      vx: (Math.random() - 0.5) * 14,
      vy: -Math.random() * 12 - 4,
      w: 6 + Math.random() * 6,
      h: 4 + Math.random() * 4,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.3,
      alpha: 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
    particlesRef.current = particles;

    let frame = 0;
    const maxFrames = 90;

    function animate() {
      frame++;
      for (const p of particles) {
        p.x += p.vx;
        p.vy += 0.25; // gravity
        p.y += p.vy;
        p.rot += p.rotV;
        if (frame > maxFrames * 0.6) {
          p.alpha = Math.max(0, p.alpha - 0.04);
        }
      }
      draw(ctx, w, h, particles);
      if (frame < maxFrames) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, w, h);
      }
    }
    if (animRef.current) cancelAnimationFrame(animRef.current);
    animate();
  }, []);

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  // Expose trigger via ref
  // We use a ref callback pattern so the parent can call trigger()
  // Actually, let's attach to the window for simplicity in a single-page app.
  useEffect(() => {
    window.__verdantConfetti = trigger;
    return () => { delete window.__verdantConfetti; };
  }, [trigger]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[200]"
      style={{ width: '100%', height: '100%' }}
    />
  );
}

/** Helper to fire confetti from any component. */
export function triggerConfetti() {
  if (typeof window !== 'undefined' && window.__verdantConfetti) {
    window.__verdantConfetti();
  }
}
