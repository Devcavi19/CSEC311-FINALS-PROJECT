import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { busesAPI } from '../../../api';
import FlashMessage from '../../../components/FlashMessage';

interface Bus {
    id: number;
    name: string;
    capacity: number;
}

const ViewBuses = () => {
    const [buses, setBuses] = useState<Bus[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchBuses();
    }, []);

    const fetchBuses = async () => {
        try {
            const response = await busesAPI.getAll();
            setBuses(response.data);
        } catch (err) {
            setError('Failed to load buses.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (busId: number, busName: string) => {
        if (!confirm(`Are you sure you want to delete "${busName}"?`)) return;

        try {
            await busesAPI.delete(busId);
            setSuccess('Bus deleted successfully.');
            setBuses(buses.filter(b => b.id !== busId));
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to delete bus.');
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
                <h2 className="text-white mb-0">🚌 View Buses</h2>
                <Link to="/admin/buses/add" className="btn btn-success">
                    + Add New Bus
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
                                <th>Bus Name</th>
                                <th>Capacity</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {buses.map((bus) => (
                                <tr key={bus.id}>
                                    <td>{bus.id}</td>
                                    <td>{bus.name}</td>
                                    <td>{bus.capacity} seats</td>
                                    <td>
                                        <Link to={`/admin/buses/edit/${bus.id}`} className="btn btn-sm btn-primary me-2">
                                            Edit
                                        </Link>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(bus.id, bus.name)}
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

export default ViewBuses;
