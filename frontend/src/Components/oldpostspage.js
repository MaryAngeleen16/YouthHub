import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Post.css';


const PostCard = ({ post }) => {
    return (
      <div className="post-card-col mb-4">
        <div className="card product-cart-text">
          <img
            src={post.images[0].url}
            alt={post.name}
            className="card-img-top product-image" // Added class for styling
          />
          <div className="card-body card-des">
            <h6 className="card-title card-title-des">{post.name}</h6>
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

    // return (
    //     <div className="container mt-4">
    //         <h1 className="prod-t">Posts</h1>
    //         <div className="row">
    //             {loading ? (
    //                 <p>Loading...</p>
    //             ) : error ? (
    //                 <p className="error-message">Error: {error.message}</p>
    //             ) : posts.length > 0 ? (
    //                 posts.map((post, index) => (
    //                     <div key={post._id} className="col-lg-6 col-md-6 col-sm-6 mb-4"> {/* Adjusted column size to fit 2 posts per row on medium and large screens */}
    //                         <PostCard post={post} />
    //                     </div>
    //                 ))
    //             ) : (
    //                 <p className="no-products-message">No posts found.</p>
    //             )}
    //         </div>
    //     </div>
    // );

    return (
        <div className="container mt-12">
        <h1 className="prod-t text-center">Posts</h1>
        <div className="row-container" style={{marginBottom: '20%', marginLeft: '5%',
        marginRight: '5%' }}>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error-message">Error: {error.message}</p>
          ) : posts.length > 0 ? (
            posts.map((post, index) => (
              <div key={post._id} className="post-card-col mb-4">
                <PostCard post={post} />
              </div>
            ))
          ) : (
            <p className="no-products-message">No posts found.</p>
          )}
        </div>
      </div>
    );
};

export default PostsPage;
