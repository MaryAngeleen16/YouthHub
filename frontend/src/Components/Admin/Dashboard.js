import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './adminHeader';
import { getToken } from '../../utils/helpers';
import axios from 'axios';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs';
import Chart from "react-apexcharts";
import '../Layouts/dashcontent.css';
import UserRegistrationChart from '../Charts/UserRegistrationChart';
import TeenLocaChart from '../Charts/TeenLocaChart';
import MostPopularCategory from '../Charts/MostPopularCategory';
import TeenMomLocationsChart from '../Charts/MomLocaChart';

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
                        <UserRegistrationChart />
                    </div>
                    <div className="unique-chart-loc">
                        <TeenLocaChart />
                    </div>
                    <div className="unique-chart-loc">
                        <TeenMomLocationsChart />
                    </div>
                </div>
                <div className="charts-container d-flex justify-content-between">
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
                                    },
                                colors: ['#F38783', '#95cbd1', '#b2b2b2'] 
                                }}
                                series={Object.values(genderCounts)}
                                type="donut"
                                width="760"
                            />
                        </div>
                    </div>
                    <div className="charts-container d-flex justify-content-between">
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
                                        },
                                        colors: ['#F38783', '#95cbd1', '#b2b2b2'] 
                                    }}
                                    series={[teenMomCount, teenagersCount]}
                                    type="donut"
                                    width="760"
                                />
                            </div>
                        </div>
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
