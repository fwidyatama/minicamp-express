const Course = require('../models/course');
const Bootcamp = require('../models/bootcamp');
const errorResponse = require('../utils/errorResponse');

//@desc     Get all course
//@route    GET /api/v1/courses
//@route    GET /api/v1/bootcamps/:bootcampId/courses
//@access   public
exports.getCourses = async (req, res, next) => {
    try {

        res.status(201).json(res.filteredResult);

    } catch (error) {
        next(error);

    }
}

//@desc     Get single course
//@route    GET /api/v1/courses/:courseId
//@access   public
exports.getCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.courseId).populate({
            path: 'bootcamp',
            select: 'name description'
        });

        if (!course) {
            next(new errorResponse(`Course with id ${req.params.courseId} not found`, 404));
        }

        res.status(201).json({
            success: true,
            data: course
        });

    } catch (error) {
        next(error);

    }
}

//@desc     Create course
//@route    POST /api/v1/bootcamps/:bootcampId/courses
//@access   private
exports.createCourse = async (req, res, next) => {
    try {

        let bootcamp = await Bootcamp.findById(req.params.bootcampId);

        if (!bootcamp) {
            next(new errorResponse(`Course with id ${req.params.courseId} not found`, 404));
        }
        if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
            next(
                new errorResponse(
                `Id ${req.user.id} not authorized for add this course to bootcamp with id ${req.params.bootcampId}`, 401
                )
            );
        }
        else{
            req.body.bootcamp = req.params.bootcampId;
            req.body.user = req.user.id;
            const course = await Course.create(req.body)
            res.status(201).json({
                success: true,
                data: course
            });
        }
  
    } catch (error) {
        next(error);

    }
}


//@desc     Edit course
//@route    PUT /api/v1/courses/:courseId
//@access   private
exports.editCourse = async (req, res, next) => {
    try {
        let course = await Course.findById(req.params.courseId)
        console.log(course);

        if(course.user.toString()!==req.user.id && req.user.role!=='admin'){
            next(
                new errorResponse(
                `Id ${req.user.id} not authorized for edit this course`, 401
                )
            );
        }

        course = await Course.findByIdAndUpdate(req.params.courseId, req.body, {
            new: true,
            runValidators: true
        });
        res.status(201).json({
            success: true,
            data: course
        });

    } catch (error) {
        next(error);
    }
}

//@desc     Delete course
//@route    DELETE /api/v1/courses/:courseId
//@access   private
exports.deleteCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.courseId);



        if (!course) {
            next(new errorResponse(`Course with id ${req.params.courseId} not found`, 404));
        }

        
        if(course.user.toString()!==req.user.id && req.user.role!=='admin'){
            next(
                new errorResponse(
                `Id ${req.user.id} not authorized for delete this course`, 401
                )
            );
        }
        else{
            
        course.remove();

        res.status(201).json({
            success: true,
            data: {}
        });
        }
      

    } catch (error) {
        next(error);
    }
}