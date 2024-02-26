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
  const [postComments, setPostComments] = useState([]);
  const [commentId, setCommentId] = useState(null);
  const [updatedComment, setUpdatedComment] = useState('');

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
        `http://localhost:4001/api/post/add-comment/${id}?commentId=${commentId}`, 
        { comment },
        config
      );
      console.log('Comment added:', response.data);    
      setComment(''); 
      window.location.reload(); 

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




// const handleEditComment = async (commentId) => {
//   try {
//       setLoading(true);

//       const config = {
//           headers: {
//               'Authorization': `Bearer ${getToken()}`
//           }
//       };

//       const response = await axios.put(`http://localhost:4001/api/post/edit-comment/${id}?commentId=${commentId}`, config);

//       console.log('Comment edited:', response.data);

//   } catch (error) {
//       setLoading(false);
//       if (error.response && error.response.status === 403) {
//           console.error('Authorization error:', error.response.data.message);
//           alert("You are not authorized to edit this comment");
//       } else {
//           console.error('Error editing comment:', error);
//           alert("Error occurred while editing the comment");
//       }
//   }
// };


// const handleEditComment = async (commentId, updatedComment) => {
//   try {
//       setLoading(true);
//       const config = {
//           headers: {
//               'Authorization': `Bearer ${getToken()}`
//           }
//       };
//       const response = await axios.put(`http://localhost:4001/api/post/edit-comment/${id}?commentId=${commentId}`, { comment: updatedComment }, config);
//       console.log('Comment edited:', response.data);
//       // Optionally, update the comments state or take other actions after editing
//   } catch (error) {
//       setLoading(false);
//       if (error.response && error.response.status === 403) {
//           console.error('Authorization error:', error.response.data.message);
//           alert("You are not authorized to edit this comment");
//       } else if (error.message === 'Network Error') {
//           console.error('Network error occurred:', error.message);
//           alert("A network error occurred. Please check your connection and try again.");
//       } else {
//           console.error('Error editing comment:', error);
//           alert("Error occurred while editing the comment");
//       }
//   }
// };

// GUMAGANA NA EDIT COMMENT 
const handleEditComment = async (commentId, updatedComment) => {
  try {
      setLoading(true);
      
      // Display an edit box for editing the comment
      const editedComment = prompt('Edit the comment:', updatedComment);
      
      if (editedComment === null) {
          // User cancelled editing
          setLoading(false);
          return;
      }

      const config = {
          headers: {
              'Authorization': `Bearer ${getToken()}`
          }
      };
      
      const response = await axios.put(`http://localhost:4001/api/post/edit-comment/${id}?commentId=${commentId}`, { comment: editedComment }, config);
      
      console.log('Comment edited:', response.data);
      
  } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 403) {
          console.error('Authorization error:', error.response.data.message);
          alert("You are not authorized to edit this comment");
      } else if (error.message === 'Network Error') {
          console.error('Network error occurred:', error.message);
          alert("A network error occurred. Please check your connection and try again.");
      } else {
          console.error('Error editing comment:', error);
          alert("Error occurred while editing the comment");
      }
  }
};

const handleEditSubmit = (commentId, updatedComment) => {
  handleEditComment(commentId, updatedComment);
};


// const handleEditComment = async (commentId, updatedComment) => {
//   try {
//       setLoading(true);
      
//       // Find the index of the comment in the postComments array
//       const commentIndex = postComments.findIndex(comment => comment._id === commentId);
      
//       if (commentIndex !== -1) {
//           // Update the comment locally for inline editing
//           const updatedComments = [...postComments];
//           updatedComments[commentIndex].comment = updatedComment;
//           setPostComments(updatedComments);
          
//           // Make API call to update the comment on the server
//           const config = {
//               headers: {
//                   'Authorization': `Bearer ${getToken()}`
//               }
//           };
          
//           const response = await axios.put(`http://localhost:4001/api/post/edit-comment/${id}?commentId=${commentId}`, { comment: updatedComment }, config);
          
//           console.log('Comment edited:', response.data);
//           // Optionally, update the comments state or take other actions after editing
//       } else {
//           console.error('Comment not found for editing');
//       }
//   } catch (error) {
//       setLoading(false);
//       if (error.response && error.response.status === 403) {
//           console.error('Authorization error:', error.response.data.message);
//           alert("You are not authorized to edit this comment");
//       } else if (error.message === 'Network Error') {
//           console.error('Network error occurred:', error.message);
//           alert("A network error occurred. Please check your connection and try again.");
//       } else {
//           console.error('Error editing comment:', error);
//           alert("Error occurred while editing the comment");
//       }
//   }
// };



const handleUpdateComment = async (commentId, updatedComment) => {
  try {
      setLoading(true);

      const config = {
          headers: {
              'Authorization': `Bearer ${getToken()}`
          }
      };

      const response = await axios.put(`http://localhost:4001/api/post/edit-comment/${commentId}`, { comment: updatedComment }, config);

      console.log('Comment updated:', response.data);
      // Update local state or UI here

  } catch (error) {
      console.error('Error updating comment:', error);
      // Handle error
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
            {/* <div className="comments">
            {post.comments.map((comment, index) => (
  <div key={index} className="comment">
    <p className='comment-username'><strong>{usersMap[comment.user]}</strong> - {new Date(comment.createdAt).toLocaleString()}</p>
    <p>{comment.comment}</p>
    {console.log('Comment user:', comment.user)}
    {console.log('Logged in user ID:', loggedInUserId)}
    {comment.user === loggedInUserId._id && (
  <button onClick={() => handleDeleteComment(comment._id)}
  className='delete-commentButton'>Delete</button>
)}
  </div>
))}
            </div> */}

{/* {post.comments.map((comment, index) => (
  <div key={index} className="comment">
    <p className='comment-username'><strong>{usersMap[comment.user]}</strong> - {new Date(comment.createdAt).toLocaleString()}</p>
    <p>{comment.comment}</p>
    {comment.user === loggedInUserId._id && (
      <>
        
        <button onClick={() => handleEditComment(comment._id, comment.comment)}>Edit</button>
        <button onClick={() => handleDeleteComment(comment._id)}>Delete</button>
      </>
    )}
  </div>
))} */}

{post.comments.map((comment, index) => (
    <div key={index} className="comment">
        <p className='comment-username'><strong>{usersMap[comment.user]}</strong> - {new Date(comment.createdAt).toLocaleString()}</p>
        {comment._id === commentId ? ( // Check if the current comment is being edited
            <>
                <input
                    type="text"
                    value={updatedComment}
                    onChange={(e) => setUpdatedComment(e.target.value)}
                />
                <button onClick={() => handleUpdateComment(comment._id)}>Update Comment</button>
            </>
        ) : (
            <p>{comment.comment}</p>
        )}
        {comment.user === loggedInUserId._id && (
            <>
                <button onClick={() => handleEditComment(comment._id, comment.comment)}>Edit</button>
                <button onClick={() => handleDeleteComment(comment._id)}>Delete</button>
            </>
        )}
    </div>
))}

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
