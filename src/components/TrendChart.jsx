import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts';

export default function TrendChart({ history }) {
  const data = history.map((h) => ({
    date: new Date(h.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
    score: h.score,
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e4ebe8" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
        <Tooltip />
        <ReferenceLine y={34} stroke="#3f9b6e" strokeDasharray="4 4" />
        <ReferenceLine y={67} stroke="#d4574e" strokeDasharray="4 4" />
        <Line type="monotone" dataKey="score" stroke="#1f5f6b" strokeWidth={3} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
