import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  Tooltip,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  LocalShipping as LocalShippingIcon,
  Logout as LogoutIcon,
  AdminPanelSettings as AdminIcon,
  Factory as FactoryIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';

const drawerWidth = 240;

function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  console.log('Layout - Rendering with user:', user);

  // Default menu items for all users
  const defaultMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  ];

  // Role-specific menu items
  const roleSpecificMenuItems = {
    Admin: [
      { text: 'Suppliers', icon: <PeopleIcon />, path: '/suppliers' },
      { text: 'Products', icon: <InventoryIcon />, path: '/products' },
      { text: 'Orders', icon: <ShoppingCartIcon />, path: '/orders' },
      { text: 'Shipments', icon: <LocalShippingIcon />, path: '/shipments' },
      { text: 'Admin', icon: <AdminIcon />, path: '/admin' },
    ],
    Manufacturer: [
      { text: 'Products', icon: <InventoryIcon />, path: '/products' },
      { text: 'Orders', icon: <ShoppingCartIcon />, path: '/orders' },
      { text: 'Shipments', icon: <LocalShippingIcon />, path: '/shipments' },
    ],
    Consumer: [
      { text: 'Products', icon: <InventoryIcon />, path: '/products' },
      { text: 'Orders', icon: <ShoppingCartIcon />, path: '/orders' },
    ],
  };

  // Combine default and role-specific menu items
  const menuItems = [
    ...defaultMenuItems,
    ...(user?.Role ? roleSpecificMenuItems[user.Role] || [] : []),
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    console.log('Layout - Logging out');
    logout();
    navigate('/login');
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const getRoleIcon = () => {
    switch (user?.Role) {
      case 'Admin':
        return <AdminIcon />;
      case 'Manufacturer':
        return <FactoryIcon />;
      case 'Consumer':
        return <PersonIcon />;
      default:
        return <PersonIcon />;
    }
  };

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <Divider sx={{ my: 1 }} />
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Supply Chain Management
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ThemeToggle />
            <Tooltip title="Account settings">
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  {getRoleIcon()}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
            >
              <MenuItem disabled>
                <Typography variant="body2">
                  {user?.name || 'User'} ({user?.Role || 'Guest'})
                </Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/settings'); }}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </MenuItem>
              <MenuItem onClick={() => { handleProfileMenuClose(); handleLogout(); }}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout; 