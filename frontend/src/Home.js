// Home.js
import React from 'react';
import Navbar from './Components/Layouts/navBar'; // Import the Navbar component
// import BannerImage from "./Public/images/home.png"
const Home = () => {
    return (
        <div>
            <Navbar /> {/* Render the Navbar component */}
            <div className="home-banner-container">
                <div className="home-bannerImage-container">
                    {/* <img src="/images/home.png" alt="Banner" /> */}
                </div>
            </div>
        </div>
    );
};

export default Home;