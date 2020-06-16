const Review = require('../models/review');
const errorResponse = require('../utils/errorResponse');
const Bootcamp = require('../models/bootcamp');


//@desc     Get All Reviews
//@route    GET /api/v1/reviews
//@route    GET /api/v1/bootcamp/:bootcampId/reviews
//@access   public
exports.getAllReviews = async (req, res, next) => {
    try {
        if (req.params.bootcampId) {
            const reviews = await Review.find({ bootcamp: req.params.bootcampId });
            res.status(200).json({
                success: true,
                count: reviews.length,
                data: reviews
            });
        }
        else {
            res.status(200).json(res.filteredResult);
        }

    } catch (error) {
        next(new errorResponse(error, 400));
    }
}

//@desc     Get Single Review
//@route    GET /api/v1/reviews/:reviewId  
//@access   public
exports.getReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.reviewId);

        if (!review) {
            next(new errorResponse(`Review for id ${req.params.reviewId} not found`, 404));
        }
        res.status(200).json({
            success: true,
            count: review.length,
            data: review
        });

    } catch (error) {
        next(new errorResponse(error, 400));
    }
}

//@desc     Add a Review
//@route    POST /api/v1/bootcamps/:bootcampId/reviews  
//@access   private
exports.addReview = async (req, res, next) => {
    try {
        req.body.bootcamp = req.params.bootcampId;
        req.body.user = req.user.id;

        const bootcamp = await Bootcamp.findById(req.params.bootcampId);
        console.log(bootcamp);
        if(!bootcamp){
            next(new errorResponse(`Bootcamp ${req.params.bootcampId} not found`,404));
        }

        const review = await Review.create(req.body);

        res.status(200).json({
            success: true,
            count: review.length,
            data: review
        });

    } catch (error) {
        next(new errorResponse(error, 400));
    }
}

//@desc     Delete  Review
//@route    Delete /api/v1/reviews/:reviewId  
//@access   private
exports.deleteReview = async (req, res, next) => {
    try {

        const review = await Review.findByIdAndRemove(req.params.reviewId);

        if (!review) {
            next(new errorResponse(`Review for id ${req.params.reviewId} not found`, 404));
        }
        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(new errorResponse(error, 400));
    }
}