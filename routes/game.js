const express = require('express');
const router = express.Router();
const GameData = require('../models/GameData');

const HIGHER_OR_LOWER_ID = 'higherOrLower';
const SNAKE_GAME_ID = 'snake';
// @route   GET api/game/highscore
// @desc    Get the universal high score for Higher or Lower
// @access  Public
router.get('/highscore', async (req, res) => {
    try {
        let game = await GameData.findOne({ gameName: HIGHER_OR_LOWER_ID });
        if (!game) {
            // Create the document if it doesn't exist
            game = new GameData({ gameName: HIGHER_OR_LOWER_ID, highScore: 0 });
            await game.save();
        }
        res.json({ highScore: game.highScore });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/game/highscore
// @desc    Update the universal high score
// @access  Public (since it's a universal score, no auth is needed)
router.post('/highscore', async (req, res) => {
    const { newScore } = req.body;
    try {
        let game = await GameData.findOne({ gameName: HIGHER_OR_LOWER_ID });
        if (newScore > game.highScore) {
            game.highScore = newScore;
            await game.save();
        }
        res.json({ highScore: game.highScore });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/snake-highscore', async (req, res) => {
    try {
        let game = await GameData.findOne({ gameName: SNAKE_GAME_ID });
        if (!game) {
            game = new GameData({ gameName: SNAKE_GAME_ID, highScore: 0 });
            await game.save();
        }
        res.json({ highScore: game.highScore });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/game/snake-highscore
// @desc    Update the universal high score for Snake
// @access  Public
router.post('/snake-highscore', async (req, res) => {
    const { newScore } = req.body;
    try {
        let game = await GameData.findOne({ gameName: SNAKE_GAME_ID });
        if (newScore > game.highScore) {
            game.highScore = newScore;
            await game.save();
        }
        res.json({ highScore: game.highScore });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;