import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import Layout from '../components/Layout';
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
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

export default function Inventory() {
  const navigate = useNavigate();
  const { mode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    manufacturer: '',
    minimumStockLevel: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setProducts([
        { 
          id: 1, 
          name: 'Laptop', 
          description: 'High-performance laptop', 
          price: 999.99, 
          stock: 15, 
          category: 'Electronics', 
          manufacturer: 'TechCorp',
          minimumStockLevel: 10,
        },
        { 
          id: 2, 
          name: 'Smartphone', 
          description: 'Latest smartphone model', 
          price: 699.99, 
          stock: 25, 
          category: 'Electronics', 
          manufacturer: 'MobileTech',
          minimumStockLevel: 15,
        },
        { 
          id: 3, 
          name: 'Desk Chair', 
          description: 'Ergonomic office chair', 
          price: 199.99, 
          stock: 8, 
          category: 'Furniture', 
          manufacturer: 'ComfortCo',
          minimumStockLevel: 5,
        },
        { 
          id: 4, 
          name: 'Coffee Maker', 
          description: 'Automatic coffee maker', 
          price: 79.99, 
          stock: 30, 
          category: 'Appliances', 
          manufacturer: 'HomeGoods',
          minimumStockLevel: 10,
        },
        { 
          id: 5, 
          name: 'Wireless Headphones', 
          description: 'Noise-cancelling headphones', 
          price: 249.99, 
          stock: 12, 
          category: 'Electronics', 
          manufacturer: 'AudioTech',
          minimumStockLevel: 8,
        },
      ]);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleFilterChange = (event) => {
    setFilterCategory(event.target.value);
    setPage(0);
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setSelectedProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
        manufacturer: product.manufacturer,
        minimumStockLevel: product.minimumStockLevel,
      });
    } else {
      setSelectedProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        manufacturer: '',
        minimumStockLevel: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      manufacturer: '',
      minimumStockLevel: '',
    });
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.price || !formData.stock || !formData.category) {
      setError('Please fill in all required fields');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      if (selectedProduct) {
        // Update existing product
        setProducts(products.map(p => 
          p.id === selectedProduct.id ? { ...p, ...formData } : p
        ));
      } else {
        // Add new product
        const newProduct = {
          id: products.length + 1,
          ...formData,
        };
        setProducts([...products, newProduct]);
      }
      handleCloseDialog();
    }, 500);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      // Simulate API call
      setTimeout(() => {
        setProducts(products.filter(p => p.id !== productId));
      }, 500);
    }
  };

  const getStockStatus = (stock, minimumStockLevel) => {
    if (stock <= 0) {
      return { label: 'Out of Stock', color: 'error' };
    } else if (stock <= minimumStockLevel) {
      return { label: 'Low Stock', color: 'warning' };
    } else {
      return { label: 'In Stock', color: 'success' };
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(products.map(p => p.category))];

  return (
    <Layout>
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
            Inventory Management
          </Typography>
          <Typography 
            variant="subtitle1"
            sx={{ 
              color: mode === 'light' ? '#666666' : '#b0b0b0',
            }}
          >
            Track and manage your inventory levels across the supply chain
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
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
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
                <InputLabel id="category-filter-label">Category</InputLabel>
                <Select
                  labelId="category-filter-label"
                  value={filterCategory}
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
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
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
                Add Product
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {products.some(p => p.stock <= p.minimumStockLevel) && (
          <Alert 
            severity="warning" 
            icon={<WarningIcon />}
            sx={{ mb: 3 }}
          >
            Some products are running low on stock. Please review the inventory and place orders as needed.
          </Alert>
        )}

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
                  <TableCell>Product Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Manufacturer</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Stock</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                      Loading inventory data...
                    </TableCell>
                  </TableRow>
                ) : filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                      No products found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((product) => {
                      const stockStatus = getStockStatus(product.stock, product.minimumStockLevel);
                      return (
                        <TableRow 
                          key={product.id}
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
                              {product.name}
                            </Typography>
                            <Typography 
                              variant="body2"
                              sx={{ 
                                color: mode === 'light' ? '#666666' : '#b0b0b0',
                              }}
                            >
                              {product.description}
                            </Typography>
                          </TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>{product.manufacturer}</TableCell>
                          <TableCell align="right">${product.price.toFixed(2)}</TableCell>
                          <TableCell align="right">{product.stock}</TableCell>
                          <TableCell>
                            <Chip 
                              label={stockStatus.label} 
                              color={stockStatus.color} 
                              size="small" 
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="Edit">
                              <IconButton 
                                size="small" 
                                onClick={() => handleOpenDialog(product)}
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
                                onClick={() => handleDeleteProduct(product.id)}
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
                      );
                    })
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredProducts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
              color: mode === 'light' ? '#333333' : '#e0e0e0',
            }
          }}
        >
          <DialogTitle>
            {selectedProduct ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Product Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    multiline
                    rows={3}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Stock"
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Manufacturer"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Minimum Stock Level"
                    name="minimumStockLevel"
                    type="number"
                    value={formData.minimumStockLevel}
                    onChange={handleInputChange}
                    helperText="Alert will be shown when stock falls below this level"
                  />
                </Grid>
              </Grid>
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
              {selectedProduct ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
} 