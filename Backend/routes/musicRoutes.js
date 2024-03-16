const express = require('express');
const router = express.Router();
const musicController = require('../controller/musicController');

router.get('/:videokey', musicController.getmusic);

module.exports = router;