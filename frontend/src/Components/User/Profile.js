import React, { Fragment, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MetaData from '../Layouts/Metadata';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Flip } from 'react-toastify';
import { getToken } from '../../utils/helpers';
import BackDropLoading from '../Layouts/BackDropLoading';
import '../Profile.css';

const Profile = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('');
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.jpg');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({});
    const [isUpdated, setIsUpdated] = useState(false);
    let navigate = useNavigate();

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

        getProfile();
    }, []);

    const updateProfile = async (userData) => {
        setLoading(true);
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
            toast.success('✅ User Profile Updated', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Flip,
              });
            navigate('/me', { replace: true });
        } catch (error) {
            setLoading(false);
            console.error('Error updating profile:', error);
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Server response:', error.response.data);
                console.error('Status code:', error.response.status);
                if (error.response.data && error.response.data.message) {
                    toast.error(error.response.data.message, {
                        position: toast.POSITION.BOTTOM_CENTER,
                    });
                } else {
                    toast.error('User Update Failed', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                        transition: Flip,
                        });
                }
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received from the server');
                toast.error('No response received from the server', {
                    position: toast.POSITION.BOTTOM_CENTER,
                });
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error setting up the request:', error.message);
                toast.error('Error setting up the request', {
                    position: toast.POSITION.BOTTOM_CENTER,
                });
            }
            setLoading(false); // Ensure loading state is updated even in case of error
        }
    };


    // Submit form handler
    const submitHandler = async (e) => {
        e.preventDefault();

        // Check if required fields are empty
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
            formData.set('avatar', avatar); // Include avatar data in FormData
        }

        try {
            // Clear any previous error messages
            setError('');

            // Attempt to update the profile
            await updateProfile(formData);
        } catch (error) {
            // Display the error using toast.error
            toast.error(error.message || 'User update failed', {
                position: toast.POSITION.BOTTOM_CENTER,
            });
        }
    };

    const onChange = (e) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatarPreview(reader.result);
                setAvatar(reader.result);
            }
        };

        reader.readAsDataURL(e.target.files[0]);
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

    // console.log(user);

    return (
        <Fragment>
            <BackDropLoading open={loading} />
            <MetaData title={'Profile'} />

            <div className="container light-style flex-grow-1 container-p-y profile-card">
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
                                {/* <a className="list-group-item list-group-item-action" style={{ paddingTop: '10px' }} data-toggle="list" href="#account-social-links">Social links</a> */}
                                {/* <a className="list-group-item list-group-item-action" style={{ paddingTop: '10px' }} data-toggle="list" href="#account-connections">Connections</a> */}
                                {/* <a className="list-group-item list-group-item-action" style={{ paddingTop: '10px' }} data-toggle="list" href="#account-notifications">Notifications</a> */}
                            </div>
                        </div>
                        <div className="col-md-9">
                            <div className="tab-content">
                                <div className="tab-pane fade active show" id="account-general">
                                    <form onSubmit={submitHandler}>
                                        <div className="card-body media align-items-center">
                                            <figure className="avatar avatar-profile" style={{ width: '100px', height: '100px' }} >
                                                {avatarPreview ? (
                                                    <img className="rounded img-fluid" src={avatarPreview} alt={user.name} />
                                                ) : null}
                                            </figure>
                                            <div className="media-body ml-4">
                                                <label className="btn-sm">
                                                    &#8203;
                                                    <input type="file" className="account-settings-fileinput" style={{ paddingTop: '10px' }} onChange={onChange} />
                                                </label> &nbsp;
                                                <button type="button" className="btn-sm btn-default">Reset</button>
                                                <div className="text-dark small mt-1">Allowed JPG, GIF or PNG. Max size of 800K</div>
                                            </div>
                                        </div>
                                        <hr className="border-light m-0" />
                                        <div className="card-body">
                                            <div className="form-group mb-4">
                                                <label htmlFor="name_field" style={{ fontWeight: 'bold' }}>Name</label>
                                                <input
                                                    type="text"
                                                    id="name_field"
                                                    className="form-control form-control-sm"
                                                    name="name"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                />
                                            </div>

                                            <div className="form-group mb-4">
                                                <label htmlFor="email_field" style={{ fontWeight: 'bold' }}>Email</label>
                                                <input
                                                    type="email"
                                                    id="email_field"
                                                    className="form-control form-control-sm"
                                                    name="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                            </div>
                                            <div className="form-group mb-4">
                                                <label className="form-label" style={{ fontWeight: 'bold' }}>Joined On</label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    value={String(user.createdAt).substring(0, 10)}
                                                    readOnly
                                                />
                                            </div>
                                            {/* <button
                                                    type="submit"
                                                    className="btn update-btn btn-block mt-4 mb-3"
                                                    disabled={loading ? true : false}
                                                >
                                                    Update
                                                </button> */}
                                            <div className="text-right mt-3">
                                                <button
                                                    type="submit"
                                                    className="btn-sm btn-primary"
                                                    disabled={loading ? true : false}
                                                >
                                                    Save changes
                                                </button>&nbsp;&nbsp;
                                                <button type="button" className="btn-sm btn-default">Cancel</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </Fragment>
    );
};

export default Profile;
