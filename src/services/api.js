
import axios from 'axios';
import { computeScore } from '../utils/scoring.js';

const api = axios.create({
  baseURL: '/api',
  timeout: 6000
});

const HISTORY_KEY = (userId) => `stressiq_history_${userId}`;

const readLocal = (userId) => {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY(userId))) || [];
  } catch {
    return [];
  }
};

// Login: use the backend first, with local demo fallback.
export async function login({ name, email, password }) {
  try {
    const { data } = await api.post('/login', {
      name,
      email,
      password
    });

    return { user: data, demo: false };
  } catch {
    return {
      user: {
        id: email.toLowerCase(),
        name: name || email.split('@')[0],
        email
      },
      demo: true
    };
  }
}

// Submit assessment and save the calculated score in MongoDB.
export async function submitAnswers(userId, answers) {
  const analysis = computeScore(answers);

  try {
    const { data } = await api.post('/submit', {
      userId,
      answers,
      score: analysis.score,
      level: analysis.level,
      topFactors: analysis.topFactors,
      responseCount: analysis.responseCount
    });

    return {
      result: {
        ...analysis,
        ...data,
        topFactors: analysis.topFactors,
        responseCount: analysis.responseCount
      },
      demo: false
    };
  } catch (error) {
    console.error(
      'Could not save assessment to backend:',
      error.message
    );

    // Keep the existing demo fallback.
    const result = analysis;

    const entry = {
      score: result.score,
      level: result.level,
      date: new Date().toISOString()
    };

    localStorage.setItem(
      HISTORY_KEY(userId),
      JSON.stringify([...readLocal(userId), entry])
    );

    return { result, demo: true };
  }
}

// Load assessment history from MongoDB.
export async function getHistory(userId) {
  try {
    const { data } = await api.get(
      `/history/${encodeURIComponent(userId)}`
    );

    return data;
  } catch (error) {
    console.error(
      'Could not load backend history:',
      error.message
    );

    return readLocal(userId);
  }
}
