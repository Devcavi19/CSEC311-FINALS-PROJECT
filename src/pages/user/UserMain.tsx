import { Link } from 'react-router-dom';

const UserMain = () => {
    const slides = [
        {
            title: 'The Solution for Traditional Buses',
            description: 'We present this app to improve the traditional bus system.',
            emoji: '🚌'
        },
        {
            title: 'Modern Bus Management',
            description: 'Efficient and reliable bus management system.',
            emoji: '📊'
        },
        {
            title: 'Comfortable Rides',
            description: 'Experience comfort and convenience with our buses.',
            emoji: '💺'
        },
        {
            title: 'Safe Travels',
            description: 'Your safety is our priority.',
            emoji: '🛡️'
        },
        {
            title: 'Eco-Friendly Buses',
            description: 'Our buses are designed to be environmentally friendly.',
            emoji: '🌿'
        }
    ];

    return (
        <div className="container py-4">
            <div id="userCarousel" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-indicators">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            data-bs-target="#userCarousel"
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
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                minHeight: '400px'
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
                <button className="carousel-control-prev" type="button" data-bs-target="#userCarousel" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon"></span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#userCarousel" data-bs-slide="next">
                    <span className="carousel-control-next-icon"></span>
                </button>
            </div>

            <div className="row mt-5 justify-content-center">
                <div className="col-md-4 mb-3">
                    <Link to="/book" className="text-decoration-none">
                        <div className="card bg-white text-center p-4 h-100 shadow-sm hover-shadow">
                            <div className="card-body">
                                <div className="display-4 mb-3">🎫</div>
                                <h5>Book a Ticket</h5>
                                <p className="text-muted small">Reserve your seat now</p>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="col-md-4 mb-3">
                    <Link to="/my-tickets" className="text-decoration-none">
                        <div className="card bg-white text-center p-4 h-100 shadow-sm">
                            <div className="card-body">
                                <div className="display-4 mb-3">📋</div>
                                <h5>My Tickets</h5>
                                <p className="text-muted small">View your bookings</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UserMain;
