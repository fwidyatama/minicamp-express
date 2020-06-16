const User = require('../models/user');
const errorResponse = require('../utils/errorResponse');


//@desc     Get All User
//@route    GET /api/v1/user/
//@access   private(admin)
exports.getAllUser = async (req, res, next) => {
    try {
        res.status(200).json(res.filteredResult);
    } catch (error) {
        next(new errorResponse(error, 400));
    }
}

//@desc     Create User
//@route    POST /api/v1/user
//@access   private(admin)
exports.createUser = async (req, res, next) => {
    try {
        const { name, email, role, password } = req.body;

        const user = await User.create({
            name, email, role, password
        });

       res.status(200).json({
           success:true,
           data:user
       });
    } catch (error) {
        next(new errorResponse(error, 400));
    }
}

//@desc     Get Single User
//@route    GET /api/v1/user/user/:id
//@access   private(admin)
exports.getSingleUser = async (req, res, next) => {
    try {
       const user = await User.findById(req.params.id);

       res.status(200).json({
           success:true,
           data:user
       });

    } catch (error) {
        next(new errorResponse(error, 400));
    }
}

//@desc     Update User
//@route    POST /api/v1/user/update/:id
//@access   private(admin)
exports.updateUser = async (req, res, next) => {
    try {
        
        const user = await User.findByIdAndUpdate(req.params.id,req.body,{
            runValidators:true,
            new:true
        });

       res.status(200).json({
           success:true,
           data:user
       });

    } catch (error) {
        next(new errorResponse(error, 400));
    }
}

//@desc     Delete User
//@route    Delete /api/v1/user/:id
//@access   private(admin)
exports.deleteUser = async (req, res, next) => {
    try {
    const user = await User.findByIdAndRemove(req.params.id);
       res.status(200).json({
           success:true,
           data:{}
       });

    } catch (error) {
        next(new errorResponse(error, 400));
    }
}