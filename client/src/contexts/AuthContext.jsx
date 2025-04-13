import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../utils/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  console.log('AuthProvider rendering');
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      console.log('Initializing auth');
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          console.log('User authenticated:', parsedUser);
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
        }
      } else {
        console.log('No auth data found');
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const register = async (userData) => {
    try {
      console.log('Registering user:', userData);
      const response = await axios.post('/auth/register', {
        Name: userData.name,
        Email: userData.email,
        Password: userData.password,
        Role: userData.role
      });
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify(user));
      setUser(user);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  const login = async (email, password, role) => {
    try {
      console.log('Logging in user:', { email, role });
      const response = await axios.post('/auth/login', {
        Email: email,
        Password: password,
        Role: role
      });
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify(user));
      setUser(user);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setUser(null);
  };

  if (loading) {
    return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 