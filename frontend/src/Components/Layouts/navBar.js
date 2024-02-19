import React from 'react';
import './FH.css';

const Navbar = () => {
  return (
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0 ">
          <li className="nav-item color-nav"><b>
            <a className="nav-link header-link" href="/">Home</a>
          </b></li>
          <li className="nav-item color-nav"><b>
            <a className="nav-link header-link" href="/postspage">All Posts</a>
          </b></li>
          <li className="nav-item color-nav"><b>
            <a className="nav-link  header-link" href="/pregnancy">Pregnancy</a>
          </b></li>
          <li className="nav-item color-nav"><b>
            <a className="nav-link header-link" href="/">Sexual Education</a>
          </b></li>
          <li className="nav-item color-nav"><b>
            <a className="nav-link header-link" href="/">Youth Events</a>
          </b></li>
          <li className="nav-item color-nav"><b>
            <a className="nav-link header-link" href="/forums">Forums</a>
          </b></li>
        </ul>
      </div>
  );
};

export default Navbar;
