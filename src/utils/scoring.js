import { QUESTIONS } from '../data/questions.js';

export function levelFromScore(score) {
  if (score < 34) return 'Low';
  if (score < 67) return 'Moderate';
  return 'High';
}

// answers: { [questionId]: 0..4 }
// Local scoring used as a fallback when the Flask backend is not running (demo mode).
export function computeScore(answers) {
  const categoryTotals = new Map();
  let responseCount = 0;
  QUESTIONS.forEach((q) => {
    const raw = Number(answers?.[q.id]);
    if (!Number.isInteger(raw) || raw < 0 || raw > 4) return;

    const value = q.reverse ? 4 - raw : raw;
    const category = categoryTotals.get(q.category) || { total: 0, count: 0 };
    category.total += value;
    category.count += 1;
    categoryTotals.set(q.category, category);
    responseCount += 1;
  });

  const factors = [...categoryTotals].map(([category, values]) => ({
    category,
    impact: Math.round((values.total / values.count / 4) * 100),
  }));
  const score = factors.length
    ? Math.round(factors.reduce((total, factor) => total + factor.impact, 0) / factors.length)
    : 0;
  const topFactors = [...factors].sort((a, b) => b.impact - a.impact).slice(0, 3);
  return { score, level: levelFromScore(score), factors, topFactors, responseCount };
}
