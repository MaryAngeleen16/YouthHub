import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './VideoDetails.css';
import { getToken, getUser } from '../utils/helpers'; // Import user-related functions

const generateThumbnailUrl = (video) => {
  if (video.videos && video.videos.length > 0) {
    const publicId = video.videos[0].public_id;
    return `https://res.cloudinary.com/dvokiypaw/video/upload/${publicId}.jpg`;
  } else {
    return ''; // Handle the case when videos array is empty or undefined
  }
};

const getCategoryName = (categories, categoryId) => {
  const category = categories.find(cat => cat._id === categoryId);
  return category ? category.name : 'Unknown';
};

const VideoDetails = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [categories, setCategories] = useState([]);
  const [recentVideos, setRecentVideos] = useState([]);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [usersMap, setUsersMap] = useState({});
  const loggedInUserId = getUser(); 
  const [commentId, setCommentId] = useState(null);
  const [updatedComment, setUpdatedComment] = useState('');

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(`http://localhost:4001/api/video/${id}`);
        setVideo(response.data);
      } catch (error) {
        console.error('Error fetching video:', error);
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

    const fetchRecentVideos = async () => {
      try {
        const response = await axios.get('http://localhost:4001/api/videos');
        const sortedVideos = response.data.videos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentVideos(sortedVideos.filter(recentVideo => recentVideo._id !== id));
      } catch (error) {
        console.error('Error fetching recent videos:', error);
      }
    };

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
        setUsersMap(usersMap);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchVideo();
    fetchCategories();
    fetchRecentVideos();
    fetchUsers();
  }, [id]);

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
        `http://localhost:4001/api/video/add-comment/${id}?commentId=${commentId}`, 
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
      const confirmDelete = window.confirm("Are you sure you want to delete this comment? This action cannot be undone.");

      if (confirmDelete) {
        setLoading(true);

        const config = {
          headers: {
            'Authorization': `Bearer ${getToken()}`
          }
        };

        const response = await axios.delete(`http://localhost:4001/api/video/delete-comment/${id}?commentId=${commentId}`, config);
        
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
      const response = await axios.put(`http://localhost:4001/api/video/edit-comment/${id}?commentId=${commentId}`, { comment: updatedComment }, config);
      console.log('Comment edited:', response.data);
      window.location.reload();
      setVideo(prevVideo => ({
        ...prevVideo,
        comments: prevVideo.comments.map(c => c._id === commentId ? { ...c, comment: updatedComment } : c)
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
      <div className="main-content-youth">
        <div className="vlog-youth">
        {video ? (
            <div>
                {video.videos.map((videoItem) => (
                <div key={videoItem._id}>
                    <iframe src={videoItem.url} title={video.name} width="960" height="540"
                        allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowFullScreen></iframe>
                    <h1 className='video-title-details'>{video.name}</h1>
                    <p>Last Updated Date: {new Date(video.updatedAt).toLocaleString()}</p>
                    {video.description.split('\r\n').map((paragraph, index) => (
              <p key={index} className='video-title-information'>{paragraph}</p>
                 ))}
                </div>
                ))}
            </div>
            ) : (
            <p>Loading video details...</p>
            )}
        </div>
        
        {/* "Go Back" button */}
        <Link to="/VideosPage" className="go-back-button">Go Back</Link>

        <h2 className='comment-h1'>Comments</h2>
            <hr className="rounded divider-comments"/>
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
        {video && video.comments.map((comment, index) => (
          <div key={index} className="comment">
            <p className='comment-username'><strong>{usersMap[comment.user]}</strong> - {new Date(comment.createdAt).toLocaleString()}</p>
            {comment._id === commentId ? (
              <div>
                <textarea
                  value={updatedComment}
                  onChange={handleUpdatedCommentChange}
                  className='edit-textarea'
                />
                <div>
                  <button onClick={handleCancelEdit} className='cancel-SubmitButton'>Cancel</button>
                  <button onClick={handleEditSubmit} className='edit-SubmitButton'>Submit</button>
                </div>
              </div>
            ) : (
              <div>
                <p>{comment.comment}</p>
                {comment.user === loggedInUserId._id && (
                  <div>
                    <button onClick={() => handleEditComment(comment._id, comment.comment)} className='edit-commentButton'>Edit</button>
                    <button onClick={() => handleDeleteComment(comment._id)} className='delete-commentButton'>Delete</button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="recent-videos">
        <h2 className='recent-video-title'>Recent Videos</h2>
        {recentVideos.map((recentVideo) => (
          <Link to={`/video/${recentVideo._id}`} key={recentVideo._id} className="video-link-youth">
            <div className="video-card-youth">
              <img src={generateThumbnailUrl(recentVideo)} alt={recentVideo.name} className='video-image-youth' />
              <h3>{recentVideo.name}</h3>
              <p>{getCategoryName(categories, recentVideo.category)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default VideoDetails;
