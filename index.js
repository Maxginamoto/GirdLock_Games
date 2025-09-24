require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Mongo = process.env.MONGO_URI;
const no = process.env.NODE_ENV;
const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// --- Database Connection ---
mongoose.connect(Mongo, {})
    .then(() => console.log('MongoDB connected successfully!'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- Define Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/game', require('./routes/game')); 

app.get('/', (req, res) => {
    res.send('API is running...');
});
if (no=== 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}
// --- Start Server ---
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
