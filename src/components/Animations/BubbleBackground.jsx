import React, { useEffect, useRef } from 'react';

/**
 * BubbleBackground — pure CSS + canvas floating bubble orbs.
 * Renders behind everything as a fixed, non-interactive layer.
 */
const BUBBLES = [
  { size: 520, x: '10%',  y: '15%',  color: 'rgba(139,92,246,0.10)', delay: '0s',   duration: '18s' },
  { size: 380, x: '75%',  y: '5%',   color: 'rgba(59,130,246,0.10)', delay: '3s',   duration: '22s' },
  { size: 280, x: '85%',  y: '55%',  color: 'rgba(168,85,247,0.09)', delay: '6s',   duration: '14s' },
  { size: 420, x: '5%',   y: '65%',  color: 'rgba(99,102,241,0.08)', delay: '1.5s', duration: '20s' },
  { size: 200, x: '50%',  y: '80%',  color: 'rgba(139,92,246,0.12)', delay: '9s',   duration: '16s' },
  { size: 310, x: '40%',  y: '20%',  color: 'rgba(236,72,153,0.06)', delay: '4s',   duration: '25s' },
  { size: 150, x: '25%',  y: '45%',  color: 'rgba(56,189,248,0.08)', delay: '7s',   duration: '12s' },
  { size: 260, x: '60%',  y: '70%',  color: 'rgba(139,92,246,0.07)', delay: '2s',   duration: '19s' },
];

export const BubbleBackground = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden -z-10"
    >
      {BUBBLES.map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: b.size,
            height: b.size,
            left: b.x,
            top: b.y,
            background: `radial-gradient(circle at 35% 35%, ${b.color}, transparent 70%)`,
            borderRadius: '50%',
            filter: 'blur(40px)',
            animation: `bubbleFloat ${b.duration} ease-in-out infinite alternate`,
            animationDelay: b.delay,
            transform: 'translate(-50%, -50%)',
            willChange: 'transform',
          }}
        />
      ))}

      {/* Inline keyframe styles */}
      <style>{`
        @keyframes bubbleFloat {
          0%   { transform: translate(-50%, -50%) scale(1)   translateY(0px); }
          33%  { transform: translate(-50%, -50%) scale(1.05) translateY(-24px); }
          66%  { transform: translate(-50%, -50%) scale(0.97) translateY(12px); }
          100% { transform: translate(-50%, -50%) scale(1.03) translateY(-8px); }
        }
      `}</style>
    </div>
  );
};

export default BubbleBackground;
