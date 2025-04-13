import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  IconButton,
  Tooltip,
  Container,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  ShoppingCart as OrderIcon,
  People as SupplierIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  Notifications as NotificationsIcon,
  ArrowForward as ArrowForwardIcon,
  ShoppingCart as ShoppingCartIcon,
  LocalShipping as LocalShippingIcon,
  Factory as FactoryIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Logout as LogoutIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Storage as StorageIcon,
  Schema as SchemaIcon,
  Code as CodeIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

// Database Schema Information
const databaseSchema = {
  tables: [
    {
      name: 'Users',
      fields: [
        { name: 'UserID', type: 'PK', description: 'Primary Key' },
        { name: 'Name', type: 'String', description: 'User\'s full name' },
        { name: 'Email', type: 'String', description: 'User\'s email address' },
        { name: 'Password', type: 'String', description: 'Hashed password' },
        { name: 'Role', type: 'String', description: 'User role (Admin/Manufacturer/Consumer)' },
        { name: 'CreatedAt', type: 'DateTime', description: 'Account creation timestamp' },
        { name: 'UpdatedAt', type: 'DateTime', description: 'Last update timestamp' },
      ],
    },
    {
      name: 'Products',
      fields: [
        { name: 'ProductID', type: 'PK', description: 'Primary Key' },
        { name: 'Name', type: 'String', description: 'Product name' },
        { name: 'Description', type: 'Text', description: 'Product description' },
        { name: 'Price', type: 'Decimal', description: 'Product price' },
        { name: 'Stock', type: 'Integer', description: 'Available quantity' },
        { name: 'ManufacturerID', type: 'FK', description: 'Foreign Key to Users' },
        { name: 'CategoryID', type: 'FK', description: 'Foreign Key to Categories' },
        { name: 'CreatedAt', type: 'DateTime', description: 'Creation timestamp' },
        { name: 'UpdatedAt', type: 'DateTime', description: 'Last update timestamp' },
      ],
    },
    {
      name: 'Categories',
      fields: [
        { name: 'CategoryID', type: 'PK', description: 'Primary Key' },
        { name: 'Name', type: 'String', description: 'Category name' },
        { name: 'Description', type: 'Text', description: 'Category description' },
        { name: 'CreatedAt', type: 'DateTime', description: 'Creation timestamp' },
        { name: 'UpdatedAt', type: 'DateTime', description: 'Last update timestamp' },
      ],
    },
    {
      name: 'Orders',
      fields: [
        { name: 'OrderID', type: 'PK', description: 'Primary Key' },
        { name: 'UserID', type: 'FK', description: 'Foreign Key to Users' },
        { name: 'TotalAmount', type: 'Decimal', description: 'Order total amount' },
        { name: 'Status', type: 'String', description: 'Order status' },
        { name: 'PaymentMethod', type: 'String', description: 'Payment method used' },
        { name: 'CreatedAt', type: 'DateTime', description: 'Creation timestamp' },
        { name: 'UpdatedAt', type: 'DateTime', description: 'Last update timestamp' },
      ],
    },
    {
      name: 'OrderItems',
      fields: [
        { name: 'OrderItemID', type: 'PK', description: 'Primary Key' },
        { name: 'OrderID', type: 'FK', description: 'Foreign Key to Orders' },
        { name: 'ProductID', type: 'FK', description: 'Foreign Key to Products' },
        { name: 'Quantity', type: 'Integer', description: 'Quantity ordered' },
        { name: 'Price', type: 'Decimal', description: 'Price at time of order' },
        { name: 'CreatedAt', type: 'DateTime', description: 'Creation timestamp' },
        { name: 'UpdatedAt', type: 'DateTime', description: 'Last update timestamp' },
      ],
    },
    {
      name: 'Reviews',
      fields: [
        { name: 'ReviewID', type: 'PK', description: 'Primary Key' },
        { name: 'UserID', type: 'FK', description: 'Foreign Key to Users' },
        { name: 'ProductID', type: 'FK', description: 'Foreign Key to Products' },
        { name: 'Rating', type: 'Integer', description: 'Rating (1-5)' },
        { name: 'Comment', type: 'Text', description: 'Review comment' },
        { name: 'CreatedAt', type: 'DateTime', description: 'Creation timestamp' },
        { name: 'UpdatedAt', type: 'DateTime', description: 'Last update timestamp' },
      ],
    },
  ],
  relationships: [
    { from: 'User', to: 'Product', type: 'Creates', cardinality: 'OneToMany', participation: 'Partial' },
    { from: 'User', to: 'Order', type: 'Places', cardinality: 'OneToMany', participation: 'Partial' },
    { from: 'User', to: 'Review', type: 'Writes', cardinality: 'OneToMany', participation: 'Partial' },
    { from: 'Product', to: 'OrderItem', type: 'Contains', cardinality: 'OneToMany', participation: 'Partial' },
    { from: 'Order', to: 'OrderItem', type: 'Includes', cardinality: 'OneToMany', participation: 'Partial' },
    { from: 'Product', to: 'Review', type: 'Has', cardinality: 'OneToMany', participation: 'Partial' },
    { from: 'Category', to: 'Product', type: 'Categorizes', cardinality: 'OneToMany', participation: 'Partial' },
  ],
  queries: [
    { name: 'getUserDetails', description: 'Retrieve user details by ID' },
    { name: 'getSalesByCategory', description: 'Get sales data grouped by product category' },
    { name: 'updateProductStock', description: 'Update product stock when an order is placed' },
    { name: 'updateOrderTotal', description: 'Update order total when items are added or removed' },
    { name: 'getOrderHistory', description: 'Get order history for a user' },
    { name: 'processOrder', description: 'Process a new order with validation' },
  ],
  functionalRequirements: [
    'Users can only access data relevant to their role',
    'Data consistency must be maintained across all tables',
    'No data loss should occur during transactions',
    'The system should handle concurrent users efficiently',
  ],
};

// Entity Attributes Information
const entityAttributes = [
  {
    name: 'User',
    attributes: ['UserID', 'Name', 'Email', 'Password', 'Role'],
    attributeTypes: ['Simple', 'Simple', 'Simple', 'Simple', 'Simple'],
    entityType: 'Strong',
    description: 'Represents users of the system with different roles (Admin, Manufacturer, Consumer)',
  },
  {
    name: 'Product',
    attributes: ['ProductID', 'Name', 'Description', 'Price', 'Stock', 'ManufacturerID', 'CategoryID'],
    attributeTypes: ['Simple', 'Simple', 'Simple', 'Simple', 'Simple', 'Simple', 'Simple'],
    entityType: 'Strong',
    description: 'Represents products available in the system with inventory tracking',
  },
  {
    name: 'Category',
    attributes: ['CategoryID', 'Name', 'Description'],
    attributeTypes: ['Simple', 'Simple', 'Simple'],
    entityType: 'Strong',
    description: 'Represents product categories for organization and filtering',
  },
  {
    name: 'Order',
    attributes: ['OrderID', 'UserID', 'TotalAmount', 'Status', 'PaymentMethod'],
    attributeTypes: ['Simple', 'Simple', 'Simple', 'Simple', 'Simple'],
    entityType: 'Strong',
    description: 'Represents customer orders with status tracking and payment information',
  },
  {
    name: 'OrderItem',
    attributes: ['OrderItemID', 'OrderID', 'ProductID', 'Quantity', 'Price'],
    attributeTypes: ['Simple', 'Simple', 'Simple', 'Simple', 'Simple'],
    entityType: 'Weak',
    description: 'Represents individual items within an order with quantity and price information',
  },
  {
    name: 'Review',
    attributes: ['ReviewID', 'UserID', 'ProductID', 'Rating', 'Comment'],
    attributeTypes: ['Simple', 'Simple', 'Simple', 'Simple', 'Simple'],
    entityType: 'Strong',
    description: 'Represents user reviews and ratings for products',
  },
];

export default function Dashboard() {


  const getRoleSpecificMetrics = () => {
    switch (user?.Role) {
      case 'Admin':
        return [
          {
            title: 'Total Orders',
            value: metrics.totalOrders,
            icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />,
            color: '#1976d2',
            path: 'orders',
          },
          {
            title: 'Pending Orders',
            value: metrics.pendingOrders,
            icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />,
            color: '#ed6c02',
            path: 'orders?status=pending',
          },
          {
            title: 'Total Products',
            value: metrics.totalProducts,
            icon: <InventoryIcon sx={{ fontSize: 40 }} />,
            color: '#2e7d32',
            path: 'products',
          },
          {
            title: 'Low Stock Products',
            value: metrics.lowStockProducts,
            icon: <InventoryIcon sx={{ fontSize: 40 }} />,
            color: '#d32f2f',
            path: 'products?filter=low-stock',
          },
          {
            title: 'Total Suppliers',
            value: metrics.totalSuppliers,
            icon: <SupplierIcon sx={{ fontSize: 40 }} />,
            color: '#9c27b0',
            path: 'suppliers',
          },
          {
            title: 'Active Suppliers',
            value: metrics.activeSuppliers,
            icon: <SupplierIcon sx={{ fontSize: 40 }} />,
            color: '#0288d1',
            path: 'suppliers?status=active',
          },
          {
            title: 'Total Shipments',
            value: metrics.totalShipments,
            icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
            color: '#ed6c02',
            path: 'shipments',
          },
          {
            title: 'Pending Shipments',
            value: metrics.pendingShipments,
            icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
            color: '#d32f2f',
            path: 'shipments?status=pending',
          },
        ];
      case 'Manufacturer':
        return [
          {
            title: 'Total Orders',
            value: metrics.totalOrders,
            icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />,
            color: '#1976d2',
            path: 'orders',
          },
          {
            title: 'Pending Orders',
            value: metrics.pendingOrders,
            icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />,
            color: '#ed6c02',
            path: 'orders?status=pending',
          },
          {
            title: 'My Products',
            value: metrics.totalProducts,
            icon: <InventoryIcon sx={{ fontSize: 40 }} />,
            color: '#2e7d32',
            path: 'products',
          },
          {
            title: 'Low Stock Products',
            value: metrics.lowStockProducts,
            icon: <InventoryIcon sx={{ fontSize: 40 }} />,
            color: '#d32f2f',
            path: 'products?filter=low-stock',
          },
          {
            title: 'Total Shipments',
            value: metrics.totalShipments,
            icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
            color: '#ed6c02',
            path: 'shipments',
          },
          {
            title: 'Pending Shipments',
            value: metrics.pendingShipments,
            icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
            color: '#d32f2f',
            path: 'shipments?status=pending',
          },
        ];
      case 'Consumer':
        return [
          {
            title: 'My Orders',
            value: metrics.totalOrders,
            icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />,
            color: '#1976d2',
            path: 'orders',
          },
          {
            title: 'Pending Orders',
            value: metrics.pendingOrders,
            icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />,
            color: '#ed6c02',
            path: 'orders?status=pending',
          },
          {
            title: 'Available Products',
            value: metrics.totalProducts,
            icon: <InventoryIcon sx={{ fontSize: 40 }} />,
            color: '#2e7d32',
            path: 'products',
          },
        ];
      default:
        return [];
    }
  };

  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { mode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    totalSuppliers: 0,
    activeSuppliers: 0,
    totalShipments: 0,
    pendingShipments: 0,
    recentOrders: [],
  });
  const [activeTab, setActiveTab] = useState(0);
  const [products, setProducts] = useState([
    { id: 1, name: 'Product 1', category: 'Category A', price: 100, stock: 50 },
    { id: 2, name: 'Product 2', category: 'Category B', price: 200, stock: 30 },
    { id: 3, name: 'Product 3', category: 'Category A', price: 150, stock: 20 },
    { id: 4, name: 'Product 4', category: 'Category C', price: 300, stock: 10 },
  ]);
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: 'Supplier 1', contact: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
    { id: 2, name: 'Supplier 2', contact: 'Jane Smith', email: 'jane@example.com', phone: '098-765-4321' },
    { id: 3, name: 'Supplier 3', contact: 'Bob Johnson', email: 'bob@example.com', phone: '555-555-5555' },
  ]);
  const [categories, setCategories] = useState([
    { id: 1, name: 'Category A', description: 'Description for Category A' },
    { id: 2, name: 'Category B', description: 'Description for Category B' },
    { id: 3, name: 'Category C', description: 'Description for Category C' },
  ]);
  const [shipments, setShipments] = useState([
    { id: 'SH001', orderId: 'ORD001', status: 'In Transit', origin: 'Warehouse A', destination: 'Store B', expectedDelivery: '2024-03-20' },
    { id: 'SH002', orderId: 'ORD002', status: 'Delivered', origin: 'Warehouse B', destination: 'Store C', expectedDelivery: '2024-03-19' },
    { id: 'SH003', orderId: 'ORD003', status: 'Pending', origin: 'Warehouse C', destination: 'Store A', expectedDelivery: '2024-03-21' },
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [formData, setFormData] = useState({});
  const [expandedAccordion, setExpandedAccordion] = useState(false);

  // Set initial active tab based on current path
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/products')) setActiveTab(0);
    else if (path.includes('/orders')) setActiveTab(1);
    else if (path.includes('/suppliers')) setActiveTab(2);
    else if (path.includes('/shipments')) setActiveTab(3);
    else if (path.includes('/database')) setActiveTab(4);
    else setActiveTab(0);
  }, [location.pathname]);

  useEffect(() => {
    // Simulate loading metrics data
    setTimeout(() => {
      setMetrics({
        totalOrders: 150,
        pendingOrders: 25,
        totalProducts: 75,
        lowStockProducts: 12,
        totalSuppliers: 30,
        activeSuppliers: 28,
        totalShipments: 200,
        pendingShipments: 15,
        recentOrders: [
          { id: 1, customer: 'John Doe', amount: 1250, status: 'Pending', date: '2024-03-15' },
          { id: 2, customer: 'Jane Smith', amount: 850, status: 'Shipped', date: '2024-03-14' },
          { id: 3, customer: 'Robert Johnson', amount: 2100, status: 'Delivered', date: '2024-03-13' },
          { id: 4, customer: 'Emily Brown', amount: 1500, status: 'Processing', date: '2024-03-12' },
          { id: 5, customer: 'Michael Wilson', amount: 950, status: 'Shipped', date: '2024-03-11' },
        ],
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigation = (path) => {
    if (path.startsWith('/')) {
      navigate(path);
    } else {
      navigate(`/dashboard/${path}`);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    const paths = ['dashboard', 'products', 'orders', 'suppliers', 'shipments', 'database', 'entityAttributes'];
    navigate(`/dashboard/${paths[newValue]}`);
  };

  const handleOpenDialog = (type, item = null) => {
    setDialogType(type);
    setFormData(item || {});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({});
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (dialogType === 'product') {
      if (formData.id) {
        setProducts(products.map(p => p.id === formData.id ? formData : p));
      } else {
        setProducts([...products, { ...formData, id: products.length + 1 }]);
      }
    } else if (dialogType === 'supplier') {
      if (formData.id) {
        setSuppliers(suppliers.map(s => s.id === formData.id ? formData : s));
      } else {
        setSuppliers([...suppliers, { ...formData, id: suppliers.length + 1 }]);
      }
    } else if (dialogType === 'category') {
      if (formData.id) {
        setCategories(categories.map(c => c.id === formData.id ? formData : c));
      } else {
        setCategories([...categories, { ...formData, id: categories.length + 1 }]);
      }
    }
    handleCloseDialog();
  };

  const handleDelete = (type, id) => {
    if (type === 'product') {
      setProducts(products.filter(p => p.id !== id));
    } else if (type === 'supplier') {
      setSuppliers(suppliers.filter(s => s.id !== id));
    } else if (type === 'category') {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  const getRoleIcon = () => {
    switch (user?.Role) {
      case 'Admin':
        return <AdminIcon sx={{ fontSize: 40 }} />;
      case 'Manufacturer':
        return <FactoryIcon sx={{ fontSize: 40 }} />;
      case 'Consumer':
        return <PersonIcon sx={{ fontSize: 40 }} />;
      default:
        return <PersonIcon sx={{ fontSize: 40 }} />;
    }
  };

 
  const getRoleSpecificActions = () => {
    switch (user?.Role) {
      case 'Admin':
        return [
          {
            title: 'Manage Products',
            description: 'Add, edit, or remove products from inventory',
            icon: <InventoryIcon sx={{ fontSize: 40 }} />,
            path: 'products',
            color: '#2e7d32',
          },
          {
            title: 'Manage Orders',
            description: 'View and process customer orders',
            icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />,
            path: 'orders',
            color: '#1976d2',
          },
          {
            title: 'Manage Suppliers',
            description: 'Add or update supplier information',
            icon: <SupplierIcon sx={{ fontSize: 40 }} />,
            path: 'suppliers',
            color: '#9c27b0',
          },
          {
            title: 'Track Shipments',
            description: 'Monitor and manage product shipments',
            icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
            path: 'shipments',
            color: '#ed6c02',
          },
          {
            title: 'Database Schema',
            description: 'View database structure and relationships',
            icon: <SchemaIcon sx={{ fontSize: 40 }} />,
            path: 'database',
            color: '#673ab7',
          },
        ];
      case 'Manufacturer':
        return [
          {
            title: 'My Products',
            description: 'Manage your product inventory',
            icon: <InventoryIcon sx={{ fontSize: 40 }} />,
            path: 'products',
            color: '#2e7d32',
          },
          {
            title: 'Orders',
            description: 'View and process orders for your products',
            icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />,
            path: 'orders',
            color: '#1976d2',
          },
          {
            title: 'Shipments',
            description: 'Track and manage your product shipments',
            icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
            path: 'shipments',
            color: '#ed6c02',
          },
          {
            title: 'Database Schema',
            description: 'View database structure and relationships',
            icon: <SchemaIcon sx={{ fontSize: 40 }} />,
            path: 'database',
            color: '#673ab7',
          },
        ];
      case 'Consumer':
        return [
          {
            title: 'Browse Products',
            description: 'View and order available products',
            icon: <InventoryIcon sx={{ fontSize: 40 }} />,
            path: 'products',
            color: '#2e7d32',
          },
          {
            title: 'My Orders',
            description: 'Track your order history and status',
            icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />,
            path: 'orders',
            color: '#1976d2',
          },
          {
            title: 'Database Schema',
            description: 'View database structure and relationships',
            icon: <SchemaIcon sx={{ fontSize: 40 }} />,
            path: 'database',
            color: '#673ab7',
          },
        ];
      default:
        return [];
    }
  };

  const MetricCard = ({ title, value, icon, color, onClick }) => (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: onClick ? 'pointer' : 'default',
        backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
        boxShadow: mode === 'light' 
          ? '0 4px 6px rgba(0, 0, 0, 0.1)'
          : '0 4px 6px rgba(0, 0, 0, 0.3)',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: mode === 'light' 
            ? '0 6px 12px rgba(0, 0, 0, 0.15)'
            : '0 6px 12px rgba(0, 0, 0, 0.4)',
        },
      }}
      onClick={onClick}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box 
            sx={{ 
              backgroundColor: `${color}20`, 
              borderRadius: '50%', 
              p: 1, 
              mr: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
          <Typography 
            variant="h6" 
            component="div"
            sx={{ 
              color: mode === 'light' ? '#333333' : '#e0e0e0',
              fontWeight: 500,
            }}
          >
            {title}
          </Typography>
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <Typography 
            variant="h4" 
            component="div"
            sx={{ 
              color: color,
              fontWeight: 700,
            }}
          >
            {value}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  const RecentOrdersCard = () => (
    <Card 
      sx={{ 
        height: '100%',
        backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
        boxShadow: mode === 'light' 
          ? '0 4px 6px rgba(0, 0, 0, 0.1)'
          : '0 4px 6px rgba(0, 0, 0, 0.3)',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ShoppingCartIcon sx={{ mr: 1, color: '#1976d2' }} />
          <Typography 
            variant="h6" 
            component="div"
            sx={{ 
              color: mode === 'light' ? '#333333' : '#e0e0e0',
              fontWeight: 500,
            }}
          >
            Recent Orders
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <List>
            {metrics.recentOrders && metrics.recentOrders.length > 0 ? (
              metrics.recentOrders.map((order) => (
                <ListItem 
                  key={order.id}
                  sx={{ 
                    py: 1,
                    '&:hover': {
                      backgroundColor: mode === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.05)',
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography 
                        variant="subtitle1"
                        sx={{ 
                          color: mode === 'light' ? '#333333' : '#e0e0e0',
                          fontWeight: 500,
                        }}
                      >
                        {order.customer}
                      </Typography>
                    }
                    secondary={
                      <Typography 
                        variant="body2"
                        sx={{ 
                          color: mode === 'light' ? '#666666' : '#b0b0b0',
                        }}
                      >
                        {order.date} • ${order.amount}
                      </Typography>
                    }
                  />
                  <Box 
                    sx={{ 
                      backgroundColor: 
                        order.status === 'Pending' ? '#ff980020' : 
                        order.status === 'Shipped' ? '#2196f320' : 
                        order.status === 'Delivered' ? '#4caf5020' : '#ff980020',
                      color: 
                        order.status === 'Pending' ? '#ff9800' : 
                        order.status === 'Shipped' ? '#2196f3' : 
                        order.status === 'Delivered' ? '#4caf50' : '#ff9800',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: '0.75rem',
                      fontWeight: 500,
                    }}
                  >
                    {order.status}
                  </Box>
                </ListItem>
              ))
            ) : (
              <Typography 
                variant="body2" 
                sx={{ 
                  color: mode === 'light' ? '#666666' : '#b0b0b0',
                  textAlign: 'center',
                  py: 2,
                }}
              >
                No recent orders found
              </Typography>
            )}
          </List>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
        <Button 
          endIcon={<ArrowForwardIcon />}
          onClick={() => handleNavigation('orders')}
          sx={{ 
            color: '#1976d2',
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.04)',
            },
          }}
        >
          View All Orders
        </Button>
      </CardActions>
    </Card>
  );

  const renderProductDialog = () => (
    <Box sx={{ p: 2 }}>
      <TextField
        label="Name"
        name="name"
        value={formData.name || ''}
        onChange={handleFormChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Category"
        name="category"
        value={formData.category || ''}
        onChange={handleFormChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Price"
        name="price"
        type="number"
        value={formData.price || ''}
        onChange={handleFormChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Stock"
        name="stock"
        type="number"
        value={formData.stock || ''}
        onChange={handleFormChange}
        fullWidth
        margin="normal"
      />
    </Box>
  );

  const renderSupplierDialog = () => (
    <Box sx={{ p: 2 }}>
      <TextField
        label="Name"
        name="name"
        value={formData.name || ''}
        onChange={handleFormChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Contact Person"
        name="contact"
        value={formData.contact || ''}
        onChange={handleFormChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        value={formData.email || ''}
        onChange={handleFormChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Phone"
        name="phone"
        value={formData.phone || ''}
        onChange={handleFormChange}
        fullWidth
        margin="normal"
      />
    </Box>
  );

  const renderCategoryDialog = () => (
    <Box sx={{ p: 2 }}>
      <TextField
        label="Name"
        name="name"
        value={formData.name || ''}
        onChange={handleFormChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Description"
        name="description"
        value={formData.description || ''}
        onChange={handleFormChange}
        fullWidth
        margin="normal"
        multiline
        rows={3}
      />
    </Box>
  );

  const renderDatabaseSchema = () => (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, color: mode === 'light' ? '#1a237e' : '#ffffff' }}>
        Database Schema
      </Typography>
      
      <Accordion 
        expanded={expandedAccordion === 'functionalRequirements'} 
        onChange={handleAccordionChange('functionalRequirements')}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SecurityIcon sx={{ mr: 1, color: '#673ab7' }} />
            <Typography>Functional Requirements</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {databaseSchema.functionalRequirements.map((req, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <SpeedIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={req} />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion 
        expanded={expandedAccordion === 'tables'} 
        onChange={handleAccordionChange('tables')}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <StorageIcon sx={{ mr: 1, color: '#673ab7' }} />
            <Typography>Database Tables</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {databaseSchema.tables.map((table) => (
            <Accordion key={table.name} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 'bold' }}>{table.name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Field</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Description</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {table.fields.map((field) => (
                        <TableRow key={field.name}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {field.name}
                              {field.type === 'PK' && (
                                <Chip 
                                  label="PK" 
                                  size="small" 
                                  color="primary" 
                                  sx={{ ml: 1 }} 
                                />
                              )}
                              {field.type === 'FK' && (
                                <Chip 
                                  label="FK" 
                                  size="small" 
                                  color="secondary" 
                                  sx={{ ml: 1 }} 
                                />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>{field.type}</TableCell>
                          <TableCell>{field.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          ))}
        </AccordionDetails>
      </Accordion>

      <Accordion 
        expanded={expandedAccordion === 'relationships'} 
        onChange={handleAccordionChange('relationships')}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SchemaIcon sx={{ mr: 1, color: '#673ab7' }} />
            <Typography>Entity Relationships</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>From</TableCell>
                  <TableCell>To</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Cardinality</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {databaseSchema.relationships.map((rel, index) => (
                  <TableRow key={index}>
                    <TableCell>{rel.from}</TableCell>
                    <TableCell>{rel.to}</TableCell>
                    <TableCell>{rel.type}</TableCell>
                    <TableCell>{rel.cardinality}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>

      <Accordion 
        expanded={expandedAccordion === 'queries'} 
        onChange={handleAccordionChange('queries')}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CodeIcon sx={{ mr: 1, color: '#673ab7' }} />
            <Typography>Database Queries</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {databaseSchema.queries.map((query, index) => (
              <ListItem key={index}>
                <ListItemText 
                  primary={query.name} 
                  secondary={query.description} 
                />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    </Box>
  );

  const renderEntityAttributes = () => {
    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Entity Attributes
        </Typography>
        
        {entityAttributes.map((entity, index) => (
          <Accordion 
            key={index}
            sx={{ 
              mb: 2,
              background: mode === 'dark' 
                ? 'linear-gradient(145deg, #1e1e1e, #2d2d2d)'
                : 'linear-gradient(145deg, #ffffff, #f5f5f5)',
              '&:before': {
                display: 'none',
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                '&:hover': {
                  backgroundColor: mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(0, 0, 0, 0.03)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: mode === 'dark' ? '#fff' : '#1976d2',
                  }}
                >
                  {entity.name}
                </Typography>
                <Chip 
                  label={entity.entityType} 
                  size="small" 
                  sx={{ 
                    ml: 2,
                    backgroundColor: entity.entityType === 'Strong' 
                      ? (mode === 'dark' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(76, 175, 80, 0.1)')
                      : (mode === 'dark' ? 'rgba(255, 152, 0, 0.2)' : 'rgba(255, 152, 0, 0.1)'),
                    color: entity.entityType === 'Strong' 
                      ? (mode === 'dark' ? '#81c784' : '#4caf50')
                      : (mode === 'dark' ? '#ffb74d' : '#ff9800'),
                    fontWeight: 'bold',
                  }}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" paragraph>
                {entity.description}
              </Typography>
              
              <TableContainer component={Paper} sx={{ mt: 2, mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Attribute</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {entity.attributes.map((attr, attrIndex) => (
                      <TableRow key={attrIndex}>
                        <TableCell>{attr}</TableCell>
                        <TableCell>{entity.attributeTypes[attrIndex]}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Typography variant="subtitle2" sx={{ mt: 2, fontWeight: 'bold' }}>
                Relationships:
              </Typography>
              <List dense>
                {databaseSchema.relationships
                  .filter(rel => rel.from === entity.name || rel.to === entity.name)
                  .map((rel, relIndex) => (
                    <ListItem key={relIndex}>
                      <ListItemIcon>
                        <ArrowForwardIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={`${rel.from} ${rel.type} ${rel.to} (${rel.cardinality})`}
                        secondary={`Participation: ${rel.participation}`}
                      />
                    </ListItem>
                  ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    );
  };

  const renderMainDashboard = () => (
    <Box sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        {/* Products Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <InventoryIcon sx={{ mr: 1, color: '#2e7d32' }} />
                <Typography variant="h6">Products</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Stock</TableCell>
                      <TableCell>Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow 
                        key={product.id}
                        hover
                        onClick={() => handleNavigation('products')}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>${product.price}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
            <CardActions>
              <Button 
                endIcon={<ArrowForwardIcon />}
                onClick={() => handleNavigation('products')}
              >
                View All Products
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Suppliers Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SupplierIcon sx={{ mr: 1, color: '#9c27b0' }} />
                <Typography variant="h6">Suppliers</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell>Email</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {suppliers.map((supplier) => (
                      <TableRow 
                        key={supplier.id}
                        hover
                        onClick={() => handleNavigation('suppliers')}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell>{supplier.name}</TableCell>
                        <TableCell>{supplier.contact}</TableCell>
                        <TableCell>{supplier.email}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
            <CardActions>
              <Button 
                endIcon={<ArrowForwardIcon />}
                onClick={() => handleNavigation('suppliers')}
              >
                View All Suppliers
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Categories Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <StorageIcon sx={{ mr: 1, color: '#673ab7' }} />
                <Typography variant="h6">Categories</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Description</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow 
                        key={category.id}
                        hover
                        onClick={() => handleNavigation('categories')}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell>{category.name}</TableCell>
                        <TableCell>{category.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
            <CardActions>
              <Button 
                endIcon={<ArrowForwardIcon />}
                onClick={() => handleNavigation('categories')}
              >
                View All Categories
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Metrics Section */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            {getRoleSpecificMetrics().map((metric, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <MetricCard
                  title={metric.title}
                  value={metric.value}
                  icon={metric.icon}
                  color={metric.color}
                  onClick={() => handleNavigation(metric.path)}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {getRoleIcon()}
          <Typography 
            variant="h4" 
            component="h1"
            sx={{ 
              color: mode === 'light' ? '#1a237e' : '#ffffff',
              fontWeight: 700,
              mb: 1,
            }}
          >
            Welcome, {user?.name || 'User'}!
          </Typography>
        </Box>
        <Tooltip title="Logout">
          <IconButton 
            onClick={handleLogout}
            sx={{ 
              color: mode === 'light' ? '#666666' : '#b0b0b0',
              '&:hover': {
                color: '#f44336',
                backgroundColor: 'rgba(244, 67, 54, 0.04)',
              },
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Dashboard" />
          <Tab label="Products" />
          <Tab label="Orders" />
          <Tab label="Suppliers" />
          <Tab label="Shipments" />
          <Tab label="Database" />
          <Tab label="Entity Attributes" />
        </Tabs>
      </Box>

      <AnimatePresence mode="wait">
        {activeTab === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderMainDashboard()}
          </motion.div>
        )}

        {activeTab === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Products content */}
            <Box sx={{ mt: 3 }}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog('product')}
                >
                  Add Product
                </Button>
              </Box>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Stock</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>${product.price}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleOpenDialog('product', product)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDelete('product', product.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </motion.div>
        )}

        {activeTab === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Orders content */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>Recent Orders</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {metrics.recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>${order.amount}</TableCell>
                        <TableCell>{order.status}</TableCell>
                        <TableCell>{order.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </motion.div>
        )}

        {activeTab === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Suppliers content */}
            <Box sx={{ mt: 3 }}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog('supplier')}
                >
                  Add Supplier
                </Button>
              </Box>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {suppliers.map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell>{supplier.name}</TableCell>
                        <TableCell>{supplier.contact}</TableCell>
                        <TableCell>{supplier.email}</TableCell>
                        <TableCell>{supplier.phone}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleOpenDialog('supplier', supplier)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDelete('supplier', supplier.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </motion.div>
        )}

        {activeTab === 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Shipments content */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>Shipment Tracking</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Shipment ID</TableCell>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Origin</TableCell>
                      <TableCell>Destination</TableCell>
                      <TableCell>Expected Delivery</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {shipments.map((shipment) => (
                      <TableRow key={shipment.id}>
                        <TableCell>{shipment.id}</TableCell>
                        <TableCell>{shipment.orderId}</TableCell>
                        <TableCell>{shipment.status}</TableCell>
                        <TableCell>{shipment.origin}</TableCell>
                        <TableCell>{shipment.destination}</TableCell>
                        <TableCell>{shipment.expectedDelivery}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </motion.div>
        )}

        {activeTab === 5 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Database Schema content */}
            {renderDatabaseSchema()}
          </motion.div>
        )}

        {activeTab === 6 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Entity Attributes content */}
            {renderEntityAttributes()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dialogs */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {dialogType === 'product' ? 'Add/Edit Product' : 
           dialogType === 'supplier' ? 'Add/Edit Supplier' : 
           dialogType === 'category' ? 'Add/Edit Category' : ''}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'product' ? renderProductDialog() : 
           dialogType === 'supplier' ? renderSupplierDialog() : 
           dialogType === 'category' ? renderCategoryDialog() : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 