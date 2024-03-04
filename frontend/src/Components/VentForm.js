import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken, getUser } from '../utils/helpers';
import '../Components/Admin/crud.css';
import '../Components/Counselor/VentList.css'
const VentForm = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     
      const user = getUser(); 
      await axios.post('http://localhost:4001/api/vent/new', { user, title, message });
      alert('Vent submitted successfully!');
      setTitle('');
      setMessage('');
    } catch (err) {
      console.error(err);
      alert('Failed to submit vent');
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
  <div className="col-md-9 text-crud ventform-center" style={{paddingBottom:'50px', 
  marginTop: '50px'}}>
   <h2 className='title-crud'>Submit Your Concern</h2>
<form onSubmit={handleSubmit} className='ventlist-center'>
  <div className="mb-3">
      <label htmlFor="title" className="form-label">
                Title
      </label>
      <input
        type="text"
        value={title}
        className="form-control"

        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter title"
        required
      />

  </div>
  <div className="mb-3">
  <label htmlFor="message" className="form-label">
                Message
  </label>
       <textarea
        value={message}
        className="form-control ventform-message"
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your message"
        required
      ></textarea>

</div>

    
      <button type="submit" className="btn btn-crud ml-auto btn-design">Submit Your Concern</button>
    </form>

</div>
    
  );
};

export default VentForm;
