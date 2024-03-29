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
import UpdateInfo from './Components/User/UpdateInfo';
import ForgotPassword from './Components/User/ForgotPassword';
import NewPassword from './Components/User/NewPassword';
import UpdatePassword from './Components/User/UpdatePassword';
import Dashboard from './Components/Admin/Dashboard';
import Home from './Home.js';

import AllEvents from './Components/Events/AllEvents';
import CreateEvent from './Components/Events/NewEvent';
import UpdateEvent from './Components/Events/UpdateEvent';
import EventDetails from './Components/EventDetails.js';

import VenueList from './Components/Venue/AllVenues';
import CreateVenue from './Components/Venue/NewVenue';
import UpdateVenue from './Components/Venue/UpdateVenue';

import CategoryList from './Components/Admin/CategoryList';
import CreateCategory from './Components/Admin/CreateCategory';
import UpdateCategory from './Components/Admin/UpdateCategory';
import ProtectedRoute from './Components/Route/ProtectedRoute';

import PostList from './Components/Admin/PostList';
import CreatePost from './Components/Admin/postCreate';
import UpdatePost from './Components/Admin/UpdatePost';
import PostsPage from './Components/PostsPage';

import VideoCreate from './Components/Admin/videoCreate';
import VideoList from './Components/Admin/VideoList';
import UpdateVideo from './Components/Admin/UpdateVideo';

import UserManagement from './Components/Admin/userManagement';

import PregnancyPostPage from './Components/PregnancyPostPage.js';
import YouthEvents from './Components/YouthEvents.js';
import Forum from './Components/Forums/Forum.js';
import EditTopic from './Components/Forums/EditTopic.js';
import VideosPage from './Components/VideosPage.js';

import PostDetails from './Components/PostDetails.js';

import VideoDetails from './Components/VideoDetails.js';
import VentForm from './Components/VentForm.js';
import VentList from './Components/Counselor/VentList.js';
import VentFormByUser from './Components/VentFormByUser.js';

import CountdownTimer from './CountdownTimer.js';
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
          <Route path="/me/info" element={<UpdateInfo />} />
          <Route path="/password/forgot" element={<ForgotPassword />} />
          <Route path="/password/reset/:token" element={<NewPassword />} />
          <Route path="/password/update" element={<UpdatePassword />} />

          <Route path="/venue/create" element={<CreateVenue />} />
          <Route path="/venue/update/:id" element={<UpdateVenue />} />
          <Route path="/venue/list" element={<VenueList />} />

          <Route path="/event/create" element={<CreateEvent />} />
          <Route path="/event/update/:id" element={<UpdateEvent />} />
          <Route path="/event/list" element={<AllEvents />} />

          <Route path="/category/create" element={<CreateCategory />} />
          <Route path="/category/update/:id" element={<UpdateCategory />} />
          <Route path="/category/list" element={<CategoryList />} />

          <Route path="/post/list" element={<PostList />} />
          <Route path="/post/create" element={<CreatePost />} />
          <Route path="/post/update/:id" element={<UpdatePost />} />
          <Route path="/PostsPage" element={<PostsPage />} exact />
          <Route path="/VideosPage" element={<VideosPage />} exact />


          <Route path="/Pregnancy" element={<PregnancyPostPage />} exact />
          <Route path="/YouthEvents" element={<YouthEvents />} exact />
          <Route path="/post/:id" element={<PostDetails />} exact />
          <Route path="/video/:id" element={<VideoDetails />} exact />

          <Route path="/vent/new" element={<VentForm />} exact />
          <Route path="/vent/me" element={<VentFormByUser/>} exact />

          <Route path="/vent/list" element={<VentList/>} exact />
          <Route path="/events/:id" element={<EventDetails />} exact />

          <Route path="/countdowntimer" element={<CountdownTimer />} exact />

          <Route path="/dashboard" element
          ={
            <ProtectedRoute isAdmin={true}>

              <Dashboard />
            </ProtectedRoute>
          } end />
          <Route path="/sidebar" element={
            <ProtectedRoute isAdmin={true}>
              {/* <Sidebar /> */}
            </ProtectedRoute>
          } end />

          <Route path='/forums' element={<Forum />} />
          <Route path='/edit/topic/:id' element={<EditTopic />} />

          <Route path="/video/create" element={<VideoCreate />} />
          <Route path="/video/list" element={<VideoList />} />
          <Route path="/video/update/:id" element={<UpdateVideo />} />
          <Route path="/" element={<Home />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute isAdmin={true}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute isAdmin={true}>
                <UserManagement />
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