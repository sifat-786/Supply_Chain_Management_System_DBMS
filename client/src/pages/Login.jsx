import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import { 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Typography,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Alert,
  Paper,
  Divider,
  CircularProgress,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'Consumer',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { success, error } = await login(formData.email, formData.password, formData.role);
      if (success) {
        navigate('/dashboard');
      } else {
        setError(error || 'Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        px: 2,
        background: theme.palette.mode === 'light' 
          ? 'linear-gradient(to bottom, #f0f7ff, #ffffff)'
          : 'linear-gradient(to bottom, #1a237e, #121212)',
      }}
    >
      <Box 
        sx={{ 
          position: 'absolute', 
          top: 20, 
          right: 20,
          zIndex: 10,
        }}
      >
        <ThemeToggle />
      </Box>
      
      <Paper 
        elevation={3}
        sx={{ 
          maxWidth: 450,
          width: '100%',
          p: 4,
          borderRadius: 2,
          backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : '#1e1e1e',
          boxShadow: theme.palette.mode === 'light' 
            ? '0 10px 25px rgba(0, 0, 0, 0.1)'
            : '0 10px 25px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          align="center" 
          gutterBottom
          sx={{ 
            color: theme.palette.mode === 'light' ? '#1a237e' : '#ffffff',
            fontWeight: 700,
          }}
        >
          Sign In
        </Typography>
        
        <Typography 
          variant="body1" 
          align="center" 
          sx={{ 
            mb: 3,
            color: theme.palette.mode === 'light' ? '#666666' : '#b0b0b0',
          }}
        >
          Welcome to Supply Chain Management
        </Typography>

        {location.state?.message && (
          <Alert 
            severity="success" 
            sx={{ mb: 3 }}
          >
            {location.state.message}
          </Alert>
        )}

        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            sx={{ mb: 2 }}
          />
          
          <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              name="role"
              value={formData.role}
              onChange={handleChange}
              label="Role"
            >
              <MenuItem value="Consumer">Consumer</MenuItem>
              <MenuItem value="Manufacturer">Manufacturer</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </Select>
          </FormControl>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox 
                  sx={{ 
                    color: theme.palette.mode === 'light' ? '#1976d2' : '#90caf9',
                    '&.Mui-checked': {
                      color: theme.palette.mode === 'light' ? '#1976d2' : '#90caf9',
                    },
                  }}
                />
              }
              label="Remember me"
            />
            <Typography 
              variant="body2" 
              component={Link} 
              to="/forgot-password"
              sx={{ 
                color: '#1976d2',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Forgot password?
            </Typography>
          </Box>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ 
              py: 1.5,
              mb: 2,
              backgroundColor: theme.palette.mode === 'light' ? '#1a237e' : '#90caf9',
              '&:hover': {
                backgroundColor: theme.palette.mode === 'light' ? '#0d47a1' : '#42a5f5',
              },
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign in'}
          </Button>
          
          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" sx={{ color: theme.palette.mode === 'light' ? '#666666' : '#b0b0b0' }}>
              OR
            </Typography>
          </Divider>
          
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Link component={RouterLink} to="/register" variant="body2">
              Don't have an account? Sign up
            </Link>
          </Box>
        </form>
      </Paper>
    </Box>
  );
} 