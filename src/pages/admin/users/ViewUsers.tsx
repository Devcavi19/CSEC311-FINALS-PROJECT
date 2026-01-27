import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usersAPI } from '../../../api';
import FlashMessage from '../../../components/FlashMessage';

interface User {
    id: number;
    username: string;
    email: string;
    balance: number;
    is_admin: boolean;
}

const ViewUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await usersAPI.getAll();
            setUsers(response.data);
        } catch (err) {
            setError('Failed to load users.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (userId: number, username: string) => {
        if (!confirm(`Are you sure you want to delete user "${username}"?`)) return;

        try {
            await usersAPI.delete(userId);
            setSuccess('User deleted successfully.');
            setUsers(users.filter(u => u.id !== userId));
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to delete user.');
        }
    };

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center py-5">
                <div className="spinner-border text-primary"></div>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-white mb-0">👥 View Users</h2>
                <Link to="/admin/users/create" className="btn btn-success">
                    + Create New User
                </Link>
            </div>

            {error && <FlashMessage message={error} type="danger" onClose={() => setError('')} />}
            {success && <FlashMessage message={success} type="success" onClose={() => setSuccess('')} />}

            <div className="card shadow">
                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Balance</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>₱{user.balance.toFixed(2)}</td>
                                    <td>
                                        <span className={`badge ${user.is_admin ? 'bg-danger' : 'bg-secondary'}`}>
                                            {user.is_admin ? 'Admin' : 'User'}
                                        </span>
                                    </td>
                                    <td>
                                        <Link to={`/admin/users/edit/${user.id}`} className="btn btn-sm btn-primary me-2">
                                            Edit
                                        </Link>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(user.id, user.username)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ViewUsers;
