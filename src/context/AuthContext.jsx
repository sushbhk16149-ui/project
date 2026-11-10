import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('stressiq_user'));
    } catch {
      return null;
    }
  });

  const signIn = (u) => {
    localStorage.setItem('stressiq_user', JSON.stringify(u));
    setUser(u);
  };
  const signOut = () => {
    localStorage.removeItem('stressiq_user');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, signIn, signOut }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
