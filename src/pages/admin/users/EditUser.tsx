import { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usersAPI } from '../../../api';
import FlashMessage from '../../../components/FlashMessage';

const EditUser = () => {
    const { id } = useParams<{ id: string }>();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await usersAPI.getById(Number(id));
                setUsername(response.data.username);
                setEmail(response.data.email);
                setIsAdmin(response.data.is_admin);
            } catch (err) {
                setError('Failed to load user.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, [id]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            await usersAPI.update(Number(id), { username, email, is_admin: isAdmin });
            navigate('/admin/users', { state: { success: 'User updated successfully.' } });
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to update user.');
        } finally {
            setIsSaving(false);
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
            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white">
                            <h4 className="mb-0">Edit User</h4>
                        </div>
                        <div className="card-body">
                            {error && <FlashMessage message={error} type="danger" onClose={() => setError('')} />}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Username</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="isAdmin"
                                            checked={isAdmin}
                                            onChange={(e) => setIsAdmin(e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor="isAdmin">
                                            Admin privileges
                                        </label>
                                    </div>
                                </div>
                                <div className="d-flex gap-2">
                                    <button type="submit" className="btn btn-primary" disabled={isSaving}>
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => navigate('/admin/users')}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditUser;
