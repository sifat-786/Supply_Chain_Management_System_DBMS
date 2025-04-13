const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const shipmentRoutes = require('./routes/shipmentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const User = require('./models/User');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/admin', adminRoutes);

// Database connection and server start
const PORT = process.env.PORT || 5000;

const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ where: { Email: 'admin@example.com' } });
    if (!adminExists) {
      await User.create({
        Name: 'Admin User',
        Email: 'admin@example.com',
        Password: 'admin123',
        Role: 'Admin'
      });
      console.log('Default admin user created successfully');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('Database synchronized.');

    // Create default admin user
    await createDefaultAdmin();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer(); 