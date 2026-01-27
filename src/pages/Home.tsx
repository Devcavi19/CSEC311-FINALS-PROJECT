import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { isAuthenticated, isAdmin } = useAuth();

    return (
        <div className="hero-section">
            <div className="container">
                <div className="row align-items-center min-vh-75">
                    {/* Left Content */}
                    <div className="col-lg-6 py-5">
                        <div className="animate-fade-in-up">
                            <h1 className="hero-title">
                                Book Your Journey in{' '}
                                <span className="highlight">60</span> Seconds
                            </h1>
                            <p className="hero-subtitle">
                                Experience seamless bus ticket booking with our modern platform.
                                Choose from multiple destinations and travel comfortably.
                            </p>

                            {!isAuthenticated ? (
                                <div className="hero-cta">
                                    <Link
                                        to="/register"
                                        className="btn btn-premium btn-premium-primary btn-premium-lg"
                                    >
                                        Get Started
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="btn btn-premium btn-premium-secondary btn-premium-lg"
                                    >
                                        Sign In
                                    </Link>
                                </div>
                            ) : (
                                <div className="hero-cta">
                                    {isAdmin ? (
                                        <Link
                                            to="/admin"
                                            className="btn btn-premium btn-premium-primary btn-premium-lg"
                                        >
                                            Go to Dashboard
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M5 12h14M12 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                to="/book"
                                                className="btn btn-premium btn-premium-primary btn-premium-lg"
                                            >
                                                Book a Ticket
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                            <Link
                                                to="/my-tickets"
                                                className="btn btn-premium btn-premium-secondary btn-premium-lg"
                                            >
                                                My Tickets
                                            </Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Content - Bus Image with Cloud Effect */}
                    <div className="col-lg-6 d-none d-lg-block">
                        <div className="position-relative animate-fade-in-up animation-delay-2" style={{ height: '500px' }}>
                            {/* Bus Image with Cloud/Fade Effect */}
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: '100%',
                                    maxWidth: '550px',
                                }}
                            >
                                <div
                                    style={{
                                        position: 'relative',
                                        borderRadius: '20px',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <img
                                        src="/bus.jpg"
                                        alt="Modern Bus"
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            display: 'block',
                                        }}
                                    />
                                    {/* Cloud/Fade Overlay - Left */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            bottom: 0,
                                            width: '100px',
                                            background: 'linear-gradient(to right, var(--color-background, #F8F9FA), transparent)',
                                            pointerEvents: 'none',
                                        }}
                                    />
                                    {/* Cloud/Fade Overlay - Right */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            bottom: 0,
                                            width: '80px',
                                            background: 'linear-gradient(to left, var(--color-background, #F8F9FA), transparent)',
                                            pointerEvents: 'none',
                                        }}
                                    />
                                    {/* Cloud/Fade Overlay - Bottom */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            height: '120px',
                                            background: 'linear-gradient(to top, var(--color-background, #F8F9FA), transparent)',
                                            pointerEvents: 'none',
                                        }}
                                    />
                                    {/* Cloud/Fade Overlay - Top */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '60px',
                                            background: 'linear-gradient(to bottom, var(--color-background, #F8F9FA), transparent)',
                                            pointerEvents: 'none',
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feature Cards */}
                <div className="row g-4 py-5">
                    <div className="col-md-4">
                        <div className="card-feature animate-fade-in-up animation-delay-1">
                            <div className="card-feature-icon">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="4" width="20" height="16" rx="2" />
                                    <path d="M7 15h0M12 15h0M17 15h0" />
                                    <path d="M2 10h20" />
                                </svg>
                            </div>
                            <h5 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: '0.75rem' }}>
                                Easy Booking
                            </h5>
                            <p style={{ color: 'var(--color-secondary)', marginBottom: 0 }}>
                                Book your bus tickets in just a few clicks with our streamlined booking process.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card-feature animate-fade-in-up animation-delay-2">
                            <div className="card-feature-icon">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="10" r="3" />
                                    <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z" />
                                </svg>
                            </div>
                            <h5 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: '0.75rem' }}>
                                Multiple Destinations
                            </h5>
                            <p style={{ color: 'var(--color-secondary)', marginBottom: 0 }}>
                                Choose from a wide variety of destinations across the country.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card-feature animate-fade-in-up animation-delay-3">
                            <div className="card-feature-icon">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    <circle cx="12" cy="16" r="1" />
                                </svg>
                            </div>
                            <h5 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: '0.75rem' }}>
                                Secure Payments
                            </h5>
                            <p style={{ color: 'var(--color-secondary)', marginBottom: 0 }}>
                                Your transactions are protected with industry-standard security.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
