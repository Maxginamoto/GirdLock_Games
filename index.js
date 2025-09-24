const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Mongo = "mongodb+srv://MKUltra:Max2103@games.6kcxrz3.mongodb.net/?retryWrites=true&w=majority&appName=Games" ;
const no = 'production';
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
//app.use('/api/auth', require('./routes/auth'));
app.use('/api/game', require('./routes/game')); 

if (no === 'production') {
    // Set static folder
    app.use(express.static('./client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}
// --- Start Server ---
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
