import { levelFromScore } from '../utils/scoring.js';

export const LEVEL_COLORS = { Low: '#3f9b6e', Moderate: '#e0a030', High: '#d4574e' };

// Semi-circle gauge. score: 0 to 100
export default function StressGauge({ score }) {
  const level = levelFromScore(score);
  const color = LEVEL_COLORS[level];
  const length = Math.PI * 50; // length of the half circle with radius 50
  const offset = length - (score / 100) * length;

  return (
    <div className="gauge">
      <svg viewBox="0 0 120 72" role="img" aria-label={`Stress score ${score} out of 100, ${level}`}>
        <path d="M10 62 A50 50 0 0 1 110 62" fill="none" stroke="#e4ebe8" strokeWidth="11" strokeLinecap="round" />
        <path
          d="M10 62 A50 50 0 0 1 110 62"
          fill="none"
          stroke={color}
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray={length}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
        <text x="60" y="58" textAnchor="middle" className="gauge-score">{score}</text>
      </svg>
      <span className="badge" style={{ background: color }}>{level} stress</span>
    </div>
  );
}
