import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../Components/Admin/Sidebar';
import '../../Components/Admin/crud.css';

const UpdateVenue = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Assuming you have a route parameter for the venue ID
    const [venue, setVenue] = useState({
        name: '',
        location: '',
        description: '',
    });

    useEffect(() => {
        // Fetch venue details using the venue ID from the URL
        axios.get(`http://localhost:4001/api/venues/${id}`)
            .then((res) => {
                const { name, location, description } = res.data;
                // Set the initial state of the form fields with existing data
                setVenue({ name, location, description });
            })
            .catch((err) => {
                console.error('Error fetching venue details:', err);
                toast.error('Failed to fetch venue details');
            });
    }, [id]);
    

    console.log('Initial Venue State:', venue); // Check initial state of venue

    const onChange = (e) => {
        setVenue({ ...venue, [e.target.name]: e.target.value });
    };

    const { name, location, description } = venue;

    const submitForm = (e) => {
        e.preventDefault();

        // Validation
        if (!name || !location || !description) {
            toast.error('Please fill out all required fields');
            return;
        }

        axios.put(`http://localhost:4001/api/venues/${id}`, { name, location, description })
            .then(() => {
                toast.success('Venue updated successfully');
                navigate('/venue/list');
            })
            .catch((err) => {
                toast.error('Failed to update venue');
                console.error('Error updating venue:', err);
            });
    };

    // Moved useEffect outside of the submitForm function
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
                    <h2 className="title-crud">Update Venue</h2>
                    <form onSubmit={submitForm}>
                        <div className="form-group row">
                            <div className="col-md-5">
                                <label htmlFor="name" className="control-label">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={venue.name}
                                    onChange={onChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-md-5">
                                <label htmlFor="location" className="control-label">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="location"
                                    value={venue.location}
                                    onChange={onChange}
                                    required
                                />
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
                                    className="form-control"
                                    cols="30"
                                    rows="5"
                                    value={venue.description}
                                    onChange={onChange}
                                    required
                                ></textarea>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <button type="submit" className="btn btn-sm btn-block btn-primary col-sm-2">
                                    Update
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

export default UpdateVenue;
