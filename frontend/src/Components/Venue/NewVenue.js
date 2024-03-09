import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../Components/Admin/Sidebar';
import '../../Components/Admin/crud.css';

const NewVenue = () => {
    const navigate = useNavigate();
    const [venue, setVenue] = useState({
        name: '',
        location: '',
        description: '',
    });

    const onChange = (e) => {
        setVenue({ ...venue, [e.target.name]: e.target.value });
    };

    const { name, location, description } = venue;

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

    const submitForm = (e) => {
        e.preventDefault();

        // Validation
        if (!name || !location || !description) {
            toast.error('Please fill out all required fields');
            return;
        }
        
        axios
      .post('http://localhost:4001/api/venues/new', { name, location, description })
      .then((res) => {
        toast.success('Successfully Created');
        navigate('/venue/list');
        setVenue({
          name: '',
          location: '',
          description: '',
        });
      })
      .catch((err) => {
        toast.error('Failed to create'); // Use toast for error message
      });
  };

    //     try {
    //         const res = await axios.post('http://localhost:4001/api/venues/new', { name, location, description });
    //         if (res.status === 200) {
    //             toast.success('Successfully Created');
    //             navigate('/venue/list');
    //             setVenue({
    //                 name: '',
    //                 location: '',
    //                 description: '',
    //             });
    //         } else {
    //             toast.error('Failed to Create');
    //         }
    //     } catch (err) {
    //         toast.error('Failed to Create');
    //         console.error('Error creating venue:', err);
    //     }
    // };


    return (
        <div className="container mt-6">
            <div className="row">
                <div className="col-md-3">
                    <Sidebar />
                </div>
                <div className="col-md-9 text-crud" style={{ paddingBottom: '50px', marginTop: '50px' }}>
                    <h2 className="title-crud">Create Venue</h2>
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
                                    value={name}
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
                                    value={location}
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
                                    value={description}
                                    onChange={onChange}
                                    required
                                ></textarea>
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

export default NewVenue;
