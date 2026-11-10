import { useEffect, useState } from 'react';
import { getHistory } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { LEVEL_COLORS } from '../components/StressGauge.jsx';

const FILTERS = [
  { label: '7 days', days: 7 },
  { label: '30 days', days: 30 },
  { label: 'All', days: null },
];

export default function History() {
  const { user } = useAuth();
  const [history, setHistory] = useState(null);
  const [filter, setFilter] = useState(FILTERS[2]);

  useEffect(() => {
    getHistory(user.id).then(setHistory);
  }, [user.id]);

  if (!history) return <div className="card center">Loading...</div>;

  const cutoff = filter.days ? Date.now() - filter.days * 24 * 60 * 60 * 1000 : 0;
  const rows = history.filter((h) => new Date(h.date).getTime() >= cutoff).reverse();

  return (
    <div className="stack">
      <h1 className="greeting">History</h1>
      <div className="row">
        {FILTERS.map((f) => (
          <button key={f.label} className={`chip ${filter.label === f.label ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f.label}
          </button>
        ))}
      </div>
      <section className="card">
        {rows.length === 0 ? (
          <p className="muted">No check-ins in this period.</p>
        ) : (
          <table className="table">
            <thead><tr><th>Date</th><th>Score</th><th>Level</th></tr></thead>
            <tbody>
              {rows.map((h, i) => (
                <tr key={i}>
                  <td>{new Date(h.date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</td>
                  <td>{h.score}</td>
                  <td><span className="badge" style={{ background: LEVEL_COLORS[h.level] }}>{h.level}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
