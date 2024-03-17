import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MDBDataTable } from 'mdbreact';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './Sidebar';
import { getToken } from '../../utils/helpers';
const UserManagement = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Fetch users when the component mounts
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
       
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const response = await axios.get('http://localhost:4001/api/admin/users', config);
            setUsers(response.data.users);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleUpdateRole = async (userId, newRole) => {
        try {
            await axios.put(`http://localhost:4001/api/editUserRole/${userId}`, { userId, newRole });
            // Refresh the user list after updating the role
            fetchUsers();
            toast.success('Role updated successfully');
        } catch (error) {
            console.error('Error updating role:', error);
            toast.error('Failed to update role');
        }
    };
    const handleDeleteUser = async (userId) => {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            };
    
            await axios.delete(`http://localhost:4001/api/deleteUser/${userId}`, config);
            // Refresh the user list after deleting the user
            fetchUsers();
            toast.success('User deleted successfully');
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Failed to delete user');
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
                    label: 'Email',
                    field: 'email',
                    sort: 'asc',
                },
                {
                    label: 'Role',
                    field: 'role',
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

        users.forEach((user) => {
            data.rows.push({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                actions: (
                    <div>
                        {user.role === 'admin' ? (
                            <button
                                className="btn btn-warning"
                                onClick={() => handleUpdateRole(user._id, 'user')}
                            >
                                Update Role to User
                            </button>
                        ) : (
                            <button
                                className="btn btn-success"
                                onClick={() => handleUpdateRole(user._id, 'admin')}
                            >
                                Update Role to Admin
                            </button>
                        )}
                        <button
                            className="btn btn-danger ml-2"
                            onClick={() => handleDeleteUser(user._id)}
                        >
                            Delete User
                        </button>
                    </div>
                ),
            });
        });

        return data;
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-3">
                    <Sidebar />
                </div>
                <div className="col-md-9">
                    <div>
                        <h2>LIST OF USERS</h2>
                        <MDBDataTable
                            data={setDataTable()}
                            className="px-3"
                            bordered
                            striped
                            hover
                        />
                        <ToastContainer />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;