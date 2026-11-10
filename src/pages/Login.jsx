import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mood, setMood] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { user } = await login(form);
    if (mood) localStorage.setItem(`stressiq_mood_${user.id}`, JSON.stringify({ mood, date: new Date().toLocaleDateString() }));
    signIn(user);
    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="login">
      <section className="login-hero">
        <span className="welcome-pill"><span className="status-dot" /> YOUR PERSONAL WELLNESS SPACE</span>
        <div className="wellness-orbit" aria-hidden="true">
          <span className="orbit-ring orbit-ring-one" />
          <span className="orbit-ring orbit-ring-two" />
          <span className="orbit-star">✦</span>
          <span className="orbit-spark orbit-spark-one">✧</span>
          <span className="orbit-spark orbit-spark-two">✦</span>
          <span className="orbit-dot" />
        </div>
        <h1>Stress<em>IQ</em></h1>
        <h2>A little space for you.<br />A better understanding of you.</h2>
        <p>Check in with yourself, understand your stress, and discover small ways to feel better every day.</p>
        <div className="login-breath-card">
          <span className="login-heart" aria-hidden="true">♡</span>
          <span><strong>Take a breath. You're here.</strong><small>There's no perfect way to feel.</small></span>
        </div>
        <span className="login-footnote">MADE FOR YOUR EVERYDAY WELLBEING <span aria-hidden="true">✦</span></span>
      </section>
      <section className="login-panel">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-card-brand"><span>Stress<em>IQ</em></span><span className="eyebrow">✧ YOUR SAFE SPACE</span></div>
          <div className="login-title">
            <span className="eyebrow">LET'S BEGIN WITH YOU</span>
            <h2>Hello, you.</h2>
            <p>Your wellbeing journey starts with one small step.</p>
          </div>
          <label>
            <span>What should we call you?</span>
            <span className="input-wrap"><span aria-hidden="true">♡</span><input name="name" value={form.name} onChange={update} placeholder="Your name" autoComplete="name" required /></span>
          </label>
          <label>
            <span>Email address</span>
            <span className="input-wrap"><span aria-hidden="true">✉</span><input name="email" type="email" value={form.email} onChange={update} placeholder="you@example.com" autoComplete="email" required /></span>
          </label>
          <label>
            <span className="password-label"><span>Create your password</span><small>4+ characters</small></span>
            <span className="input-wrap"><span aria-hidden="true">⌑</span><input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={update} placeholder="Enter password" autoComplete="new-password" required minLength={4} /><button className="show-password" type="button" onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? 'Hide' : 'Show'}</button></span>
          </label>
          <fieldset className="mood-fieldset">
            <legend><span>How are you feeling today?</span><small>OPTIONAL</small></legend>
            <div className="mood-options">
              {[
                { label: 'Good', emoji: '😊' },
                { label: 'Calm', emoji: '😌' },
                { label: 'Okay', emoji: '😶' },
                { label: 'Stressed', emoji: '😰' },
              ].map((option) => (
                <button key={option.label} type="button" className={`mood-option${mood === option.label ? ' selected' : ''}`} onClick={() => setMood(option.label)} aria-pressed={mood === option.label}>
                  <span>{option.emoji}</span><small>{option.label}</small>
                </button>
              ))}
            </div>
          </fieldset>
          <button className="btn login-submit" disabled={loading}>{loading ? 'Making your space...' : <><span>Enter my space</span><span className="submit-arrow">→</span></>}</button>
          <p className="login-privacy">Your personal wellness space. Your pace, your journey.</p>
        </form>
      </section>
    </div>
  );
}
