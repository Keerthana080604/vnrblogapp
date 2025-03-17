import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('/api/admin/all-users')
            .then(response => setUsers(response.data))
            .catch(error => console.log(error));
    }, []);

    const toggleBlockStatus = (id, status) => {
        axios.put(`/api/admin/block-user/${id}`)
            .then(() => {
                setUsers(users.map(user => 
                    user._id === id ? { ...user, status: status === 'active' ? 'blocked' : 'active' } : user
                ));
            })
            .catch(error => console.log(error));
    };

    return (
        <div>
            <h2>Admin Dashboard</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>{user.firstName} {user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{user.status}</td>
                            <td>
                                <button onClick={() => toggleBlockStatus(user._id, user.status)}>
                                    {user.status === 'active' ? 'Block' : 'Unblock'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
