const User = require('../models/user');
const sendToken = require('../utils/jwttoken');
const cloudinary = require('cloudinary');
const crypto = require('crypto');

exports.registerUser = async (req, res, next) => {
    try {
        const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: 'avatars',
            width: 150,
            crop: "scale"
        });

        const { name, email, password, role } = req.body;
        const user = await User.create({
            name,
            email,
            password,
            avatar: {
                public_id: result.public_id,
                url: result.secure_url
            },
        });

        if (!user) {
            return res.status(500).json({
                success: false,
                message: 'User not created'
            });
        }

        sendToken(user, 200, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please enter email & password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return res.status(401).json({ message: 'Invalid Email or Password' });
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return res.status(401).json({ message: 'Invalid Email or Password' });
    }

    sendToken(user, 200, res);
};

exports.logout = async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: 'Logged out'
    });
};

exports.forgotPassword = async (req, res, next) => {
    // Implement forgot password functionality here (if needed).
    // Remove this function if you don't need it.
};

exports.resetPassword = async (req, res, next) => {
    // Implement password reset functionality here (if needed).
    // Remove this function if you don't need it.
};

exports.getUserProfile = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    });
};

exports.updatePassword = async (req, res, next) => {
    const user = await User.findById(req.user.id).select('password');

    const isMatched = await user.comparePassword(req.body.oldPassword);
    if (!isMatched) {
        return res.status(400).json({ message: 'Old password is incorrect' });
    }
    user.password = req.body.password;
    await user.save();
    sendToken(user, 200, res);
};

exports.updateProfile = async (req, res, next) => {

    try {
        // const newUserData = {
        //     name: req.body.name,
        //     email: req.body.email
        // };
        console.log(req.body);
        if (req.body.avatar) {
            const user = await User.findById(req.user.id);

            const image_id = user.avatar.public_id;
            const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
                folder: 'avatars',
                width: 150,
                crop: "scale"
            });

            req.body.avatar = {
                public_id: result.public_id,
                url: result.secure_url
            };
        }

        const user = await User.findByIdAndUpdate(req.user.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!user) {
            return res.status(401).json({ message: 'User Not Updated' });
        }

        res.status(200).json({
            success: true,
            message: 'Update Successfully',
            user: user
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message })
    }
};

exports.allUsers = async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users
    });
};

exports.getUserDetails = async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(400).json({ message: `User does not found with id: ${req.params.id}` });
    }

    res.status(200).json({
        success: true,
        user
    });
};

exports.getAdditionalInfo = async (req, res, next) => {
    try {
        const userId = req.user.id; // Get the user ID from the request

        // Update user information based on the request body
        const updatedUserData = {
            bio: req.body.bio,
            birthday: req.body.birthday,
            location: req.body.location,
            phone: req.body.phone,
            gender: req.body.gender // Include gender field
        };

        // Find the user by ID and update the information
        const user = await User.findByIdAndUpdate(userId, updatedUserData, {
            new: true, // Return the updated document
            runValidators: true // Run validation
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // sendToken(user, 200, res)
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

exports.editUserRole = async (req, res, next) => {
    const { userId, newRole } = req.body;

    try {
        const user = await User.findByIdAndUpdate(userId, { role: newRole }, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};


exports.deleteUser = async (req, res, next) => {
    const userId = req.params.id;

    try {
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

// authController.js

exports.getPublicUserNames = async (req, res, next) => {
    try {
        if (req.publicUsers) {
            return res.status(200).json({
                success: true,
                users: req.publicUsers
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'No public users found'
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};
