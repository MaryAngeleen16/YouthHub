import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './adminHeader';
import { getToken } from '../../utils/helpers';
import axios from 'axios';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs';
import Chart from "react-apexcharts";
import '../Layouts/dashcontent.css';
import FemaleTeenagersChart from './FemaleTeenLoc';
import MostPopularCategory from './MostPopularCategory';

const Dashboard = () => {
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [category, setCategory] = useState([]);
    const [events, setEvents] = useState([]);
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
    const [userRegistrationDates, setUserRegistrationDates] = useState({});
    const [genderCounts, setGenderCounts] = useState({});
    const [selectedCategory, setSelectedCategory] = useState('all'); // Initially set to 'all'
    const [teenMomCount, setTeenMomCount] = useState(0);
    const [teenagersCount, setTeenagersCount] = useState(0);
    const [femaleTeenagersLocations, setFemaleTeenagersLocations] = useState({}); // State to store female teenagers' locations
    const [teenMomLocations, setTeenMomLocations] = useState({});

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

            // Extract gender counts
            const genderCountsData = data.users.reduce((acc, user) => {
                acc[user.gender] = (acc[user.gender] || 0) + 1;
                return acc;
            }, {});
            setGenderCounts(genderCountsData);

            // Filter users for teenagers
            const teenageUsers = data.users.filter(user => user.roleStatus === 'Teenager');
            console.log("Teenage users:", teenageUsers);
            setTeenagersCount(teenageUsers.length);

            // Filter users for teen moms
            const teenMomUsers = data.users.filter(user => user.roleStatus === 'Teen Mom');
            console.log("Teen mom users:", teenMomUsers);
            setTeenMomCount(teenMomUsers.length);

            // Extract female teenagers' locations
            const femaleTeenagers = data.users.filter(user => user.gender === 'Female' && user.roleStatus === 'Teenager');
            const locationsCount = femaleTeenagers.reduce((acc, user) => {
                acc[user.location] = (acc[user.location] || 0) + 1;
                return acc;
            }, {});
            setFemaleTeenagersLocations(locationsCount);

            // Extract teen moms' locations
            const teenMomLocationsCount = teenMomUsers.reduce((acc, user) => {
                acc[user.location] = (acc[user.location] || 0) + 1;
                return acc;
            }, {});
            setTeenMomLocations(teenMomLocationsCount);

        } catch (error) {
            console.error(error);
            // Handle the error as needed
        }

    };

    const getPosts = async () => {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            };

            const { data } = await axios.get(`http://localhost:4001/api/posts`, config);
            setPosts(data.posts);
        } catch (error) {
            console.error(error);
            // Handle the error as needed
        }
    };

    const getCategories = async () => {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            };

            const { data } = await axios.get(`http://localhost:4001/api/categories`, config);
            setCategory(data.categories);
        } catch (error) {
            console.error(error);
            // Handle the error as needed
        }
    };

    const getEvents = async () => {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            };

            const { data } = await axios.get(`http://localhost:4001/api/events`, config);
            setEvents(data.events);
        } catch (error) {
            console.error(error);
            // Handle the error as needed
        }
    };

    useEffect(() => {
        getUsers();
        getPosts();
        getCategories();
        getEvents();
    }, [selectedCategory]);

    return (
        <div className='grid-container'>
            <Header OpenSidebar={OpenSidebar} />
            <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
            <main className='main-container'>
                <div className='unique-card-container'>
                    <div className='card'>
                        <div className='card-inner'>
                            <h3 style={{ color: 'white' }}>USERS</h3>
                            <BsFillArchiveFill className='card_icon' />
                        </div>
                        <h1 style={{ color: 'white' }}>{users.length}</h1>
                    </div>
                    <div className='card'>
                        <div className='card-inner'>
                            <h3 style={{ color: 'white' }}>POSTS</h3>
                            <BsFillGrid3X3GapFill className='card_icon' />
                        </div>
                        <h1 style={{ color: 'white' }}>{posts.length}</h1>
                    </div>
                    <div className='card'>
                        <div className='card-inner'>
                            <h3 style={{ color: 'white' }}>CATEGORIES</h3>
                            <BsPeopleFill className='card_icon' />
                        </div>
                        <h1 style={{ color: 'white' }}>{category.length}</h1>
                    </div>
                    <div className='card'>
                        <div className='card-inner'>
                            <h3 style={{ color: 'white' }}>EVENTS</h3>
                            <BsFillBellFill className='card_icon' />
                        </div>
                        <h1 style={{ color: 'white' }}>{events.length}</h1>
                    </div>
                </div>
                <div className="charts-container d-flex justify-content-between">
                    <div className="unique-chart-container">
                        <div className="card-user">
                            <div className="card-user-body d-flex flex-column align-items-center">
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
                    <div className="unique-chart-loc">
                        <div className="card-loc">
                            <div className="card-loc-body d-flex flex-column align-items-center">
                                <h5 className="card-title" style={{ color: "#b38269" }}>Female Teenagers in Different Locations</h5>
                                <Chart
                                    options={{
                                        chart: {
                                            id: "female-teenagers-locations-chart"
                                        },
                                        xaxis: {
                                            categories: Object.keys(femaleTeenagersLocations)
                                        }
                                    }}
                                    series={[
                                        {
                                            name: "female-teenagers-locations",
                                            data: Object.values(femaleTeenagersLocations)
                                        }
                                    ]}
                                    type="line"
                                    width="500"
                                />
                            </div>
                        </div>
                    </div>
                    {/* <div className="unique-chart-loc">
                        <div className="card-loc">
                            <div className="card-loc-body d-flex flex-column align-items-center">
                                <h5 className="card-title" style={{ color: "#b38269" }}>Female Teenagers in Different Locations</h5>
                                <FemaleTeenagersChart />
                            </div>
                        </div>
                    </div> */}
                    <div className="unique-chart-loc">
                        <div className="card-loc">
                            <div className="card-loc-body d-flex flex-column align-items-center">
                                <h5 className="card-title" style={{ color: "#b38269" }}>Teen Moms in Different Locations</h5>
                                <Chart
                                    options={{
                                        chart: {
                                            id: "teen-moms-locations-chart"
                                        },
                                        xaxis: {
                                            categories: Object.keys(teenMomLocations)
                                        }
                                    }}
                                    series={[
                                        {
                                            name: "teen-moms-locations",
                                            data: Object.values(teenMomLocations)
                                        }
                                    ]}
                                    type="line"
                                    width="450"
                                />
                            </div>
                        </div>
                    </div>

                </div>

                <div className="charts-container d-flex justify-content-between">
                    {/* Other charts */}
                    <div className="card">
                        <div className="card-inner">
                            <h5 style={{ color: "#b38269" }}>User Gender Distribution</h5>
                        </div>
                        <div className="card-body">
                            <Chart
                                options={{
                                    labels: Object.keys(genderCounts),
                                    legend: {
                                        show: true
                                    }
                                }}
                                series={Object.values(genderCounts)}
                                type="donut"
                                width="760"
                            />
                        </div>
                    </div>
                    <div className="charts-container d-flex justify-content-between">
                        {/* Your existing JSX code */}
                        {/* Pie chart for teen moms vs teenagers */}
                        <div className="card">
                            <div className="card-inner">
                                <h5 style={{ color: "#b38269" }}>Teen Moms vs Teenagers</h5>
                            </div>
                            <div className="card-body">
                                <Chart
                                    options={{
                                        labels: ['Teen Moms', 'Teenagers'],
                                        legend: {
                                            show: true
                                        }
                                    }}
                                    series={[teenMomCount, teenagersCount]}
                                    type="donut"
                                    width="760"
                                />
                            </div>


                        </div>
                        {/* Your existing JSX code */}



                    </div>

                </div>
                <div className="most-popular-category-container">
                    <MostPopularCategory />

                </div>
            </main>

        </div>
    );
};

export default Dashboard;
