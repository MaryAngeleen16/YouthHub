import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MDBDataTable } from 'mdbreact';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { getToken } from '../../utils/helpers';
import Sidebar from './Sidebar';

const PostDataTable = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsResponse, categoriesResponse] = await Promise.all([
          axios.get('http://localhost:4001/api/posts'),
          axios.get('http://localhost:4001/api/categories'),
        ]);

        setPosts(postsResponse.data.posts || []);
        setCategories(categoriesResponse.data.categories || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch posts and categories');
        setLoading(false);
      }
    };


    fetchData();
  }, []);




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
          label: 'Category',
          field: 'category',
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

    posts.forEach((post) => {
      data.rows.push({
        _id: post._id,
        name: post.name,
        description: post.description,
        category: categories.find((category) => category._id === post.category)?.name || '',
        actions: (
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: "10px" }}>
            <Link
              to={{
                pathname: `/post/update/${post._id}`,
                state: { post },
              }}
              className="btn btn-primary"
              style={{ padding: "5px 30px", maxHeight: "50px", 
              paddingBottom: "-80px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: "40px" // Set line height equal to button height
        }}>
              Edit
            </Link>
            <button
              className="btn btn-danger ml-2"
              onClick={() => handleDelete(post._id)}
            >
              Delete
            </button>
          </div>
        ),
      });
    });

    return data;
  };

  const handleDelete = (postId) => {
    axios
      .delete(`http://localhost:4001/api/admin/delete/post/${postId}`)
      .then(() => {
        setPosts(posts.filter((post) => post._id !== postId));
        toast.success('Post is deleted successfully');
      })
      .catch((err) => {
        console.error(err);
        toast.error('Failed to delete post');
      });
  };

    return (
      <div className="container mt-6">
        <div className="row">
          <div className="col-md-3" style={{ float: 'left' }}>
            <Sidebar />
          </div>
          <div className="col-md-9">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div style={{ float: 'left' }}>
                <h2 style={{ fontWeight: 'bold', padding: '10px', paddingBottom: '10px', marginBottom: '80px' }}>List of Posts</h2>
              </div>
              <Link to="/post/create" className="btn btn-primary mb-3" 
              style={{ fontWeight: 'bold', padding: '10px', marginRight: '10%', maxWidth: '200px' }}>
                Create Post
              </Link>
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <React.Fragment>
                <MDBDataTable
                  data={setDataTable()}
                  className="px-3"
                  bordered
                  striped
                  hover
                />
                <ToastContainer />
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  export default PostDataTable;