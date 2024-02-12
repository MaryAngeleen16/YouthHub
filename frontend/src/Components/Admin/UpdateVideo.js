import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { errMsg, successMsg } from '../../utils/helpers';
import { getToken } from '../../utils/helpers';
import axios from 'axios';

const UpdateVideo = () => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [video, setVideo] = useState(true);
    const [videos, setVideos] = useState([]);
    const [oldVideos, setOldVideos] = useState([]);
    const [videosPreview, setVideosPreview] = useState([]);
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
        setVideosPreview([]);
        setVideos([])
        setOldVideos([])
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setVideosPreview(oldArray => [...oldArray, reader.result])
                    setVideos(oldArray => [...oldArray, reader.result])
                }
            }
            reader.readAsDataURL(file)
        })
    }

    const getVideoDetails = async (id) => {
        try {
            const { data } = await axios.get(`http://localhost:4001/api/videos/${id}`, config);
            setVideo(data.video);
            setName(data.video.name);
            setDescription(data.video.description);
            setCategory(data.video.category);
            setOldVideos(data.video.videos);
            setLoading(false);
        } catch (error) {
            setError(error.response.data.message || 'Error fetching video details');
        }
    };

    const updateVideo = async (id, videoData) => {
        try {
            const { data } = await axios.put(`http://localhost:4001/api/admin/update/video/${id}`, videoData, config);
            setIsUpdated(data.success);
            setLoading(false);
        } catch (error) {
            setError(error.response.data.message || 'Error updating video');
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

        if (video && video._id !== id) {
            getVideoDetails(id);
        } else {
            setName(name);
            setDescription(description);
            setCategories(categories);
            setCategory(category);
            setOldVideos(videos);
        }

        if (error) {
            errMsg(error);
            setError('');
        }

        if (isUpdated) {
            successMsg('Video updated successfully');
            navigate('/video/list');
        }
    }, [error, isUpdated, id]);

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('name', name);
        formData.set('description', description);
        formData.set('category', category);

        if (e.target.videos.value) {
            videos.forEach(video => {
                formData.append('videos', video)
            })
        }
        updateVideo(video._id, formData);
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-3">
                </div>
                <div className="col-md-9 text-crud" style={{ paddingBottom: '50px' }}>
                    <h2 className='title-crud'>Update Video</h2>
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
                            <label htmlFor="video_upload" className='w-100' style={{ textAlign: "left" }}>Video</label>
                            <div className='custom-file'>
                                <input
                                    type='file'
                                    name='videos'
                                    className='custom-file-input form-control'
                                    id='customFile'
                                    accept='video/*'
                                    onChange={onChange}
                                    multiple
                                />

                                <label className='custom-file-label' htmlFor='customFile'>
                                    Choose Videos
                                </label>
                            </div>

                            {oldVideos && oldVideos.map(vid => (
                                <video key={vid} src={vid.url} controls className="mt-3 mr-2" width="320" height="240">
                                    Your browser does not support the video tag.
                                </video>
                            ))}
                            {videosPreview.map(vid => (
                                <video key={vid} src={vid} controls className="mt-3 mr-2" width="320" height="240">
                                    Your browser does not support the video tag.
                                </video>
                            ))}
                        </div>
                        <button type="submit" className="btn btn-crud" style={{ marginTop: '20px' }}>Update</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default UpdateVideo;