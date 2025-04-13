const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Create a new order
router.post('/', async (req, res) => {
  try {
    const { items, ...orderData } = req.body;
    const order = await Order.create(orderData);
    
    if (items && items.length > 0) {
      // Fetch product prices and create order items with proper pricing
      const orderItems = await Promise.all(items.map(async (item) => {
        const product = await Product.findByPk(item.ProductID);
        if (!product) {
          throw new Error(`Product with ID ${item.ProductID} not found`);
        }
        
        return {
          OrderID: order.OrderID,
          ProductID: item.ProductID,
          Quantity: item.Quantity,
          UnitPrice: product.Price,
          TotalPrice: product.Price * item.Quantity
        };
      }));
      
      await OrderItem.bulkCreate(orderItems);
    }
    
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
});

module.exports = router; 