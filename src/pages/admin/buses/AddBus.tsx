import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { busesAPI } from '../../../api';
import FlashMessage from '../../../components/FlashMessage';

const AddBus = () => {
    const [name, setName] = useState('');
    const [capacity, setCapacity] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await busesAPI.create({ name, capacity: Number(capacity) });
            navigate('/admin/buses');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to add bus.');
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
                            <h4 className="mb-0">Add New Bus</h4>
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
                                        minLength={4}
                                        maxLength={25}
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
                                    <button type="submit" className="btn btn-success" disabled={isLoading}>
                                        {isLoading ? 'Adding...' : 'Add Bus'}
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

export default AddBus;
