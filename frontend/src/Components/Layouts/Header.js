import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { getUser,setUser, logout } from '../../utils/helpers';
import './FH.css';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null); // Added avatarPreview state
  const user = getUser();
  const userAuthenticated = !!user;
  const navigate = useNavigate();

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

  // Assuming `settings` contains an array of user settings
  const settings = ['Profile', 'Settings'];

  return (
    <div>
      <AppBar position="static" className="bg">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} className="text-ye" style={{ textAlign: 'left' }} href="/">
            Youth Empowerment
          </Typography>

          <Box>
            {userAuthenticated ? (
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu}>
                  {user.avatar ? (
                    <Avatar src={avatarPreview || user.avatar.url} alt={user.name} /> // Updated Avatar src
                  ) : null}
                </IconButton>
              </Tooltip>
            ) : (
              <Link to="/login" className="btn ml-4" id="login_btn">
                <Button className='login-text'>Login</Button>
              </Link>
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
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item"><b>
            <a className="nav-link" href="/">Home</a>
          </b></li>
          <li className="nav-item"><b>
            <a className="nav-link" href="/collections">Trending Posts</a>
          </b></li>
          <li className="nav-item"><b>
            <a className="nav-link" href="/Pregnancy">Pregnancy</a>
          </b></li>
          <li className="nav-item"><b>
            <a className="nav-link" href="/">Sexual Education</a>
          </b></li>
          <li className="nav-item"><b>
            <a className="nav-link" href="/">Youth Events</a>
          </b></li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
