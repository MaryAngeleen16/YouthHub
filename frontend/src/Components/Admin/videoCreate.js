import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../../utils/helpers';
import { toast } from 'react-toastify';

const VideoCreate = () => {
  const navigate = useNavigate();
  const [videoData, setVideoData] = useState({
    name: '',
    description: '',
    category: '',
    video: null,
  });
  const [categories, setCategories] = useState([]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === 'file') {
      setVideoData({
        ...videoData,
        [name]: e.target.files[0], // Store the file itself, not the URL
      });
    } else {
      setVideoData({
        ...videoData,
        [name]: value,
      });
    }
  };

  useEffect(() => {
    console.log('Fetching categories...');
    axios
      .get('http://localhost:4001/api/categories', configs)
      .then((response) => {
        console.log('Categories data:', response.data);
        setCategories(response.data.categories);
      })
      .catch((error) => {
        console.error('Failed to fetch categories:', error);
      });
  }, []);

  const configs = {
    headers: {
      "Content-Type": "multipart/form-data",
      'Authorization': `Bearer ${getToken()}`
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', videoData.name);
    formData.append('description', videoData.description);
    formData.append('category', videoData.category);
    formData.append('video', videoData.video); // Append the file to FormData

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          'Authorization': `Bearer ${getToken()}`
        }
      };

      await axios.post('http://localhost:4001/api/admin/video/new', formData, config);

      toast.success('Video uploaded successfully');
      setVideoData({
        name: '',
        description: '',
        category: '',
        video: null,
      });
      navigate('/video/list');
    } catch (error) {
      toast.error('Failed to upload video');
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-9 offset-md-1 text-crud" style={{paddingBottom:'50px'}}>
          <h2 className='title-crud'>Upload Video</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Title
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                required
                value={videoData.name}
                onChange={handleChange}
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
                value={videoData.description}
                onChange={handleChange}
              ></textarea>
            </div>
            
            <div className="mb-3">
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <select
                className="form-control"
                id="category"
                name="category"
                required
                value={videoData.category}
                onChange={handleChange}
              >
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="video" className="form-label">
                Video
              </label>
              <input
                type="file"
                className="form-control"
                id="video"
                accept="video/*"
                name="video"
                required
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-crud">
              Upload Video
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VideoCreate;