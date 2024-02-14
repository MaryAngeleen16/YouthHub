import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Post.css';

const PregnancyPostPage = () => {
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const postsResponse = await axios.get('http://localhost:4001/api/posts');
                const categoriesResponse = await axios.get('http://localhost:4001/api/categories');
                
                // Get the category ID for the category named 'pregnancy'
                const pregnancyCategory = categoriesResponse.data.categories.find(category => category.name === 'Pregnancy');
    
                if (pregnancyCategory) {
                    const pregnancyCategoryId = pregnancyCategory._id;
    
                    // Filter posts where category ID matches the ID of 'pregnancy' category
                    const filteredPosts = postsResponse.data.posts.filter(post => post.category === pregnancyCategoryId);
    
                    setPosts(filteredPosts);
                } else {
                    setPosts([]);
                }
    
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };
    
        fetchData();
    }, []);
    
    return (
        <div className="container mt-4 posts-container">
            <h1 className="posts-header">Pregnancy Posts</h1>
            <div className="row">
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="error-message">Error: {error.message}</p>
                ) : posts.length > 0 ? (
                    posts.map((post, index) => (
                        <div key={post._id} className="col-lg-6 col-md-6 col-sm-6 mb-4">
                            <div className="card product-cart-text">
                                <div className="card-body card-des">
                                    <div className="post-content">
                                        <img
                                            src={post.images[0].url}
                                            alt={post.name}
                                            className="card-img-top posts-image"
                                        />
                                        <div className="post-details">
                                            <h6 className="card-title card-title-des posts-title">{post.name}</h6>
                                            <h8 className="card-title card-title-des posts-desc">
                                                {post.description.split(' ').slice(0, 30).join(' ')}
                                                {post.description.split(' ').length > 30 ? '...' : ''}
                                            </h8>
                                            <div className="button-container">
                                                <Link to={`/post/${post._id}`} className="btn json-button">
                                                    Read More
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-products-message">No posts found.</p>
                )}
            </div>
        </div>
    );
};

export default PregnancyPostPage;

