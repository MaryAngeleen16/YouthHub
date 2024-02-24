import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { getToken } from '../../utils/helpers';
import '../Profile.css';

const UpdatePassword = () => {
    const [user, setUser] = useState({});
    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch user profile data
    useEffect(() => {
        const getProfile = async () => {
            try {
                const config = {
                    headers: {
                        'Authorization': `Bearer ${getToken()}`
                    }
                };
                const { data } = await axios.get(`http://localhost:4001/api/me`, config);
                setUser(data.user);
            } catch (error) {
                console.error(error);
                toast.error("Failed to fetch user data");
            }
        };
        getProfile();
    }, []);

    // Update password handler
    const updatePassword = async (formData) => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            };
            const { data } = await axios.put(`http://localhost:4001/api/password/update`, formData, config);
            toast.success('Password updated');
        } catch (error) {
            setError(error.response.data.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    // Form submission handler
    const submitHandler = (e) => {
        e.preventDefault();
        if (!oldPassword || !password) {
            toast.error('Both old password and new password are required');
            return;
        }
        const formData = {
            oldPassword,
            password,
        };
        updatePassword(formData);
    };

    //BOOTSTRAP CSS
    useEffect(() => {
        const bootstrapStyles = `
          @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css');
        `;
    
        const styleElement = document.createElement('style');
        styleElement.innerHTML = bootstrapStyles;
    
        document.head.appendChild(styleElement);
    
        return () => {
          document.head.removeChild(styleElement);
        };
    }, []);

    // Error handling
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    return (
        <div className="container light-style flex-grow-1 container-p-y">
            <h4 className="font-weight-bold py-3 mb-4">
                Account settings
            </h4>
            <div className="card overflow-hidden">
                <div className="row no-gutters row-bordered row-border-light">
                    <div className="col-md-3 pt-0">
                        <div className="list-group list-group-flush account-settings-links">
                            <a className="list-group-item list-group-item-action active" style={{ paddingTop: '20px' }} data-toggle="list"
                                href="/me">GENERAL</a>
                            <a className="list-group-item list-group-item-action" style={{ paddingTop: '10px' }} data-toggle="list"
                                href="/password/update">Change password</a>
                            <a className="list-group-item list-group-item-action" style={{ paddingTop: '10px' }} data-toggle="list"
                                href="#account-info">Info</a>
                            <a className="list-group-item list-group-item-action" style={{ paddingTop: '10px' }} data-toggle="list"
                                href="#account-social-links">Social links</a>
                            <a className="list-group-item list-group-item-action" style={{ paddingTop: '10px' }} data-toggle="list"
                                href="#account-connections">Connections</a>
                            <a className="list-group-item list-group-item-action" style={{ paddingTop: '10px' }} data-toggle="list"
                                href="#account-notifications">Notifications</a>
                        </div>
                    </div>
                    <div className="col-md-9">
                        <div className="card-body">
                            {/* Change Password */}
                            <form onSubmit={submitHandler}>
                                <div className="form-group">
                                    <label className="form-label">Old Password</label>
                                    <input type="password" className="form-control" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">New Password</label>
                                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                <button type="submit" className="btn btn-primary" disabled={loading}>Update Password</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdatePassword;