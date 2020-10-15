const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('API Running'));
// Define Routes
app.use('/api/restaurants', require('./routes/api/restaurants'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));