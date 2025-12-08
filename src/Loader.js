import React, { useEffect, useState } from 'react';

export default function Loader({ loading, progress: externalProgress = null, text = 'Processing...' }) {
  // If parent doesn't pass `loading`, show by default so /Loader route works without edits
  const show = typeof loading === 'undefined' ? true : Boolean(loading);

  const [progress, setProgress] = useState(
    typeof externalProgress === 'number' ? Math.min(100, Math.max(0, Math.round(externalProgress))) : 0
  );

  useEffect(() => {
    if (typeof externalProgress === 'number') {
      setProgress(Math.min(100, Math.max(0, Math.round(externalProgress))));
      return;
    }

    // self animate when no external progress provided
    let mounted = true;
    setProgress(0);
    const id = setInterval(() => {
      if (!mounted) return;
      setProgress((p) => {
        const next = p + Math.random() * 8 + 2; // steady progress
        return next >= 95 ? 95 : Math.round(next);
      });
    }, 180);

    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [externalProgress]);

  if (!show) return null;

  const pct = Math.min(100, Math.max(0, Math.round(progress)));

  const overlayStyle = {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    background: 'rgba(0,0,0,0.25)',
    pointerEvents: 'none',
  };

  const boxStyle = {
    pointerEvents: 'auto',
    width: '92%',
    maxWidth: 640,
    background: 'rgba(255,255,255,0.98)',
    borderRadius: 10,
    padding: '12px 16px',
    boxShadow: '0 10px 30px rgba(2,6,23,0.12)',
  };

  const textStyle = {
    fontSize: '0.95rem',
    marginBottom: 8,
    color: '#111827',
    textAlign: 'left',
  };

  const barStyle = {
    height: 12,
    background: '#e6e6e6',
    borderRadius: 999,
    overflow: 'hidden',
  };

  const fillStyle = {
    height: '100%',
    width: `${pct}%`,
    background: 'linear-gradient(90deg,#4f46e5,#8b5cf6)',
    transition: 'width 180ms linear',
  };

  return (
    <div style={overlayStyle} role="status" aria-live="polite" aria-label={text}>
      <div style={boxStyle}>
        <div style={textStyle}>{text} {pct}%</div>
        <div style={barStyle} aria-hidden>
          <div style={fillStyle} />
        </div>
      </div>
    </div>
  );
}