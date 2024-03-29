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

  exports.addComment = async (req, res, next) => {
    try {
        const { id } = req.params; // Get the ID of the post
        const userId = req.user._id; // Get the ID of the user posting the comment

        const post = await Post.findById(id); // Find the post by ID

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        const newComment = {
            user: userId,
            comment: req.body.comment,
        };

        post.comments.push(newComment); // Add the new comment to the post
        await post.save(); // Save the changes

        res.status(201).json({
            success: true,
            message: 'Comment posted',
            post: post,
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
        const { id } = req.params; // Get the post ID from the URL params
        const { commentId } = req.query; // Get the comment ID from the query params

        // Find the post by ID
        const post = await Post.findById(id);

        // Check if the post exists
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Filter out the comment with the specified ID
        post.comments = post.comments.filter(comment => comment._id.toString() !== commentId);

        // Save the post with the updated comments
        await post.save();

        // Return success response
        return res.status(200).json({ message: 'Comment deleted successfully', post });
    } catch (error) {
        console.error('Error deleting comment:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};



exports.editComment = async (req, res, next) => {
    try {
        const { id } = req.params; // Get the post ID from the URL params
        const { commentId } = req.query; // Get the comment ID from the query params
        const { comment: updatedComment } = req.body; // Get the updated comment text from the request body

        // Find the post by ID
        const post = await Post.findById(id);

        // Check if the post exists
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Find the comment within the post's comments array and update it
        const commentToUpdate = post.comments.find(comment => comment._id.toString() === commentId);
        if (!commentToUpdate) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Update the comment text
        commentToUpdate.comment = updatedComment;

        // Save the post with the updated comment
        await post.save();

        // Return success response
        return res.status(200).json({ message: 'Comment updated successfully', post });
    } catch (error) {
        console.error('Error updating comment:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};