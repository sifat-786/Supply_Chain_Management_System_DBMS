const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');
const Product = require('../models/Product');
const Supplier = require('../models/Supplier');
const Order = require('../models/Order');
const Shipment = require('../models/Shipment');
const User = require('../models/User');

// Apply auth middleware to all admin routes
router.use(authMiddleware);
router.use(roleMiddleware(['Admin']));

// Update Product
router.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.update(req.body);
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product' });
  }
});

// Update Supplier
router.put('/suppliers/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    await supplier.update(req.body);
    res.json(supplier);
  } catch (error) {
    console.error('Error updating supplier:', error);
    res.status(500).json({ message: 'Error updating supplier' });
  }
});

// Update Order
router.put('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    await order.update(req.body);
    res.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Error updating order' });
  }
});

// Update Shipment
router.put('/shipments/:id', async (req, res) => {
  try {
    const shipment = await Shipment.findByPk(req.params.id);
    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }
    await shipment.update(req.body);
    res.json(shipment);
  } catch (error) {
    console.error('Error updating shipment:', error);
    res.status(500).json({ message: 'Error updating shipment' });
  }
});

// Update User
router.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.update(req.body);
    res.json({
      UserID: user.UserID,
      Name: user.Name,
      Email: user.Email,
      Role: user.Role
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
});

// Delete Product
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
});

// Delete Supplier
router.delete('/suppliers/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    await supplier.destroy();
    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({ message: 'Error deleting supplier' });
  }
});

// Delete Order
router.delete('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    await order.destroy();
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Error deleting order' });
  }
});

// Delete Shipment
router.delete('/shipments/:id', async (req, res) => {
  try {
    const shipment = await Shipment.findByPk(req.params.id);
    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }
    await shipment.destroy();
    res.json({ message: 'Shipment deleted successfully' });
  } catch (error) {
    console.error('Error deleting shipment:', error);
    res.status(500).json({ message: 'Error deleting shipment' });
  }
});

// Delete User
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

module.exports = router; 