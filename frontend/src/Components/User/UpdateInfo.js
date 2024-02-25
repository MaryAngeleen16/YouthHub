import React, { Fragment, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MetaData from '../Layouts/Metadata';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getToken } from '../../utils/helpers';

const UpdateInfo = () => {
    const [bio, setBio] = useState('');
    const [birthday, setBirthday] = useState('');
    const [location, setLocation] = useState('');
    const [phone, setPhone] = useState('');
    const [avatar, setAvatar] = useState('');
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.jpg');
    const [gender, setGender] = useState('');
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
                setBio(data.user.bio || '');
                setBirthday(data.user.birthday || '');
                setLocation(data.user.location || '');
                setPhone(data.user.phone || '');
                setGender(data.user.gender || '');
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
                const { data } = await axios.get(`http://localhost:4001/api/me/info`, config);
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

        // Check if required fields are filled
        if (!bio || !birthday || !location || !phone) {
            toast.error('Bio, birthday, location, and phone are required', {
                position: toast.POSITION.BOTTOM_CENTER,
            });
            return;
        }

        const formData = new FormData();
        formData.set('bio', bio);
        formData.set('birthday', birthday);
        formData.set('location', location);
        formData.set('phone', phone);
        formData.set('gender', gender);

        // If avatar is selected, add it to the form data
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
        const { name, value, files } = e.target;
    
        // If it's a file input (avatar), set the avatar state
        if (name === 'avatar') {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(file);
                setAvatarPreview(reader.result);
            };
            if (file) {
                reader.readAsDataURL(file);
            }
        } else {
            // If it's not a file input, update the corresponding state
            if(name === 'gender') {
                setGender(value);
            } else {
                // For other inputs, update state directly
                switch(name) {
                    case 'bio':
                        setBio(value);
                        break;
                    case 'birthday':
                        setBirthday(value);
                        break;
                    case 'location':
                        setLocation(value);
                        break;
                    case 'phone':
                        setPhone(value);
                        break;
                    default:
                        break;
                }
            }
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
                                            <div className="form-group mb-3">
                                                <label htmlFor="bio_field" style={{ fontWeight: 'bold' }}>Bio</label>
                                                <textarea
                                                    id="bio_field"
                                                    name="bio" // Update name attribute
                                                    className="form-control form-control-sm"
                                                    rows="5"
                                                    value={bio || ''}
                                                    onChange={onChange}
                                                ></textarea>
                                            </div>

                                            <div className="form-group mb-3">
                                                <label htmlFor="birthday_field" style={{ fontWeight: 'bold' }}>Birthday</label>
                                                <input
                                                    type="date"
                                                    id="birthday_field"
                                                    name="birthday" // Update name attribute
                                                    className="form-control form-control-sm"
                                                    value={birthday || ''}
                                                    onChange={onChange}
                                                />
                                            </div>

                                            <div className="form-group mb-3">
                                                <label htmlFor="gender_field" style={{ fontWeight: 'bold' }}>Gender</label>
                                                <br />
                                                <select
                                                    id="gender_field"
                                                    name="gender" // Update name attribute
                                                    className="custom-select form-control-sm"
                                                    value={gender || ''}
                                                    onChange={onChange}
                                                >
                                                    <option value="">Select Gender</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>

                                            <div className="form-group mb-3">
                                                <label htmlFor="location_field" style={{ fontWeight: 'bold' }}>Location (within Taguig City)</label>
                                                <br />
                                                <select
                                                    id="location_field"
                                                    name="location" // Update name attribute
                                                    className="custom-select form-control-sm"
                                                    value={location || ''}
                                                    onChange={onChange}
                                                >
                                                    <option value="">Select Location</option>
                                                    <option value="USA">USA</option>
                                                    <option value="Canada">Canada</option>
                                                    <option value="UK">UK</option>
                                                    <option value="Germany">Germany</option>
                                                    <option value="France">France</option>
                                                </select>
                                            </div>



                                            <hr className="border-light m-0" />

                                            <div className="card-body pb-2">
                                                <h6 className="mb-4">Contacts</h6>
                                                <div className="form-group mb-3">
                                                    <label htmlFor="phone_field" style={{ fontWeight: 'bold' }}>Phone</label>
                                                    <input
                                                        type="text"
                                                        id="phone_field"
                                                        name="phone" // Update name attribute
                                                        className="form-control form-control-sm"
                                                        value={phone || ''}
                                                        onChange={onChange}
                                                    />
                                                </div>
                                                <div className="form-group mb-0">
                                                    <label htmlFor="website_field" style={{ fontWeight: 'bold' }}>Website</label>
                                                    <input
                                                        type="text"
                                                        id="website_field"
                                                        className="form-control form-control-sm"
                                                        value={user.website || ''}
                                                        onChange={(e) => setUser({ ...user, website: e.target.value })}
                                                    />
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
                                        </div>
                                    </div>
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
