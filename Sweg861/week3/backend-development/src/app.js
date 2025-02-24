const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const bookRoutes = require('./routes/bookRoutes');
const app = express();

// CORS configuration
const corsOptions = {
  origin: ['*'] 
};

// Middleware to simulate HTTPS enforcement
const simulateHTTPS = (req, res, next) => {
  // Simulate HTTPS enforcement
  res.setHeader('X-Simulated-HTTPS', 'Enabled');
  next();
}

// Middleware to ensure the correct domain
// const ensureCorrectDomain = (req, res, next) => {
//   const host = req.get('host');
//   if (host !== 'localhost:8000' && host !== 'localhost:3001' && host !== 'localhost:3000') {
//     return res.status(400).send('Please use localhost:8000 || localhost:3001 || localhost:3000');
//   }
//   next();
// }

// Use the middlewares
app.use(simulateHTTPS);
// app.use(ensureCorrectDomain);

app.use(cors(corsOptions)); // Use the CORS configuration
app.use(helmet());
app.use(express.json());

const swaggerDocument = YAML.load('./src/swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/books', bookRoutes);

// Export the app
const startServer = () => {
  const PORT = process.env.PORT || 8000;
  return app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

module.exports = { app, startServer };