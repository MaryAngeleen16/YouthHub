const Video = require('../models/video');
const mongoose = require('mongoose');
const APIFeatures = require('../utils/apiFeatures');
const cloudinary = require('cloudinary')

// exports.newVideo = async (req, res, next) => {

// 	let videoLinks = [];
// 	let videos = []

// 	if (req.files.length > 0) {
// 		req.files.forEach(video => {
// 			videos.push(video.path)
// 		})
// 	}
exports.newVideo = async (req, res, next) => {
	let videoLinks = [];
	let videos = [];

	if (req.files && req.files.length > 0) { // Add a check for req.files
		req.files.forEach((video) => {
			videos.push(video.path);
		});
	}

	if (req.file) {
		videos.push(req.file.path);
	}

	if (req.body.videos) {
		if (typeof req.body.videos === 'string') {
			videos.push(req.body.videos)
		} else {
			videos = req.body.videos
		}
	}

	for (let i = 0; i < videos.length; i++) {
		let videoDataUri = videos[i]
		console.log(videoDataUri)
		try {
			const result = await cloudinary.v2.uploader.upload(`${videoDataUri}`, {
				folder: 'videos-youthhub',
				resource_type: 'video'
			});

			videoLinks.push({
				public_id: result.public_id,
				url: result.secure_url
			})

		} catch (error) {
			console.log(error)
		}

	}

	req.body.videos = videoLinks
	//req.body.user = req.user.id;

	const video = await Video.create(req.body);
	if (!video)
		return res.status(400).json({
			success: false,
			message: 'Video not created'
		})


	res.status(201).json({
		success: true,
		video
	})
}

exports.deleteVideo = async (req, res) => {
	try {
		const { id } = req.params;

		const video = await Video.findByIdAndDelete(id);

		if (!video) {
			return res.status(404).json({ message: 'Video not found' });
		}

		return res.json({ message: 'Video deleted successfully' });
	} catch (error) {
		return res.status(500).json({ error: 'Internal server error' });
	}
};

exports.getVideos = async (req, res, next) => {
	const videos = await Video.find({});
	res.status(200).json({
		success: true,
		count: videos.length,
		videos
	})
}

exports.getSingleVideo = async (req, res, next) => {
	const video = await Video.findById(req.params.id);
	if (!video) {
		return res.status(404).json({
			success: false,
			message: 'Video not found'
		})
	}
	res.status(200).json({
		success: true,
		video
	})
}

exports.getAdminVideos = async (req, res, next) => {

	const videos = await Video.find();

	res.status(200).json({
		success: true,
		videos
	})
}
exports.updateVideo = async (req, res, next) => {
	// console.log(req.files)
	console.log(req.file)
	try {
		// console.log(req.files);s
		let video = await Video.findById(req.params.id);

		if (!video) {
			return res.status(404).json({
				success: false,
				message: 'Video not found'
			});
		}

		let videos = [];
		let videoLinks = [];

		if (req.files && req.files.length > 0) { // Add a check for req.files
			req.files.forEach((video) => {
				videos.push(video.path);
			});
		}

		if (req.file) {
			videos.push(req.file.path);
		}

		if (req.body.videos) {
			if (typeof req.body.videos === 'string') {
				videos.push(req.body.videos)
			} else {
				videos = req.body.videos
			}
		}

		console.log(videos)
		for (let i = 0; i < videos.length; i++) {
			let videoDataUri = videos[i]
			console.log(videoDataUri)
			try {
				const result = await cloudinary.v2.uploader.upload(`${videoDataUri}`, {
					folder: 'videos-youthhub',
					resource_type: 'video'
				});

				videoLinks.push({
					public_id: result.public_id,
					url: result.secure_url
				})

			} catch (error) {
				console.log(error)
			}

		}
		req.body.videos = videoLinks
		// if (req.body.videos) {
		//     let videos = [];

		//     if (typeof req.body.videos === 'string') {
		//         videos.push(req.body.videos);
		//     } else {
		//         videos = req.body.videos;
		//     }

		//     if (videos && videos.length > 0) {
		//         for (let i = 0; i < video.videos.length; i++) {
		//             const result = await cloudinary.uploader.destroy(video.videos[i].public_id);
		//         }
		//     }

		//     let videoLinks = [];

		//     for (let i = 0; i < videos.length; i++) {
		// 		// console.log(videos[i])
		//         const result = await cloudinary.uploader.upload(videos[i], {
		//             folder: 'baghub/videos',
		//             resource_type: 'auto'
		//         });

		//         videoLinks.push({
		//             public_id: result.public_id,
		//             url: result.secure_url
		//         });
		//     }

		//     req.body.videos = videoLinks;
		// }

		video = await Video.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
			useFindAndModify: false
		});

		return res.status(200).json({
			success: true,
			video
		});
	} catch (error) {
		console.error('Error updating video:', error);
		return res.status(500).json({
			success: false,
			message: 'Internal Server Error'
		});
	}
};

exports.getSingleVideo = async (req, res, next) => {
	const video = await Video.findById(req.params.id);
	if (!video) {
		return res.status(404).json({
			success: false,
			message: 'Video not found'
		})
	}
	res.status(200).json({
		success: true,
		video
	})
}


exports.getVideoById = async (req, res) => {
	try {
		const { id } = req.params;

		const video = await Video.findById(id);

		if (!video) {
			return res.status(404).json({ message: 'Video not found' });
		}

		return res.json(video);
	} catch (error) {
		return res.status(500).json({ error: 'Internal server error' });
	}
};




exports.addComment = async (req, res, next) => {
    try {
        const { id } = req.params; // Get the ID of the video
        const userId = req.user._id; // Get the ID of the user posting the comment

        const video = await Video.findById(id); // Find the video by ID

        if (!video) {
            return res.status(404).json({
                success: false,
                message: 'Video not found'
            });
        }

        const newComment = {
            user: userId,
            comment: req.body.comment,
        };

        video.comments.push(newComment); // Add the new comment to the video
        await video.save(); // Save the changes

        res.status(201).json({
            success: true,
            message: 'Comment posted',
            video: video,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

exports.deleteComment = async (req, res, next) => {
    try {
        const { id } = req.params; // Get the video ID from the URL params
        const { commentId } = req.query; // Get the comment ID from the query params

        // Find the video by ID
        const video = await Video.findById(id);

        // Check if the video exists
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        // Filter out the comment with the specified ID
        video.comments = video.comments.filter(comment => comment._id.toString() !== commentId);

        // Save the video with the updated comments
        await video.save();

        // Return success response
        return res.status(200).json({ message: 'Comment deleted successfully', video });
    } catch (error) {
        console.error('Error deleting comment:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.editComment = async (req, res, next) => {
    try {
        const { id } = req.params; // Get the video ID from the URL params
        const { commentId } = req.query; // Get the comment ID from the query params
        const { comment: updatedComment } = req.body; // Get the updated comment text from the request body

        // Find the video by ID
        const video = await Video.findById(id);

        // Check if the video exists
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        // Find the comment within the video's comments array and update it
        const commentToUpdate = video.comments.find(comment => comment._id.toString() === commentId);
        if (!commentToUpdate) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Update the comment text
        commentToUpdate.comment = updatedComment;

        // Save the video with the updated comment
        await video.save();

        // Return success response
        return res.status(200).json({ message: 'Comment updated successfully', video });
    } catch (error) {
        console.error('Error updating comment:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
