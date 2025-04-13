const sequelize = require('./config/db');
const Supplier = require('./models/Supplier');
const Product = require('./models/Product');
const Order = require('./models/Order');
const OrderItem = require('./models/OrderItem');
const Shipment = require('./models/Shipment');

const suppliers = [
  {
    Name: 'Tech Solutions Inc',
    Contact: '+1-555-0123',
    Address: '123 Tech Street, Silicon Valley, CA',
    Email: 'contact@techsolutions.com',
    Status: 'Active'
  },
  {
    Name: 'Global Electronics',
    Contact: '+1-555-0124',
    Address: '456 Electronics Ave, New York, NY',
    Email: 'info@globalelectronics.com',
    Status: 'Active'
  },
  {
    Name: 'Smart Devices Co',
    Contact: '+1-555-0125',
    Address: '789 Smart Road, Boston, MA',
    Email: 'sales@smartdevices.com',
    Status: 'Active'
  }
];

const products = [
  {
    Name: 'Laptop Pro X1',
    Description: 'High-performance laptop with 16GB RAM',
    Category: 'Electronics',
    Stock: 50,
    Price: 999.99,
    MinStockLevel: 10,
    SupplierID: 1
  },
  {
    Name: 'Smartphone Y2',
    Description: 'Latest smartphone with 5G capability',
    Category: 'Electronics',
    Stock: 100,
    Price: 699.99,
    MinStockLevel: 20,
    SupplierID: 2
  },
  {
    Name: 'Tablet Z3',
    Description: '10-inch tablet with stylus support',
    Category: 'Electronics',
    Stock: 75,
    Price: 499.99,
    MinStockLevel: 15,
    SupplierID: 3
  }
];

const orders = [
  {
    OrderDate: new Date(),
    Status: 'Processing',
    TotalAmount: 1499.98,
    SupplierID: 1,
    Notes: 'Urgent order for weekend delivery'
  },
  {
    OrderDate: new Date(),
    Status: 'Pending',
    TotalAmount: 999.99,
    SupplierID: 2,
    Notes: 'Regular monthly order'
  }
];

const orderItems = [
  {
    OrderID: 1,
    ProductID: 1,
    Quantity: 1,
    UnitPrice: 999.99,
    TotalPrice: 999.99
  },
  {
    OrderID: 1,
    ProductID: 2,
    Quantity: 1,
    UnitPrice: 499.99,
    TotalPrice: 499.99
  },
  {
    OrderID: 2,
    ProductID: 3,
    Quantity: 2,
    UnitPrice: 499.99,
    TotalPrice: 999.99
  }
];

const shipments = [
  {
    OrderID: 1,
    TrackingNumber: 'TRK123456',
    Status: 'In Transit',
    EstimatedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    Carrier: 'FedEx',
    Notes: 'Express shipping'
  },
  {
    OrderID: 2,
    TrackingNumber: 'TRK789012',
    Status: 'Preparing',
    EstimatedDeliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    Carrier: 'UPS',
    Notes: 'Standard shipping'
  }
];

const seedDatabase = async () => {
  try {
    // Sync database with force: true to drop existing tables
    console.log('Syncing database...');
    await sequelize.sync({ force: true });
    console.log('Database synced successfully');

    // Insert suppliers
    console.log('Creating suppliers...');
    const createdSuppliers = await Supplier.bulkCreate(suppliers);
    console.log(`Created ${createdSuppliers.length} suppliers`);

    // Insert products
    console.log('Creating products...');
    const createdProducts = await Product.bulkCreate(products);
    console.log(`Created ${createdProducts.length} products`);

    // Insert orders
    console.log('Creating orders...');
    const createdOrders = await Order.bulkCreate(orders);
    console.log(`Created ${createdOrders.length} orders`);

    // Insert order items
    console.log('Creating order items...');
    const createdOrderItems = await OrderItem.bulkCreate(orderItems);
    console.log(`Created ${createdOrderItems.length} order items`);

    // Insert shipments
    console.log('Creating shipments...');
    const createdShipments = await Shipment.bulkCreate(shipments);
    console.log(`Created ${createdShipments.length} shipments`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    console.error('Error details:', error.message);
    if (error.errors) {
      error.errors.forEach(err => console.error('Validation error:', err.message));
    }
    process.exit(1);
  }
};

// Run the seed function
console.log('Starting database seeding...');
seedDatabase(); 