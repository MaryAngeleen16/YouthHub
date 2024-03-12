const Forum = require('../models/forum');
const cloudinary = require('cloudinary');


exports.getForums = async (req, res, next) => {

    try {

        let filters = {};

        if (req.query.category) {
            filters.category = req.query.category
        }

        if (req.query.user) {
            filters.user = req.query.user
        }

        let sortOption = {}
        if (req.query.sortType) {
            if (req.query.sortType === 'ra') {
                sortOption.updatedAt = -1;
            } else if (req.query.sortType === 'nto') {
                sortOption.createdAt = -1;
            } else if (req.query.sortType === 'otn') {
                sortOption.createdAt = 1;
            }
        }

        console.log(sortOption)

        const forumTopics = await Forum.find(filters)
            .populate('category')
            .populate('user')
            .sort(sortOption)

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

        if (req.body.image) {

            const imagePath = req.body.image

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

        req.body.user = req.user._id;
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

exports.deleteTopic = async (req, res, next) => {
    try {
        const { id } = req.params

        const forumTopic = await Forum.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Forum topic deleted successfully'
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Error occured'
        })
    }

}

exports.getSingleTopic = async (req, res, next) => {

    try {

        const { id } = req.params;

        const forumTopic = await Forum.findById(id)
            .populate('category')
            .populate('user')
            .populate({
                path: 'userComments.user',
                ref: 'User'
            })
            .populate({
                path: 'userComments.replies.user',
                ref: 'User'
            })

        const relatedTopics = await Forum.find({
            category: forumTopic.category._id
        }).where({
            _id: {
                $ne: id
            }
        })

        if (!forumTopic) {
            return res.status(404).json({
                success: false,
                message: 'Forum topic not found'
            })
        }

        res.status(200).json({
            success: true,
            forumTopic: forumTopic,
            relatedTopics: relatedTopics,
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
        let forumTopic = await Forum.findById(req.params.id);

        if (!forumTopic) {
            return res.status(404).json({
                success: false,
                message: 'Forum topic not found'
            })
        }

        if (req.body.image !== '') {
            console.log('dumaan')
            if (forumTopic.image.public_id) {
                await cloudinary.uploader.destroy(forumTopic.image.public_id);
            }

            const imagePath = req.body.image

            const result = await cloudinary.v2.uploader.upload(`${imagePath}`, {
                folder: 'forums-youthhub',
                width: 1000,
                crop: "auto",
            });

            req.body.image = {
                public_id: result.public_id,
                url: result.secure_url
            }
        } else {
            delete req.body.image
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

// Define offensive language check function within the controller
// const containsOffensiveLanguage = (comment) => {
//     const englishOffensiveWords = [
//         'asshole',
//         'bitch',
//         'stupid',
//         'bastard',
//         'jerk',
//         'moron',
//         'gay',
//         'nigga',
//         'faggot',
//         'retard',
//         'asswipe',
//         'motherfucker',
//         'fuck you',
//         'son of a bitch',
//         'slut',
//         'cock',
//         'dick'
//     ];
//     const tagalogOffensiveWords = [
//         'bobo',
//         'tangina mo',
//         'tanga',
//         'gago',
//         'inutil',
//         'pokpok',
//         'malandi',
//         'maldita',
//         'gaga',
//         'bobita',
//         'tangina',
//         'engot',
//         'pakyu',
//         'pakyo',
//         'pota',
//         'potangina',
//         'ulol',
//         'olol', 
//         'bobita'
//     ];

//     const englishMatch = englishOffensiveWords.some(word => comment.toLowerCase().includes(word.toLowerCase()));
//     const tagalogMatch = tagalogOffensiveWords.some(word => comment.toLowerCase().includes(word.toLowerCase()));

//     return englishMatch || tagalogMatch;
// };


// exports.makeComment = async (req, res, next) => {
//     try {
//         const topicId = req.params.id;
//         const userId = req.user._id;
//         const { comment } = req.body;

//         if (containsOffensiveLanguage(comment)) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Your comment goes against the community standards. It will not be posted.'
//             });
//         }

//         const forumTopic = await Forum.findById(topicId);

//         if (!forumTopic) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Forum topic not found'
//             });
//         }

//         const newComment = {
//             user: userId,
//             comment: comment,
//         };

//         forumTopic.userComments.push(newComment);
//         await forumTopic.save(); // Ensure that saving is awaited

//         res.status(201).json({
//             success: true,
//             message: 'Comment posted',
//             forumTopic: forumTopic,
//         });
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({
//             success: false,
//             message: 'Error occurred while processing the request.'
//         });
//     }
// };



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

        const { commentId, forumTopicId } = req.query;

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

        const { commentId, forumTopicId, replyId } = req.query;

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

exports.categorizeTopics = async (req, res, next) => {
    const categorizeForums = await Forum.aggregate([
        {
            $lookup: {
                from: 'categories', // Use the actual name of your categories collection
                localField: 'category',
                foreignField: '_id',
                as: 'category'
            }
        },
        {
            $unwind: '$category'
        },
        {
            $group: {
                _id: '$category._id',
                name: { $first: '$category.name' },
                description: { $first: '$category.description' },
                forums: { $push: '$$ROOT' }
            }
        },
        {
            $project: {
                _id: 0,
                categoryId: '$_id',
                name: 1,
                description: 1,
                forums: 1
            }
        }
    ]);

    res.status(200).json({
        success: true,
        categorizeForums: categorizeForums
    })

}

// exports.getTopicsByCategory = async (req, res, next) => {

//     try {

//         const forumTopics = await Forum.find({
//             category: req.params.id
//         })

//         res.status(200).json({
//             success: true,
//             forumTopics: forumTopics
//         })

//     } catch (err) {

//         console.log(err)
//         return res.status(500).json({
//             success: false,
//             message: 'Error occured'
//         })

//     }

// }


