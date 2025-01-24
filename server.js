const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bookRoutes = require('./routes/books');
const rentalRoutes = require('./routes/rentals');

dotenv.config();

const app = express();
const port = process.env.PORT || 5231;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/api/books', bookRoutes);
app.use('/api/rentals', rentalRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});