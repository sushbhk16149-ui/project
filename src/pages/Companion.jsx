import { useEffect, useRef, useState } from 'react';

const PROMPTS = [
  "I've been feeling overwhelmed",
  'Help me take a mindful pause',
  'I want to reflect on my day',
];

const INITIAL_MESSAGE = {
  role: 'assistant',
  text: "Hi, I'm here with you. What has been on your mind today?",
};

function replyTo(message) {
  const text = message.toLowerCase();
  if (/sleep|tired|exhaust/.test(text)) {
    return "It sounds like rest has been hard to come by. If it feels right, what is one small thing that could make tonight a little more restful?";
  }
  if (/work|study|deadline|busy|overwhelm/.test(text)) {
    return "That can feel like a lot to carry. Try choosing just one small thing that matters most right now. What feels manageable to start with?";
  }
  if (/anxious|worr|panic|nervous|stress/.test(text)) {
    return "I'm sorry this feels heavy right now. Take a gentle breath, and notice one thing you can see around you. Would you like to talk about what's contributing to this feeling?";
  }
  if (/thank|better|good|okay|ok/.test(text)) {
    return "I'm glad you shared that with me. What do you think helped, even a little? Noticing those moments can be useful.";
  }
  if (/friend|family|alone|relationship/.test(text)) {
    return "Feeling connected can matter a lot. Is there someone you trust you could reach out to, even with a simple hello?";
  }
  return "Thank you for sharing that. What feels most important about it for you right now? We can take it one step at a time.";
}

export default function Companion() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [draft, setDraft] = useState('');
  const [breathing, setBreathing] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  const sendMessage = (value = draft) => {
    const text = value.trim();
    if (!text) return;
    setMessages((current) => [
      ...current,
      { role: 'user', text },
      { role: 'assistant', text: replyTo(text) },
    ]);
    setDraft('');
    setBreathing(false);
  };

  return (
    <div className="companion-layout">
      <section className="companion-main">
        <header className="companion-header">
          <span className="companion-avatar" aria-hidden="true">✦</span>
          <div>
            <span className="eyebrow">YOUR PERSONAL SPACE</span>
            <h1>AI companion</h1>
            <p className="muted">A guided place to pause and reflect.</p>
          </div>
          <span className="online-indicator">Here with you</span>
        </header>

        <div className="chat-messages" aria-live="polite" aria-label="Conversation">
          {messages.map((message, index) => (
            <div className={`chat-message ${message.role}`} key={`${index}-${message.role}`}>
              {message.role === 'assistant' && <span className="message-avatar" aria-hidden="true">✦</span>}
              <p>{message.text}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="prompt-list" aria-label="Suggested messages">
          {messages.length === 1 && PROMPTS.map((prompt) => (
            <button className="prompt-chip" key={prompt} onClick={() => sendMessage(prompt)}>{prompt}</button>
          ))}
        </div>

        {breathing && (
          <section className="breathing-card" aria-live="polite">
            <div className="breathing-orb" aria-hidden="true" />
            <div>
              <strong>Take a slow, easy breath</strong>
              <p className="muted small">Breathe in gently, then let your breath out slowly. Repeat for as long as feels comfortable.</p>
            </div>
            <button className="btn-link" onClick={() => setBreathing(false)}>Finish</button>
          </section>
        )}

        <form className="chat-form" onSubmit={(event) => { event.preventDefault(); sendMessage(); }}>
          <label className="sr-only" htmlFor="companion-message">Write a message</label>
          <input
            id="companion-message"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Share what's on your mind..."
            autoComplete="off"
          />
          <button type="submit" className="send-button" disabled={!draft.trim()} aria-label="Send message">↑</button>
        </form>
        <p className="companion-disclaimer">Guided, pre-written replies; not a live AI service or a substitute for professional care.</p>
      </section>

      <aside className="companion-aside">
        <span className="eyebrow">A MOMENT FOR YOU</span>
        <h2>Small steps count.</h2>
        <p className="muted">You don't have to solve everything right now. Choose a gentle place to begin.</p>
        <button className={`reset-button ${breathing ? 'active' : ''}`} onClick={() => setBreathing((value) => !value)}>
          <span aria-hidden="true">◌</span>
          <span><strong>{breathing ? 'Pause breathing exercise' : 'Try a breathing pause'}</strong><small>Slow down for a moment</small></span>
          <span aria-hidden="true">→</span>
        </button>
        <div className="companion-tip">
          <span aria-hidden="true">✧</span>
          <p>Try naming one thing you need right now, without judging yourself for needing it.</p>
        </div>
      </aside>
    </div>
  );
}
