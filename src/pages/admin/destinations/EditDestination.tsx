import { useState, useEffect, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { destinationsAPI } from '../../../api';
import FlashMessage from '../../../components/FlashMessage';

const EditDestination = () => {
    const { id } = useParams<{ id: string }>();
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [distance, setDistance] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDestination = async () => {
            try {
                const response = await destinationsAPI.getById(Number(id));
                setName(response.data.name);
                setPrice(String(response.data.price));
                setDistance(String(response.data.distance));
            } catch (err) {
                setError('Failed to load destination.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchDestination();
    }, [id]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            await destinationsAPI.update(Number(id), { name, price: Number(price), distance: Number(distance) });
            navigate('/admin/destinations');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to update destination.');
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
                            <h4 className="mb-0">Edit Destination</h4>
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
                                    />
                                </div>
                                <div className="d-flex gap-2">
                                    <button type="submit" className="btn btn-primary" disabled={isSaving}>
                                        {isSaving ? 'Saving...' : 'Save Changes'}
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

export default EditDestination;
