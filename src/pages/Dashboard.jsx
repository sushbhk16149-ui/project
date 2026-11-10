import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TrendChart from '../components/TrendChart.jsx';
import { getHistory } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const MOODS = [
  { label: 'Calm', icon: '☼', note: 'A little calm can carry you through the day.' },
  { label: 'Focused', icon: '✦', note: 'One thing at a time is more than enough.' },
  { label: 'Tense', icon: '≈', note: 'Let your shoulders soften. You can take this slowly.' },
  { label: 'Drained', icon: '☾', note: 'Rest is productive, too. Be gentle with yourself.' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [history, setHistory] = useState(null);
  const [mood, setMood] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(`stressiq_mood_${user.id}`));
      return saved?.date === new Date().toLocaleDateString() ? saved.mood : '';
    } catch {
      return '';
    }
  });

  useEffect(() => {
    getHistory(user.id).then(setHistory);
  }, [user.id]);

  if (!history) return <div className="card center">Loading...</div>;

  const sortedHistory = [...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const latest = sortedHistory[sortedHistory.length - 1];
  const average = history.length ? Math.round(history.reduce((sum, entry) => sum + entry.score, 0) / history.length) : null;
  const lowest = history.length ? Math.min(...history.map((entry) => entry.score)) : null;
  const weekCutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const weekCount = history.filter((entry) => new Date(entry.date).getTime() >= weekCutoff).length;
  const selectedMood = MOODS.find((option) => option.label === mood);

  const chooseMood = (label) => {
    setMood(label);
    localStorage.setItem(`stressiq_mood_${user.id}`, JSON.stringify({ mood: label, date: new Date().toLocaleDateString() }));
  };

  return (
    <div className="stack">
      <section className="dashboard-hero">
        <span className="eyebrow">✦ YOUR PERSONAL WELLNESS SPACE</span>
        <h1>Good day, {user.name}.<br /><span>Let's take care of your mind today.</span></h1>
        <p>A small check-in can help you understand how you feel and find your balance.</p>
        <div className="mood-panel">
          <div className="mood-panel-heading">
            <strong>How are you feeling?</strong>
            {selectedMood && <span className="mood-saved" role="status">Saved for today ✓</span>}
          </div>
          <div className="dashboard-moods" role="group" aria-label="Choose how you feel">
            {MOODS.map((option) => (
              <button key={option.label} className={`dashboard-mood${mood === option.label ? ' selected' : ''}`} onClick={() => chooseMood(option.label)} aria-pressed={mood === option.label}>
                <span className="mood-symbol" aria-hidden="true">{option.icon}</span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
          {selectedMood && <p className="mood-note" role="status">{selectedMood.note}</p>}
        </div>
      </section>

      <section className="snapshot-heading">
        <div><span className="eyebrow">YOUR WELLNESS SNAPSHOT</span><h2>Today at a glance</h2></div>
        <span className="snapshot-pill"><span className="status-dot" /> Personal overview</span>
      </section>

      <section className="snapshot-grid">
        <article className="snapshot-card">
          <span className="snapshot-icon mint" aria-hidden="true">◉</span>
          <span className="snapshot-label">AVERAGE SCORE</span>
          <strong>{average === null ? '—' : average}</strong>
          <small>{average === null ? 'No data yet' : 'Across your check-ins'}</small>
        </article>
        <article className="snapshot-card">
          <span className="snapshot-icon lilac" aria-hidden="true">↓</span>
          <span className="snapshot-label">LOWEST SCORE</span>
          <strong>{lowest === null ? '—' : lowest}</strong>
          <small>{lowest === null ? 'Your calmest recorded check-in' : 'Your calmest recorded check-in'}</small>
        </article>
        <article className="snapshot-card">
          <span className="snapshot-icon peach" aria-hidden="true">✧</span>
          <span className="snapshot-label">CHECK-INS</span>
          <strong>{history.length}</strong>
          <small>{weekCount} in the last 7 days</small>
        </article>
      </section>

      <section className="overview-lower">
        <article className="card overview-trend">
          <div className="section-heading">
            <div><span className="eyebrow">YOUR PATTERNS</span><h2>Stress over time</h2></div>
            <Link className="text-link" to="/trends">View trends →</Link>
          </div>
          {history.length ? <TrendChart history={sortedHistory.slice(-7)} /> : (
            <div className="overview-empty">
              <p>Every check-in helps you understand your patterns.</p>
              <Link className="btn" to="/check-in">Start your first check-in →</Link>
            </div>
          )}
        </article>
        <article className="card overview-next">
          <span className="eyebrow">A GENTLE NEXT STEP</span>
          <div className="next-step-icon" aria-hidden="true">♡</div>
          <h2>Make a little space for yourself.</h2>
          <p className="muted">A quick stress check can help you notice what you need today.</p>
          <Link className="btn" to="/check-in">{latest ? 'New check-in' : 'Start a check-in'} <span aria-hidden="true">→</span></Link>
          <Link className="text-link" to="/companion">Or talk to your companion</Link>
        </article>
      </section>
    </div>
  );
}
