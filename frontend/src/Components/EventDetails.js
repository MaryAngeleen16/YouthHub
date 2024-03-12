import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './PostDetails.css'; // Rename PostDetails.css to EventDetails.css
import { getToken, getUser } from '../utils/helpers';
import './CommentSection.css';
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
  const [venues, setVenues] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]); 
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [usersMap, setUsersMap] = useState({});
  const loggedInUserId = getUser();
  const [commentId, setCommentId] = useState(null);
  const [updatedComment, setUpdatedComment] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);


  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:4001/api/event/${id}`);
        setEvent(response.data); // Change post to event
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
        console.log('Users Map:', usersMap);
        setUsersMap(usersMap);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchEvent();
    fetchVenues();
    fetchRecentEvents();
    fetchUsers();
  }, [id]);


  const getVenueName = (venueId) => {
    // Check if venues data is available
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



  const fetchVenueNamesForRecentEvents = async (recentEvents) => {
    try {
      // Fetch venue names for recent events
      const updatedRecentEvents = await Promise.all(recentEvents.map(async (event) => {
        try {
          const venueResponse = await axios.get(`http://localhost:4001/api/venues/${event.venue._id}`);
          const venueName = venueResponse.data.title; // Assuming title is the name of the venue
          return { ...event, venueName };
        } catch (error) {
          console.error('Error fetching venue:', error);
          return null;
        }
      }));
  
      // Filter out any events where venue fetch failed
      const finalRecentEvents = updatedRecentEvents.filter(event => event !== null);
  
      return finalRecentEvents;
    } catch (error) {
      console.error('Error fetching venue names for recent events:', error);
      return null;
    }
  };
  
  return (
    <div className="container-youth">
      <ToastContainer className={'toast-container-offensive'} autoClose={3000} />

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        TransitionComponent={Slide} 
        TransitionProps={{
          direction: 'down', 
        }}
        PaperProps={{
          sx: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 'auto',
            maxWidth: 'sm',
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">Comment Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this comment? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} style={{ color: '#424242' }}>
            Cancel
          </Button>
          <Button onClick={() => confirmDeleteComment(selectedCommentId)} style={{ color: '#b71c1c' }} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

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
            <p>Venue: {getVenueName(event.venue_id)}</p> 
            <p>Payment Status: {event.payment_status}</p> 
            <p>Registration Fee: {event.amount}</p> 
            <p>Audience Capacity: {event.audience_capacity}</p>
  
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
