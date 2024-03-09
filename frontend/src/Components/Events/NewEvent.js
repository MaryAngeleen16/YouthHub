import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../Components/Admin/Sidebar';
import '../../Components/Admin/crud.css';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [event, setEvent] = useState({
    title: '',
    description: '',
    schedule: '',
    venue_id: '',
    type: '',
    payment_status: '',
    amount: '',
    audience_capacity: '',
    banner: null,
    additionalImages: [],
  });

  const onChange = (e) => {
    if (e.target.type === 'file') {
      setEvent({ ...event, [e.target.name]: e.target.files[0] });
    } else {
      setEvent({ ...event, [e.target.name]: e.target.value });
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

    // Validation
    if (!title || !description || !schedule || !venue_id) {
      toast.error('Please fill out all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('schedule', schedule);
    formData.append('venue_id', venue_id);
    formData.append('type', type);
    formData.append('payment_status', payment_status);
    formData.append('amount', amount);
    formData.append('audience_capacity', audience_capacity);
    formData.append('banner', banner);
    additionalImages.forEach((image) => formData.append('additionalImages', image));

    try {
      const response = await axios.post('http://localhost:4001/api/events/new', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Event created successfully');
      navigate('/events/list');
    } catch (error) {
      toast.error('Failed to create event');
    }
  };

  useEffect(() => {
    // Initialize datetimepicker and select2 plugins or any other initialization code
    // Remember to cleanup on component unmount if needed
    // Example: $('input.datetimepicker').datetimepicker();
    // Example: $('select.select2').select2();
    return () => {
      // Cleanup code if needed
    };
  }, []);

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
          <h2 className="title-crud">Create Event</h2>
          <form id="manage-event" encType="multipart/form-data" onSubmit={submitForm}>
            {/* <input type="hidden" name="id" value={id} /> */}
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
                  type="text"
                  className="form-control datetimepicker"
                  name="schedule"
                  value={schedule}
                  onChange={onChange}
                  required
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="form-group row">
              <div className="col-md-5">
                <label htmlFor="venue_id" className="control-label">
                  Venue
                </label>
                <select
                  name="venue_id"
                  id="venue_id"
                  className="custom-select select2"
                  value={venue_id}
                  onChange={onChange}
                  required
                >
                  <option value=""></option>
                  {/* Add options dynamically based on the data */}
                </select>
              </div>
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
                  onChange={onChange}
                  required
                ></textarea>
              </div>
            </div>
            <div className="form-group">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="2"
                  id="type"
                  name="type"
                  checked={type === '2'}
                  onChange={onChange}
                />
                <label className="form-check-label" htmlFor="type">
                  Private Event (<i>Do not show in website</i>)
                </label>
              </div>
            </div>
            <div className="form-group">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="1"
                  id="payment_status"
                  name="payment_status"
                  checked={payment_status === '1'}
                  onChange={onChange}
                />
                <label className="form-check-label" htmlFor="payment_status">
                  Free For All
                </label>
              </div>
            </div>
            <div className="form-group row" style={{ display: payment_status === '1' ? 'none' : 'block' }}>
              <div className="col-md-5">
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
                  onChange={onChange}
                  required
                  autoComplete="off"
                />
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
                {banner && (
                  <img src={URL.createObjectURL(banner)} alt="Banner Preview" style={{ maxWidth: '100%' }} />
                )}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="additionalImages" className="control-label">
                Additional Images
              </label>
              <input
                type="file"
                id="additionalImages"
                multiple
                onChange={onChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <label htmlFor="additionalImages" style={{ cursor: 'pointer' }}>
                <strong>Choose File</strong>
              </label>
              <div id="drop">
                {/* Additional image previews can be shown here */}
              </div>
              <div id="list"></div>
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

export default CreateEvent;
