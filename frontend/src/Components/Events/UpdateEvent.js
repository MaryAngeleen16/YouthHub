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
  const { id } = useParams();

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
    timeStarts: '',
    timeEnds: ''
  });

  const [venues, setVenues] = useState([]);
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState({});

  useEffect(() => {
    // Fetch event details based on eventId
    axios
      .get(`http://localhost:4001/api/events/${id}`)
      .then((response) => {
        setEvent(response.data.event);
      })
      .catch((error) => {
        console.error('Failed to fetch event:', error);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === 'file') {
      const files = e.target.files;
      if (!files || files.length === 0) {
        return; // No files selected, do nothing
      }

      const imagePreviews = {};

      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.readyState === 2) {
            imagePreviews[file.name] = reader.result;
            setEvent({ ...event, imagePreviews });
          }
        };

        reader.readAsDataURL(file);
      });

      setEvent({ ...event, additionalImages: Array.from(files) });
    } else {
      if (name === 'venues_id') {
        setEvent({ ...event, venues_id: value });
      } else {
        setEvent({ ...event, [name]: value });
      }
    }
  };

  const {
    title,
    description,
    schedule,
    venue_id,
    type,
    payment_status,
    amount,
    audience_capacity,
    banner,
    additionalImages,
  } = event;

  const submitForm = async (e) => {
    e.preventDefault();

    console.log("Event before validation:", event);

    // Validation
    if (!event.title || !event.description || !event.schedule || !event.venue_id) {
      toast.error('Please fill out all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('title', event.title);
    formData.append('description', event.description);
    formData.append('schedule', event.schedule);
    formData.append('timeStarts', event.timeStarts);
    formData.append('timeEnds', event.timeEnds);
    formData.append('venue_id', event.venue_id);
    formData.append('type', event.type);
    formData.append('payment_status', event.payment_status);
    formData.append('amount', event.amount);
    formData.append('audience_capacity', event.audience_capacity);
    formData.append('banner', event.banner);
    // if (event.additionalImages.length > 0) {
    if (event.additionalImages && event.additionalImages.length > 0) {
      event.additionalImages.forEach((image) => formData.append('additionalImages', image));
    }

    axios
      .put(`http://localhost:4001/api/events/${id}`, formData, configs)
      .then((res) => {
        toast.success('Event updated successfully');
        navigate('/event/list');
        setEvent({
          title: '',
          description: '',
          schedule: '',
          venue_id: '',
          type: '',
          payment_status: '',
          amount: '',
          audience_capacity: '',
          banner: '',
          additionalImages: '',
          timeEnds: '',
          timeStarts: '',
        });
      })
      .catch((err) => {
        toast.error('Failed to update event');
      });
  };

  useEffect(() => {
    console.log('Fetching venues...');
    axios
      .get('http://localhost:4001/api/venues', configs)
      .then((response) => {
        console.log('Venues data:', response.data);
        setVenues(response.data.venues);
      })
      .catch((error) => {
        console.error('Failed to fetch venues:', error);
      });
  }, []);

  const configs = {
    headers: {
      "Content-Type": "multipart/form-data",
      'Authorization': `Bearer ${getToken()}`
    }
  };


  // BOOTSTRAP CSS
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
                  value={title}
                  onChange={handleChange}
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
                  value={schedule ? formatDate(new Date(schedule)) : ''}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group row">
              <div className="col-md-5">
                <label htmlFor="startTime">Start Time:</label>
                <input
                  type="time"
                  id="startTime"
                  value={event.timeStarts}
                  onChange={(e) => setEvent({ ...event, timeStarts: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group row">
              <div className="col-md-5">
                <label htmlFor="endTime">End Time:</label>
                <input
                  type="time"
                  id="endTime"
                  value={event.timeEnds}
                  onChange={(e) => setEvent({ ...event, timeEnds: e.target.value })}
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
                value={venue_id}
                onChange={handleChange}
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
                  value={description}
                  onChange={handleChange}
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
                    checked={payment_status === '1'}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="payment_status">
                    Free For All
                  </label>
                </div>
                {payment_status === '0' && (
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
                      value={amount}
                      onChange={handleChange}
                      required={!payment_status}
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
                  value={audience_capacity}
                  onChange={handleChange}
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
                  onChange={handleChange}
                  accept="image/*"
                />
              </div>
              <div className="col-md-5">
                {banner && (
                  <img src={URL.createObjectURL(banner)} alt="Banner Preview" style={{ maxWidth: '100%' }} />
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
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-indexed
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}