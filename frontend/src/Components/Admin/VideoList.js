import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MDBDataTable } from 'mdbreact';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { getToken } from '../../utils/helpers';
import Sidebar from './Sidebar';

const VideoDataTable = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get('http://localhost:4001/api/videos');
        setVideos(response.data.videos || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching videos:', error);
        toast.error('Failed to fetch videos');
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleDelete = (videoId) => {
    axios
      .delete(`http://localhost:4001/api/admin/delete/video/${videoId}`)
      .then(() => {
        setVideos(videos.filter((video) => video._id !== videoId));
        toast.success('Video deleted successfully');
      })
      .catch((err) => {
        console.error(err);
        toast.error('Failed to delete video');
      });
  };

  const setDataTable = () => {
    const data = {
      columns: [
        {
          label: 'ID',
          field: '_id',
          sort: 'asc',
        },
        {
          label: 'Name',
          field: 'name',
          sort: 'asc',
        },
        {
          label: 'Description',
          field: 'description',
          sort: 'asc',
        },
        {
          label: 'Actions',
          field: 'actions',
          sort: 'asc',
        },
      ],
      rows: [],
    };

    videos.forEach((video) => {
      data.rows.push({
        _id: video._id,
        name: video.name,
        description: video.description,
        actions: (
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: "10px" }}>
            <Link
              to={`/video/update/${video._id}`}
              className="btn btn-primary mr-2"
              style={{
                padding: "5px 30px",
                maxHeight: "50px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: "40px" // Set line height equal to button height
              }}
            >
              Edit
            </Link>
            <button
              className="btn btn-danger"
              style={{
                minWidth: "100px",
                marginTop: "5px",
                fontSize: "0.8rem",
                marginLeft: "5px",
                padding: "6px 12px"
              }}
              onClick={() => handleDelete(video._id)}
            >
              Delete
            </button>
          </div>
        ),
      });
    });

    return data;
  };

  return (
    <div className="container mt-6">
      <div className="row">
        <div className="col-md-3">
          <Sidebar />
        </div>
        <div className="col-md-9" style={{ float: 'left', paddingLeft: '30px' }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 style={{
              fontWeight: "bold",
              padding: "10px",
              paddingBottom: "10px",
              margingBottom: "80px"
            }}>List of Videos</h2>
            <Link to="/video/create" className="btn btn-primary"
              style={{
                fontWeight: "bold",
                padding: "10px",
                marginLeft: "73%",
              }}>
              Upload Video
            </Link>
          </div>
          <div className="text-center">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <MDBDataTable
                data={setDataTable()}
                bordered
                striped
                hover
              />
            )}
          </div>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default VideoDataTable;
