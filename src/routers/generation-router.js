const express = require('express');
const generationController = require('../controllers/generation-controller');
const router = express.Router();
const asyncHandler = require('../utils/async-handler');
const { auth, checkAdmin } = require('../middlewares/verify-token');

router.get('/', asyncHandler(generationController.findAllGeneration));
router.post('/', auth, checkAdmin, asyncHandler(generationController.addGeneration));
router.patch('/:id', auth, checkAdmin, asyncHandler(generationController.modifyGeneration));
router.delete('/:id', auth, checkAdmin, asyncHandler(generationController.removeGeneration));

module.exports = router;
