import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Questionnaire from './pages/Questionnaire.jsx';
import Result from './pages/Result.jsx';
import History from './pages/History.jsx';
import Trends from './pages/Trends.jsx';
import Companion from './pages/Companion.jsx';
import { useAuth } from './context/AuthContext.jsx';

function Protected({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" replace />;
}

export default function App() {
  const { user } = useAuth();
  const routes = (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
      <Route path="/check-in" element={<Protected><Questionnaire /></Protected>} />
      <Route path="/result" element={<Protected><Result /></Protected>} />
      <Route path="/history" element={<Protected><History /></Protected>} />
      <Route path="/trends" element={<Protected><Trends /></Protected>} />
      <Route path="/companion" element={<Protected><Companion /></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );

  if (!user) return <main className="login-page">{routes}</main>;

  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">{routes}</main>
    </div>
  );
}
