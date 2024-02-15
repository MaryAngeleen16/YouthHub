const Forum = require('../models/forum');
const cloudinary = require('cloudinary');

exports.getForums = async (req, res, next) => {

    try {

        const forumTopics = await Forum.find({})
            .populate('category');

        if (!forumTopics?.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'No topics available'
            })
        }

        res.status(200).json({
            success: true,
            count: forumTopics.length,
            forumTopics: forumTopics,
        })

    } catch (err) {

        console.log(err)
        return res.status(500).json({
            success: false,
            message: 'Error occured'
        })

    }
}

exports.createTopic = async (req, res, next) => {

    try {

        if (req.file) {

            const imagePath = req.file.path

            const result = await cloudinary.v2.uploader.upload(`${imagePath}`, {
                folder: 'forums-youthhub',
                width: 1000,
                crop: "auto",
            });

            req.body.image = {
                public_id: result.public_id,
                url: result.secure_url
            }
        }

        const forumTopic = await Forum.create(req.body);

        if (!forumTopic) {
            return res.status(400).json({
                success: false,
                message: 'Forum topic not created'
            })
        }

        return res.status(200).json({
            success: true,
            forumTopic: forumTopic,
        })

    } catch (err) {

        console.log(err)
        return res.status(500).json({
            success: false,
            message: 'Error occured'
        })

    }

}

exports.getSingleTopic = async (req, res, next) => {

    try {

        const { id } = req.params;

        const forumTopic = await Forum.findById(id)
            .populate('category');

        if (!forumTopic) {
            return res.status(404).json({
                success: false,
                message: 'Forum topic not found'
            })
        }

        res.status(200).json({
            success: true,
            forumTopic: forumTopic,
        })

    } catch (err) {

        console.log(err)
        return res.status(500).json({
            success: false,
            message: 'Error occured'
        })

    }
}

exports.editForumTopic = async (req, res, next) => {
    try {
        console.log(req.body)
        let forumTopic = await Forum.findById(req.params.id);

        if (!forumTopic) {
            return res.status(404).json({
                success: false,
                message: 'Forum topic not found'
            })
        }

        if (req.file) {

            if (forumTopic.image) {
                await cloudinary.uploader.destroy(forumTopic.image.public_id);
            }

            const imagePath = req.file.path

            const result = await cloudinary.v2.uploader.upload(`${imagePath}`, {
                folder: 'forums-youthhub',
                width: 1000,
                crop: "auto",
            });

            req.body.image = {
                public_id: result.public_id,
                url: result.secure_url
            }
        }

        forumTopic = await Forum.findByIdAndUpdate(req.params.id, req.body);

        res.status(201).json({
            success: true,
            message: 'Forum topic updated',
            forumTopic: forumTopic,
        })

    } catch (err) {

        console.log(err)
        return res.status(500).json({
            success: false,
            message: 'Error occured'
        })

    }

}

exports.makeComment = async (req, res, next) => {

    try {

        const topicId = req.params.id;
        const userId = req.user._id;

        const forumTopic = await Forum.findById(topicId);

        if (!forumTopic) {
            return res.status(404).json({
                success: false,
                message: 'Forum topic not found'
            })
        }

        const newComment = {
            user: userId,
            comment: req.body.comment,
        }

        forumTopic.userComments.push(newComment);
        forumTopic.save();

        res.status(201).json({
            success: true,
            message: 'Comment posted',
            forumTopic: forumTopic,
        })

    } catch (err) {

        console.log(err)
        return res.status(500).json({
            success: false,
            message: 'Error occured'
        })

    }
}

exports.editComment = async (req, res, next) => {

    try {

        const { commentId, forumTopicId, comment } = req.body;

        const forumTopic = await Forum.findById(forumTopicId);

        // finding nemo, joke, finding comment and updating
        forumTopic.userComments
            .find(comment => comment._id.toString() == commentId)
            .comment = comment;

        forumTopic.save();

        res.status(200).json({
            success: true,
            forumTopic: forumTopic
        })

    } catch (err) {

        console.log(err)
        return res.status(500).json({
            success: false,
            message: 'Error occured'
        })

    }
}

exports.deleteComment = async (req, res, next) => {

    try {

        const { commentId, forumTopicId } = req.body;

        const forumTopic = await Forum.findById(forumTopicId)

        const updatedComments = forumTopic
            .userComments.filter(comment => comment._id.toString() !== commentId);

        forumTopic.userComments = updatedComments;

        forumTopic.save();

        res.status(200).json({
            success: true,
            message: 'Comment deleted',
            forumTopic: forumTopic,
        })

    } catch (err) {

        console.log(err)
        return res.status(500).json({
            success: false,
            message: 'Error occured'
        })

    }

}

exports.replyToComment = async (req, res, next) => {

    try {

        const { commentId, forumTopicId, comment } = req.body;

        const forumTopic = await Forum.findById(forumTopicId); // 1. forum topic

        forumTopic.userComments
            .find(comment => comment._id.toString() == commentId) // 2. find comment in forum topic
            .replies.push({ // 3. push new comment in replies 
                comment,
                user: req.user._id
            })

        forumTopic.save(); // 4. saving changes

        res.status(200).json({
            success: true,
            forumTopic: forumTopic
        })

    } catch (err) {

        console.log(err)
        return res.status(500).json({
            success: false,
            message: 'Error occured'
        })

    }
}

exports.editRepliedComment = async (req, res, next) => {

    try {

        const { commentId, forumTopicId, comment, replyId } = req.body;

        const forumTopic = await Forum.findById(forumTopicId);

        if (!forumTopic) {
            return res.status(404).json({
                success: false,
                message: 'Forum topic not found'
            })
        }

        forumTopic.userComments
            .find(comment => comment._id.toString() == commentId) // find comment in forum topic
            .replies.find(replyComment => replyComment._id.toString() == replyId) // find reply comment in userComments array
            .comment = comment; // change the replied comment

        forumTopic.save();

        res.status(200).json({
            success: true,
            forumTopic: forumTopic
        })

    } catch (err) {

        console.log(err)
        return res.status(500).json({
            success: false,
            message: 'Error occured'
        })

    }

}

exports.deleteRepliedComment = async (req, res, next) => {

    try {

        const { commentId, forumTopicId, replyId } = req.body;

        const forumTopic = await Forum.findById(forumTopicId)

        const updatedRepliedComments = forumTopic
            .userComments.find(comment => comment._id.toString() == commentId)
            .replies.filter(comment => comment._id.toString() !== replyId)

        forumTopic
            .userComments.find(comment => comment._id.toString() == commentId)
            .replies = updatedRepliedComments;

        forumTopic.save()

        res.status(200).json({
            success: true,
            message: 'Replied omment deleted',
            forumTopic: forumTopic,
        })

    } catch (err) {

        console.log(err)
        return res.status(500).json({
            success: false,
            message: 'Error occured'
        })

    }
}