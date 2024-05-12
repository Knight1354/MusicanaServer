const express = require('express');
const bodyParser = require('body-parser');
const musicRoutes = require('./routes/musicRoutes');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
app.use('/public', express.static('assets/music'))
app.use(express.json());

// Middleware
app.use(cors());

// Routes
app.use('/music', musicRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
