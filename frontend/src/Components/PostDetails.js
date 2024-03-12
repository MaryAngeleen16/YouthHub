import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './PostDetails.css';
import { getToken, getUser } from '../utils/helpers';
import './CommentSection.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const offensiveWords =
  (comment) => {
    const englishOffensiveWords = [
      'asshole',
      'bitch',
      'stupid',
      'bastard',
      'jerk',
      'moron',
      'gay',
      'nigga',
      'faggot',
      'retard',
      'asswipe',
      'motherfucker',
      'fuck you',
      'son of a bitch',
      'slut',
      'cock',
      'dick'
    ];
    const tagalogOffensiveWords = [
      'bobo',
      'tangina',
      'tang ina',
      'tanga',
      'gago',
      'inutil',
      'pokpok',
      'malandi',
      'maldita',
      'gaga',
      'bobita',
      'tangina',
      'engot',
      'pakyu',
      'pakyo',
      'pota',
      'potangina',
      'potang ina',
      'ulol',
      'olol',
      'bobita',
      'ampota',
      'boboo',
      'tnga'
    ];

    const englishMatch = englishOffensiveWords.some(word => comment.toLowerCase().includes(word.toLowerCase()));
    const tagalogMatch = tagalogOffensiveWords.some(word => comment.toLowerCase().includes(word.toLowerCase()));

    return englishMatch || tagalogMatch;
  };



const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [categories, setCategories] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [usersMap, setUsersMap] = useState({});
  const loggedInUserId = getUser();
  const [commentId, setCommentId] = useState(null);
  const [updatedComment, setUpdatedComment] = useState('');
  // const history = useHistory();

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

    // const fetchUsers = async () => {
    //     try {
    //       const response = await axios.get('http://localhost:4001/api/admin/users');
    //       const users = response.data.users;
    //       const usersMap = {};
    //       users.forEach(user => {
    //         usersMap[user._id] = user.name;
    //       });
    //       console.log('Users Map:', usersMap); // Log the users map
    //       setUsersMap(usersMap);
    //     } catch (error) {
    //       console.error('Error fetching users:', error);
    //     }
    //   };

    const fetchUsers = async () => {
      try {
        const token = getToken();
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };

        const response = await axios.get('http://localhost:4001/api/public/users', config);
        const users = response.data.users;
        const usersMap = {};
        users.forEach(user => {
          usersMap[user._id] = user.name;
        });
        console.log('Users Map:', usersMap);
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

  const isCommentValid = (comment) => {
    return !offensiveWords(comment);
  };

  const handleAddComment = async () => {
    setLoading(true);
    if (!isCommentValid(comment)) {
      setLoading(false);
      toast.error('Your comment contains offensive words. Your comment have been cleared.');
      setComment('');
      return;
    }
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


  //   const handleDeleteComment = async (commentId) => {
  //     try {
  //         setLoading(true);

  //         const config = {
  //             headers: {
  //                 'Authorization': `Bearer ${getToken()}`
  //             }
  //         };

  //         const response = await axios.delete(`http://localhost:4001/api/post/delete-comment/${id}?commentId=${commentId}`, config);

  //         console.log('Comment deleted:', response.data);
  //         window.location.reload(); // Reload the page after adding comment


  //     } catch (error) {
  //         if (error.response.status === 403) {
  //             console.error('Authorization error:', error.response.data.message);
  //             alert("You are not authorized to delete this comment");
  //         } else {
  //             console.error('Error deleting comment:', error);
  //             alert("Error occurred while deleting the comment");
  //         }
  //     } finally {
  //         setLoading(false);
  //     }
  // };


  const handleDeleteComment = async (commentId) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this comment? This action cannot be undone.");

      if (confirmDelete) {
        setLoading(true);

        const config = {
          headers: {
            'Authorization': `Bearer ${getToken()}`
          }
        };

        const response = await axios.delete(`http://localhost:4001/api/post/delete-comment/${id}?commentId=${commentId}`, config);

        console.log('Comment deleted:', response.data);
        window.location.reload(); // Reload the page after deleting the comment
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
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


  const handleEditSubmit = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      };
      const response = await axios.put(`http://localhost:4001/api/post/edit-comment/${id}?commentId=${commentId}`, { comment: updatedComment }, config);
      console.log('Comment edited:', response.data);
      window.location.reload();
      setPost(prevPost => ({
        ...prevPost,
        comments: prevPost.comments.map(c => c._id === commentId ? { ...c, comment: updatedComment } : c)
      }));
    } catch (error) {
      console.error('Error editing comment:', error);
      // Handle error
    } finally {
      setLoading(false);
      // Reset commentId and updatedComment after editing
      setCommentId(null);
      setUpdatedComment('');
    }
  };

  const handleEditComment = (commentId, currentComment) => {
    setUpdatedComment(currentComment);
    setCommentId(commentId);
  };
  const handleUpdatedCommentChange = (e) => {
    setUpdatedComment(e.target.value);
  };
  const handleCancelEdit = () => {
    setCommentId(null);
    setUpdatedComment('');
  };


  return (
    <div className="container-youth">

      <ToastContainer className={'toast-container-offensive'} autoClose={3000} />
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

            {/* "Go Back" button */}
            <Link to="/PostsPage" className="go-back-button">Go Back</Link>

            <h2 className='comment-h1'>Comments</h2>
            <hr className="rounded divider-comments" />



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
            {post.comments.map((comment, index) => (
              <div key={index} className="comment">
                <p className='comment-username'><strong>
                  {usersMap[comment.user]}</strong> -
                  {new Date(comment.createdAt).toLocaleString()}</p>
                {comment._id === commentId ? (
                  <div>
                    <textarea
                      value={updatedComment}
                      onChange={handleUpdatedCommentChange}
                      className='edit-textarea'
                    />
                    <div>
                      <button onClick={handleCancelEdit}
                        className='cancel-SubmitButton'>Cancel</button>
                      <button onClick={handleEditSubmit}
                        className='edit-SubmitButton'>Submit</button>

                    </div>
                  </div>
                ) : (
                  <div>
                    <p>{comment.comment}</p>
                    {comment.user === loggedInUserId._id && (
                      <div>
                        <button onClick={() => handleEditComment(comment._id, comment.comment)}
                          className='edit-commentButton'>Edit</button>
                        <button onClick={() => handleDeleteComment(comment._id)}
                          className='delete-commentButton'>Delete</button>
                      </div>
                    )}
                  </div>
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
