const Bootcamp = require('../models/bootcamp');
const errorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');

//@desc     Get all bootcamps
//@route    GET /api/v1/bootcamps
//@access   public
exports.getBootcamps = async (req, res, next) => {
    try {
        res.status(200).json(res.filteredResult);

    } catch (error) {
        next(error);
    }
}

//@desc     Get single bootcamp
//@route    GET /api/v1/bootcamps/:id
//@access   public
exports.getBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);
        if (!bootcamp) {
            next(new errorResponse(`Bootcamp for id ${req.params.id} not found`, 404));
        }
        res.status(200).json({
            success: true,
            data: bootcamp
        });
    } catch (error) {
        next(error);
    }
}

//@desc     Create bootcamp
//@route    POST /api/v1/bootcamps
//@access   private
exports.createBootcamp = async (req, res, next) => {
    try {
        req.body.user = req.user.id;
        const createdBootcamp = await Bootcamp.findOne({ user: req.user.id });
        //only admin can create more than 1 bootcamp
        if (createdBootcamp && req.user.role !== 'admin') {
            next(new errorResponse(`This ${req.user.id} already published a bootcamp`, 401));
        }
        else {
            const bootcamp = await Bootcamp.create(req.body)
            res.status(201).json({
                success: true,
                data: bootcamp
            });
        }
    } catch (error) {
        next(error);

    }
}

//@desc     Update bootcamp
//@route    PUT /api/v1/bootcamps/:id
//@access   private
exports.updateBootcamp = async (req, res, next) => {
    try {
        let bootcamp = await Bootcamp.findById(req.params.id);
        //only owner and admin can update bootcamp
        if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
            next(new errorResponse(`Id ${req.user.id} not authorized for update this bootcamp`, 401));
        }
        bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            runValidators: true,
            new: true
        })
        res.status(200).json({
            success: true,
            msg: bootcamp
        })
    } catch (error) {
        next(error)
    }
}

//@desc     Delete bootcamp
//@route    DELETE /api/v1/bootcamps/:id
//@access   private
exports.deleteBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);
        if (!bootcamp) {
            next(new errorResponse(`Bootcamp for id ${req.params.id} not found`, 404));
        }
        //only owner and admin can update bootcamp
        if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
            next(new errorResponse(`Id ${req.user.id} not authorized for update this bootcamp`, 401));
        }
        bootcamp.remove();
        res.status(200).json({
            success: true,
            msg: 'Success delete bootcamp'
        })
    } catch (error) {
        next(error);
    }
}

//@desc     Get bootcamp by zipcode and radius
//@route    GET /api/v1/bootcamps/:zipcode/:radius
//@access   public
exports.getBootcampsInRadius = async (req, res, next) => {
    try {
        const { zipcode, distance } = req.params;
        //geocode location and get long lat
        const location = await geocoder.geocode(zipcode);
        const long = location[0].longitude;
        const lat = location[0].latitude;

        //distance in mile
        const radius = distance / 3963.2;

        //search in radius
        const bootcamps = await Bootcamp.find({
            location: { $geoWithin: { $centerSphere: [[long, lat], radius] } }
        });
        res.status(200).json({
            count: bootcamps.length,
            success: true,
            data: bootcamps
        })

    } catch (error) {
        next(error);
    }
}

//@desc     Upload bootcamp photo
//@route    PUT /api/v1/bootcamps/:id/photo
//@access   private
exports.uploadBootcampPhoto = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);
        if (!bootcamp) {
            next(new errorResponse(`Bootcamp for id ${req.params.id} not found`, 404));
        }

        //only owner and admin can update bootcamp
        if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
            next(new errorResponse(`Id ${req.user.id} not authorized for update this bootcamp`, 401));
        }

        let photo = req.files.photo;
        if (!photo.mimetype.startsWith('image')) {
            next(new errorResponse('Please upload with image only', 400));
        }
        if (photo.size > process.env.PHOTO_MAX_SIZE) {
            next(new errorResponse('Photo size should less 10MB', 400));
        }
        const photoName = `${bootcamp.id}_photo.jpg`;

        photo.mv(`${process.env.PHOTO_UPLOAD_PATH}/${photoName}`), async (err) => {
            if (err) {
                console.log(err);
            }
        }
        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: photoName });
        res.status(200).send({
            success: true,
            data: bootcamp
        })
    } catch (error) {
        next(error);
    }
}