import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QUESTIONS, OPTIONS } from '../data/questions.js';
import { submitAnswers } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Questionnaire() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const q = QUESTIONS[current];
  const progress = Math.round(((current + 1) / QUESTIONS.length) * 100);

  const choose = async (value) => {
    const updated = { ...answers, [q.id]: value };
    setAnswers(updated);

    if (current < QUESTIONS.length - 1) {
      setCurrent(current + 1);
      return;
    }
    setSaving(true);
    const { result, demo } = await submitAnswers(user.id, updated);
    navigate('/result', { state: { result, demo } });
  };

  if (saving) return <div className="card center">Calculating your stress score...</div>;

  return (
    <div className="quiz">
      <div className="quiz-heading">
        <div>
          <span className="eyebrow">STRESS CHECK</span>
          <h1 className="question">Check in with yourself</h1>
        </div>
        <span className="question-count">{current + 1} <span className="muted">/ {QUESTIONS.length}</span></span>
      </div>
      <div
        className="progress"
        role="progressbar"
        aria-label="Stress check progress"
        aria-valuemin={0}
        aria-valuemax={QUESTIONS.length}
        aria-valuenow={current + 1}
      ><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
      <p className="muted question-category">A few moments to reflect · {q.category}</p>
      <h2 className="question-text" key={q.id}>{q.text}</h2>
      <div className="options" role="group" aria-label="Choose how often">
        {OPTIONS.map((label, value) => (
          <button
            key={label}
            className={`option ${answers[q.id] === value ? 'selected' : ''}`}
            onClick={() => choose(value)}
            aria-pressed={answers[q.id] === value}
            disabled={saving}
          >
            <span className="option-dot" aria-hidden="true">{answers[q.id] === value ? '✓' : ''}</span>
            <span>{label}</span>
            <span className="option-arrow" aria-hidden="true">→</span>
          </button>
        ))}
      </div>
      {current > 0 && (
        <button className="btn-link previous-question" onClick={() => setCurrent(current - 1)}>&larr; Previous question</button>
      )}
      <p className="muted small quiz-note">There are no right or wrong answers. Your responses are for self-reflection.</p>
    </div>
  );
}
