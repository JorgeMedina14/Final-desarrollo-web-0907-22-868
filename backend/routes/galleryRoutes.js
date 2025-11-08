const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const { verificarSesion } = require('../middleware/auth');

router.get('/', verificarSesion, galleryController.getGallery);

module.exports = router;
