import React, { useState } from 'react';
import { getUser, logout } from '../../utils/helpers';
import '../Layouts/dashcontent.css'; // Import your CSS file


function Sidebar() {
    const user = getUser();

    const [isExpanded, setIsExpanded] = useState(false);

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };
    const handleClickUser = () => {
        // Add logic here to handle user click action, such as redirecting to user profile page
        console.log('User clicked');
    };

    const handleLogout = () => {
        logout();
        // Add logic to redirect to logout route or homepage
    };

    return (
        <div className={`wrapper ${isExpanded ? 'expand' : ''}`}>
            <aside id="sidebar" className='fixed-left-sidebar'>
                <div className="d-flex" style={{ marginTop: '15px', float: 'center' }}>
                    <button className="toggle-btn" onClick={toggleSidebar}>
                        <i className="lni lni-grid-alt"></i>
                    </button>
                    <div className="sidebar-logo">
                        <a href="/dashboard">Dashboard</a>
                    </div>
                </div>
                <ul className="sidebar-nav">
                    <li className=''>
                        <a href="/" className="sidebar-link">
                            <box-icon name='category'></box-icon>
                            <span>Home</span>
                        </a>
                    </li>
                    <li className="sidebar-item">
                        <a href="#" className="sidebar-link collapsed has-dropdown" data-bs-toggle="collapse" data-bs-target="#categories" aria-expanded="false" aria-controls="categories">
                            <box-icon name='category'></box-icon>
                            <span>Categories</span>
                        </a>
                        <ul id="category" className="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">
                            <li className="sidebar-category">
                                <a href="/category/list" className="sidebar-link">Category List</a>
                            </li>
                            <li className="sidebar-item">
                                <a href="/category/create" className="sidebar-link">Create Category</a>
                            </li>
                        </ul>
                    </li>
                    <li className="sidebar-item">
                        <a href="#" className="sidebar-link collapsed has-dropdown" data-bs-toggle="collapse" data-bs-target="#categories" aria-expanded="false" aria-controls="categories">
                            <box-icon name='comment-dots' ></box-icon>
                            <span>Posts</span>
                        </a>
                        <ul id="post" className="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">
                            <li className="sidebar-item">
                                <a href="/post/list/" className="sidebar-link">Post List</a>
                            </li>
                            <li className="sidebar-item">
                                <a href="/post/create/" className="sidebar-link">Create Post</a>
                            </li>
                        </ul>
                    </li>
                    <li className="sidebar-item">
                        <a href="#" className="sidebar-link collapsed has-dropdown" data-bs-toggle="collapse"
                            data-bs-target="#video" aria-expanded="false" aria-controls="video">
                            <box-icon name='video' ></box-icon>
                            <span>Videos</span>
                        </a>
                        <ul id="auth" className="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">
                            <li className="sidebar-item">
                                <a href="/video/list" className="sidebar-link">Video List</a>
                            </li>
                            <li className="sidebar-item">
                                <a href="/video/create" className="sidebar-link">Upload New Video</a>
                            </li>
                        </ul>
                    </li>
                    <li className="sidebar-item">
                        <a href="#" className="sidebar-link collapsed has-dropdown" data-bs-toggle="collapse"
                            data-bs-target="#video" aria-expanded="false" aria-controls="video">
                            <box-icon name='carousel' ></box-icon>
                            <span>Sliders</span>
                        </a>
                        <ul id="auth" className="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">
                            <li className="sidebar-item">
                                <a href="#" className="sidebar-link">Slider List</a>
                            </li>
                            <li className="sidebar-item">
                                <a href="#" className="sidebar-link">Create Slider</a>
                            </li>
                        </ul>
                    </li>
                    <li className="sidebar-item">
                        <a href="#" className="sidebar-link collapsed has-dropdown" data-bs-toggle="collapse"
                            data-bs-target="#video" aria-expanded="false" aria-controls="video">
                            <box-icon name='user' ></box-icon>
                            <span>Users</span>
                        </a>
                        <ul id="auth" className="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">
                            <li className="sidebar-item">
                                <a href="/admin/users" className="sidebar-link">Users List</a>
                            </li>
                            <li className="sidebar-item">
                                <a href="#" className="sidebar-link">Create New User</a>
                            </li>
                        </ul>
                    </li>
                </ul>
                <div className="sidebar-footer">
                    <a href="/me" className="sidebar-link" onClick={handleClickUser}>
                        <span>Welcome, {user.name}</span>!
                    </a>
                    <a href="#" className="sidebar-link">
                        <box-icon name='exit' ></box-icon>
                        <span>Logout</span>
                    </a>
                </div>
            </aside>
        </div>
    );
}

export default Sidebar;
