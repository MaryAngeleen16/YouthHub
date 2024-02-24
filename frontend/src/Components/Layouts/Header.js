import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { getUser, setUser, logout } from '../../utils/helpers';
import './FH.css';
import './Header.css';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const user = getUser();
  const userAuthenticated = !!user;
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const onChange = (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setUser(prevState => ({
          ...prevState,
          avatar: { url: reader.result }
        }));
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const settings = ['Profile', 'Settings'];

  // Define the paths where you don't want the Header to appear
  const excludedPaths = ['/dashboard', '/category/create', '/category/list',
    '/post/list/', '/post/create/', '/video/list',
    '/video/create', '/admin/users'];

  // Check if the current location is one of the excluded paths
  const shouldRenderHeader = !excludedPaths.includes(location.pathname);

  // Render the Header only if it's not one of the excluded paths
  if (!shouldRenderHeader) {
    return null;
  }
  return (
    <div>
      <AppBar position="static" className="gradient-header">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} className="text-ye" style={{ textAlign: 'left' }}>
            <a href="/" style={{ color: 'white', textDecoration: 'none' }}>
              Youth Empowerment
            </a>
          </Typography>
          <Box>
            {userAuthenticated ? (
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu}>
                  {user.avatar ? (
                    <Avatar src={avatarPreview || user.avatar.url} alt={user.name} />
                  ) : null}
                </IconButton>
              </Tooltip>
            ) : (
              <>
                <Link to="/register" className="ml-4" id="signup_link">
                  <span className='signup-text' style={{ fontSize: '0.8em', marginRight: '1em', color: '#A3716E' }}>SIGN UP</span>
                </Link>
                <Link to="/login" className="btn ml-4" id="login_btn">
                  <Button className='login-text'>Login</Button>
                </Link>
              </>
            )}
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting, index) => (
                <MenuItem key={index} onClick={handleCloseUserMenu}>
                  <Link to="/me" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Typography textAlign="center">{setting}</Typography>
                  </Link>
                </MenuItem>
              ))}

              {user && user.role === 'admin' && (
                <MenuItem>
                  <Link to="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Typography textAlign="center">Dashboard</Typography>
                  </Link>
                </MenuItem>
              )}

              <MenuItem onClick={handleLogout}>
                <Typography textAlign="center" color="red">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </div >
  );
};

export default Header;
