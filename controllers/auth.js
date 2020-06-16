const User = require('../models/user');
const errorResponse = require('../utils/errorResponse');
const bcrypt = require('bcrypt');
const sendEmail = require('../utils/mail');
const crypto = require('crypto');

//@desc     Register User
//@route    POST /api/v1/auth/register
//@access   public
exports.registerUser = async (req, res, next) => {
    try {
        const { name, email, role, password } = req.body;

        const user = await User.create({
            name, email, role, password
        });

        storeCookiesToken(user, 200, res);

    } catch (error) {
        next(new errorResponse(error, 400));
    }
}

//@desc     Login 
//@route    POST /api/v1/auth/login
//@access   public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            next(new errorResponse('Please provide email and password', 400));
        }

        // + karena passwordnya biar diinclude soalnya defaultnya di hide. 
        const user = await User.findOne({ email: email }).select('password');

        if (!user) {
            next(new errorResponse('Incorrect email or password, please try again', 404));
        }

        const isSuccess = await bcrypt.compare(password, user.password);
        if (!isSuccess) {
            next(new errorResponse('Incorrect email or password, please try again', 401));
        }
        else {
            storeCookiesToken(user, 200, res);
        }

    } catch (error) {
        next(new errorResponse(error, 400));
    }
}


//@desc     Get Profile 
//@route    GET /api/v1/auth/profile
//@access   private
exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(new errorResponse(error, 400));
    }
}

//@desc     FORGOT Password 
//@route    POST /api/v1/auth/forgotpassword
//@access   public
exports.forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            next(new errorResponse('User not found', 404));
        }
        const token = user.generateResetPasswordToken();

        await user.save({ validateBeforeSave: false });

        const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${token}`;

        const message = `You receiving this email because do a password reset request. Please hit this URL ${resetUrl}`;
        const options = {
            to: user.email,
            text: message
        };
        try {
            sendEmail(options);
            res.status(200).json({
                success: true,
                data: 'Email sent'
            });

        } catch (error) {
            console.log(error);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
        }
        storeCookiesToken(user, 200, res);

    } catch (error) {
        next(new errorResponse(error, 400));
    }
}

//@desc     Reset Password 
//@route    PUT /api/v1/auth/resetpassword/token
//@access   public
exports.resetPassword = async (req, res, next) => {

    const resetToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        resetPasswordToken: resetToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        next(new errorResponse('Invalid token', 401));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    storeCookiesToken(user, 200, res);
}

//@desc     Update User 
//@route    PUT /api/v1/auth/updateuser
//@access   private
exports.updateUser = async (req, res, next) => {
    try {
        const updatedFields = {
            name: req.body.name,
            email : req.body.email
        }
        const user = await User.findByIdAndUpdate(req.user.id,updatedFields,{runValidators:true});
        res.status(200).json({
            success:true,
            data:user
        });
    } catch (error) {
        next(new errorResponse(error,401));
    }
}


//@desc     Update password 
//@route    PUT /api/v1/auth/updateuser
//@access   private
exports.updatePassword = async (req, res, next) => {
    try {   
        const user = await User.findOne({_id:req.user.id}).select('+password');
        user.password = req.body.password;
        await user.save({runValidators:false});
        res.status(200).json({
            success:true,
            data:user
        });

        
    } catch (error) {
        next(new errorResponse(error,401));
    }
}


//to store token in cookies
const storeCookiesToken = (user, statusCode, res) => {
    const token = user.getJwtToken();
    const options = {
        httpOnly: true,
        expires: new Date(Date.now() + process.env.JWT_COOKIES_EXP * 24 * 60 * 60 * 1000)
    }
    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        });
}
