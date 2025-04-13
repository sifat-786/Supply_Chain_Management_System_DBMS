import React from 'react';
import { IconButton, Tooltip, Box } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';

const ThemeToggle = () => {
  const { mode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Tooltip title={mode === 'dark' ? 'Light Mode' : 'Dark Mode'}>
        <IconButton onClick={toggleTheme} color="inherit">
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Tooltip>
      <Tooltip title="Go to Dashboard">
        <IconButton onClick={() => navigate('/dashboard')} color="inherit">
          <DashboardIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ThemeToggle; 