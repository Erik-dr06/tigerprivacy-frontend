import React, { useMemo, useEffect, useState } from "react";

const getScoreColor = (score) => {
  if (score >= 80) return { color: "#10b981", label: "Safe", emoji: "🟢" };
  if (score >= 50) return { color: "#f59e0b", label: "Moderate Risk", emoji: "🟡" };
  return { color: "#ef4444", label: "High Risk", emoji: "🔴" };
};

export default function PrivacyScore({ score = 0 }) {
  const bounded = Math.max(0, Math.min(100, Math.round(score)));
  const { color, label, emoji } = useMemo(() => getScoreColor(bounded), [bounded]);
  const [displayNumber, setDisplayNumber] = useState(0);

  useEffect(() => {
    let rafId;
    const start = 0;
    const end = bounded;
    const duration = 900;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (end - start) * easeOutCubic);
      setDisplayNumber(current);
      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [bounded]);

  return (
    <div className="privacy-score-card glass rounded-2xl shadow-card">
      <div className="privacy-score-header">Privacy Score</div>

      <div className="privacy-score-visual">
        <div className="privacy-score-ring">
          <svg viewBox="0 0 120 120" className="privacy-score-svg">
            <circle
              className="ring-bg"
              cx="60"
              cy="60"
              r="52"
              stroke="#e5e7eb"
              strokeWidth="12"
              fill="none"
            />
            <circle
              className="ring-fg"
              cx="60"
              cy="60"
              r="52"
              stroke={color}
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              style={{
                strokeDasharray: 2 * Math.PI * 52,
                strokeDashoffset: ((100 - bounded) / 100) * (2 * Math.PI * 52),
                transition: "stroke-dashoffset 900ms ease",
              }}
              transform="rotate(-90 60 60)"
            />
            <text x="60" y="64" textAnchor="middle" className="privacy-score-text" fill="#0f172a">
              <tspan>{displayNumber}</tspan>
              <tspan className="privacy-score-denom"> / 100</tspan>
            </text>
          </svg>
        </div>
      </div>

      <div className="privacy-score-caption" style={{ color }}>
        {emoji} {label}
      </div>
      <div className="privacy-score-note">
        How secure your Instagram data appears based on detected exposure.
      </div>
    </div>
  );
}


