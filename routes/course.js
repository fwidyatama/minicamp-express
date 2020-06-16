const express = require('express');
const router = express.Router({ mergeParams: true });
const {authMiddleware,roleCheck} = require('../middlewares/auth');


const courseController = require('../controllers/courses');
const Course = require('../models/course');
const filterResult = require('../middlewares/filterResult');

router.route('/')
    .get(filterResult(Course,'bootcamp'),courseController.getCourses)
    .post(authMiddleware,roleCheck('admin','publisher'),courseController.createCourse);

router.route('/:courseId')
    .get(courseController.getCourse)
    .put(authMiddleware,roleCheck('admin','publisher'),courseController.editCourse)
    .delete(authMiddleware,roleCheck('admin','publisher'),courseController.deleteCourse);


module.exports = router;