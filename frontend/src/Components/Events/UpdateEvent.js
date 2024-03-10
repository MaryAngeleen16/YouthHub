import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getToken } from '../../utils/helpers';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../Components/Admin/Sidebar';
import '../../Components/Admin/crud.css';

const UpdateEvent = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();

  const [event, setEvent] = useState({
    title: '',
    description: '',
    schedule: '',
    venue_id: '',
    type: '',
    payment_status: '0',
    amount: '',
    audience_capacity: '',
    banner: null,
    additionalImages: [],
  });

  const [venues, setVenues] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:4001/api/events/${eventId}`, configs)
      .then((response) => {
        const eventData = response.data.event;
        setEvent(eventData);
      })
      .catch((error) => {
        console.error('Failed to fetch event:', error);
      });

    axios
      .get('http://localhost:4001/api/venues', configs)
      .then((response) => {
        setVenues(response.data.venues);
      })
      .catch((error) => {
        console.error('Failed to fetch venues:', error);
      });
  }, [eventId]);

  const configs = {
    headers: {
      "Content-Type": "multipart/form-data",
      'Authorization': `Bearer ${getToken()}`
    }
  };

  const onChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'checkbox') {
      setEvent({ ...event, [name]: checked ? '1' : '0' });
    } else if (name === 'amount') {
      setEvent({ ...event, [name]: value });
    } else if (type === 'file') {
      setEvent({ ...event, [name]: files[0] });
    } else {
      setEvent({ ...event, [name]: value });
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();

    if (!event.title || !event.description || !event.schedule || !event.venue_id) {
      toast.error('Please fill out all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('title', event.title);
    formData.append('description', event.description);
    formData.append('schedule', event.schedule);
    formData.append('venue_id', event.venue_id);
    formData.append('type', event.type);
    formData.append('payment_status', event.payment_status);
    formData.append('amount', event.amount);
    formData.append('audience_capacity', event.audience_capacity);
    formData.append('banner', event.banner);
    if (event.additionalImages.length > 0) {
      event.additionalImages.forEach((image) => formData.append('additionalImages', image));
    }

    axios
      .put(`http://localhost:4001/api/events/${eventId}`, formData, configs)
      .then((res) => {
        toast.success('Event updated successfully');
        navigate(`/events/${eventId}`);
      })
      .catch((err) => {
        toast.error('Failed to update event');
      });
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
        <div className="col-md-9 text-crud" style={{ paddingBottom: '50px', marginTop: '50px' }}>
          <h2 className="title-crud">Update Event</h2>
          <form id="manage-event" encType="multipart/form-data" onSubmit={submitForm}>
            <div className="form-group row">
              <div className="col-md-5">
                <label htmlFor="title" className="control-label">
                  Event
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={event.title}
                  onChange={onChange}
                  required
                />
              </div>
            </div>
            <div className="form-group row">
              <div className="col-md-5">
                <label htmlFor="schedule" className="control-label">
                  Schedule
                </label>
                <input
                  type="date"
                  className="form-control datetimepicker"
                  name="schedule"
                  value={event.schedule}
                  onChange={onChange}
                  required
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="venue" className="form-label">
                Venue
              </label>
              <select
                className="form-control"
                id="venue"
                name="venue_id"
                required
                value={event.venue_id}
                onChange={onChange}
              >
                <option value="">Select Venue</option>
                {venues.map((venue) => (
                  <option key={venue._id} value={venue._id}>
                    {venue.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group row">
              <div className="col-md-10">
                <label htmlFor="description" className="control-label">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  className="form-control jqte"
                  cols="30"
                  rows="5"
                  value={event.description}
                  onChange={onChange}
                  required
                ></textarea>
              </div>
            </div>
            <div className="form-group row">
              <div className="col-md-5">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value="1"
                    id="payment_status"
                    name="payment_status"
                    checked={event.payment_status === '1'}
                    onChange={onChange}
                  />
                  <label className="form-check-label" htmlFor="payment_status">
                    Free For All
                  </label>
                </div>
                {event.payment_status === '0' && (
                  <div>
                    <label htmlFor="amount" className="control-label">
                      Registration Fee
                    </label>
                    <input
                      type="number"
                      step="any"
                      className="form-control text-right"
                      name="amount"
                      id="amount"
                      value={event.amount}
                      onChange={onChange}
                      required={!event.payment_status}
                      autoComplete="off"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="form-group row">
              <div className="col-md-5">
                <label htmlFor="audience_capacity" className="control-label">
                  Audience Capacity
                </label>
                <input
                  type="number"
                  step="any"
                  className="form-control text-right"
                  name="audience_capacity"
                  id="audience_capacity"
                  value={event.audience_capacity}
                  onChange={onChange}
                  required
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="row form-group">
              <div className="col-md-5">
                <label htmlFor="banner" className="control-label">
                  Banner Image
                </label>
                <input
                  type="file"
                  className="form-control"
                  name="banner"
                  onChange={onChange}
                  accept="image/*"
                />
              </div>
              <div className="col-md-5">
                {event.banner && (
                  <img src={URL.createObjectURL(event.banner)} alt="Banner Preview" style={{ maxWidth: '100%' }} />
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <button type="submit" className="btn btn-sm btn-block btn-primary col-sm-2">
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UpdateEvent;
