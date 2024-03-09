import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MDBDataTable } from 'mdbreact';
import 'mdbreact/dist/css/mdb.css';
import Sidebar from '../../Components/Admin/Sidebar';

const AllEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:4001/api/events')
      .then((res) => {
        setEvents(res.data.events);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleDelete = (eventId) => {
    axios
      .delete(`http://localhost:4001/api/events/${eventId}`)
      .then(() => {
        setEvents(events.filter((event) => event._id !== eventId));
        toast.success('Event deleted successfully');
      })
      .catch((err) => {
        console.error(err);
        toast.error('Failed to delete event');
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
          label: 'Schedule',
          field: 'schedule',
          sort: 'asc',
        },
        {
          label: 'Venue',
          field: 'venue',
          sort: 'asc',
        },
        {
          label: 'Event Info',
          field: 'event_info',
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

    events.forEach((event) => {
      data.rows.push({
        _id: event._id,
        schedule: event.schedule,
        venue: event.venue,
        event_info: event.event_info,
        description: event.description,
        actions: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link to={`/event/update/${event._id}`} className="btn btn-primary mr-2">
              Edit
            </Link>
            <button
              className="btn btn-danger"
              onClick={() => handleDelete(event._id)}
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
          <Sidebar />
        </div>
        <div className="col-md-9">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>List of Events</h2>
            <Link to="/event/create" className="btn btn-primary">
              Create Event
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

export default AllEvents;
