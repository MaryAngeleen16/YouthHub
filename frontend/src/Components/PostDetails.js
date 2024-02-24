import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './PostDetails.css';


const PostDetails = () => {
const { id } = useParams();
const [post, setPost] = useState(null);
const [categories, setCategories] = useState([]);
const [recentPosts, setRecentPosts] = useState([]);

useEffect(() => {
const fetchPost = async () => {
try {
const response = await axios.get(`http://localhost:4001/api/post/${id}`);
setPost(response.data);
} catch (error) {
console.error('Error fetching post:', error);
}
};

const fetchCategories = async () => {
try {
const response = await axios.get('http://localhost:4001/api/categories');
setCategories(response.data.categories);
} catch (error) {
console.error('Error fetching categories:', error);
}
};

const fetchRecentPosts = async () => {
try {
const response = await axios.get('http://localhost:4001/api/posts');
const sortedPosts = response.data.posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
setRecentPosts(sortedPosts.filter(recentPost => recentPost._id !== id)); // Exclude the current post
} catch (error) {
console.error('Error fetching recent posts:', error);
}
};

fetchPost();
fetchCategories();
fetchRecentPosts();
}, [id]);

const getCategoryName = (categoryId) => {
const category = categories.find(cat => cat._id === categoryId);
return category ? category.name : 'Unknown';
};

return (
<div className="container-youth">
    <div className="main-content-youth">
        <div className="blog-post-youth">
            {post ? (
            <div>
                <h1 className='post-title-details'>{post.name}</h1>
                <img src={post.images[0].url} alt={post.name} className="post-image-youth" />
                <p>Category: {getCategoryName(post.category)}</p>
                <p>Last Updated Date: {new Date(post.updatedAt).toLocaleString()}</p>
                <p className='post-title-information'>{post.description}</p>
            </div>
            ) : (
            <p>Loading post details...</p>
            )}
        </div>
    </div>
    <div className="recent-posts-youth">
        <h2 className='recent-post-title'>Recent Posts</h2>
        {recentPosts.map((recentPost) => (
        <Link to={`/post/${recentPost._id}`} key={recentPost._id} className="post-link-youth">
        <div className="post-card-youth">
            <h3>{recentPost.name}</h3>
            <p>{getCategoryName(recentPost.category)}</p>
        </div>
        </Link>
        ))}
    </div>
</div>
);
};

export default PostDetails;
