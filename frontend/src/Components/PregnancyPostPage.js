import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Posts.css';
import NavBar from '../Components/Layouts/navBar'; // Adjust the path as per your actual file structure

const PregnancyPostPage = () => {
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const postsResponse = await axios.get('http://localhost:4001/api/posts');
                const categoriesResponse = await axios.get('http://localhost:4001/api/categories');
                
                const pregnancyCategory = categoriesResponse.data.categories.find(category => category.name === 'Pregnancy');
    
                if (pregnancyCategory) {
                    const pregnancyCategoryId = pregnancyCategory._id;
    
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
        <>
            <NavBar />
            <div className="container mt-4 posts-maincontainer">
                <h1 className="posts-header">PREGNANCY POSTS</h1>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="error-message">Error: {error.message}</p>
                ) : posts.length > 0 ? (
                    <div className="row row-posts" style={{ margin: '10px 150px' }}>
                        {posts.map(post => (
                            <div className='center-row' key={post._id}>
                                <div className="card product-cart-text maxwidthh">
                                    <div className="card-body card-des">
                                        <div className="post-content ">
                                            <img
                                                src={post.images[0].url}
                                                alt={post.name}
                                                className="card-img-top posts-image"
                                            />
                                            <div className="post-details">
                                                <h6 className="card-title card-title-des posts-title">
                                                    {post.name.length > 50 ? 
                                                    post.name.slice(0, 50) + "..." : post.name}
                                                </h6>
                                                <h6 className="card-title card-title-des posts-desc">
                                                    {post.description.length > 80 ? 
                                                    post.description.slice(0, 80) + 
                                                    "..." : post.description}
                                                </h6>
                                                <div className="button-container button-container-ye">
                                                    <Link to={`/post/${post._id}`} 
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
                    <p className="no-products-message">No posts found.</p>
                )}
            </div>
        </>
    );
};

export default PregnancyPostPage;
