import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { errMsg, successMsg } from '../../utils/helpers';
import { getToken } from '../../utils/helpers';
import axios from 'axios';

const UpdatePost = () => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState(true);
    const [images, setImages] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isUpdated, setIsUpdated] = useState(false);
    const [error, setError] = useState('');

    let navigate = useNavigate();
    const { id } = useParams();
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${getToken()}`
        }
    }

    const onChange = e => {
        const files = Array.from(e.target.files)
        setImagesPreview([]);
        setImages([])
        setOldImages([])
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview(oldArray => [...oldArray, reader.result])
                    setImages(oldArray => [...oldArray, reader.result])
                }
            }
            reader.readAsDataURL(file)
        })
    }

    const getPostDetails = async (id) => {
        try {
            const { data } = await axios.get(`http://localhost:4001/api/posts/${id}`, config);
            setPost(data.post);
            setName(data.post.name);
            setDescription(data.post.description);
            setCategory(data.post.category);
            setOldImages(data.post.images);
            setLoading(false);
        } catch (error) {
            setError(error.response.data.message || 'Error fetching post details');
        }
    };

    const updatePost = async (id, postData) => {
        try {
            const { data } = await axios.put(`http://localhost:4001/api/admin/update/post/${id}`, postData, config);
            setIsUpdated(data.success);
            setLoading(false);
        } catch (error) {
            setError(error.response.data.message || 'Error updating post');
        }
    }

    useEffect(() => {
        axios
            .get(`http://localhost:4001/api/categories`, config)
            .then((response) => {
                setCategories(response.data.categories);
            })
            .catch((error) => {
                setError('Failed to fetch categories');
            });

        if (post && post._id !== id) {
            getPostDetails(id);
        } else {
            setName(name);
            setDescription(description);
            setCategories(categories);
            setCategory(category);
            setOldImages(images);
        }

        if (error) {
            errMsg(error);
            setError('');
        }

        if (isUpdated) {
            successMsg('Post updated successfully');
            navigate('/post/list');
        }
    }, [error, isUpdated, id]);

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('name', name);
        formData.set('description', description);
        formData.set('category', category);

        if (e.target.images.value) {
            images.forEach(image => {
                formData.append('images', image)
            })
        }
        updatePost(post._id, formData);
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-3">
                </div>
                <div className="col-md-9 text-crud" style={{ paddingBottom: '50px' }}>
                    <h2 className='title-crud'>Update Post</h2>
                    <form onSubmit={submitHandler}>
                        <div className="mb-3">
                            <label htmlFor="name_field">Title</label>
                            <input
                                type="name"
                                id="name_field"
                                className="form-control"
                                name='name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description_field">Description</label>
                            <textarea className="form-control" id="description_field" rows="8" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                        </div>

                        <div className="form-group">
                            <label htmlFor="category_field">Category</label>
                            <select className="form-control" id="category_field" value={category} onChange={(e) => setCategory(e.target.value)}>
                                {categories && categories.map(category => (
                                    <option key={category.name} value={category._id} selected={category.name === category} >{category.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group px-4">
                            <label htmlFor="avatar_upload" className='w-100' style={{ textAlign: "left" }}>Image</label>
                            <div className='custom-file'>
                                <input
                                    type='file'
                                    name='images'
                                    className='custom-file-input form-control'
                                    id='customFile'
                                    accept='image/*'
                                    onChange={onChange}
                                    multiple
                                />

                                <label className='custom-file-label' htmlFor='customFile'>
                                    Choose Images
                                </label>
                            </div>

                            {oldImages && oldImages.map(img => (
                                <img key={img} src={img.url} alt={img.url} className="mt-3 mr-2" width="55" height="52" />
                            ))}
                            {imagesPreview.map(img => (
                                <img src={img} key={img} alt="Images Preview" className="mt-3 mr-2" width="55" height="52" />
                            ))}
                        </div>
                        <button type="submit" className="btn btn-crud" style={{ marginTop: '20px' }}>Update</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default UpdatePost;
