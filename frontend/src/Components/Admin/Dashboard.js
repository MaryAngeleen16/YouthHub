import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './adminHeader';
import { getToken } from '../../utils/helpers';
import axios from 'axios';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs';
import Chart from "react-apexcharts";
import '../Layouts/dashcontent.css';
import FemaleTeenagersChart from './FemaleTeenLoc';

const Dashboard = () => {
    const [users, setUsers] = useState([]);
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
    const [userRegistrationDates, setUserRegistrationDates] = useState({});

    const OpenSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle);
    };

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

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <div className='grid-container'>
            <Header OpenSidebar={OpenSidebar} />
            <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
            <main className='main-container'>
                <div className='main-title'>
                    <h3>DASHBOARD</h3>
                </div>

                <div className='unique-card-container'>
                    <div className='card'>
                        <div className='card-inner'>
                            <h3>USERS</h3>
                            <BsFillArchiveFill className='card_icon' />
                        </div>
                        <h1>{users.length}</h1>
                    </div>
                    <div className='card'>
                        <div className='card-inner'>
                            <h3>POSTS</h3>
                            <BsFillGrid3X3GapFill className='card_icon' />
                        </div>
                        <h1>12</h1>
                    </div>
                    <div className='card'>
                        <div className='card-inner'>
                            <h3>CATEGORIES</h3>
                            <BsPeopleFill className='card_icon' />
                        </div>
                        <h1>33</h1>
                    </div>
                    <div className='card'>
                        <div className='card-inner'>
                            <h3>ALERTS</h3>
                            <BsFillBellFill className='card_icon' />
                        </div>
                        <h1>0</h1>
                    </div>
                    <div className="card">
                    <div className="card-body d-flex flex-column align-items-center">
                        <h5 className="card-title" style={{ color: "#b38269" }}>User Registration by Day</h5>
                        <Chart
                            options={{
                                chart: {
                                    id: "user-registration-chart"
                                },
                                xaxis: {
                                    categories: Object.keys(userRegistrationDates)
                                }
                            }}
                            series={[
                                {
                                    name: "users-registered",
                                    data: Object.values(userRegistrationDates)
                                }
                            ]}
                            type="bar"
                            width="500"
                        />
                    </div>
                </div>
                </div>

                
                <div className="card">
                    <div className="card-body d-flex flex-column align-items-center">
                        <h5 className="card-title" style={{ color: "#b38269" }}>Female Teenagers in Different Locations</h5>
                        <FemaleTeenagersChart />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
