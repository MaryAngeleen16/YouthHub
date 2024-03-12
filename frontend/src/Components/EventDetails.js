import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './PostDetails.css';
import { getToken, getUser } from '../utils/helpers';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Slide from '@mui/material/Slide';

const offensiveWords = (comment) => {
  const englishOffensiveWords = [
    'asshole', 'bitch', 'stupid', 'bastard', 'jerk', 'moron', 'gay', 'nigga',
    'faggot', 'retard', 'asswipe', 'motherfucker', 'fuck you', 'son of a bitch',
    'slut', 'cock', 'dick'
  ];
  const tagalogOffensiveWords = [
    'bobo', 'tangina', 'tang ina', 'tanga', 'gago', 'inutil', 'pokpok', 'malandi',
    'maldita', 'gaga', 'bobita', 'tangina', 'engot', 'pakyu', 'pakyo', 'pota',
    'potangina', 'potang ina', 'ulol', 'olol', 'bobita', 'ampota', 'boboo', 'tnga'
  ];

  const englishMatch = englishOffensiveWords.some(word => 
    comment.toLowerCase().includes(word.toLowerCase()));
  const tagalogMatch = tagalogOffensiveWords.some(word =>
    comment.toLowerCase().includes(word.toLowerCase()));

  return englishMatch || tagalogMatch;
};

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [audienceCapacity, setAudienceCapacity] = useState(0); // New state for audience capacity
  const [loading, setLoading] = useState(false);
  const [venues, setVenues] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [comment, setComment] = useState('');
  const [usersMap, setUsersMap] = useState({});
  const loggedInUserId = getUser();
  const [commentId, setCommentId] = useState(null);
  const [updatedComment, setUpdatedComment] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [joinStatus, setJoinStatus] = useState(false);
  const [isUserJoined, setIsUserJoined] = useState(false);
  
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:4001/api/event/${id}`);
        setEvent(response.data);
        // Calculate audience capacity after setting the event
        setAudienceCapacity(response.data.audience_capacity - response.data.joined_users.length);
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };
  
    const fetchVenues = async () => {
      try {
        const response = await axios.get('http://localhost:4001/api/venues');
        setVenues(response.data.venues);
      } catch (error) {
        console.error('Error fetching venues:', error);
      }
    };
  
    const fetchRecentEvents = async () => {
      try {
        const response = await axios.get('http://localhost:4001/api/events');
        const sortedEvents = response.data.events.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentEvents(sortedEvents.filter(recentEvent => recentEvent._id !== id));
      } catch (error) {
        console.error('Error fetching other events:', error);
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
  
    if (event && loggedInUserId) {
      setIsUserJoined(event.joined_users.includes(loggedInUserId._id)); // Change here
    }
  
    fetchEvent();
    fetchVenues();
    fetchRecentEvents();
    fetchUsers();
  }, [id, event, loggedInUserId]);
  

  const getVenueName = (venueId) => {
    if (!venues || venues.length === 0) {
      return 'Loading...';
    }
    const venue = venues.find(ven => ven._id === venueId);
    return venue ? venue.name : 'Unknown';
  };

  const isCommentValid = (comment) => {
    return !offensiveWords(comment);
  };

  const handleAddComment = async () => {
    setLoading(true);
    if (!isCommentValid(comment)) {
      setLoading(false);
      toast.error('Your comment contains offensive words. Your comment has been cleared.');
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
        `http://localhost:4001/api/event/add-comment/${id}?commentId=${commentId}`,
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

  const handleOpenDialog = (commentId) => {
    setSelectedCommentId(commentId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      handleOpenDialog(commentId);
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Error occurred while deleting the comment');
    }
  };

  const confirmDeleteComment = async (commentId) => {
    try {
      handleCloseDialog();
      setLoading(true);

      const config = {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      };

      const response = await axios.delete(`http://localhost:4001/api/event/delete-comment/${id}?commentId=${commentId}`, config);

      console.log('Comment deleted:', response.data);
      window.location.reload();
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.error('Authorization error:', error.response.data.message);
        alert("You are not authorized to delete this comment");
      } else {
        console.error('Error deleting comment:', error);
        toast.error('Error occurred while deleting the comment');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    try {
      setLoading(true);
      if (!isCommentValid(updatedComment)) {
        setLoading(false);
        toast.error('Your comment contains offensive words. Comment will remain unchanged');
        return;
      }
      const config = {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      };
      const response = await axios.put(`http://localhost:4001/api/event/edit-comment/${id}?commentId=${commentId}`, { comment: updatedComment }, config);
      console.log('Comment edited:', response.data);
      window.location.reload();
      setEvent(prevEvent => ({
        ...prevEvent,
        comments: prevEvent.comments.map(c => c._id === commentId ? { ...c, comment: updatedComment } : c)
      }));
    } catch (error) {
      console.error('Error editing comment:', error);
    } finally {
      setLoading(false);
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

  const isLoggedIn = () => {
    return true; // Placeholder, replace with actual logic
  };
  
  // const handleAudienceCapacityUpdate = async (action) => {
  //   setLoading(true);
  //   try {
  //     if (!loggedInUserId) {
  //       toast.error('You need to be logged in to join/unjoin the event.');
  //       return;
  //     }
  
  //     // Ensure event is defined and contains _id
  //     if (!event || !event._id) {
  //       console.error('Event or event id is undefined.');
  //       return;
  //     }
  
  //     // Check if the user is already joined
  //     const isUserJoined = event.joined_users.includes(loggedInUserId._id); // Corrected here
  
  //     if (action === 'join') {
  //       if (isUserJoined) {
  //         toast.warn('You have already joined this event.');
  //         return;
  //       }
  //       // Add the logged-in user to joined_users
  //       const updatedEvent = { ...event, joined_users: [...event.joined_users, loggedInUserId._id] }; // Corrected here
  //       setEvent(updatedEvent);
  //     } else if (action === 'unjoin') {
  //       if (!isUserJoined) {
  //         toast.warn('You haven\'t joined this event yet.');
  //         return;
  //       }
  //       // Remove the logged-in user from joined_users
  //       const updatedEvent = { ...event, joined_users: event.joined_users.filter(userId => userId !== loggedInUserId._id) }; // Corrected here
  //       setEvent(updatedEvent);
  //     }
  
  //     const config = {
  //       headers: {
  //         'Authorization': `Bearer ${getToken()}`
  //       }
  //     };
  
  //     const response = await axios.patch(`http://localhost:4001/api/event/${event._id}`, { action, joined_users: event.joined_users }, config);
  //     setEvent(response.data);
  //     toast.success(action === 'join' ? 'You have successfully joined the event.' : 'You have successfully unjoined the event.');
  //   } catch (error) {
  //     console.error('Error updating audience capacity:', error);
  //     toast.error('Failed to update audience capacity');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleJoinEvent = async () => {
    if (loading || !loggedInUserId) return; // Prevent multiple requests or unauthorized requests
    setLoading(true);
    try {
      const response = await axios.patch(`http://localhost:4001/api/event/${event._id}/join`, null, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      const updatedEvent = response.data;
      // Update audience capacity based on the updated event
      setEvent(updatedEvent); // Update the entire event object
      toast.success('You have successfully joined the event.');
    } catch (error) {
      console.error('Error joining event:', error);
      toast.error('Failed to join the event');
    } finally {
      setLoading(false);
    }
  };
  
  
  
  const handleUnjoinEvent = async () => {
    setLoading(true);
    try {
      if (!loggedInUserId) {
        toast.error('You need to be logged in to unjoin the event.');
        return;
      }
  
      const response = await axios.patch(`http://localhost:4001/api/event/${event._id}/unjoin`, null, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      const updatedEvent = response.data;
      // Update audience capacity based on the updated event
      setAudienceCapacity(updatedEvent.audience_capacity);
      toast.success('You have successfully unjoined the event.');
    } catch (error) {
      console.error('Error unjoining event:', error);
      toast.error('Failed to unjoin the event');
    } finally {
      setLoading(false);
    }
  };
  
  
const handleAudienceCapacityUpdate = (action) => {
  if (action === 'join') {
    handleJoinEvent();
  } else if (action === 'unjoin') {
    handleUnjoinEvent();
  }
};
  


  return (
    <div className="container-youth">
      <ToastContainer className={'toast-container-offensive'} autoClose={3000} />
      <div className="main-content-youth">
        {event ? (
          <div>
            <h1 className='post-title-details'>{event.title}</h1>
            {event.images.length > 0 && (
              <img src={event.images[0].url} alt={event.title} className="post-image-youth" />
            )}
            <p>Last Updated Date: {new Date(event.updatedAt).toLocaleString()}</p>
            <p className='post-title-information'>{event.description}</p>
            <p>Schedule: {new Date(event.schedule).toLocaleString()}</p> 
            <p>Time: {event.timeStarts} - {event.timeEnds}</p>
            <p>Venue: {getVenueName(event.venue_id)}</p> 
            <p>Registration Fee: {event.amount}</p> 
             <p>Slots Left: {audienceCapacity}</p>
             <button onClick={() => handleAudienceCapacityUpdate('join')} className='joinButton' disabled={loading || isUserJoined}>Join</button>
            <button onClick={() => handleAudienceCapacityUpdate('unjoin')} className='unjoinButton' disabled={loading || !isUserJoined}>Unjoin</button>

            <h2 className='comment-h1'>Comments</h2>
            <hr className="rounded divider-comments" />

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

            {event.comments.map((comment, index) => (
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
          <p>Loading event details...</p>
        )}
      </div>
      <div className="recent-posts-youth">
        <h2 className='recent-post-title'>Other Events</h2>
        {recentEvents.map((recentEvent) => (
          <Link to={`/events/${recentEvent._id}`} key={recentEvent._id} className="post-link-youth">
            <div className="post-card-youth">
              <h3>{recentEvent.title}</h3>
              <p>{recentEvent.venue_id.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default EventDetails;