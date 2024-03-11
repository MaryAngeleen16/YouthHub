import React from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import './FH.css';
import './Header.css';

const Footer = () => {
  const location = useLocation(); // Get the current location

   // Define the paths where you don't want the Header to appear
   const excludedPaths = ['/dashboard', '/venue/list','/venue/create','/event/create','/event/list', '/category/create', '/category/list',
                          '/post/list/','/post/create/','/video/list',
                          '/video/create','/me', '/password/update','/me/info','/admin/users'];

   // Check if the current location is one of the excluded paths
   const shouldRenderHeader = !excludedPaths.includes(location.pathname);
 
   // Render the Header only if it's not one of the excluded paths
   if (!shouldRenderHeader) {
     return null;
   }

  return (
    <footer className="gradient-footer footer-space">
      <p>&copy; 2024 Youth Empowerment. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
