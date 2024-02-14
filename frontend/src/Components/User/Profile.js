import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MetaData from '../Layouts/Metadata';
import { getUser } from '../../utils/helpers';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getToken } from '../../utils/helpers';
// import 'bootstrap/dist/css/bootstrap.min.css';

const Profile = () => {
    // const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({});

    const getProfile = async () => {
        const config = {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        };
        try {
            const { data } = await axios.get(`http://localhost:4001/api/me`, config);
            setUser(data.user);
            // setLoading(false);
        } catch (error) {
            console.log(error);
            toast.error("Invalid user or password", {
                position: 'top-right'
            });
            // setLoading(false);
        }
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

    useEffect(() => {
        getProfile();
    }, []);

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
                        <div className="tab-content">
                            <div className="tab-pane fade active show" id="account-general">
                                <div className="card-body media align-items-center">
                                    <figure className="avatar avatar-profile" style={{ width: '100px', height: '100px' }} >
                                        {user.avatar && user.avatar.url ? (
                                            <img className="rounded img-fluid" src={user.avatar.url} alt={user.name} />
                                        ) : null}
                                    </figure>
                                    <div className="media-body ml-4">
                                        <label className="btn-sm">
                                            &#8203;
                                            <input type="file" className="account-settings-fileinput" style={{ paddingTop: '10px' }} />
                                        </label> &nbsp;
                                        <button type="button" className="btn-sm btn-default">Reset</button>
                                        <div className="text-light small mt-1">Allowed JPG, GIF or PNG. Max size of 800K</div>
                                    </div>
                                </div>
                                <hr className="border-light m-0" />
                                <div className="card-body">
                                    {/* <div className="form-group">
                                        <label className="form-label">Username</label>
                                        <input type="text" className="form-control form-control-sm mb-1" value={user.name} />
                                    </div> */}
                                    <div className="form-group">
                                        <label className="form-label">Name</label>
                                        <input type="text" className="form-control form-control-sm" value={user.name} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">E-mail</label>
                                        <input type="text" className="form-control form-control-sm mb-1" value={user.email} />
                                        <div className="alert alert-warning mt-3">
                                            Your email is not confirmed. Please check your inbox.<br />
                                            <a href="javascript:void(0)">Resend confirmation</a>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Joined On</label>
                                        <input type="text" className="form-control form-control-sm" value={String(user.createdAt).substring(0, 10)} />
                                    </div>
                                </div>
                            </div>
                            {/* Other tab panes go here */}
                        </div>
                    </div>
                </div>
            </div>
            <div className="text-right mt-3">
                <button type="button" className="btn-sm btn-primary">Save changes</button>&nbsp;
                <button type="button" className="btn-sm btn-default">Cancel</button>
            </div>
        </div>
    );
}

export default Profile;