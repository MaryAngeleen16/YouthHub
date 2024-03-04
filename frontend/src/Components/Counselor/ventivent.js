import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../../utils/helpers';

const VentList = () => {
  const [vents, setVents] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [usersMap, setUsersMap] = useState({});

  useEffect(() => {
    const fetchAllVents = async () => {
      try {
        const token = getToken();
        const response = await axios.get('http://localhost:4001/api/vent/list', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setVents(response.data);
        // Extract user IDs from vents
        const userIds = response.data.map(vent => vent.user);
        // Fetch user information for each user ID
        const usersResponse = await axios.get('http://localhost:4001/api/public/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            userIds: userIds.join(','), // Pass user IDs as a comma-separated string
          }
        });
        // Create a map of user IDs to usernames
        const usersMap = {};
        usersResponse.data.users.forEach(user => {
          usersMap[user._id] = user.name; // Assuming the username field in your user model is called 'username'
        });
        setUsersMap(usersMap);
      } catch (err) {
        console.error(err);
        if (err.response && err.response.status === 403) {
          setErrorMessage('You are not allowed to access this area.');
        } else {
          // Handle other errors
        }
      }
    };

    fetchAllVents();
  }, []);

  return (
    <div>
      {errorMessage && (
        <div className="popup">
          <p>{errorMessage}</p>
        </div>
      )}
      <h2>All Vents</h2>
      <ul>
        {vents.map((vent) => (
          <li key={vent._id}>
            <strong>{vent.title}</strong>: {vent.message} - Posted by: {usersMap[vent.user]}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VentList;
