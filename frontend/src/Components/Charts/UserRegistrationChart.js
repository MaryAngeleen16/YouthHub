// UserRegistrationChart.js
import React, { useState, useEffect } from 'react';
import Chart from "react-apexcharts";
import axios from 'axios';
import { getToken } from '../../utils/helpers';


const UserRegistrationChart = () => {
    const [userRegistrationDates, setUserRegistrationDates] = useState({});

    useEffect(() => {
        const fetchUserRegistrationDates = async () => {
            try {
                const config = {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${getToken()}`
                    }
                };

                const { data } = await axios.get(`http://localhost:4001/api/admin/users`, config);

                // Extract user registration dates
                const registrationDates = data.users.map(user => user.createdAt.split('T')[0]);
                const registrationDatesCount = registrationDates.reduce((acc, date) => {
                    acc[date] = (acc[date] || 0) + 1;
                    return acc;
                }, {});
                setUserRegistrationDates(registrationDatesCount);
            } catch (error) {
                console.error(error);
                // Handle error
            }
        };

        fetchUserRegistrationDates();
    }, []);

    return (
        <div className="card-user">
            <div className="card-user-body d-flex flex-column align-items-center user-register-chart">
                <h5 className="card-title" style={{ color: "#b38269" }}>User Registration by Day</h5>
                <Chart
                    options={{
                        chart: {
                            id: "user-registration-chart"
                        },
                        xaxis: {
                            categories: Object.keys(userRegistrationDates)
                        },
                        colors:['#95cbd1'] // Setting global colors
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
    );
};

export default UserRegistrationChart;
