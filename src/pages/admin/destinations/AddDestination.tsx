import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { destinationsAPI } from '../../../api';
import FlashMessage from '../../../components/FlashMessage';

const AddDestination = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [distance, setDistance] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await destinationsAPI.create({ name, price: Number(price), distance: Number(distance) });
            navigate('/admin/destinations');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to add destination.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <div className="card shadow">
                        <div className="card-header bg-success text-white">
                            <h4 className="mb-0">Add New Destination</h4>
                        </div>
                        <div className="card-body">
                            {error && <FlashMessage message={error} type="danger" onClose={() => setError('')} />}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Destination Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        minLength={4}
                                        maxLength={25}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Price (₱)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-control"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        required
                                        min={0}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">Distance (km)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        className="form-control"
                                        value={distance}
                                        onChange={(e) => setDistance(e.target.value)}
                                        required
                                        min={0}
                                    />
                                </div>
                                <div className="d-flex gap-2">
                                    <button type="submit" className="btn btn-success" disabled={isLoading}>
                                        {isLoading ? 'Adding...' : 'Add Destination'}
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/destinations')}>
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

export default AddDestination;
