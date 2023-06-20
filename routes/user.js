const express = require('express');
const router = express.Router();
const userAuthentication = require('../middleware/auth');
// const expenseController = require('../controllers/expense');

const userController = require('../controllers/user');


router.post('/user/signup', userController.addUser);
router.post('/user/login', userController.login);

module.exports = router;