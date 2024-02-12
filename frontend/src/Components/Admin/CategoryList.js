import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MDBDataTable } from 'mdbreact';
import 'mdbreact/dist/css/mdb.css';
import Sidebar from './Sidebar';

const CategoryDataTable = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:4001/api/categories')
      .then((res) => {
        setCategories(res.data.categories);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleDelete = (categoryId) => {
    axios
      .delete(`http://localhost:4001/api/categories/${categoryId}`)
      .then(() => {
        setCategories(categories.filter((category) => category._id !== categoryId));
        toast.success('Category deleted successfully');
      })
      .catch((err) => {
        console.error(err);
        toast.error('Failed to delete category');
      });
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

    categories.forEach((category) => {
      data.rows.push({
        _id: category._id,
        name: category.name,
        description: category.description,
        actions: (
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: "10px" }}>
          <Link to={`/category/update/${category._id}`} className="btn btn-primary mr-2"
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
            className="btn btn-danger"
            style={{
              minWidth: "100px",
              marginTop: "5px",
              fontSize: "0.8rem",
              marginLeft: "5px",
              padding: "6px 12px" 
            }}
            onClick={() => handleDelete(category._id)}
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
        <div className="col-md-3" style={{ float: 'left' }}>
          <Sidebar />
        </div>
        <div className="col-md-9" style={{ float: 'left', paddingLeft: '30px' }}> 
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 style={{ fontWeight: "bold", padding: "10px", paddingBottom: "10px", 
            margingBottom: "80px" }}>List of Categories</h2>
            <Link to="/category/create" className="btn btn-primary" 
            style={{ 
            fontWeight: "bold", 
            padding: "10px",
            marginLeft: "75%",
          
             }}>
              Create Category
            </Link>
          </div>
          <div className="text-center">
            <MDBDataTable
              data={setDataTable()}
              bordered
              striped
              hover
            />
          </div>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default CategoryDataTable;