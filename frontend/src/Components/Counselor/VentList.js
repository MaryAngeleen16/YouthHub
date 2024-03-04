import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../../utils/helpers';
import MUIDataTable from "mui-datatables";
import { Button } from '@mui/material';
import './VentList.css';
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

  const handleReply = (ventId) => {
    // Handle reply logic here
    console.log('Replying to vent:', ventId);
  };

  const handleDelete = (ventId) => {
    // Handle delete logic here
    console.log('Deleting vent:', ventId);
  };

  const columns = [
    {
        name: "Vent ID",
        options: {
          filter: true,
          sort: true,
        }
      },
    {
      name: "Title",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "MESSAGE",
      options: {
        filter: true,
        sort: false,
      }
    },
    {
      name: "User",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
        name: "Sent At",
        options: {
          filter: true,
          sort: true,
        }
      },
    {
      name: "Actions",
      options: {
        filter: false,
        sort: false,
      }
    },
  ];

  const data = vents.map(vent => [
    vent._id,
    vent.title,
    vent.message,
    usersMap[vent.user],
    vent.createdAt,
    <div >
      <Button variant="contained" className='vent-button-space'
      color="primary" onClick={() => handleReply(vent._id)}>Reply</Button>
      <Button variant="contained" 
      color="secondary" onClick={() => handleDelete(vent._id)}>Delete</Button>
    </div>
  ]);

  const options = {
    filterType: 'textField',
    responsive: 'standard',
    selectableRows: 'none',
    resizableColumns: true,
  };

  return (
    <div>
      {errorMessage && (
        <div className="popup">
          <p>{errorMessage}</p>
        </div>
      )}
      <h2 className='title-vent'>All Vents</h2>
      <MUIDataTable
        title={""}
        data={data}
        columns={columns}
        options={options}
      />
    </div>
  );
};

export default VentList;
