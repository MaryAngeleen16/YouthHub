import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../utils/helpers';
import MUIDataTable from "mui-datatables";
import BackDropLoading from './Layouts/BackDropLoading';

const VentFormByUser = () => {
  const [vents, setVents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMyVents = async () => {
        setLoading(true);
        try {
          const token = getToken();
          const response = await axios.get('http://localhost:4001/api/vent/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setVents(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching vents:', error);
          setLoading(false);
        }
      };

    fetchMyVents();
  }, []);

  const columns = [
    {
      name: "title",
      label: "Title",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "message",
      label: "Message",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "createdAt",
      label: "Created At",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: 'actions',
      label: 'Actions',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) => (
          <button onClick={() => handleAction(value)}>Action</button> // Modify to include action button
        )
      }
    }
  ];

  const options = {
    filterType: 'textField',
    responsive: 'standard',
    selectableRows: 'none',
    resizableColumns: true,
  };

  const handleAction = (ventId) => {
    // Handle action logic here
    console.log('Action clicked for vent:', ventId);
  };

  return (
    <>
      <BackDropLoading open={loading} />
      <div>
        <h2>My Vents</h2>
        <MUIDataTable
          title={""}
          data={vents}
          columns={columns}
          options={options}
        />
      </div>
    </>
  );
};

export default VentFormByUser;
