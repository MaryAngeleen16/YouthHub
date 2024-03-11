import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Components/Layouts/navBar';
import './Home.css';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => (
    <div className="card product-cart-text">
        <div className="card-body card-des card-posts">
            <img src={post.images[0].url} alt={post.name} className="card-img-top posts-image" />
            <div>
                <h1 className="card-title posts-title">{post.name}</h1>
                <h3 className="posts-desc">
                    {post.description.length > 30 ? `${post.description.substring(0, 30)}...` : post.description}
                </h3>
                <Link to={`/post/${post._id}`} className="btn json-button">
                    Details
                </Link>
            </div>
        </div>
    </div>
);

const Home = () => {
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
        <div>
            <Navbar />
            <div className="container-banner">
                <div className="row-banner">
                    <div className="col-banner">
                        <div className="WomanReadingWithBaby">
                            <img className="WomanReadingWithBaby" src="/images/heartwoman.png" alt="Banner" />
                        </div>
                    </div>

                    <div className="col-banner">
                        <div className="Frame21">
                            <div className="banner-para">
                                <div className="YouthEmpowerment">Youth Empowerment Hub</div>
                                <div className="LoremIpsumDolorSitAmetSitTeFerriHabemusConstitutoSimulFuissetProAdUtPerpetuaModeratiusSitMeaNeDictaLaoreetOporteatVerteremOcurreretLiberavisseNeUsuOmnisAtomorumNamInAliquamSalutatusPro">Lorem ipsum dolor sit amet, sit te ferri habemus constituto, <br />simul fuisset pro ad. Ut perpetua moderatius sit. Mea ne dicta <br />laoreet oporteat. Verterem ocurreret liberavisse ne usu, omnis<br />atomorum nam in. Aliquam salutatus pro</div>
                                <div className="Frame8">
                                    <div className="Frame1">
                                        <div className="Button-banner" onClick={() => { window.location.href = '/login'; }}>CREATE ACCOUNT</div>
                                    </div>
                                    <div className="Frame6">
                                        <div className="Button-banner" onClick={() => { window.location.href = '/VideosPage'; }}>WATCH VIDEO</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div class="Content">
                <div class="Base"></div>
                <div class="Picture">
                    <img class="Image" src="/images/parenthood.png" />
                </div>
                <div class="Frame26">
                    <div class="Frame19">
                        <div class="ThereAreManyReaso">PARENTHOOD is a gift buuut!</div>
                        <div class="AlthoughThisIsWel">IPDC Finance Limited (previously known as "Industrial Promotion and Development Company of Bangladesh Limited") is the first private sector financial institution of the country established in 1981 by a distinguished group of shareholders namely International Finance Corporation (IFC), USA, German Investment and Development Company (DEG), Germany, The Aga Khan Fund for Economic Development (AKFED), Switzerland, Commonwealth Development Corporation (CDC), UK and the Government of Bangladesh</div>
                    </div>
                    <div class="Frame25">
                        <div class="ReadMore">Read Post</div>
                        <div class="RightArrow">
                            <div class="Vector"></div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="recent-posts-section">
                {/* <h2>Recent Posts</h2> */}
                <div className="container mt-4 posts-maincontainer">
                    <h1 className="posts-header">RECENT POSTS</h1>
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p className="error-message">Error: {error.message}</p>
                    ) : posts.length > 0 ? (
                        <div className="row row-posts" style={{ margin: '10px 150px' }}>
                            {posts.map(recentPost => (
                                <div className='center-row' key={recentPost._id}>
                                    <div className="card product-cart-text maxwidthh">
                                        <div className="card-body card-des">
                                            <div className="post-content ">
                                                <img
                                                    src={recentPost.images[0].url}
                                                    alt={recentPost.name}
                                                    className="card-img-top posts-image"
                                                />
                                                <div className="post-details">
                                                    <h6 className="card-title card-title-des posts-title">
                                                        {recentPost.name.length > 50 ?
                                                            recentPost.name.slice(0, 50) + "..." : recentPost.name}
                                                    </h6>
                                                    <h6 className="card-title card-title-des posts-desc">
                                                        {recentPost.description.length > 80 ?
                                                            recentPost.description.slice(0, 80) +
                                                            "..." : recentPost.description}
                                                    </h6>
                                                    <div className="button-container button-container-ye">
                                                        <Link to={`/post/${recentPost._id}`}
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
            </div>

        </div>
    );
};

export default Home;
