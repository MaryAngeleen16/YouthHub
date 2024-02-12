import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import axios from 'axios';
import { getToken } from '../../utils/helpers'; 

const Dashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userRegistrationDates, setUserRegistrationDates] = useState({});

    useEffect(() => {
        const getUsers = async () => {
            try {
                const config = {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${getToken()}`
                    }
                };

                const { data } = await axios.get(`http://localhost:4001/api/admin/users`, config);
                setUsers(data.users);
                setLoading(false);

                // Extract user registration dates
                const registrationDates = data.users.map(user => user.createdAt.split('T')[0]);
                const registrationDatesCount = registrationDates.reduce((acc, date) => {
                    acc[date] = (acc[date] || 0) + 1;
                    return acc;
                }, {});
                setUserRegistrationDates(registrationDatesCount);

                console.log(data.users);
            } catch (error) {
                console.error(error);
                // Handle the error as needed
            }
        };

        getUsers();
    }, []);

    return (
        <div className="container-dashboard">
            <div className="d-flex" id="wrapper">
                <Sidebar />
                <div id="page-content-wrapper">
                    <div className="container-dashboard px-4">
                        <div className="col-xl-4 col-sm-6 mb-3">
                            <div className="card text-white bg-info o-hidden h-100 dashboard-product">
                                <div className="card-body">
                                    <div className="text-center card-font-size">Users<br /> <b>{users.length}</b></div>
                                </div>

                                <Link className="card-footer text-white clearfix small z-1" to="/admin/users">
                                    <span className="float-left">View Details</span>
                                    <span className="float-right">
                                        <i className="fa fa-angle-right"></i>
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
