const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const cors = require('cors');

const app = express();
// const corsOptions = {
//   origin: 'http://localhost:8002',
//   credentials: true, //access-control-allow-credentials:true
//   optionSuccessStatus: 200,
// };

// Connect Database
connectDB();

// Init Middleware
// app.use(cors(corsOptions));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/category', require('./routes/api/category'));
app.use('/api/product', require('./routes/api/product'));
app.use('/api/customer', require('./routes/api/customer'));
app.use('/api/order', require('./routes/api/order'));
app.use('/api/restaurant', require('./routes/api/restaurant'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
