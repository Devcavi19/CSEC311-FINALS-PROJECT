import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBus } from 'react-icons/fa';

const Navbar = () => {
    const { isAuthenticated, isAdmin, user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="navbar navbar-expand-lg navbar-premium">
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
                    <FaBus style={{ fontSize: '1.5rem', color: 'var(--color-accent)' }} />
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>BusBook</span>
                </Link>
                <button
                    className="navbar-toggler border-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto ms-lg-4">
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${isActive('/') ? 'active' : ''}`}
                                to="/"
                            >
                                Home
                            </Link>
                        </li>
                        {isAuthenticated && isAdmin && (
                            <>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
                                        to="/admin"
                                    >
                                        Dashboard
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link ${isActive('/admin/bookings') ? 'active' : ''}`}
                                        to="/admin/bookings"
                                    >
                                        Bookings
                                    </Link>
                                </li>
                                <li className="nav-item dropdown">
                                    <a
                                        className="nav-link dropdown-toggle"
                                        href="#"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        Manage
                                    </a>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <Link className="dropdown-item" to="/admin/users">
                                                <span className="me-2">👥</span> View Users
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item" to="/admin/users/create">
                                                <span className="me-2">➕</span> Create User
                                            </Link>
                                        </li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li>
                                            <Link className="dropdown-item" to="/admin/buses">
                                                <span className="me-2">🚌</span> View Buses
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item" to="/admin/buses/add">
                                                <span className="me-2">➕</span> Add Bus
                                            </Link>
                                        </li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li>
                                            <Link className="dropdown-item" to="/admin/destinations">
                                                <span className="me-2">📍</span> Destinations
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item" to="/admin/destinations/add">
                                                <span className="me-2">➕</span> Add Destination
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                            </>
                        )}
                        {isAuthenticated && !isAdmin && (
                            <>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link ${isActive('/user') ? 'active' : ''}`}
                                        to="/user"
                                    >
                                        Dashboard
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link ${isActive('/book') ? 'active' : ''}`}
                                        to="/book"
                                    >
                                        Book Ticket
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link ${isActive('/my-tickets') ? 'active' : ''}`}
                                        to="/my-tickets"
                                    >
                                        My Tickets
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                    <ul className="navbar-nav align-items-lg-center gap-2">
                        {isAuthenticated ? (
                            <>
                                <li className="nav-item">
                                    <span className="nav-link d-flex align-items-center gap-2" style={{ color: 'var(--color-secondary)' }}>
                                        <span className="d-none d-lg-inline" style={{
                                            background: 'var(--color-accent-gradient)',
                                            color: 'white',
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.875rem',
                                            fontWeight: 600,
                                            lineHeight: 2.5,
                                            textAlign: 'center'
                                        }}>
                                            {user?.username?.charAt(0).toUpperCase()}
                                        </span>
                                        <span className="d-lg-none">Welcome, </span>
                                        {user?.username}
                                    </span>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className="btn btn-premium btn-premium-secondary"
                                        onClick={handleLogout}
                                        style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">
                                        Sign in
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        className="btn btn-premium btn-premium-primary"
                                        to="/register"
                                        style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}
                                    >
                                        Get Started
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
