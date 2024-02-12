import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './PostPage.css';

const PostCard = ({ post }) => {
    return (
        <div className="col-lg-4 col-md-4 col-sm-6 mb-4"> {/* Adjusted column size to fit 3-4 posts per row */}
            <div className="card product-cart-text prodcard-JSON">
                <img
                    src={post.images[0].url}
                    alt={post.name}
                    className="card-img-top product-image" // Added class for styling
                />
                <div className="card-body card-des">
                    <h6 className="card-title card-title-des">
                        {post.name}
                    </h6>
                    <div className="button-container">
                        <Link to={`/post/${post._id}`} className="btn json-button">
                            Details
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PostsPage = () => {
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const postsResponse = await axios.get('http://localhost:4001/api/posts');
                setPosts(postsResponse.data.posts);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="container mt-4">
            <h1 className='prod-t'>Posts</h1>
            <div className="row">
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="error-message">Error: {error.message}</p>
                ) : posts.length > 0 ? (
                    posts.map((post, index) => (
                        <React.Fragment key={post._id}>
                            <PostCard post={post} />
                            {(index + 1) % 3 === 0 && <div className="w-100 d-lg-none d-md-block"></div>} {/* Add a new row after every 3 post cards */}
                        </React.Fragment>
                    ))
                ) : (
                    <p className="no-products-message">No posts found.</p>
                )}
            </div>
        </div>
    );
};

export default PostsPage;