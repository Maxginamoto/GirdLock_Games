const mongoose = require('mongoose');

const GameDataSchema = new mongoose.Schema({
    gameName: {
        type: String,
        required: true,
        unique: true
    },
    highScore: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('GameData', GameDataSchema);