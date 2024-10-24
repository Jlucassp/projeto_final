const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000'
}));

// Importando as rotas
const authRoutes = require('./routes/auth');
const resourceRoutes = require('./routes/resource');

// Usando as rotas
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.log('Error connecting to MongDB:', error));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});