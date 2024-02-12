import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
 import Sidebar from './Sidebar'; 
// import './CRUD.css';
import SBar from './SBar';

const CreateCategory = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState({
    name: '',
    description: '',
  });

  const onChange = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  const { name, description } = category;

  const submitForm = (e) => {
    e.preventDefault();
  
  //validation
    if (!name || !description) {
      toast.error('Please fill out all fields');
      return;
    }
  
    axios
      .post('http://localhost:4001/api/categories/new', { name, description })
      .then((res) => {
        toast.success('Successfully Created');
        navigate('/category/list');
        setCategory({
          name: '',
          description: '',
        });
      })
      .catch((err) => {
        toast.error('Failed to create'); // Use toast for error message
      });
  };

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
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-3">
          <Sidebar /> 
        </div>
        <div className="col-md-9 text-crud" style={{paddingBottom:'50px'}}>
          <h2 className='title-crud'>Create Category</h2>
          <form>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                required
                onChange={onChange}
                value={name}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                onChange={onChange}
                value={description}
              ></textarea>
            </div>
            <button className="btn btn-crud ml-auto" onClick={submitForm}>
              Submit
            </button>
          </form>
        </div>
      </div>
      <ToastContainer /> 
    </div>
  );
};

export default CreateCategory;