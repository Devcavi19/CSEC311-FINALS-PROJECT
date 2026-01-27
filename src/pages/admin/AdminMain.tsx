import { Link } from 'react-router-dom';

const AdminMain = () => {
    const slides = [
        {
            title: 'Admin Dashboard',
            description: 'Manage your bus booking system efficiently.',
            emoji: '👨‍💼'
        },
        {
            title: 'User Management',
            description: 'Create, edit, and manage user accounts.',
            emoji: '👥'
        },
        {
            title: 'Bus Fleet Management',
            description: 'Add and manage your bus fleet.',
            emoji: '🚌'
        },
        {
            title: 'Route Management',
            description: 'Configure destinations and pricing.',
            emoji: '🗺️'
        },
        {
            title: 'Booking Overview',
            description: 'Monitor all bookings in real-time.',
            emoji: '📊'
        }
    ];

    return (
        <div className="container py-4">
            <div id="adminCarousel" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-indicators">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            data-bs-target="#adminCarousel"
                            data-bs-slide-to={index}
                            className={index === 0 ? 'active' : ''}
                        ></button>
                    ))}
                </div>
                <div className="carousel-inner rounded-4 shadow-lg" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className={`carousel-item ${index === 0 ? 'active' : ''}`}
                            style={{
                                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                                minHeight: '350px'
                            }}
                        >
                            <div className="d-flex flex-column align-items-center justify-content-center h-100 text-white p-5">
                                <div className="display-1 mb-4">{slide.emoji}</div>
                                <h3 className="text-center">{slide.title}</h3>
                                <p className="text-center opacity-75">{slide.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#adminCarousel" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon"></span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#adminCarousel" data-bs-slide="next">
                    <span className="carousel-control-next-icon"></span>
                </button>
            </div>

            <div className="row mt-5">
                <div className="col-md-3 mb-3">
                    <Link to="/admin/users" className="text-decoration-none">
                        <div className="card bg-primary text-white text-center p-4 h-100">
                            <div className="card-body">
                                <div className="display-4 mb-3">👥</div>
                                <h5>Manage Users</h5>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="col-md-3 mb-3">
                    <Link to="/admin/buses" className="text-decoration-none">
                        <div className="card bg-success text-white text-center p-4 h-100">
                            <div className="card-body">
                                <div className="display-4 mb-3">🚌</div>
                                <h5>Manage Buses</h5>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="col-md-3 mb-3">
                    <Link to="/admin/destinations" className="text-decoration-none">
                        <div className="card bg-info text-white text-center p-4 h-100">
                            <div className="card-body">
                                <div className="display-4 mb-3">📍</div>
                                <h5>Destinations</h5>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="col-md-3 mb-3">
                    <Link to="/admin/bookings" className="text-decoration-none">
                        <div className="card bg-warning text-dark text-center p-4 h-100">
                            <div className="card-body">
                                <div className="display-4 mb-3">🎫</div>
                                <h5>All Bookings</h5>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminMain;
