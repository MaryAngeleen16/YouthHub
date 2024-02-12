import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../../utils/helpers';
import { toast } from 'react-toastify';
import './crud.css';
import Sidebar from './Sidebar';

const CreatePost = () => {
  const navigate = useNavigate();
  const [post, setPost] = useState({
    name: '',
    description: '',
    category: '',
    images: null,
  });
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState({});

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === 'file') {
      const files = Array.from(e.target.files);
      const imagePreviews = {};

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.readyState === 2) {
            imagePreviews[file.name] = reader.result;
            setImagesPreview(imagePreviews);
          }
        };

        reader.readAsDataURL(file);
      });

      setImages(files);
    } else {
      setPost({
        ...post,
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

  const submitForm = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', post.name);
    formData.append('description', post.description);
    formData.append('category', post.category);

    images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          'Authorization': `Bearer ${getToken()}`
        }
      };

      await axios.post('http://localhost:4001/api/admin/post/new', formData, config);

      alert('Post created successfully');
      setPost({
        name: '',
        description: '',
        category: '',
        images: null,
      });
      setImages([]);
      setImagesPreview([]);
      navigate('/post/list');
    } catch (error) {
      alert('Failed to create post');
      console.error(error);
    }
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
    <div className="container mt-5">
      <div className="row">
      <div className="col-md-3">
          <Sidebar /> 
        </div>
        <div className="col-md-9" style={{paddingBottom:'50px'}}>
          <h2 className='title-crud'>Create Post</h2>
          <form onSubmit={submitForm}>
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
                value={post.name}
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
                value={post.description}
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
                value={post.category}
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
              <label htmlFor="image" className="form-label">
                Image
              </label>
              <input
                type="file"
                className="form-control"
                id="image"
                accept="image/*"
                name="images"
                required
                onChange={handleChange}
                multiple
              />
              {Object.keys(imagesPreview).map((key) => (
                <img src={imagesPreview[key]} key={key} alt="Images Preview" className="mt-3 mr-2" width="55" height="52" />
              ))}
            </div>
            <button type="submit" className="btn btn-crud btn-design">
              Create Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
