import React from 'react';
import './FH.css';

const Navbar = () => {
  return (
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item color-nav">
          <b>
            <a className="nav-link header-link" href="/">Home</a>
          </b>
        </li>
        <li className="nav-item color-nav dropdown">
          <b>
            <a className="nav-link header-link" href="/">Feed</a>
          </b>
          <ul className="dropdown-menu">
            <li className="dropdown-item"><a href="/PostsPage">All Post</a></li>
            <li className="dropdown-item"><a href="/pregnancy">Pregnancy</a></li>
            {/* <li className="dropdown-item"><a href="#">Sexual Education</a></li>
            <li className="dropdown-item"><a href="#">Contraceptive</a></li> */}
            {/* Add more dropdown items as needed */}
          </ul>
        </li>
        
        <li className="nav-item color-nav">
          <b>
            <a className="nav-link header-link" href="/VideosPage">Videos</a>
          </b>
        </li>
        {/* <li className="nav-item color-nav">
          <b>
            <a className="nav-link header-link" href="/">Sexual Education</a>
          </b>
        </li> */}
        <li className="nav-item color-nav">
          <b>
            <a className="nav-link header-link" href="/YouthEvents">Youth Events</a>
          </b>
        </li>
        <li className="nav-item color-nav">
          <b>
            <a className="nav-link header-link" href="/forums">Forums</a>
          </b>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
