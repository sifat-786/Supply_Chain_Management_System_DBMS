import { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import axios from '../utils/axios';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} style={{ width: '100%' }}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function AdminDashboard() {
  const [tabValue, setTabValue] = useState(0);
  const [data, setData] = useState({
    products: [],
    suppliers: [],
    orders: [],
    shipments: [],
    users: [],
  });
  const [editDialog, setEditDialog] = useState({
    open: false,
    type: '',
    item: null,
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [products, suppliers, orders, shipments, users] = await Promise.all([
        axios.get('/products'),
        axios.get('/suppliers'),
        axios.get('/orders'),
        axios.get('/shipments'),
        axios.get('/users'),
      ]);

      setData({
        products: products.data,
        suppliers: suppliers.data,
        orders: orders.data,
        shipments: shipments.data,
        users: users.data,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEdit = (type, item) => {
    setEditDialog({
      open: true,
      type,
      item,
    });
  };

  const handleDelete = async (type, id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`/admin/${type}/${id}`);
        fetchAllData();
      } catch (error) {
        console.error(`Error deleting ${type}:`, error);
      }
    }
  };

  const handleSave = async () => {
    try {
      const { type, item } = editDialog;
      await axios.put(`/admin/${type}/${item.id}`, item);
      setEditDialog({ open: false, type: '', item: null });
      fetchAllData();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const renderTable = (type, columns) => {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.field}>{column.headerName}</TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data[type].map((item) => (
              <TableRow key={item.id}>
                {columns.map((column) => (
                  <TableCell key={column.field}>{item[column.field]}</TableCell>
                ))}
                <TableCell>
                  <IconButton onClick={() => handleEdit(type, item)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(type, item.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderEditDialog = () => {
    const { type, item } = editDialog;
    if (!item) return null;

    const fields = {
      products: [
        { name: 'Name', field: 'name' },
        { name: 'Description', field: 'description' },
        { name: 'Price', field: 'price', type: 'number' },
        { name: 'Stock', field: 'stock', type: 'number' },
      ],
      suppliers: [
        { name: 'Name', field: 'name' },
        { name: 'Contact', field: 'contact' },
        { name: 'Email', field: 'email' },
      ],
      orders: [
        { name: 'Status', field: 'status' },
        { name: 'Total Amount', field: 'totalAmount', type: 'number' },
      ],
      shipments: [
        { name: 'Status', field: 'status' },
        { name: 'Tracking Number', field: 'trackingNumber' },
        { name: 'Carrier', field: 'carrier' },
      ],
      users: [
        { name: 'Name', field: 'name' },
        { name: 'Email', field: 'email' },
        { name: 'Role', field: 'role' },
      ],
    };

    return (
      <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, type: '', item: null })}>
        <DialogTitle>Edit {type.slice(0, -1)}</DialogTitle>
        <DialogContent>
          {fields[type].map((field) => (
            <TextField
              key={field.field}
              margin="dense"
              label={field.name}
              fullWidth
              type={field.type || 'text'}
              value={item[field.field] || ''}
              onChange={(e) =>
                setEditDialog({
                  ...editDialog,
                  item: { ...item, [field.field]: e.target.value },
                })
              }
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, type: '', item: null })}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Products" />
          <Tab label="Suppliers" />
          <Tab label="Orders" />
          <Tab label="Shipments" />
          <Tab label="Users" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          {renderTable('products', [
            { field: 'name', headerName: 'Name' },
            { field: 'description', headerName: 'Description' },
            { field: 'price', headerName: 'Price' },
            { field: 'stock', headerName: 'Stock' },
          ])}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {renderTable('suppliers', [
            { field: 'name', headerName: 'Name' },
            { field: 'contact', headerName: 'Contact' },
            { field: 'email', headerName: 'Email' },
          ])}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {renderTable('orders', [
            { field: 'id', headerName: 'ID' },
            { field: 'status', headerName: 'Status' },
            { field: 'totalAmount', headerName: 'Total Amount' },
          ])}
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          {renderTable('shipments', [
            { field: 'id', headerName: 'ID' },
            { field: 'status', headerName: 'Status' },
            { field: 'trackingNumber', headerName: 'Tracking Number' },
            { field: 'carrier', headerName: 'Carrier' },
          ])}
        </TabPanel>

        <TabPanel value={tabValue} index={4}>
          {renderTable('users', [
            { field: 'name', headerName: 'Name' },
            { field: 'email', headerName: 'Email' },
            { field: 'role', headerName: 'Role' },
          ])}
        </TabPanel>
      </Paper>

      {renderEditDialog()}
    </Box>
  );
}

export default AdminDashboard; 