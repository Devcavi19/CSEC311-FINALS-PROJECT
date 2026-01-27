import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { bookingsAPI } from '../../api';
import FlashMessage from '../../components/FlashMessage';

interface Booking {
    booking_id: number;
    bus_id: number;
    destination_id: number;
    booking_date: string;
    travel_date: string;
    bus_name: string;
    destination_name: string;
    destination_price: number;
    destination_distance: number;
}

const MyTickets = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [cancellingId, setCancellingId] = useState<number | null>(null);
    const location = useLocation();

    useEffect(() => {
        if (location.state?.success) {
            setSuccess(location.state.success);
            // Clear the state
            window.history.replaceState({}, document.title);
        }
        fetchBookings();
    }, [location]);

    const fetchBookings = async () => {
        try {
            const response = await bookingsAPI.getAll();
            setBookings(response.data);
        } catch (err) {
            setError('Failed to load bookings.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = async (bookingId: number) => {
        if (!confirm('Are you sure you want to cancel this booking?')) return;

        setCancellingId(bookingId);
        try {
            await bookingsAPI.cancel(bookingId);
            setSuccess('Booking cancelled successfully.');
            setBookings(bookings.filter(b => b.booking_id !== bookingId));
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to cancel booking.');
        } finally {
            setCancellingId(null);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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
            <h2 className="text-white mb-4">📋 My Tickets</h2>

            {error && <FlashMessage message={error} type="danger" onClose={() => setError('')} />}
            {success && <FlashMessage message={success} type="success" onClose={() => setSuccess('')} />}

            {bookings.length === 0 ? (
                <div className="card bg-white p-5 text-center">
                    <div className="display-1 mb-3">🎫</div>
                    <h4>No bookings yet</h4>
                    <p className="text-muted">Book your first ticket to see it here!</p>
                </div>
            ) : (
                <div className="row">
                    {bookings.map((booking) => (
                        <div key={booking.booking_id} className="col-lg-6 mb-4">
                            <div className="card shadow-sm h-100">
                                <div
                                    className="card-header text-white"
                                    style={{ background: 'linear-gradient(to right, #007bff, #00b8d4)' }}
                                >
                                    <h5 className="mb-0">Ticket #{booking.booking_id}</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-6">
                                            <p className="mb-1 text-muted small">Bus</p>
                                            <p className="fw-bold">{booking.bus_name}</p>
                                        </div>
                                        <div className="col-6">
                                            <p className="mb-1 text-muted small">Destination</p>
                                            <p className="fw-bold">{booking.destination_name}</p>
                                        </div>
                                        <div className="col-6">
                                            <p className="mb-1 text-muted small">Travel Date</p>
                                            <p className="fw-bold">{formatDate(booking.travel_date)}</p>
                                        </div>
                                        <div className="col-6">
                                            <p className="mb-1 text-muted small">Price</p>
                                            <p className="fw-bold text-success">₱{booking.destination_price.toFixed(2)}</p>
                                        </div>
                                        <div className="col-12">
                                            <p className="mb-1 text-muted small">Booked On</p>
                                            <p className="small">{formatDate(booking.booking_date)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer bg-white border-0">
                                    <button
                                        className="btn btn-outline-danger w-100"
                                        onClick={() => handleCancel(booking.booking_id)}
                                        disabled={cancellingId === booking.booking_id}
                                    >
                                        {cancellingId === booking.booking_id ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Cancelling...
                                            </>
                                        ) : (
                                            'Cancel Booking'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyTickets;
