const Post = require('../models/post');
const mongoose = require('mongoose');
const APIFeatures = require('../utils/apiFeatures');
const cloudinary = require('cloudinary')

exports.newPost = async (req, res, next) => {

	let imagesLinks = [];
	let images = []
	
	if (req.files.length > 0) {
		req.files.forEach(image => {
			images.push(image.path)
		})
	}

	if (req.file) {
		images.push(req.file.path);
	}

	if (req.body.images) {
		if (typeof req.body.images === 'string') {
			images.push(req.body.images)
		} else {
			images = req.body.images
		}
	}

	for (let i = 0; i < images.length; i++) {
		let imageDataUri = images[i]
		try {
			const result = await cloudinary.v2.uploader.upload(`${imageDataUri}`, {
				folder: 'posts-youthhub',
				width: 1000,
				crop: "auto",
			});

			imagesLinks.push({
				public_id: result.public_id,
				url: result.secure_url
			})

		} catch (error) {
			console.log(error)
		}

	}

	req.body.images = imagesLinks
	//req.body.user = req.user.id;

	const post = await Post.create(req.body);
	if (!post)
		return res.status(400).json({
			success: false,
			message: 'Post not created'
		})


	res.status(201).json({
		success: true,
		post
	})
}


exports.deletePost = async (req, res) => {
	try {
		const { id } = req.params;

		const post = await Post.findByIdAndDelete(id);

		if (!post) {
			return res.status(404).json({ message: 'Post not found' });
		}

		return res.json({ message: 'Post deleted successfully' });
	} catch (error) {
		return res.status(500).json({ error: 'Internal server error' });
	}
};

exports.getPosts = async (req, res, next) => {
	const posts = await Post.find({});
	res.status(200).json({
		success: true,
		count: posts.length,
		posts
	})
}

exports.getSinglePost = async (req, res, next) => {
	const post = await Post.findById(req.params.id);
	if (!post) {
		return res.status(404).json({
			success: false,
			message: 'Post not found'
		})
	}
	res.status(200).json({
		success: true,
		post
	})
}
 
exports.getAdminPost = async (req, res, next) => {

	const posts = await Post.find();

	res.status(200).json({
		success: true,
		posts
	})
}
exports.updatePost = async (req, res, next) => {
    try {
        console.log(req.body);
        let post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        if (req.body.images) {
            let images = [];

            if (typeof req.body.images === 'string') {
                images.push(req.body.images);
            } else {
                images = req.body.images;
            }

            if (images && images.length > 0) {
                for (let i = 0; i < post.images.length; i++) {
                    const result = await cloudinary.uploader.destroy(post.images[i].public_id);
                }
            }

            let imagesLinks = [];

            for (let i = 0; i < images.length; i++) {
                const result = await cloudinary.uploader.upload(images[i], {
                    folder: 'baghub/post'
                });

                imagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url
                });
            }

            req.body.images = imagesLinks;
        }

        post = await Post.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });

        return res.status(200).json({
            success: true,
            post
        });
    } catch (error) {
        console.error('Error updating post:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

exports.getSinglePost = async (req, res, next) => {
	const post = await Post.findById(req.params.id);
	if (!post) {
		return res.status(404).json({
			success: false,
			message: 'Post not found'
		})
	}
	res.status(200).json({
		success: true,
		post
	})
}


exports.getPostById = async (req, res) => {
	try {
	  const { id } = req.params;
  
	  const post = await Post.findById(id);
  
	  if (!post) {
		return res.status(404).json({ message: 'Post not found' });
	  }
  
	  return res.json(post);
	} catch (error) {
	  return res.status(500).json({ error: 'Internal server error' });
	}
  };