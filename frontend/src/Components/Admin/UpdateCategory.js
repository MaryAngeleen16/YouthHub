import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
// import Sidebar from './Sidebar';

const UpdateCategory = () => {
    const navigate = useNavigate();
  const { id } = useParams(); // Access the 'id' parameter from the route

  const [category, setCategory] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    // Fetch the category data for updating using the 'id' from the route
    axios
      .get(`http://localhost:4001/api/categories/${id}`)
      .then((res) => {
        
        const { name, description } = res.data;
        setCategory({ name, description });
      })
      .catch((err) => {
        console.error(err);
        // Display an error toast if there's an issue fetching data
        toast.error('Failed to fetch category data');
      });
  }, [id]);

  const onChange = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  const { name, description } = category;

  const submitForm = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:4001/api/categories/${id}`, category)
      .then((res) => {
        if (res.status === 200) {
         
        //   toast.success('Category updated successfully');
          navigate('/category/list'); 

         
        } else {
          // Display an error toast if there's an issue with the request
          toast.error('Failed to update category');
        }
      })
      .catch((err) => {
        console.error(err);
        // Display an error toast if there's an issue with the request
        toast.error('Failed to update category');
      });
  };

//   return (
//     <div className="container mt-5">
//       <form>
//         <div className="mb-3">
//           <label htmlFor="name" className="form-label">
//             Name
//           </label>
//           <input
//             type="text"
//             className="form-control"
//             id="name"
//             name="name"
//             value={name}
//             onChange={onChange}
//           />
//         </div>
//         <div className="mb-3">
//           <label htmlFor="description" className="form-label">
//             Description
//           </label>
//           <textarea
//             className="form-control"
//             id="description"
//             name="description"
//             value={description}
//             onChange={onChange}
//           ></textarea>
//         </div>
//         <button className="btn btn-primary" onClick={submitForm}>
//           Update
//         </button>
//       </form>
//       <ToastContainer />
//     </div>
//   );
// };

// export default UpdateCategory;

return (
  <div className="container mt-5">
    <div className="row">
      <div className="col-md-3">
       {/* <Sidebar/> */}
      
      </div>
      <div className="col-md-9 text-crud" style={{ paddingBottom: '50px' }}>
        
        <h2 className="title-crud">Update Category</h2>
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
              value={name}
              onChange={onChange}
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
              value={description}
              onChange={onChange}
            ></textarea>
          </div>
          <button type="button" className="btn btn-crud" onClick={submitForm}>
            Update
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  </div>
);
};

export default UpdateCategory;