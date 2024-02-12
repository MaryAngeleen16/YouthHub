import React from 'react';
import Header from './Components/Layouts/Header';
import Footer from './Components/Layouts/Footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { getUser } from './utils/helpers';

import Login from './Components/User/Login';
import Register from './Components/User/Register';
import Profile from './Components/User/Profile';
import UpdateProfile from './Components/User/UpdateProfile';
import ForgotPassword from './Components/User/ForgotPassword';
import NewPassword from './Components/User/NewPassword';
import UpdatePassword from './Components/User/UpdatePassword';
import Dashboard from './Components/Admin/Dashboard';
import Home from './Home.js';

import CategoryList from './Components/Admin/CategoryList';
import CreateCategory from './Components/Admin/CreateCategory';
import UpdateCategory from './Components/Admin/UpdateCategory';
import ProtectedRoute from './Components/Route/ProtectedRoute';

import PostList from './Components/Admin/PostList';
import CreatePost from './Components/Admin/postCreate';
import UpdatePost from './Components/Admin/UpdatePost';
import PostPage from './Components/PostPage';

import VideoCreate from './Components/Admin/videoCreate';
import VideoList from './Components/Admin/VideoList';
import UpdateVideo from './Components/Admin/UpdateVideo';
function App() {
  return (
    <div>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} exact />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/me" element={<Profile />} />
          <Route path="/me/update" element={<UpdateProfile />} />
          <Route path="/password/forgot" element={<ForgotPassword />} />
          <Route path="/password/reset/:token" element={<NewPassword />} />
          <Route path="/password/update" element={<UpdatePassword />} />

          <Route path="/category/create" element={<CreateCategory />} />
          <Route path="/category/update/:id" element={<UpdateCategory />} />
          <Route path="/category/list" element={<CategoryList />} />

          <Route path="/post/list" element={<PostList />} />
          <Route path="/post/create" element={<CreatePost />} />
          <Route path="/post/update/:id" element={<UpdatePost />} />
          <Route path="/PostPage" element={<PostPage />} exact />

          <Route path="/dashboard" element={
            <ProtectedRoute isAdmin={true}>

              <Dashboard />
            </ProtectedRoute>
          } end />
          <Route path="/sidebar" element={
            <ProtectedRoute isAdmin={true}>
              {/* <Sidebar /> */}
            </ProtectedRoute>
          } end />


          <Route path="/video/create" element={<VideoCreate />} />
          <Route path="/video/list" element={<VideoList />} />
          <Route path="/video/update/:id" element={<UpdateVideo />} />
          <Route path="/" element={<Home />} />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute isAdmin={true}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;