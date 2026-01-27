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

                                {/* Right Side - Image */}
                                <div
                                    className="col-lg-6 d-none d-lg-flex align-items-end position-relative"
                                    style={{
                                        backgroundImage: 'url("/bus_log.jpg")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        minHeight: '600px'
                                    }}
                                >
                                    {/* Gradient Overlay */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, transparent 100%)',
                                        }}
                                    />

                                    {/* Content */}
                                    <div className="text-white p-5 position-relative z-1" style={{ width: '100%' }}>
                                        <h3 style={{
                                            fontFamily: 'var(--font-display)',
                                            fontWeight: 700,
                                            fontSize: 'var(--text-2xl)',
                                            marginBottom: '0.5rem'
                                        }}>
                                            Welcome Back
                                        </h3>
                                        <p style={{
                                            opacity: 0.85,
                                            fontSize: 'var(--text-base)',
                                            margin: 0
                                        }}>
                                            Sign in to continue your journey with us.
                                        </p>
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
