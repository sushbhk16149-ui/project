import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import TrendChart from '../components/TrendChart.jsx';
import { getHistory } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const PERIODS = [
  { label: '7 days', days: 7 },
  { label: '30 days', days: 30 },
  { label: 'All time', days: null },
];

export default function Trends() {
  const { user } = useAuth();
  const [history, setHistory] = useState(null);
  const [period, setPeriod] = useState(PERIODS[1]);

  useEffect(() => {
    getHistory(user.id).then(setHistory);
  }, [user.id]);

  const entries = useMemo(() => {
    if (!history) return [];
    const cutoff = period.days ? Date.now() - period.days * 24 * 60 * 60 * 1000 : 0;
    return history
      .filter((entry) => new Date(entry.date).getTime() >= cutoff)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [history, period]);

  if (!history) return <div className="card center">Loading your trends...</div>;

  const average = entries.length
    ? Math.round(entries.reduce((total, entry) => total + entry.score, 0) / entries.length)
    : null;
  const lowest = entries.length ? Math.min(...entries.map((entry) => entry.score)) : null;
  const latest = entries[entries.length - 1];
  const previous = entries[entries.length - 2];
  const change = latest && previous ? latest.score - previous.score : null;

  return (
    <div className="stack">
      <section className="page-heading">
        <div>
          <span className="eyebrow">YOUR WELLBEING</span>
          <h1 className="greeting">Daily trends</h1>
          <p className="muted">Notice your patterns over time, one check-in at a time.</p>
        </div>
        <Link className="btn" to="/check-in">Take a stress check</Link>
      </section>

      <div className="row period-picker" aria-label="Choose a date range">
        {PERIODS.map((option) => (
          <button
            key={option.label}
            className={`chip ${period.label === option.label ? 'active' : ''}`}
            onClick={() => setPeriod(option)}
            aria-pressed={period.label === option.label}
          >
            {option.label}
          </button>
        ))}
      </div>

      {entries.length === 0 ? (
        <section className="card center empty-state">
          <span className="empty-icon" aria-hidden="true">↗</span>
          <h2>Your trend starts here</h2>
          <p className="muted">There are no check-ins in this period yet. A quick check-in can help you begin noticing what affects your stress.</p>
          <Link className="btn" to="/check-in">Start a check-in</Link>
        </section>
      ) : (
        <>
          <section className="trend-stats">
            <article className="card trend-stat">
              <span className="muted small">CHECK-INS</span>
              <strong>{entries.length}</strong>
              <span className="muted small">in this period</span>
            </article>
            <article className="card trend-stat">
              <span className="muted small">AVERAGE SCORE</span>
              <strong>{average}</strong>
              <span className="muted small">out of 100</span>
            </article>
            <article className="card trend-stat">
              <span className="muted small">LOWEST SCORE</span>
              <strong>{lowest}</strong>
              <span className="muted small">your calmest recorded check-in</span>
            </article>
          </section>

          <section className="card trend-card">
            <div className="section-heading">
              <div>
                <h2>Stress score over time</h2>
                <p className="muted small">Scores are a reflection tool, not a diagnosis.</p>
              </div>
              <span className="trend-period-label">{period.label}</span>
            </div>
            <TrendChart history={entries} />
          </section>

          <section className="reflection-card">
            <span className="feature-icon" aria-hidden="true">✦</span>
            <div>
              <strong>{change === null
                ? 'Keep checking in with yourself'
                : change < 0
                  ? 'Your latest score is lower than your previous one'
                  : change > 0
                    ? 'Your latest score is higher than your previous one'
                    : 'Your latest score is similar to your previous one'}
              </strong>
              <p className="muted small">
                {change === null
                  ? 'Regular check-ins can help you notice patterns. Be kind to yourself as you do.'
                  : 'A score is just one moment in time. Consider what was happening around each check-in.'}
              </p>
            </div>
            <Link className="btn-link" to="/companion">Reflect with your companion →</Link>
          </section>
        </>
      )}
    </div>
  );
}
