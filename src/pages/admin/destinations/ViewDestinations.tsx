import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { destinationsAPI } from '../../../api';
import FlashMessage from '../../../components/FlashMessage';

interface Destination {
    id: number;
    name: string;
    price: number;
    distance: number;
}

const ViewDestinations = () => {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchDestinations();
    }, []);

    const fetchDestinations = async () => {
        try {
            const response = await destinationsAPI.getAll();
            setDestinations(response.data);
        } catch (err) {
            setError('Failed to load destinations.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

        try {
            await destinationsAPI.delete(id);
            setSuccess('Destination deleted successfully.');
            setDestinations(destinations.filter(d => d.id !== id));
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to delete destination.');
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
                <h2 className="text-white mb-0">📍 View Destinations</h2>
                <Link to="/admin/destinations/add" className="btn btn-success">
                    + Add New Destination
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
                                <th>Destination Name</th>
                                <th>Price</th>
                                <th>Distance</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {destinations.map((dest) => (
                                <tr key={dest.id}>
                                    <td>{dest.id}</td>
                                    <td>{dest.name}</td>
                                    <td>₱{dest.price.toFixed(2)}</td>
                                    <td>{dest.distance} km</td>
                                    <td>
                                        <Link to={`/admin/destinations/edit/${dest.id}`} className="btn btn-sm btn-primary me-2">
                                            Edit
                                        </Link>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(dest.id, dest.name)}
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

export default ViewDestinations;
