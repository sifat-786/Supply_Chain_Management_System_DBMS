import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider as CustomThemeProvider, useTheme } from './contexts/ThemeContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';

// Create a wrapper component to access the theme
function AppContent() {
  const { theme } = useTheme();
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/*" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CustomThemeProvider>
          <AppContent />
        </CustomThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
