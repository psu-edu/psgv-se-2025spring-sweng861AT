const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const bookRoutes = require('./routes/bookRoutes');
const app = express();

// Middleware to simulate HTTPS enforcement
const simulateHTTPS = (req, res, next) => {
  // Simulate HTTPS enforcement
  res.setHeader('X-Simulated-HTTPS', 'Enabled');
  console.log('Simulated HTTPS enforcement');
  next();
}

// Middleware to ensure the correct domain
const ensureCorrectDomain = (req, res, next) => {
  const host = req.get('host');
  if (host !== 'localhost:3001') {
    return res.status(400).send('Please use localhost:3001');
  }
  next();
}

// Use the middlewares
app.use(simulateHTTPS);
app.use(ensureCorrectDomain);

app.use(cors());
app.use(helmet());
app.use(express.json());

const swaggerDocument = YAML.load('./src/swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/books', bookRoutes);

const HOST = 'localhost';
const PORT = 3001;

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
  console.log(`In a production environment, this would be running on HTTPS`);
});
