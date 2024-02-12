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
    try {
        console.log(req.body);
        let video = await Video.findById(req.params.id);

        if (!video) {
            return res.status(404).json({
                success: false,
                message: 'Video not found'
            });
        }

        if (req.body.videos) {
            let videos = [];

            if (typeof req.body.videos === 'string') {
                videos.push(req.body.videos);
            } else {
                videos = req.body.videos;
            }

            if (videos && videos.length > 0) {
                for (let i = 0; i < video.videos.length; i++) {
                    const result = await cloudinary.uploader.destroy(video.videos[i].public_id);
                }
            }

            let videoLinks = [];

            for (let i = 0; i < videos.length; i++) {
                const result = await cloudinary.uploader.upload(videos[i], {
                    folder: 'baghub/videos',
                    resource_type: 'video'
                });

                videoLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url
                });
            }

            req.body.videos = videoLinks;
        }

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