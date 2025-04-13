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

export default function Suppliers() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [suppliers, setSuppliers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    category: '',
    paymentTerms: '',
  });

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setSuppliers([
        {
          id: 1,
          name: 'Tech Solutions Inc',
          contactPerson: 'John Smith',
          email: 'john@techsolutions.com',
          phone: '+1 234-567-8900',
          address: '123 Tech Street, Silicon Valley, CA',
          category: 'Electronics',
          paymentTerms: 'Net 30',
          status: 'active',
        },
        {
          id: 2,
          name: 'Global Parts Co',
          contactPerson: 'Sarah Johnson',
          email: 'sarah@globalparts.com',
          phone: '+1 234-567-8901',
          address: '456 Parts Avenue, Chicago, IL',
          category: 'Components',
          paymentTerms: 'Net 15',
          status: 'active',
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
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      category: '',
      paymentTerms: '',
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
    // Add API call to create/update supplier
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    // Add API call to delete supplier
    setSuppliers((prev) => prev.filter((supplier) => supplier.id !== id));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || supplier.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ color: mode === 'light' ? '#1a237e' : '#ffffff' }}>
          Suppliers
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
          Add Supplier
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
              <MenuItem value="Components">Components</MenuItem>
              <MenuItem value="Raw Materials">Raw Materials</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Contact Person</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Payment Terms</TableCell>
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
                filteredSuppliers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell>{supplier.name}</TableCell>
                      <TableCell>{supplier.contactPerson}</TableCell>
                      <TableCell>{supplier.email}</TableCell>
                      <TableCell>{supplier.phone}</TableCell>
                      <TableCell>{supplier.category}</TableCell>
                      <TableCell>{supplier.paymentTerms}</TableCell>
                      <TableCell>
                        <Chip
                          label={supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}
                          color={getStatusColor(supplier.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => handleOpenDialog(supplier)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" onClick={() => handleDelete(supplier.id)}>
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
          count={filteredSuppliers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add Supplier</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Company Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Contact Person"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Address"
              name="address"
              multiline
              rows={3}
              value={formData.address}
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
                <MenuItem value="Components">Components</MenuItem>
                <MenuItem value="Raw Materials">Raw Materials</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Payment Terms</InputLabel>
              <Select
                name="paymentTerms"
                value={formData.paymentTerms}
                label="Payment Terms"
                onChange={handleInputChange}
                required
              >
                <MenuItem value="Net 15">Net 15</MenuItem>
                <MenuItem value="Net 30">Net 30</MenuItem>
                <MenuItem value="Net 45">Net 45</MenuItem>
                <MenuItem value="Net 60">Net 60</MenuItem>
              </Select>
            </FormControl>
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