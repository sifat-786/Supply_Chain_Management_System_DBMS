import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Box, useTheme, Grid, Card, CardContent, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, AppBar, Toolbar, useScrollTrigger, Slide } from '@mui/material';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SecurityIcon from '@mui/icons-material/Security';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import ThemeToggle from '../components/ThemeToggle';

// Background Animation Component
const BackgroundAnimation = ({ mode }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        overflow: 'hidden',
        background: mode === 'dark' 
          ? 'linear-gradient(to bottom, #121212, #1a1a1a)'
          : 'linear-gradient(to bottom, #f5f5f5, #ffffff)',
      }}
    >
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: Math.random() * 100 + 50,
            height: Math.random() * 100 + 50,
            borderRadius: '50%',
            background: mode === 'dark'
              ? `rgba(25, 118, 210, ${Math.random() * 0.1})`
              : `rgba(25, 118, 210, ${Math.random() * 0.05})`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, Math.random() * 100 - 50],
            x: [0, Math.random() * 100 - 50],
            scale: [1, Math.random() * 0.5 + 0.5],
            opacity: [0.5, Math.random() * 0.5],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
      ))}
    </Box>
  );
};

// Star Animation Component
const StarAnimation = ({ mode }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            borderRadius: '50%',
            background: mode === 'dark'
              ? `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`
              : `rgba(25, 118, 210, ${Math.random() * 0.8 + 0.2})`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            boxShadow: mode === 'dark'
              ? `0 0 ${Math.random() * 5 + 2}px rgba(255, 255, 255, 0.8)`
              : `0 0 ${Math.random() * 5 + 2}px rgba(25, 118, 210, 0.8)`,
          }}
          animate={{
            scale: [1, Math.random() * 0.5 + 0.5, 1],
            opacity: [0.2, 1, 0.2],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </Box>
  );
};

// Hide AppBar on scroll
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Landing = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { mode } = useCustomTheme();
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    perspective: '1000px',
    overflow: 'hidden',
  };

  const heroSectionStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    position: 'relative',
    zIndex: 1,
  };

  const titleContainerStyle = {
    position: 'relative',
    width: '100%',
    maxWidth: '800px',
    marginBottom: '2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const titleBackgroundStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    height: 'auto',
    opacity: 0.15,
    filter: mode === 'dark' ? 'invert(1) brightness(0.8)' : 'none',
    zIndex: -1,
  };

  const illustrationStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: `translate(-50%, -50%) rotate(${scrollY * 0.02}deg)`,
    width: '100%',
    maxWidth: '800px',
    height: 'auto',
    opacity: 0.8,
    zIndex: 0,
    transition: 'transform 0.3s ease',
  };

  const buttonStyle = {
    margin: '1rem',
    padding: '1rem 2rem',
    borderRadius: '30px',
    textTransform: 'none',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 8px rgba(0, 0, 0, 0.2)',
    },
  };

  const features = [
    {
      icon: <InventoryIcon sx={{ fontSize: 40 }} />,
      title: 'Inventory Management',
      description: 'Track and manage your inventory in real-time with advanced analytics.',
      details: 'Our inventory management system provides real-time tracking, automated reordering, and predictive analytics to optimize your stock levels.',
      color: '#4CAF50', // Green
    },
    {
      icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
      title: 'Logistics Tracking',
      description: 'Monitor shipments and deliveries with detailed tracking information.',
      details: 'Track your shipments in real-time with GPS integration, automated status updates, and comprehensive delivery analytics.',
      color: '#2196F3', // Blue
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
      title: 'Analytics Dashboard',
      description: 'Get insights into your supply chain performance with detailed reports.',
      details: 'Access comprehensive analytics with customizable dashboards, predictive insights, and detailed performance metrics.',
      color: '#9C27B0', // Purple
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Secure Platform',
      description: 'Enterprise-grade security to protect your supply chain data.',
      details: 'Our platform uses advanced encryption, multi-factor authentication, and regular security audits to protect your data.',
      color: '#F44336', // Red
    },
  ];

  const handleFeatureClick = (feature) => {
    setSelectedFeature(feature);
  };

  const handleCloseDialog = () => {
    setSelectedFeature(null);
  };

  return (
    <Box sx={containerStyle}>
      <BackgroundAnimation mode={mode} />
      
      <HideOnScroll>
        <AppBar position="fixed" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(10px)' }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              SupplyChain Pro
            </Typography>
            <ThemeToggle />
          </Toolbar>
        </AppBar>
      </HideOnScroll>

      {/* Hero Section */}
      <Box sx={{ ...heroSectionStyle, pt: 8 }}>
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={titleContainerStyle}
        >
          <motion.img
            src="/images/supply-chain-illustration.svg"
            alt="Supply Chain Background"
            style={titleBackgroundStyle}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? 5 : scrollY * 0.02,
            }}
            transition={{ duration: 0.5 }}
          />
          <StarAnimation mode={mode} />
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '1rem',
              background: mode === 'dark' 
                ? 'linear-gradient(45deg, #fff, #1976d2)'
                : 'linear-gradient(45deg, #1976d2, #64b5f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              position: 'relative',
              zIndex: 2,
            }}
          >
            Supply Chain Management
          </Typography>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Typography
            variant="h5"
            sx={{
              textAlign: 'center',
              marginBottom: '2rem',
              color: mode === 'dark' ? '#fff' : '#666',
              maxWidth: '800px',
            }}
          >
            Streamline your supply chain with our advanced management system
          </Typography>
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/login')}
              sx={{
                ...buttonStyle,
                background: mode === 'dark' 
                  ? 'linear-gradient(45deg, #1976d2, #64b5f6)'
                  : 'linear-gradient(45deg, #1976d2, #42a5f5)',
                '&:hover': {
                  background: mode === 'dark'
                    ? 'linear-gradient(45deg, #1565c0, #42a5f5)'
                    : 'linear-gradient(45deg, #1565c0, #2196f3)',
                },
              }}
              endIcon={<ArrowForwardIcon />}
            >
              Login
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/register')}
              sx={{
                ...buttonStyle,
                borderWidth: '2px',
                '&:hover': {
                  borderWidth: '2px',
                  background: mode === 'dark' 
                    ? 'rgba(25, 118, 210, 0.1)'
                    : 'rgba(25, 118, 210, 0.05)',
                },
              }}
              endIcon={<ArrowForwardIcon />}
            >
              Register
            </Button>
          </motion.div>
        </motion.div>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8, position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h2"
            sx={{
              textAlign: 'center',
              mb: 6,
              background: mode === 'dark' 
                ? 'linear-gradient(45deg, #fff, #1976d2)'
                : 'linear-gradient(45deg, #1976d2, #64b5f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
            }}
          >
            Key Features
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card
                    onClick={() => handleFeatureClick(feature)}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      p: 3,
                      background: mode === 'dark' 
                        ? 'linear-gradient(145deg, #1e1e1e, #2d2d2d)'
                        : 'linear-gradient(145deg, #ffffff, #f5f5f5)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      boxShadow: mode === 'dark'
                        ? '0 4px 6px rgba(0, 0, 0, 0.3)'
                        : '0 4px 6px rgba(0, 0, 0, 0.1)',
                      '&:hover': {
                        transform: 'translateY(-10px)',
                        boxShadow: mode === 'dark'
                          ? '0 8px 12px rgba(0, 0, 0, 0.4)'
                          : '0 8px 12px rgba(0, 0, 0, 0.15)',
                        background: mode === 'dark'
                          ? `linear-gradient(145deg, ${feature.color}20, #2d2d2d)`
                          : `linear-gradient(145deg, ${feature.color}10, #f5f5f5)`,
                        '& .feature-icon': {
                          color: feature.color,
                          transform: 'scale(1.1)',
                        },
                        '& .feature-title': {
                          color: feature.color,
                        },
                      },
                    }}
                  >
                    <IconButton
                      className="feature-icon"
                      sx={{
                        mb: 2,
                        backgroundColor: mode === 'dark' 
                          ? 'rgba(255,255,255,0.1)'
                          : 'rgba(25,118,210,0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: mode === 'dark'
                            ? 'rgba(255,255,255,0.2)'
                            : 'rgba(25,118,210,0.2)',
                        },
                      }}
                    >
                      {feature.icon}
                    </IconButton>
                    <CardContent>
                      <Typography 
                        className="feature-title"
                        variant="h6" 
                        sx={{ 
                          mb: 1, 
                          fontWeight: 'bold',
                          transition: 'color 0.3s ease',
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          py: 8,
          background: mode === 'dark'
            ? 'linear-gradient(to bottom, #1e1e1e, #121212)'
            : 'linear-gradient(to bottom, #ffffff, #f5f5f5)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center' }}
          >
            <Typography
              variant="h2"
              sx={{
                mb: 4,
                background: mode === 'dark' 
                  ? 'linear-gradient(45deg, #fff, #1976d2)'
                  : 'linear-gradient(45deg, #1976d2, #64b5f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold',
              }}
            >
              Ready to Get Started?
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 4,
                color: mode === 'dark' ? '#fff' : '#666',
              }}
            >
              Join thousands of businesses already using our platform
            </Typography>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => navigate('/register')}
                sx={{
                  ...buttonStyle,
                  fontSize: '1.2rem',
                  padding: '1.5rem 3rem',
                  background: mode === 'dark' 
                    ? 'linear-gradient(45deg, #1976d2, #64b5f6)'
                    : 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  '&:hover': {
                    background: mode === 'dark'
                      ? 'linear-gradient(45deg, #1565c0, #42a5f5)'
                      : 'linear-gradient(45deg, #1565c0, #2196f3)',
                  },
                }}
                endIcon={<ArrowForwardIcon />}
              >
                Start Free Trial
              </Button>
            </motion.div>
          </motion.div>
        </Container>
      </Box>

      {/* Feature Details Dialog */}
      <Dialog
        open={Boolean(selectedFeature)}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: mode === 'dark'
              ? 'linear-gradient(145deg, #1e1e1e, #2d2d2d)'
              : 'linear-gradient(145deg, #ffffff, #f5f5f5)',
            borderTop: selectedFeature ? `4px solid ${selectedFeature.color}` : 'none',
          },
        }}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography 
              variant="h6" 
              sx={{ 
                color: selectedFeature?.color,
                fontWeight: 'bold',
              }}
            >
              {selectedFeature?.title}
            </Typography>
            <IconButton onClick={handleCloseDialog} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center" py={2}>
            <IconButton
              sx={{
                mb: 2,
                backgroundColor: mode === 'dark' 
                  ? 'rgba(255,255,255,0.1)'
                  : 'rgba(25,118,210,0.1)',
                color: selectedFeature?.color,
              }}
            >
              {selectedFeature?.icon}
            </IconButton>
            <Typography variant="body1" paragraph>
              {selectedFeature?.details}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseDialog} 
            sx={{ 
              color: selectedFeature?.color,
              '&:hover': {
                backgroundColor: `${selectedFeature?.color}10`,
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Landing; 