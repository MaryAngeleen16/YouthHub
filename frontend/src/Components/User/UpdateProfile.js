import React, { Fragment, useState, useEffect } from 'react';
import MetaData from '../Layouts/Metadata';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getToken } from '../../utils/helpers';

const UpdateProfile = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('');
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.jpg');
    const [error, setError] = useState('');
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);
    let navigate = useNavigate();

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
            setLoading(false);
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Error fetching user profile', {
                position: toast.POSITION.BOTTOM_CENTER, 
            });
        }
    };

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
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Server response:', error.response.data);
                console.error('Status code:', error.response.status);
                toast.error(error.response.data.message || 'User update failed', {
                    position: toast.POSITION.BOTTOM_CENTER,
                });
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
        }
    };

    
    const goBack = () => {
        // Navigate back to the previous page
        navigate(-1);
    };

    useEffect(() => {
        getProfile();
    }, []); // Empty dependency array ensures the effect runs only once when the component mounts

    //validation of update profile
    const submitHandler = async (e) => {
        e.preventDefault();
    
        // Check if required fields are empty
        if (!name || !email || !avatar) {
            toast.error('All fields are required', {
                position: toast.POSITION.BOTTOM_CENTER,
            });
            return;
        }
    
        const formData = new FormData();
        formData.set('name', name);
        formData.set('email', email);
        formData.set('avatar', avatar);
    
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

    console.log(user);

    return (
        <Fragment>
            <MetaData title={'Update Profile'} />

            <div className="row update-profile-bg" >
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" 
                   style={{ border: '3px solid #8e5f47',
                borderRadius: '15px'}}
                    onSubmit={submitHandler} encType="multipart/form-data">
                        <h2 className="mt-2 mb-5"
                        style={{
                            color: '#8e5f47',
                            textTransform: 'uppercase',
                            fontFamily: 'Hammersmith One, sans-serif',
                            textAlign: 'center', 
                            margin: '0 auto',   
                           
                        }}>Update Profile</h2>
                        <div className="form-group">
                            <label htmlFor="email_field">Name</label>
                            <input
                                type="name"
                                id="name_field"
                                className="form-control"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email_field">Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="avatar_upload">Avatar</label>
                            <div className="d-flex align-items-center">
                                <div>
                                    <figure className="avatar mr-3 item-rtl">
                                        <img
                                            src={avatarPreview}
                                            className="rounded-circle"
                                            alt="Avatar Preview"
                                        />
                                    </figure>
                                </div>
                                <div className="custom-file">
                                    <input
                                        type="file"
                                        name="avatar"
                                        className="custom-file-input"
                                        id="customFile"
                                        accept="image/*"
                                        onChange={onChange}
                                    />
                                    <label className="custom-file-label" htmlFor="customFile">
                                        Choose Avatar
                                    </label>
                                </div>
                            </div>
                        </div>
                            <button
                                type="submit"
                                className="btn update-btn btn-block mt-4 mb-3"
                                disabled={loading ? true : false}
                                style={{marginTop: '30%', backgroundColor: '#8e5f47',
                                        borderColor: '#8e5f47'}}
                            >
                                Update
                            </button>
                    </form>
                </div>
            </div>
         
            
        </Fragment>
    );
};

export default UpdateProfile;