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
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  LocalShipping as ShippingIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

export default function Shipments() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [shipments, setShipments] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    orderId: '',
    trackingNumber: '',
    carrier: '',
    shippingMethod: '',
    estimatedDeliveryDate: '',
    notes: '',
  });

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setShipments([
        {
          id: 1,
          orderId: 'ORD-001',
          trackingNumber: 'TRK123456789',
          carrier: 'FedEx',
          shippingMethod: 'Express',
          status: 'in_transit',
          estimatedDeliveryDate: '2024-03-20',
          actualDeliveryDate: null,
          notes: 'Priority shipping',
        },
        {
          id: 2,
          orderId: 'ORD-002',
          trackingNumber: 'TRK987654321',
          carrier: 'UPS',
          shippingMethod: 'Ground',
          status: 'delivered',
          estimatedDeliveryDate: '2024-03-18',
          actualDeliveryDate: '2024-03-17',
          notes: 'Delivered ahead of schedule',
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
    setFilterStatus(event.target.value);
    setPage(0);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      orderId: '',
      trackingNumber: '',
      carrier: '',
      shippingMethod: '',
      estimatedDeliveryDate: '',
      notes: '',
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
    // Add API call to create/update shipment
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    // Add API call to delete shipment
    setShipments((prev) => prev.filter((shipment) => shipment.id !== id));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in_transit':
        return 'info';
      case 'delivered':
        return 'success';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusStep = (status) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'in_transit':
        return 1;
      case 'delivered':
        return 2;
      case 'failed':
        return -1;
      default:
        return 0;
    }
  };

  const filteredShipments = shipments.filter((shipment) => {
    const matchesSearch =
      shipment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || shipment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ color: mode === 'light' ? '#1a237e' : '#ffffff' }}>
          Shipments
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
          Create Shipment
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
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              label="Status"
              onChange={handleFilterChange}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in_transit">In Transit</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Tracking Number</TableCell>
                <TableCell>Carrier</TableCell>
                <TableCell>Shipping Method</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Estimated Delivery</TableCell>
                <TableCell>Actual Delivery</TableCell>
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
                filteredShipments
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((shipment) => (
                    <TableRow key={shipment.id}>
                      <TableCell>{shipment.orderId}</TableCell>
                      <TableCell>{shipment.trackingNumber}</TableCell>
                      <TableCell>{shipment.carrier}</TableCell>
                      <TableCell>{shipment.shippingMethod}</TableCell>
                      <TableCell>
                        <Chip
                          label={shipment.status.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                          color={getStatusColor(shipment.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{new Date(shipment.estimatedDeliveryDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {shipment.actualDeliveryDate
                          ? new Date(shipment.actualDeliveryDate).toLocaleDateString()
                          : '-'}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View Details">
                          <IconButton size="small" onClick={() => handleOpenDialog(shipment)}>
                            <ShippingIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton size="small">
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" onClick={() => handleDelete(shipment.id)}>
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
          count={filteredShipments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create Shipment</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Order ID"
              name="orderId"
              value={formData.orderId}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Tracking Number"
              name="trackingNumber"
              value={formData.trackingNumber}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Carrier</InputLabel>
              <Select
                name="carrier"
                value={formData.carrier}
                label="Carrier"
                onChange={handleInputChange}
                required
              >
                <MenuItem value="FedEx">FedEx</MenuItem>
                <MenuItem value="UPS">UPS</MenuItem>
                <MenuItem value="DHL">DHL</MenuItem>
                <MenuItem value="USPS">USPS</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Shipping Method</InputLabel>
              <Select
                name="shippingMethod"
                value={formData.shippingMethod}
                label="Shipping Method"
                onChange={handleInputChange}
                required
              >
                <MenuItem value="Ground">Ground</MenuItem>
                <MenuItem value="Express">Express</MenuItem>
                <MenuItem value="Next Day">Next Day</MenuItem>
                <MenuItem value="2 Day">2 Day</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Estimated Delivery Date"
              name="estimatedDeliveryDate"
              type="date"
              value={formData.estimatedDeliveryDate}
              onChange={handleInputChange}
              margin="normal"
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              fullWidth
              label="Notes"
              name="notes"
              multiline
              rows={3}
              value={formData.notes}
              onChange={handleInputChange}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Create Shipment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 