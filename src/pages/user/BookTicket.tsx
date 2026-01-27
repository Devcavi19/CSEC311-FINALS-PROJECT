import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { busesAPI, destinationsAPI, bookingsAPI } from '../../api';
import FlashMessage from '../../components/FlashMessage';

interface Bus {
    id: number;
    name: string;
    capacity: number;
}

interface Destination {
    id: number;
    name: string;
    price: number;
    distance: number;
}

const BookTicket = () => {
    const [buses, setBuses] = useState<Bus[]>([]);
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [busId, setBusId] = useState('');
    const [destinationId, setDestinationId] = useState('');
    const [travelDate, setTravelDate] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [busRes, destRes] = await Promise.all([
                    busesAPI.getAll(),
                    destinationsAPI.getAll()
                ]);
                setBuses(busRes.data);
                setDestinations(destRes.data);
            } catch (err) {
                setError('Failed to load buses and destinations.');
            } finally {
                setIsFetching(false);
            }
        };
        fetchData();
    }, []);

    const selectedDestination = destinations.find(d => d.id === Number(destinationId));

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (!busId || !destinationId || !travelDate) {
            setError('Please fill in all fields.');
            return;
        }

        setIsLoading(true);

        try {
            await bookingsAPI.create({
                bus_id: Number(busId),
                destination_id: Number(destinationId),
                travel_date: travelDate
            });
            navigate('/my-tickets', { state: { success: 'Ticket booked successfully!' } });
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to book ticket.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
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
                    <div className="card shadow-lg border-0 rounded-4">
                        <div
                            className="card-header text-white text-center py-4 rounded-top-4"
                            style={{ background: 'linear-gradient(to right, #007bff, #00b8d4)' }}
                        >
                            <h3 className="mb-0">🎫 Book Ticket</h3>
                        </div>
                        <div className="card-body p-4">
                            {error && (
                                <FlashMessage message={error} type="danger" onClose={() => setError('')} />
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="bus" className="form-label">Select Bus</label>
                                    <select
                                        className="form-select form-select-lg"
                                        id="bus"
                                        value={busId}
                                        onChange={(e) => setBusId(e.target.value)}
                                        required
                                    >
                                        <option value="">Choose a bus...</option>
                                        {buses.map((bus) => (
                                            <option key={bus.id} value={bus.id}>
                                                {bus.name} (Capacity: {bus.capacity})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="destination" className="form-label">Select Destination</label>
                                    <select
                                        className="form-select form-select-lg"
                                        id="destination"
                                        value={destinationId}
                                        onChange={(e) => setDestinationId(e.target.value)}
                                        required
                                    >
                                        <option value="">Choose a destination...</option>
                                        {destinations.map((dest) => (
                                            <option key={dest.id} value={dest.id}>
                                                {dest.name} - ₱{dest.price.toFixed(2)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {selectedDestination && (
                                    <div className="alert alert-info">
                                        <strong>Selected:</strong> {selectedDestination.name}<br />
                                        <strong>Price:</strong> ₱{selectedDestination.price.toFixed(2)}<br />
                                        <strong>Distance:</strong> {selectedDestination.distance} km
                                    </div>
                                )}

                                <div className="mb-4">
                                    <label htmlFor="travelDate" className="form-label">Travel Date</label>
                                    <input
                                        type="date"
                                        className="form-control form-control-lg"
                                        id="travelDate"
                                        value={travelDate}
                                        onChange={(e) => setTravelDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary btn-lg w-100"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Booking...
                                        </>
                                    ) : (
                                        'Book Ticket'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookTicket;
