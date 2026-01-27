import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FlashMessage from '../components/FlashMessage';
import { FaBus } from 'react-icons/fa';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(username, password);
            navigate(isAdmin ? '/admin' : '/user');
        } catch (err: any) {
            setError(err.response?.data?.error || 'An error occurred during login.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center" style={{ background: 'var(--color-background)' }}>
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-xl-10 col-lg-11">
                        <div className="card card-premium overflow-hidden" style={{ borderRadius: 'var(--radius-2xl)' }}>
                            <div className="row g-0">
                                {/* Left Side - Form */}
                                <div className="col-lg-6">
                                    <div className="p-4 p-md-5">
                                        {/* Header */}
                                        <div className="mb-4">
                                            <Link to="/" className="d-inline-flex align-items-center gap-2 text-decoration-none mb-4" style={{ color: 'var(--color-primary)' }}>
                                                <FaBus style={{ fontSize: '1.5rem', color: 'var(--color-accent)' }} />
                                                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem' }}>BusBook</span>
                                            </Link>
                                            <h2 style={{
                                                fontFamily: 'var(--font-display)',
                                                fontWeight: 700,
                                                fontSize: 'var(--text-3xl)',
                                                marginBottom: '0.5rem'
                                            }}>
                                                Welcome back
                                            </h2>
                                            <p style={{ color: 'var(--color-secondary)' }}>
                                                Sign in to your account to continue
                                            </p>
                                        </div>

                                        {/* Error Message */}
                                        {error && (
                                            <FlashMessage
                                                message={error}
                                                type="danger"
                                                onClose={() => setError('')}
                                            />
                                        )}

                                        {/* Form */}
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-4">
                                                <label
                                                    htmlFor="username"
                                                    className="form-label"
                                                    style={{
                                                        fontWeight: 'var(--font-medium)',
                                                        color: 'var(--color-secondary)',
                                                        fontSize: 'var(--text-sm)'
                                                    }}
                                                >
                                                    Username
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-lg input-premium"
                                                    id="username"
                                                    placeholder="Enter your username"
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                    required
                                                    minLength={4}
                                                    maxLength={25}
                                                    style={{
                                                        borderRadius: 'var(--radius-lg)',
                                                        padding: 'var(--space-4) var(--space-5)'
                                                    }}
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label
                                                    htmlFor="password"
                                                    className="form-label"
                                                    style={{
                                                        fontWeight: 'var(--font-medium)',
                                                        color: 'var(--color-secondary)',
                                                        fontSize: 'var(--text-sm)'
                                                    }}
                                                >
                                                    Password
                                                </label>
                                                <input
                                                    type="password"
                                                    className="form-control form-control-lg input-premium"
                                                    id="password"
                                                    placeholder="Enter your password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                    minLength={6}
                                                    style={{
                                                        borderRadius: 'var(--radius-lg)',
                                                        padding: 'var(--space-4) var(--space-5)'
                                                    }}
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                className="btn btn-premium btn-premium-primary w-100"
                                                disabled={isLoading}
                                                style={{
                                                    padding: 'var(--space-4)',
                                                    fontSize: 'var(--text-base)',
                                                    fontWeight: 'var(--font-semibold)'
                                                }}
                                            >
                                                {isLoading ? (
                                                    <span className="d-flex align-items-center justify-content-center gap-2">
                                                        <span className="spinner-border spinner-border-sm"></span>
                                                        Signing in...
                                                    </span>
                                                ) : (
                                                    'Sign In'
                                                )}
                                            </button>
                                        </form>

                                        {/* Footer */}
                                        <div className="text-center mt-4">
                                            <p style={{ color: 'var(--color-secondary)' }}>
                                                Don't have an account?{' '}
                                                <Link
                                                    to="/register"
                                                    style={{
                                                        color: 'var(--color-accent)',
                                                        fontWeight: 'var(--font-semibold)',
                                                        textDecoration: 'none'
                                                    }}
                                                >
                                                    Create one
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side - Decorative */}
                                <div
                                    className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center position-relative"
                                    style={{
                                        background: 'var(--color-accent-gradient)',
                                        minHeight: '600px'
                                    }}
                                >
                                    {/* Background Pattern */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            opacity: 0.1,
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                                        }}
                                    />

                                    {/* Content */}
                                    <div className="text-center text-white px-5 position-relative z-1">
                                        <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>
                                            <FaBus style={{ color: 'white' }} />
                                        </div>
                                        <h3 style={{
                                            fontFamily: 'var(--font-display)',
                                            fontWeight: 700,
                                            fontSize: 'var(--text-3xl)',
                                            marginBottom: '1rem'
                                        }}>
                                            Bus Ticket Booking System
                                        </h3>
                                        <p style={{
                                            opacity: 0.85,
                                            fontSize: 'var(--text-lg)',
                                            maxWidth: '350px',
                                            margin: '0 auto'
                                        }}>
                                            Book your tickets easily and travel comfortably to your favorite destinations.
                                        </p>

                                        {/* Stats */}
                                        <div className="d-flex justify-content-center gap-5 mt-5">
                                            <div>
                                                <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}>100+</div>
                                                <div style={{ opacity: 0.7, fontSize: 'var(--text-sm)' }}>Routes</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}>50+</div>
                                                <div style={{ opacity: 0.7, fontSize: 'var(--text-sm)' }}>Buses</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}>10k+</div>
                                                <div style={{ opacity: 0.7, fontSize: 'var(--text-sm)' }}>Users</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
