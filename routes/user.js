const { Router } = require("express");

const express = require('express');
const router = express.Router();
const {authMiddleware,roleCheck} = require('../middlewares/auth');
const userController = require('../controllers/user');
const filterResult = require('../middlewares/filterResult');
const User = require('../models/user');


router.use(authMiddleware);
router.use(roleCheck('admin'));

router.route('/')
.get(filterResult(User),userController.getAllUser)
.post(userController.createUser);
router.route('/:id')
.put(userController.updateUser)
.get(userController.getSingleUser)
.delete(userController.deleteUser);


module.exports = router;
