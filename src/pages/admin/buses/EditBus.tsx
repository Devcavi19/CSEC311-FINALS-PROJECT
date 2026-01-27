import { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { busesAPI } from '../../../api';
import FlashMessage from '../../../components/FlashMessage';

const EditBus = () => {
    const { id } = useParams<{ id: string }>();
    const [name, setName] = useState('');
    const [capacity, setCapacity] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBus = async () => {
            try {
                const response = await busesAPI.getById(Number(id));
                setName(response.data.name);
                setCapacity(String(response.data.capacity));
            } catch (err) {
                setError('Failed to load bus.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchBus();
    }, [id]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            await busesAPI.update(Number(id), { name, capacity: Number(capacity) });
            navigate('/admin/buses');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to update bus.');
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
                            <h4 className="mb-0">Edit Bus</h4>
                        </div>
                        <div className="card-body">
                            {error && <FlashMessage message={error} type="danger" onClose={() => setError('')} />}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Bus Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">Capacity</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={capacity}
                                        onChange={(e) => setCapacity(e.target.value)}
                                        required
                                        min={1}
                                    />
                                </div>
                                <div className="d-flex gap-2">
                                    <button type="submit" className="btn btn-primary" disabled={isSaving}>
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/buses')}>
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

export default EditBus;
