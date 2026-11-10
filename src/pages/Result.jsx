import { Link, Navigate, useLocation } from 'react-router-dom';
import StressGauge from '../components/StressGauge.jsx';
import { RECOMMENDATIONS } from '../data/recommendations.js';

export default function Result() {
  const { state } = useLocation();
  if (!state?.result) return <Navigate to="/dashboard" replace />;

  const { result, demo } = state;
  const tips = RECOMMENDATIONS[result.level] || [];
  const strongestFactor = result.topFactors?.[0];

  return (
    <div className="stack">
      <section className="card center">
        <h2>Your stress score</h2>
        <StressGauge score={result.score} />
        <p className="muted">
          Your answers indicate a {result.level?.toLowerCase() || 'reported'} stress level
          {result.responseCount ? `, based on ${result.responseCount} responses` : ''}.
          {strongestFactor && ` ${strongestFactor.category} was your strongest stress signal at ${strongestFactor.impact}%.`}
        </p>
      </section>

      <section className="card">
        <h3>What influenced your score most</h3>
        {result.topFactors?.map((f) => (
          <div className="factor" key={f.category}>
            <span>{f.category}</span>
            <div className="bar"><div className="bar-fill" style={{ width: `${f.impact}%` }} /></div>
            <strong>{f.impact}%</strong>
          </div>
        ))}
      </section>

      <section className="card">
        <h3>Suggestions for you</h3>
        <ul className="tips">{tips.map((t) => <li key={t}>{t}</li>)}</ul>
      </section>

      <p className="muted small">
        StressIQ is a self-awareness tool, not a medical diagnosis. If you are struggling, please talk to a professional.
        {demo && ' (Demo mode: the backend was not reachable, so the score was calculated in your browser.)'}
      </p>
      <div className="row">
        <Link className="btn" to="/dashboard">Go to dashboard</Link>
        <Link className="btn btn-ghost" to="/history">View history</Link>
      </div>
    </div>
  );
}
