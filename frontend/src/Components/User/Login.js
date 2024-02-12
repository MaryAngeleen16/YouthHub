import React, { Fragment, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Metadata from '../Layouts/Metadata';
import Loader from '../Layouts/Loader';
import axios from 'axios';

import 'boxicons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { authenticate, getUser } from '../../utils/helpers';

import '../Layouts/FH.css';
import '../Layouts/RLForms.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  // const redirect = location.search ? new URLSearchParams(location.search).get('redirect') : '';

  // useEffect(() => {
  //   if (getUser() && redirect === 'shipping') {
  //     navigate(`/${redirect}`);
  //   }
  // }, [redirect, navigate]);

  // const notify = (error) => {
  //   toast.error(error, {
  //     position: toast,
  //   });
  // };

  const login = async (email, password) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const { data } = await axios.post(`http://localhost:4001/api/login`, { email, password }, config);
      console.log(data);
      authenticate(data, () => navigate('/'));
      window.location.reload();
    } catch (error) {
      toast.error('Invalid User or Password', {
        position: 'top-right',
      });
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="container-login">
            <div className="content">
              <h2 className="logo"><span className="healthicons--pregnant-outline"> Youth Hub</span></h2>
              <div className="text-sci">
                <h2>Welcome!<br /><span>To our Website.</span></h2>
                <p>Lorem ipsum dolor sit amhiet, consectetur adipiscing elit.<br></br> Sed vestibulum, velit eget fermentum consectetur, erat ex sodales sapien, vel rutrum odio dui at velit.<br></br> Nulla facilisi. Integer consectetur lorem nec libero bibendum, sit amet dapibus turpis hendrerit.
                </p>
              </div>
            </div>
            <div className="logreg-box">
              <div className="form-box login">
                <form onSubmit={submitHandler}>
                  <h2>Sign In</h2>

                  <div className="input-box">
                  <span class="icon"><box-icon type='solid' name='envelope'></box-icon>
                    </span>
                    <input 
                      type="email"
                      id="emailform"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                     required />
                    <label>Email</label>
                  </div>

                  <div className="input-box">
                    <span class="icon"><box-icon type='solid' name='lock-alt'></box-icon></span>
                    <input 
                      type="password" 
                      id="passwordform"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                     required />
                    <label>Password</label>
                  </div>
                  <div class="remember-forgot">
                    <label>
                      <input type="checkbox" />
                      Remember me
                    </label>
                    <a href="#">Forgot Password</a>
                  </div>

                  <button type="submit" class="btn">Login</button>

                  <div class="login-register">
                    <p>Don't have an account? <a href="/register" class="register-link">Sign Up</a></p>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <ToastContainer />
        </Fragment>
      )}
    </Fragment>
  );
};

export default Login;
