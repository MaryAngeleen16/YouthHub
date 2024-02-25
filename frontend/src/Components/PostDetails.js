import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './PostDetails.css';
import { getToken, getUser } from '../utils/helpers';
import './CommentSection.css';


const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [categories, setCategories] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [usersMap, setUsersMap] = useState({});
  const loggedInUserId = getUser(); 
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

    const fetchUsers = async () => {
        try {
          const response = await axios.get('http://localhost:4001/api/admin/users');
          const users = response.data.users;
          const usersMap = {};
          users.forEach(user => {
            usersMap[user._id] = user.name;
          });
          console.log('Users Map:', usersMap); // Log the users map
          setUsersMap(usersMap);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };
      

    fetchPost();
    fetchCategories();
    fetchRecentPosts();
    fetchUsers();
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
      window.location.reload(); // Reload the page after adding comment

    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteComment = async (commentId) => {
    try {
        setLoading(true);

        const config = {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        };

        const response = await axios.delete(`http://localhost:4001/api/post/delete-comment/${id}?commentId=${commentId}`, config);
        
        console.log('Comment deleted:', response.data);
        window.location.reload(); // Reload the page after adding comment

        
        // Update the post state or perform any necessary actions after successful deletion
        // For example, you can update the UI to reflect the deleted comment
        
    } catch (error) {
        if (error.response.status === 403) {
            console.error('Authorization error:', error.response.data.message);
            alert("You are not authorized to delete this comment");
        } else {
            console.error('Error deleting comment:', error);
            alert("Error occurred while deleting the comment");
        }
    } finally {
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

            <h2 className='comment-h1'>Comments</h2>
            <hr className="rounded divider-comments"/>

            {/* Form to add a comment */}
            <div className="add-comment-form">
              <h2 className='comment-addcomment'>Add Comment</h2>
              <textarea
                placeholder="   Write your comment here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className='commentBox'
              />
              {loading ? (
                <p>Loading...</p> 
              ) : (
                <button onClick={handleAddComment} className='commentButton'>
                  Post Comment
                </button>
              )}
            </div>

            {/* Display comments */}
            <div className="comments">
            {post.comments.map((comment, index) => (
  <div key={index} className="comment">
    <p className='comment-username'><strong>{usersMap[comment.user]}</strong> - {new Date(comment.createdAt).toLocaleString()}</p>
    <p>{comment.comment}</p>
    {/* Log the values for comparison */}
    {console.log('Comment user:', comment.user)}
    {console.log('Logged in user ID:', loggedInUserId)}
    {/* Delete button comment */}
    {comment.user === loggedInUserId._id && (
  <button onClick={() => handleDeleteComment(comment._id)}
  className='delete-commentButton'>Delete</button>
)}
  </div>
))}

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
