import React, { Fragment, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MetaData from '../Layouts/Metadata';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getToken } from '../../utils/helpers';

const UpdateInfo = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('');
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.jpg');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({});
    const [isUpdated, setIsUpdated] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const getProfile = async () => {
            const config = {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            };

            try {
                const { data } = await axios.get(`http://localhost:4001/api/me`, config);
                setName(data.user.name);
                setEmail(data.user.email);
                setAvatarPreview(data.user.avatar.url);
                setUser(data.user);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching profile:', error);
                toast.error('Error fetching user profile', {
                    position: toast.POSITION.BOTTOM_CENTER,
                });
            }
        };

        const getAdditionalInfo = async () => {
            const config = {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            };

            try {
                const { data } = await axios.get(`http://localhost:4001/api/me/additional-info`, config);
                setUser(prevUser => ({ ...prevUser, ...data }));
            } catch (error) {
                console.error('Error fetching additional info:', error);
                toast.error('Error fetching additional user info', {
                    position: toast.POSITION.BOTTOM_CENTER,
                });
            }
        };

        getProfile();
        getAdditionalInfo();
    }, []);

    const updateProfile = async (userData) => {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${getToken()}`,
            },
        };

        try {
            const { data } = await axios.put(`http://localhost:4001/api/me/update`, userData, config);
            setIsUpdated(data.success);
            setLoading(false);
            toast.success('User updated', {
                position: toast.POSITION.BOTTOM_CENTER,
            });
            navigate('/me', { replace: true });
        } catch (error) {
            console.error('Error updating profile:', error);
            if (error.response) {
                console.error('Server response:', error.response.data);
                console.error('Status code:', error.response.status);
                toast.error(error.response.data.message || 'User update failed', {
                    position: toast.POSITION.BOTTOM_CENTER,
                });
            } else if (error.request) {
                console.error('No response received from the server');
                toast.error('No response received from the server', {
                    position: toast.POSITION.BOTTOM_CENTER,
                });
            } else {
                console.error('Error setting up the request:', error.message);
                toast.error('Error setting up the request', {
                    position: toast.POSITION.BOTTOM_CENTER,
                });
            }
        }
    };

    // Submit form handler
    const submitHandler = async (e) => {
        e.preventDefault();

        if (!name || !email) {
            toast.error('Name and email are required', {
                position: toast.POSITION.BOTTOM_CENTER,
            });
            return;
        }

        const formData = new FormData();
        formData.set('name', name);
        formData.set('email', email);
        if (avatar) {
            formData.set('avatar', avatar);
        }

        try {
            await updateProfile(formData);
        } catch (error) {
            toast.error(error.message || 'User update failed', {
                position: toast.POSITION.BOTTOM_CENTER,
            });
        }
    };

    const onChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setAvatar(file);
            setAvatarPreview(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    // Bootstrap CSS
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

    return (
        <Fragment>
            <MetaData title={'Profile'} />

            <div className="container light-style flex-grow-1 container-p-y">
                <h4 className="font-weight-bold py-3 mb-4">
                    Account settings
                </h4>
                <div className="card overflow-hidden">
                    <div className="row no-gutters row-bordered row-border-light">
                        <div className="col-md-3 pt-0">
                            <div className="list-group list-group-flush account-settings-links">
                                <a className="list-group-item list-group-item-action active" style={{ paddingTop: '20px' }} data-toggle="list" href="/me">GENERAL</a>
                                <a className="list-group-item list-group-item-action" style={{ paddingTop: '10px' }} data-toggle="list" href="/password/update">Change password</a>
                                <a className="list-group-item list-group-item-action" style={{ paddingTop: '10px' }} data-toggle="list" href="/me/info">Info</a>
                                <a className="list-group-item list-group-item-action" style={{ paddingTop: '10px' }} data-toggle="list" href="#account-social-links">Social links</a>
                                <a className="list-group-item list-group-item-action" style={{ paddingTop: '10px' }} data-toggle="list" href="#account-connections">Connections</a>
                                <a className="list-group-item list-group-item-action" style={{ paddingTop: '10px' }} data-toggle="list" href="#account-notifications">Notifications</a>
                            </div>
                        </div>
                        <div className="col-md-9">
                            <div className="tab-content">
                                <form onSubmit={submitHandler} encType="multipart/form-data">
                                    <div className="tab-pane fade show active" id="account-info">
                                        <div className="card-body pb-2">
                                            <div className="form-group">
                                                <label className="form-label">Bio</label>
                                                <textarea className="form-control" rows="5" value={user.bio || ''} onChange={(e) => setUser({ ...user, bio: e.target.value })}></textarea>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Birthday</label>
                                                <input type="date" className="form-control" value={user.birthday || ''} onChange={(e) => setUser({ ...user, birthday: e.target.value })} />
                                            </div>
                                            <div>
                                                <div className="form-group">
                                                    <label className="form-label">Gender</label>
                                                    <div>
                                                        <select className="custom-select" value={user.gender || ''} onChange={(e) => setUser({ ...user, gender: e.target.value })}>
                                                            <option>Male</option>
                                                            <option>Female</option>
                                                            <option>Other</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Location (within Taguig City) </label>
                                                    <div>
                                                        <select className="custom-select" value={user.country || ''} onChange={(e) => setUser({ ...user, country: e.target.value })}>
                                                            <option>USA</option>
                                                            <option>Canada</option>
                                                            <option>UK</option>
                                                            <option>Germany</option>
                                                            <option>France</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <hr className="border-light m-0" />
                                        <div className="card-body pb-2">
                                            <h6 className="mb-4">Contacts</h6>
                                            <div className="form-group">
                                                <label className="form-label">Phone</label>
                                                <input type="text" className="form-control" value={user.phone || ''} onChange={(e) => setUser({ ...user, phone: e.target.value })} />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Website</label>
                                                <input type="text" className="form-control" value={user.website || ''} onChange={(e) => setUser({ ...user, website: e.target.value })} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right mt-3">
                                        <button
                                            type="submit"
                                            className="btn-sm btn-primary"
                                            disabled={loading ? true : false}
                                        >
                                            Save changes
                                        </button>&nbsp;&nbsp;
                                        <button type="button" className="btn-sm btn-default" onClick={() => navigate('/me')}>Cancel</button>
                                    </div>
                                    &nbsp;&nbsp;
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default UpdateInfo;
