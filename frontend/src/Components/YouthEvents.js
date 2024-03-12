import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Posts.css';
import NavBar from '../Components/Layouts/navBar'; 

const YouthEvents = () => {
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const eventsResponse = await axios.get('http://localhost:4001/api/events');
                setEvents(eventsResponse.data.events);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };
    
        fetchData();
    }, []);

    return (
        <>
            <NavBar />
            <div className="container mt-4 posts-maincontainer">
                <h1 className="posts-header">YOUTH EVENTS</h1>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="error-message">Error: {error.message}</p>
                ) : events.length > 0 ? (
                    <div className="row row-posts" style={{ margin: '10px 150px' }}>
                       {events.map(event => (
        <div className='center-row' key={event._id}>
        <div className="card product-cart-text maxwidthh">
            <div className="card-body card-des">
                <div className="post-content ">
                {event.images && event.images.length > 0 && (
                    <img
                        src={event.images[0].url}
                        alt={event.title}
                        className="card-img-top posts-image"
                    />
                )}

                    <div className="post-details">
                        <h6 className="card-title card-title-des posts-title">
                            {event.title.length > 50 ? 
                            event.title.slice(0, 50) + "..." : event.title}
                        </h6>
                        <h6 className="card-title card-title-des posts-desc">
                            {event.description.length > 80 ? 
                            event.description.slice(0, 80) + 
                            "..." : event.description}
                        </h6>
                        <div className="button-container button-container-ye">
                            <Link to={`/events/${event._id}`} 
                            className="btn ye-button">
                                Read More
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
))}
                    </div>
                ) : (
                    <p className="no-products-message">No events found.</p>
                )}
            </div>
        </>
    );
};

export default YouthEvents;
