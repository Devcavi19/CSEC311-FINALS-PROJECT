import { useState, useEffect } from 'react';
import { bookingsAPI } from '../../../api';
import FlashMessage from '../../../components/FlashMessage';

interface Booking {
    booking_id: number;
    user_id: number;
    username: string;
    bus_name: string;
    destination_name: string;
    destination_price: number;
    booking_date: string;
    travel_date: string;
}

const ViewBookings = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchBookings();
    }, []);

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

    const handleDelete = async (bookingId: number) => {
        if (!confirm('Are you sure you want to delete this booking?')) return;

        try {
            await bookingsAPI.cancel(bookingId);
            setSuccess('Booking deleted successfully.');
            setBookings(bookings.filter(b => b.booking_id !== bookingId));
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to delete booking.');
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
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
            <h2 className="text-white mb-4">🎫 All Bookings</h2>

            {error && <FlashMessage message={error} type="danger" onClose={() => setError('')} />}
            {success && <FlashMessage message={success} type="success" onClose={() => setSuccess('')} />}

            <div className="card shadow">
                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>User</th>
                                <th>Bus</th>
                                <th>Destination</th>
                                <th>Price</th>
                                <th>Travel Date</th>
                                <th>Booked On</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking.booking_id}>
                                    <td>{booking.booking_id}</td>
                                    <td>{booking.username}</td>
                                    <td>{booking.bus_name}</td>
                                    <td>{booking.destination_name}</td>
                                    <td>₱{booking.destination_price?.toFixed(2)}</td>
                                    <td>{formatDate(booking.travel_date)}</td>
                                    <td>{formatDate(booking.booking_date)}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(booking.booking_id)}
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

export default ViewBookings;
