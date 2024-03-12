import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Components/Layouts/navBar';
import './Home.css';
import { Link } from 'react-router-dom';
import BackDropLoading from './Components/Layouts/BackDropLoading';

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

    const [events, setEvents] = useState([]);
    const [earliestEvent, setEarliestEvent] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:4001/api/events');
                setEvents(response.data.events); // Corrected to extract the events array
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, []);


    useEffect(() => {
        if (events.length > 0) {
            // Find the event with the latest start time
            const latestEvent = events.reduce((prev, current) => {
                const prevTime = new Date(prev.schedule || prev.timeStarts);
                const currentTime = new Date(current.schedule || current.timeStarts);
                return prevTime > currentTime ? prev : current;
            });

            setEarliestEvent(latestEvent);
        }
    }, [events]);


    useEffect(() => {
        if (earliestEvent) {
            const intervalId = setInterval(() => {
                const now = new Date();
                const eventTime = new Date(earliestEvent.schedule || earliestEvent.timeStarts);
                const timeDiff = eventTime.getTime() - now.getTime();
                setTimeRemaining(Math.max(0, timeDiff));
            }, 1000);

            return () => clearInterval(intervalId);
        }
    }, [earliestEvent]);

    const formatTime = (time) => {
        const pad = (num) => {
            return num < 10 ? '0' + num : num;
        };

        const days = Math.floor(time / (1000 * 60 * 60 * 24));
        const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((time % (1000 * 60)) / 1000);

        return {
            days: pad(days),
            hours: pad(hours),
            minutes: pad(minutes),
            seconds: pad(seconds)
        };
    };

    return (
        <div>
            <BackDropLoading open={loading} />
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
                                <div className="banner-paragraph">Join us in curbing premature parenthood through community-driven support<br />
                                    and education. Together, let's build a healthy online community dedicated<br />
                                    to empowering adolescents and preventing unwanted pregnancies.<br />
                                    Together, we can make a difference.</div>
                                <div className="Frame8">
                                    <div className="Frame1">
                                        <div className="Button-banner" onClick={() => { window.location.href = '/register'; }}>CREATE ACCOUNT</div>
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

            <div>
                {earliestEvent && (
                    <div>

                        <p className='text-countdown-info'>{new Date(earliestEvent.schedule || earliestEvent.timeStarts).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</p>

                        <p className='text-countdown-title'>{earliestEvent.title}</p>

                        <p className='text-countdown'>
                            <span>{formatTime(timeRemaining).days}</span>
                            <span>D:
                            </span>
                            <span>{formatTime(timeRemaining).hours}</span>
                            <span>HRS: </span>

                            <span>{formatTime(timeRemaining).minutes}</span>
                            <span>MINS: </span>

                            <span>{formatTime(timeRemaining).seconds}</span>
                            <span>SECS</span>
                        </p>

                    </div>
                )}
            </div>


            <div className="button-center">
                <button
                    className="btn-event countown-button"
                    onClick={() => {
                        window.location.href = `/events/${earliestEvent._id}`;
                    }}
                >
                    JOIN NOW
                </button>

            </div>


            <div class="Content">
                <div class="Base"></div>
                <div class="Picture">
                    <img class="Image" src="/images/parenthood.png" />
                </div>
                <div class="Frame26">
                    <div class="Frame19">
                        <div class="ThereAreManyReaso">PARENTHOOD is a gift buuut!</div>
                        <div class="AlthoughThisIsWel">Parenthood is a gift, but it's important to be prepared.
                            At the Youth Empowerment Hub, we believe in equipping adolescents with the knowledge
                            and support they need for responsible decision-making. Explore our educational posts
                            to learn about adolescent empowerment and how to navigate the journey to parenthood
                            with confidence. Start your journey toward informed choices today.</div>
                    </div>
                    <div class="Frame25">
                        <div class="ReadMore"><a href="/PostsPage" style={{ color: "#ff9900" }}>Read Post</a></div>                        <div class="RightArrow">
                            <div class="Vector"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="edu" style={{ width: '1440px', height: '820px', position: 'relative' }}>
                <div className="edu-sec" style={{ width: '1230px', right: '-150px', top: '220px', position: 'absolute', justifyContent: 'space-between', alignItems: 'flex-start', display: 'inline-flex' }}>
                    <div className="Feature" style={{ width: '259px', padding: '24px', boxShadow: '0px 18px 58px 16px rgba(0, 0, 0, 0.06)', borderRadius: '8px', overflow: 'hidden', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '18px', display: 'inline-flex' }}>
                        <div className="CircleLayer" style={{ width: '37px', height: '37px', position: 'relative' }}>
                            <div className="Vector" style={{ width: '21.40px', height: '21.40px', left: '12.52px', top: '3.08px', position: 'absolute', background: '#FCE0EF' }}></div>
                            <div className="Vector" style={{ width: '15.42px', height: '15.42px', left: '3.08px', top: '18.50px', position: 'absolute', background: '#ED017F' }}></div>
                            <div className="Vector" style={{ width: '18.45px', height: '18.45px', left: '7.75px', top: '10.79px', position: 'absolute', background: '#F899CC' }}></div>
                        </div>
                        <div className="Frameedu" style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '10px', display: 'flex' }}>
                            <div className="TheFirst" style={{ color: '#363940', fontSize: '22px', fontFamily: 'Metropolis', fontWeight: '700', lineHeight: '22px', wordWrap: 'break-word' }}>Community<br />Collaboration</div>
                            <div className="MicrosoftPatchMana" style={{ width: '160px', color: '#999999', fontSize: '14px', fontFamily: 'Metropolis', fontWeight: '400', lineHeight: '24px', wordWrap: 'break-word' }}>Displaying the highest level of Integrity in the way we conduct our business</div>
                        </div>
                    </div>
                    <div className="Feature" style={{ width: '259px', padding: '24px', boxShadow: '0px 18px 58px 16px rgba(0, 0, 0, 0.06)', borderRadius: '8px', overflow: 'hidden', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '18px', display: 'inline-flex' }}>
                        <div className="Rocket" style={{ width: '37px', height: '37px', position: 'relative' }}>
                            <div className="Vector" style={{ width: '26.91px', height: '26.98px', left: '1.59px', top: '8.50px', position: 'absolute', background: '#ED017F' }}></div>
                            <div className="Vector" style={{ width: '28.73px', height: '28.87px', left: '6.68px', top: '1.52px', position: 'absolute', background: '#F899CC' }}></div>
                        </div>
                        <div className="Frame17" style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '10px', display: 'flex' }}>
                            <div className="TheFirst" style={{ color: '#363940', fontSize: '22px', fontFamily: 'Metropolis', fontWeight: '700', lineHeight: '22px', wordWrap: 'break-word' }}>Teen <br /> Counseling</div>
                            <div className="MicrosoftPatchMana" style={{ width: '160px', color: '#999999', fontSize: '14px', fontFamily: 'Metropolis', fontWeight: '400', lineHeight: '24px', wordWrap: 'break-word' }}>Harnessing the power of Technology to deliver better customer experience</div>
                        </div>
                    </div>
                    <div className="Feature" style={{ width: '259px', padding: '24px', boxShadow: '0px 18px 58px 16px rgba(0, 0, 0, 0.06)', borderRadius: '8px', overflow: 'hidden', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '18px', display: 'inline-flex' }}>
                        <div className="Bag" style={{ width: '37px', height: '37px', position: 'relative' }}>
                            <div className="Vector" style={{ width: '30.83px', height: '12.33px', left: '3.08px', top: '9.25px', position: 'absolute', background: '#F899CC' }}></div>
                            <div className="Vector" style={{ width: '30.83px', height: '27.75px', left: '3.08px', top: '4.62px', position: 'absolute', background: '#ED017F' }}></div>
                        </div>
                        <div className="Frame17" style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '10px', display: 'flex' }}>
                            <div className="TheFirst" style={{ color: '#363940', fontSize: '22px', fontFamily: 'Metropolis', fontWeight: '700', lineHeight: '22px', wordWrap: 'break-word' }}>Online <br /> Forum</div>
                            <div className="MicrosoftPatchMana" style={{ width: '160px', color: '#999999', fontSize: '14px', fontFamily: 'Metropolis', fontWeight: '400', lineHeight: '24px', wordWrap: 'break-word' }}>Setting the standard for the best Corporate Citizenship in the communities we work</div>
                        </div>
                    </div>
                    {/* Add more Feature components here */}
                </div>

                <div className="edu" style={{ width: '1440px', height: '820px', position: 'relative', bottom: '30px' }}>
                    <div className="edu-sec" style={{ width: '1230px', right: '-150px', bottom: '30px', position: 'absolute', justifyContent: 'space-between', alignItems: 'flex-start', display: 'inline-flex' }}>
                        <div className="Feature" style={{ width: '259px', padding: '24px', boxShadow: '0px 18px 58px 16px rgba(0, 0, 0, 0.06)', borderRadius: '8px', overflow: 'hidden', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '18px', display: 'inline-flex' }}>
                            <div className="CircleLayer" style={{ width: '37px', height: '37px', position: 'relative' }}>
                                <div className="Vector" style={{ width: '21.40px', height: '21.40px', left: '12.52px', top: '3.08px', position: 'absolute', background: '#FCE0EF' }}></div>
                                <div className="Vector" style={{ width: '15.42px', height: '15.42px', left: '3.08px', top: '18.50px', position: 'absolute', background: '#ED017F' }}></div>
                                <div className="Vector" style={{ width: '18.45px', height: '18.45px', left: '7.75px', top: '10.79px', position: 'absolute', background: '#F899CC' }}></div>
                            </div>
                            <div className="Frameedu" style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '10px', display: 'flex' }}>
                                <div className="TheFirst" style={{ color: '#363940', fontSize: '22px', fontFamily: 'Metropolis', fontWeight: '700', lineHeight: '22px', wordWrap: 'break-word' }}>Event <br /> Tracking</div>
                                <div className="MicrosoftPatchMana" style={{ width: '160px', color: '#999999', fontSize: '14px', fontFamily: 'Metropolis', fontWeight: '400', lineHeight: '24px', wordWrap: 'break-word' }}>Displaying the highest level of Integrity in the way we conduct our business</div>
                            </div>
                        </div>
                        <div className="Feature" style={{ width: '259px', padding: '24px', boxShadow: '0px 18px 58px 16px rgba(0, 0, 0, 0.06)', borderRadius: '8px', overflow: 'hidden', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '18px', display: 'inline-flex' }}>
                            <div className="Rocket" style={{ width: '37px', height: '37px', position: 'relative' }}>
                                <div className="Vector" style={{ width: '26.91px', height: '26.98px', left: '1.59px', top: '8.50px', position: 'absolute', background: '#ED017F' }}></div>
                                <div className="Vector" style={{ width: '28.73px', height: '28.87px', left: '6.68px', top: '1.52px', position: 'absolute', background: '#F899CC' }}></div>
                            </div>
                            <div className="Frame17" style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '10px', display: 'flex' }}>
                                <div className="TheFirst" style={{ color: '#363940', fontSize: '22px', fontFamily: 'Metropolis', fontWeight: '700', lineHeight: '22px', wordWrap: 'break-word' }}>Adolescent <br />Education Hub</div>
                                <div className="MicrosoftPatchMana" style={{ width: '160px', color: '#999999', fontSize: '14px', fontFamily: 'Metropolis', fontWeight: '400', lineHeight: '24px', wordWrap: 'break-word' }}>Harnessing the power of Technology to deliver better customer experience</div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="edu-info" style={{ width: '660px', right: '150px', top: '163px', position: 'absolute', textAlign: 'center', color: '#ED017F', fontSize: '16px', fontFamily: 'Metropolis', fontWeight: '400', lineHeight: '22px', wordWrap: 'break-word' }}>These are what the sites offer that you can explore!</div>
                <div className="edu-title" style={{ right: '50px', top: '100px', position: 'absolute', textAlign: 'center', color: '#F38783', fontSize: '36px', fontFamily: 'Metropolis', fontWeight: '700', lineHeight: '43px', wordWrap: 'break-word' }}>Creating Extraordinary Adolescent Experience</div>
            </div >


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

        </div >
    );
};

export default Home;
