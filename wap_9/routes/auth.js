<<<<<<< HEAD
const express = require('express');
const authController = require('../controllers/auth.js')
const router = express.Router();

router.post('/login', authController.login);

router.post('/register', authController.register);

=======
const express = require('express');
const authController = require('../controllers/auth.js')
const router = express.Router();

router.post('/login', authController.login);

router.post('/register', authController.register);

>>>>>>> server1
module.exports = router;