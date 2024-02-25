import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './VideoDetails.css';



const generateThumbnailUrl = (video) => {
if (video.videos && video.videos.length > 0) {
const publicId = video.videos[0].public_id; // Accessing public_id from the first video
return `https://res.cloudinary.com/dvokiypaw/video/upload/${publicId}.jpg`;
} else {
// Handle the case when videos array is empty or undefined
return ''; // or return a placeholder URL, or handle it based on your requirements
}
};



const getCategoryName = (categories, categoryId) => {
const category = categories.find(cat => cat._id === categoryId);
return category ? category.name : 'Unknown';
};

const VideoDetails = () => {
const { id } = useParams();
const [video, setVideo] = useState(null);
const [categories, setCategories] = useState([]);
const [recentVideos, setRecentVideos] = useState([]);

useEffect(() => {
const fetchVideo = async () => {
try {
const response = await axios.get(`http://localhost:4001/api/video/${id}`);
setVideo(response.data);
} catch (error) {
console.error('Error fetching video:', error);
}
};

const fetchCategories = async () => {
try {
const response = await axios.get('http://localhost:4001/api/categories');
setCategories(response.data.categories);
} catch (error) {
console.error('Error fetching categories:', error);
}
};

const fetchRecentVideos = async () => {
try {
const response = await axios.get('http://localhost:4001/api/videos');
const sortedVideos = response.data.videos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
setRecentVideos(sortedVideos.filter(recentVideo => recentVideo._id !== id)); // Exclude the current video
} catch (error) {
console.error('Error fetching recent videos:', error);
}
};

fetchVideo();
fetchCategories();
fetchRecentVideos();
}, [id]);

return (
<div className="container-youth">
    <div className="main-content-youth">
        <div className="vlog-youth">
            {video ? (
            <div>
                {video.videos.map((videoItem) => (
                <div key={videoItem._id}>
                    <iframe src={videoItem.url} title={video.name} width="960" height="540"
                        allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowFullScreen></iframe>
                    <h1 className='video-title-details'>{video.name}</h1>
                    <p>Last Updated Date: {new Date(video.updatedAt).toLocaleString()}</p>
                    <p className='video-title-information'>{video.description}</p>
                </div>
                ))}
            </div>
            ) : (
            <p>Loading video details...</p>
            )}
        </div>
    </div>




    {/* <div className="recent-videos">
        <h2 className='recent-video-title'>Recent Videos</h2>
        {recentVideos.map((recentVideo) => (
        <Link to={`/video/${recentVideo._id}`} key={recentVideo._id} className="video-link-youth">
        <div className="video-card-youth">
            <h3>{recentVideo.name}</h3>
            <p>{getCategoryName(categories, recentVideo.category)}</p>
        </div>
        </Link>
        ))}
    </div> */}

    <div className="recent-videos">
        <h2 className='recent-video-title'>Recent Videos</h2>
        {recentVideos.map((recentVideo) => (
        <Link to={`/video/${recentVideo._id}`} key={recentVideo._id} className="video-link-youth">
        <div className="video-card-youth">
            <img src={generateThumbnailUrl(recentVideo)} alt={recentVideo.name} className='video-image-youth' />
            <h3>{recentVideo.name}</h3>
            <p>{getCategoryName(categories, recentVideo.category)}</p>
        </div>
        </Link>
        ))}
    </div>


</div>
);
};

export default VideoDetails;
