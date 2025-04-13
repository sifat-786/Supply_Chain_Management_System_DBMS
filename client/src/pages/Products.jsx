import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

export default function Products() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    manufacturer: '',
    minimumStockLevel: '',
  });

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setProducts([
        {
          id: 1,
          name: 'Laptop',
          description: 'High-performance laptop',
          price: 999.99,
          stock: 50,
          category: 'Electronics',
          manufacturer: 'Tech Corp',
          minimumStockLevel: 10,
        },
        {
          id: 2,
          name: 'Smartphone',
          description: 'Latest model smartphone',
          price: 699.99,
          stock: 5,
          category: 'Electronics',
          manufacturer: 'Mobile Inc',
          minimumStockLevel: 15,
        },
        // Add more sample products as needed
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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleFilterChange = (event) => {
    setFilterCategory(event.target.value);
    setPage(0);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      manufacturer: '',
      minimumStockLevel: '',
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Add API call to create/update product
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    // Add API call to delete product
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const getStockStatus = (stock, minimumStockLevel) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'error' };
    if (stock <= minimumStockLevel) return { label: 'Low Stock', color: 'warning' };
    return { label: 'In Stock', color: 'success' };
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ color: mode === 'light' ? '#1a237e' : '#ffffff' }}>
          Products
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          sx={{
            backgroundColor: mode === 'light' ? '#1a237e' : '#90caf9',
            '&:hover': {
              backgroundColor: mode === 'light' ? '#0d47a1' : '#42a5f5',
            },
          }}
        >
          Add Product
        </Button>
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{ flexGrow: 1 }}
          />
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={filterCategory}
              label="Category"
              onChange={handleFilterChange}
            >
              <MenuItem value="all">All Categories</MenuItem>
              <MenuItem value="Electronics">Electronics</MenuItem>
              <MenuItem value="Clothing">Clothing</MenuItem>
              <MenuItem value="Food">Food</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Manufacturer</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((product) => {
                    const stockStatus = getStockStatus(product.stock, product.minimumStockLevel);
                    return (
                      <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.description}</TableCell>
                        <TableCell>${product.price}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.manufacturer}</TableCell>
                        <TableCell>
                          <Chip
                            label={stockStatus.label}
                            color={stockStatus.color}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => handleOpenDialog(product)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" onClick={() => handleDelete(product.id)}>
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

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add Product</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              margin="normal"
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                label="Category"
                onChange={handleInputChange}
                required
              >
                <MenuItem value="Electronics">Electronics</MenuItem>
                <MenuItem value="Clothing">Clothing</MenuItem>
                <MenuItem value="Food">Food</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Manufacturer"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Minimum Stock Level"
              name="minimumStockLevel"
              type="number"
              value={formData.minimumStockLevel}
              onChange={handleInputChange}
              margin="normal"
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 