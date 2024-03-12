import React, { useState, useEffect } from 'react';
import { getToken } from '../../utils/helpers';
import Chart from 'react-apexcharts';
import axios from 'axios';

const TeenMomLocationsChart = ({ locations }) => {
    const [users, setUsers] = useState([]);
    const [teenMomCount, setTeenMomCount] = useState(0);
    const [teenagersCount, setTeenagersCount] = useState(0);
    const [genderCounts, setGenderCounts] = useState({});
    const [teenMomLocations, setTeenMomLocations] = useState({});
    const [selectedCategory, setSelectedCategory] = useState('all'); // Initially set to 'all'

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

            // Filter users for teenagers
            const teenageUsers = data.users.filter(user => user.roleStatus === 'Teenager');
            console.log("Teenage users:", teenageUsers);
            setTeenagersCount(teenageUsers.length);

            // Filter users for teen moms
            const teenMomUsers = data.users.filter(user => user.roleStatus === 'Teen Mom');
            console.log("Teen mom users:", teenMomUsers);
            setTeenMomCount(teenMomUsers.length);


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

    useEffect(() => {
        getUsers();
    }, [selectedCategory]);

    return (
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
                        },
                        colors:['#95cbd1'] // Setting global colors
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
    );
};

export default TeenMomLocationsChart;