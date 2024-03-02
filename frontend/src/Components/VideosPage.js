import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import NavBar from '../Components/Layouts/navBar';
import './Videos.css';


const generateThumbnailUrl = (video) => {
if (video.videos && video.videos.length > 0) {
const publicId = video.videos[0].public_id; // Accessing public_id from the first video
return `https://res.cloudinary.com/dvokiypaw/video/upload/${publicId}.jpg`;
} else {
return ''; 
}
};

const VideoCard = ({ video }) => {
const thumbnailUrl = generateThumbnailUrl(video);

return (
    <div className="video-card">
      <img src={thumbnailUrl} alt={video.name} className='video-thumbnail' />
      <div className="video-details">
        <h3 className='videos-title'>{video.name}</h3>
        <p> {video.description.length > 80 ?
            video.description.slice(0, 80) +
            "..." : video.description}</p>
      </div>
      <Link to={`/video/${video._id}`} className="video-watch">Watch Now</Link>
    </div>
  );
};
{/* <div className="video-card">
    <img src={thumbnailUrl} alt={video.name} className='video-thumbnail' />
    <h3 className='videos-title'>{video.name}</h3>
    <p> {video.description.length > 80 ?
        video.description.slice(0, 80) +
        "..." : video.description}</p>
    <Link to={`/video/${video._id}` } className="video-watch">Watch Now</Link>
</div>
);
}; */}





const VideosPage = () => {
const [videos, setVideos] = useState([]);
const [filteredVideos, setFilteredVideos] = useState([]);
const [categories, setCategories] = useState([]);
const [selectedCategories, setSelectedCategories] = useState([]);


useEffect(() => {
const fetchVideos = async () => {
try {
const response = await axios.get('http://localhost:4001/api/videos'); // Update API endpoint
setVideos(response.data.videos);
setFilteredVideos(response.data.videos); // Initialize filtered videos with all videos
} catch (error) {
console.error('Error fetching videos:', error);
}
};

fetchVideos();
}, []);



useEffect(() => {
const fetchCategories = async () => {
try {
const response = await axios.get('http://localhost:4001/api/categories');
setCategories(response.data.categories);
} catch (error) {
console.error('Error fetching categories:', error);
}
};

fetchCategories();
}, []);

const filterByCategory = (category) => {
const isSelected = selectedCategories.includes(category);
let updatedSelectedCategories;

if (isSelected) {
updatedSelectedCategories = selectedCategories.filter(cat => cat !== category);
} else {
updatedSelectedCategories = [...selectedCategories, category];
}

setSelectedCategories(updatedSelectedCategories);

const filtered = videos.filter(video => updatedSelectedCategories.includes(video.category));
setFilteredVideos(filtered);
};


// const checkboxes = document.querySelectorAll('.card-checkbox input[type="checkbox"]');
// checkboxes.forEach(checkbox => {
// checkbox.addEventListener('change', function() {
// const label = this.parentElement;
// label.classList.toggle('checked', this.checked);
// });
// });


const checkboxes = document.querySelectorAll('.card-checkbox input[type="checkbox"]');
const resetFilter = () => {
checkboxes.forEach(checkbox => {
checkbox.checked = false;
const cardCheckbox = checkbox.closest('.card-checkbox');
cardCheckbox.classList.remove('checked');
});
setSelectedCategories([]);
setFilteredVideos(videos);
};

checkboxes.forEach(checkbox => {
checkbox.addEventListener('change', function() {
const cardCheckbox = this.closest('.card-checkbox');
cardCheckbox.classList.toggle('checked', this.checked);
});
});


// return (
// <div className="video-page">
//     <NavBar />
//     <h1 className='videos-header'>ALL VIDEOS</h1>

//     <div className="videos-container">
//         <div className="side-filter video-filter">
//             <h3 className='video-filter-title'>Filter by Category </h3>
//             {categories.map(category => (
//             <div key={category._id} className='video-filter-category card-checkbox'>
//                 <label className="checkbox-label txt-category">
//                     <input type="checkbox" value={category._id} checked={selectedCategories.includes(category._id)}
//                         onChange={()=> filterByCategory(category._id)}/>
//                     {category.name}
//                 </label>
//             </div>
//             ))}
//             <button onClick={resetFilter} className='video-button-style'>Reset</button>

//         </div>

//         <div className="video-container">
//             {filteredVideos.map(video => (
//             <VideoCard key={video._id} video={video} />
//             ))}
//         </div>
//     </div>
// </div>
// );
// };

// export default VideosPage;
return (
    <div className="video-page">
      <NavBar />
      <h1 className='videos-header'>ALL VIDEOS</h1>

      <div className="videos-container">
        <div className="side-filter video-filter">
          <h3 className='video-filter-title'>Filter by Category </h3>
          {categories.map(category => (
            <div key={category._id} className='video-filter-category card-checkbox'>
              <label className="checkbox-label txt-category">
                <input
                  type="checkbox"
                  value={category._id}
                  checked={selectedCategories.includes(category._id)}
                  onChange={() => filterByCategory(category._id)}
                />
                {category.name}
              </label>
            </div>
          ))}
          <button onClick={resetFilter} className='video-button-style'>Reset</button>
        </div>

        <div className="video-container">
          {filteredVideos.map(video => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideosPage;