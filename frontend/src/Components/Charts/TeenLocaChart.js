import React, { useState, useEffect } from 'react';
import { getToken } from '../../utils/helpers';
import Chart from 'react-apexcharts';
import axios from 'axios';

const TeenLocaChart = () => {
    const [users, setUsers] = useState([]);
    const [femaleTeenagersLocations, setFemaleTeenagersLocations] = useState({});
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

            // Extract female teenagers' locations
            const femaleTeenagers = data.users.filter(user => user.gender === 'Female' && user.roleStatus === 'Teenager');
            const locationsCount = femaleTeenagers.reduce((acc, user) => {
                acc[user.location] = (acc[user.location] || 0) + 1;
                return acc;
            }, {});
            setFemaleTeenagersLocations(locationsCount);

        } catch (error) {
            console.error(error);
            // Handle the error as needed
        }

    };

    useEffect(() => {
        const fetchFemaleTeenagersLocations = async () => {
            try {
                const { data } = await axios.get('http://localhost:4001/api/admin/users');
                const femaleTeenagers = data.users.filter(user => user.gender === 'Female' && user.roleStatus === 'Teenager');
                const locationsCount = femaleTeenagers.reduce((acc, user) => {
                    acc[user.location] = (acc[user.location] || 0) + 1;
                    return acc;
                }, {});
                setFemaleTeenagersLocations(locationsCount);
            } catch (error) {
                console.error(error);
            }
        };

        fetchFemaleTeenagersLocations();
    }, []);


    useEffect(() => {
        getUsers();
    }, [selectedCategory]);


    return (
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
                       },
                       colors:['#F38783'] 
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
    );
};

export default TeenLocaChart;
