import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MDBDataTable } from 'mdbreact';
import 'mdbreact/dist/css/mdb.css';
import Sidebar from '../../Components/Admin/Sidebar';
import BackDropLoading from '../Layouts/BackDropLoading';
import './venues.css';

const VenueList = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    axios
      .get('http://localhost:4001/api/venues')
      .then((res) => {
        setVenues(res.data.venues);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleDelete = (venueId) => {
    axios
      .delete(`http://localhost:4001/api/venues/${venueId}`)
      .then(() => {
        setVenues(venues.filter((venue) => venue._id !== venueId));
        toast.success('Venue deleted successfully');
      })
      .catch((err) => {
        console.error(err);
        toast.error('Failed to delete venue');
      });
  };

  const setDataTable = () => {
    const data = {
      columns: [
        {
          label: 'ID',
          field: '_id',
          sort: 'asc',
        },
        {
          label: 'Name',
          field: 'name',
          sort: 'asc',
        },
        {
          label: 'Location',
          field: 'location',
          sort: 'asc',
        },
        {
          label: 'Description',
          field: 'description',
          sort: 'asc',
        },
        {
          label: 'Actions',
          field: 'actions',
          sort: 'asc',
        },
      ],
      rows: [],
    };

    venues.forEach((venue) => {
      data.rows.push({
        _id: venue._id,
        name: venue.name,
        location: venue.location,
        description: venue.description,
        actions: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link to={`/venue/update/${venue._id}`} className="btn btn-primary mr-2">
              Edit
            </Link>
            <button
              className="btn btn-danger"
              onClick={() => handleDelete(venue._id)}
            >
              Delete
            </button>
          </div>
        ),
      });
    });

    return data;
  };

  //BOOTSTRAP CSS
  useEffect(() => {
    const bootstrapStyles = `
      @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css');
    `;

    const styleElement = document.createElement('style');
    styleElement.innerHTML = bootstrapStyles;

    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  
  return (
    <div className="container mt-6">
      <div className="row">
        <div className="col-md-3">
        <BackDropLoading open={loading} />
          <Sidebar />
        </div>
        <div className="col-md-9">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>List of Venues</h2>
            <Link to="/venue/create" className="btn btn-primary">
              Create Venue
            </Link>
          </div>
          <div className="text-center">
            <MDBDataTable
              data={setDataTable()}
              bordered
              striped
              hover
            />
          </div>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default VenueList;
