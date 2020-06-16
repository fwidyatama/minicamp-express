const express = require('express');
const router = express.Router({mergeParams:true});

const { authMiddleware, roleCheck } = require('../middlewares/auth');
const reviewController = require('../controllers/review');
const filterResult = require('../middlewares/filterResult');
const Review = require('../models/review');


router.route('/')
.get(filterResult(Review,{path:'bootcamp',select:'name description'}), reviewController.getAllReviews)
.post(authMiddleware,roleCheck('user','admin'),reviewController.addReview);

router.route('/:reviewId')
.get(reviewController.getReview)
.delete(authMiddleware,roleCheck('admin'),reviewController.deleteReview);



module.exports = router;