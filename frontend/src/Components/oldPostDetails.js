import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './PostDetails.css';
import { getToken, getUser} from '../utils/helpers';


const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [categories, setCategories] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

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
        setRecentPosts(sortedPosts.filter(recentPost => recentPost._id !== id));
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

  const handleAddComment = async () => {
    setLoading(true);
    const config = {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }
    };

    try {
      const response = await axios.post(
        `http://localhost:4001/api/post/add-comment/${id}`, 
        { comment },
        config
      );
      console.log('Comment added:', response.data);    
      setComment(''); 
      setLoading(false);
    } catch (error) {
      console.error('Error adding comment:', error);
      setLoading(false);
    }
  };

  return (
    <div className="container-youth">
      <div className="main-content-youth">
        {post ? (
          <div>
            <h1 className='post-title-details'>{post.name}</h1>
            <img src={post.images[0].url} alt={post.name} className="post-image-youth" />
            <p>Category: {getCategoryName(post.category)}</p>
            <p>Last Updated Date: {new Date(post.updatedAt).toLocaleString()}</p>
            {post.description.split('\r\n').map((paragraph, index) => (
              <p key={index} className='post-title-information'>{paragraph}</p>
            ))}
         


 {/* Form to add a comment */}
 <div className="add-comment-form">
        <h2>Add Comment</h2>
        <textarea
          placeholder="Write your comment here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button onClick={handleAddComment} disabled={loading}>
          {loading ? 'Adding Comment...' : 'Add Comment'}
        </button>
      </div>

          </div>
        ) : (
          <p>Loading post details...</p>
        )}
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
