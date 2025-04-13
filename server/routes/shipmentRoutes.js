const express = require('express');
const router = express.Router();
const Shipment = require('../models/Shipment');

// Get all shipments
router.get('/', async (req, res) => {
  try {
    const shipments = await Shipment.findAll();
    res.json(shipments);
  } catch (error) {
    console.error('Error fetching shipments:', error);
    res.status(500).json({ message: 'Error fetching shipments' });
  }
});

// Create a new shipment
router.post('/', async (req, res) => {
  try {
    const shipment = await Shipment.create(req.body);
    res.status(201).json(shipment);
  } catch (error) {
    console.error('Error creating shipment:', error);
    res.status(500).json({ message: 'Error creating shipment' });
  }
});

// Update shipment status
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const shipment = await Shipment.findByPk(id);
    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }
    
    shipment.Status = status;
    if (status === 'Delivered') {
      shipment.ActualDeliveryDate = new Date();
    }
    
    await shipment.save();
    res.json(shipment);
  } catch (error) {
    console.error('Error updating shipment:', error);
    res.status(500).json({ message: 'Error updating shipment' });
  }
});

module.exports = router; 