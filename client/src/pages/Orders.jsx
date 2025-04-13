import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Tooltip,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

export default function Orders() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    items: [{ productId: '', quantity: 1 }],
    paymentMethod: '',
    shippingAddress: '',
  });
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Get status filter from URL if present
    const params = new URLSearchParams(location.search);
    const statusParam = params.get('status');
    if (statusParam) {
      setFilterStatus(statusParam);
    }

    // Simulate loading data
    const timer = setTimeout(() => {
      setProducts([
        { id: 1, name: 'Laptop', price: 999.99, stock: 15 },
        { id: 2, name: 'Smartphone', price: 699.99, stock: 25 },
        { id: 3, name: 'Desk Chair', price: 199.99, stock: 8 },
        { id: 4, name: 'Coffee Maker', price: 79.99, stock: 30 },
        { id: 5, name: 'Wireless Headphones', price: 249.99, stock: 12 },
      ]);

      setOrders([
        {
          id: 1,
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          items: [
            { productId: 1, name: 'Laptop', quantity: 1, price: 999.99 },
            { productId: 2, name: 'Smartphone', quantity: 2, price: 699.99 },
          ],
          total: 2399.97,
          status: 'pending',
          paymentMethod: 'Credit Card',
          shippingAddress: '123 Main St, City, Country',
          createdAt: '2024-03-15',
        },
        {
          id: 2,
          customerName: 'Jane Smith',
          customerEmail: 'jane@example.com',
          items: [
            { productId: 1, name: 'Laptop', quantity: 1, price: 999.99 },
          ],
          total: 999.99,
          status: 'shipped',
          paymentMethod: 'PayPal',
          shippingAddress: '456 Oak St, City, Country',
          createdAt: '2024-03-14',
        },
      ]);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [location]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
    setPage(0);
  };

  const handleOpenDialog = (order = null) => {
    if (order) {
      setSelectedOrder(order);
      setFormData({
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        items: [...order.items],
        paymentMethod: order.paymentMethod,
        shippingAddress: order.shippingAddress,
      });
    } else {
      setSelectedOrder(null);
      setFormData({
        customerName: '',
        customerEmail: '',
        items: [{ productId: '', quantity: 1 }],
        paymentMethod: '',
        shippingAddress: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
    setFormData({
      customerName: '',
      customerEmail: '',
      items: [{ productId: '', quantity: 1 }],
      paymentMethod: '',
      shippingAddress: '',
    });
    setError('');
    setSelectedProduct('');
    setQuantity(1);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { productId: '', quantity: 1 }],
    }));
  };

  const handleRemoveItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Add API call to create/update order
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    // Add API call to delete order
    setOrders((prev) => prev.filter((order) => order.id !== id));
  };

  const handleStatusChange = (id, newStatus) => {
    // Add API call to update order status
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <PendingIcon />;
      case 'processing':
        return <PaymentIcon />;
      case 'shipped':
        return <ShippingIcon />;
      case 'delivered':
        return <CheckCircleIcon />;
      case 'cancelled':
        return <CancelIcon />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statuses = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <Box 
      sx={{ 
        p: 3,
        backgroundColor: mode === 'light' ? '#f5f5f5' : '#121212',
        minHeight: 'calc(100vh - 64px)',
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1"
          sx={{ 
            color: mode === 'light' ? '#1a237e' : '#ffffff',
            fontWeight: 700,
            mb: 1,
          }}
        >
          Order Management
        </Typography>
        <Typography 
          variant="subtitle1"
          sx={{ 
            color: mode === 'light' ? '#666666' : '#b0b0b0',
          }}
        >
          Create and track orders from placement to delivery
        </Typography>
      </Box>

      <Paper 
        sx={{ 
          p: 2, 
          mb: 3,
          backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
          boxShadow: mode === 'light' 
            ? '0 4px 6px rgba(0, 0, 0, 0.1)'
            : '0 4px 6px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              placeholder="Search orders..."
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm('')}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  backgroundColor: mode === 'light' ? '#ffffff' : '#2d2d2d',
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                value={filterStatus}
                onChange={handleFilterChange}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterIcon />
                  </InputAdornment>
                }
                sx={{ 
                  backgroundColor: mode === 'light' ? '#ffffff' : '#2d2d2d',
                }}
              >
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status === 'all' ? 'All Statuses' : getStatusLabel(status)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={4} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{ 
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
              }}
            >
              Create Order
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper 
        sx={{ 
          backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
          boxShadow: mode === 'light' 
            ? '0 4px 6px rgba(0, 0, 0, 0.1)'
            : '0 4px 6px rgba(0, 0, 0, 0.3)',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    No orders found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((order) => (
                    <TableRow 
                      key={order.id}
                      hover
                      sx={{ 
                        '&:hover': {
                          backgroundColor: mode === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.05)',
                        },
                      }}
                    >
                      <TableCell>
                        <Typography 
                          variant="body1"
                          sx={{ 
                            color: mode === 'light' ? '#333333' : '#e0e0e0',
                            fontWeight: 500,
                          }}
                        >
                          #{order.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body1"
                          sx={{ 
                            color: mode === 'light' ? '#333333' : '#e0e0e0',
                            fontWeight: 500,
                          }}
                        >
                          {order.customerName}
                        </Typography>
                        <Typography 
                          variant="body2"
                          sx={{ 
                            color: mode === 'light' ? '#666666' : '#b0b0b0',
                          }}
                        >
                          {order.customerEmail}
                        </Typography>
                      </TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell align="right">${order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip 
                          icon={getStatusIcon(order.status)}
                          label={getStatusLabel(order.status)} 
                          color={getStatusColor(order.status)} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="View Details">
                          <IconButton 
                            size="small" 
                            onClick={() => handleOpenDialog(order)}
                            sx={{ 
                              color: '#1976d2',
                              '&:hover': {
                                backgroundColor: 'rgba(25, 118, 210, 0.04)',
                              },
                            }}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Status">
                          <IconButton 
                            size="small" 
                            onClick={() => handleStatusChange(order.id, 'processing')}
                            sx={{ 
                              color: '#1976d2',
                              '&:hover': {
                                backgroundColor: 'rgba(25, 118, 210, 0.04)',
                              },
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton 
                            size="small" 
                            onClick={() => handleDelete(order.id)}
                            sx={{ 
                              color: '#f44336',
                              '&:hover': {
                                backgroundColor: 'rgba(244, 67, 54, 0.04)',
                              },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
            color: mode === 'light' ? '#333333' : '#e0e0e0',
          }
        }}
      >
        <DialogTitle>
          {selectedOrder ? 'Order Details' : 'Create New Order'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Customer Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Customer Name"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Customer Email"
                      name="customerEmail"
                      type="email"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Shipping Address"
                      name="shippingAddress"
                      value={formData.shippingAddress}
                      onChange={handleInputChange}
                      multiline
                      rows={2}
                      required
                    />
                  </Grid>
                </Grid>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Order Items
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="product-select-label">Product</InputLabel>
                      <Select
                        labelId="product-select-label"
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                        label="Product"
                      >
                        {products.map((product) => (
                          <MenuItem key={product.id} value={product.id}>
                            {product.name} - ${product.price}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                      inputProps={{ min: 1 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Button
                      variant="contained"
                      onClick={handleAddItem}
                      disabled={!selectedProduct || quantity <= 0}
                      sx={{ 
                        height: '100%',
                        backgroundColor: '#1976d2',
                        '&:hover': {
                          backgroundColor: '#1565c0',
                        },
                      }}
                    >
                      Add
                    </Button>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 2, maxHeight: 200, overflow: 'auto' }}>
                  {formData.items.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" align="center">
                      No items added to the order
                    </Typography>
                  ) : (
                    <List>
                      {formData.items.map((item, index) => (
                        <ListItem 
                          key={index}
                          secondaryAction={
                            <IconButton 
                              edge="end" 
                              aria-label="delete"
                              onClick={() => handleRemoveItem(index)}
                              sx={{ color: '#f44336' }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          }
                        >
                          <ListItemText
                            primary={item.name}
                            secondary={`Quantity: ${item.quantity} x $${item.price} = $${(item.quantity * item.price).toFixed(2)}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="h6" gutterBottom>
                  Payment Method
                </Typography>
                <FormControl fullWidth>
                  <InputLabel id="payment-method-label">Payment Method</InputLabel>
                  <Select
                    labelId="payment-method-label"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    label="Payment Method"
                  >
                    <MenuItem value="Credit Card">Credit Card</MenuItem>
                    <MenuItem value="PayPal">PayPal</MenuItem>
                    <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, p: 2, bgcolor: mode === 'light' ? '#f5f5f5' : '#2d2d2d', borderRadius: 1 }}>
              <Typography variant="h6" align="right">
                Total: ${calculateTotal().toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            sx={{ 
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0',
              },
            }}
          >
            {selectedOrder ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 