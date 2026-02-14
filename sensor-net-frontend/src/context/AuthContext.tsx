import React from 'react';

interface User {
  username: string;
  role: 'ADMIN' | 'USER' | 'VIEWER';
}

interface AuthContextType {
  user: User | null;
  login: (username: string, role: 'ADMIN' | 'USER' | 'VIEWER') => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    // Check for stored user in production
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Demo default
      setUser({ username: 'Admin', role: 'ADMIN' });
    }
  }, []);

  const login = (username: string, role: 'ADMIN' | 'USER' | 'VIEWER') => {
    const newUser: User = { username, role };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
