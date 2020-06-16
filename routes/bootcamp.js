const express = require('express');
const router = express.Router();

const bootcampController = require('../controllers/bootcamps');
const courseRouter = require('../routes/course');
const reviewRouter = require('../routes/review');
const {authMiddleware,roleCheck} = require('../middlewares/auth');
const Bootcamp = require('../models/bootcamp');
const filterResult = require('../middlewares/filterResult');

// anything beginning with /:bootcampId/courses will use this router
router.use('/:bootcampId/courses',courseRouter);
router.use('/:bootcampId/reviews',reviewRouter);


router.route('/').get(filterResult(Bootcamp,'courses'),bootcampController.getBootcamps)
    .post(authMiddleware,roleCheck('admin','publisher'),bootcampController.createBootcamp);

router.route('/:id').get(bootcampController.getBootcamp)
    .put(authMiddleware,roleCheck('admin','publisher'),bootcampController.updateBootcamp)
    .delete(authMiddleware,roleCheck('admin','publisher'),bootcampController.deleteBootcamp);

router.route('/:id/photo').put(authMiddleware,roleCheck('admin','publisher'),bootcampController.uploadBootcampPhoto);

router.route('/:zipcode/:distance').get(bootcampController.getBootcampsInRadius);

module.exports = router;