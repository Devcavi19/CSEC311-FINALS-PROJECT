import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FlashMessage from '../components/FlashMessage';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const validatePassword = (pwd: string): string | null => {
        if (pwd.length < 6) {
            return 'Password must be at least 6 characters.';
        }
        if (/^[A-Za-z]+$/.test(pwd) || /^\d+$/.test(pwd)) {
            return 'Password is too weak. It should contain both letters and numbers.';
        }
        if (/^[A-Za-z0-9]+$/.test(pwd)) {
            return 'Password should contain special characters for more strength.';
        }
        if (!/^[A-Za-z0-9@#$%^&+=]+$/.test(pwd)) {
            return 'Password should contain only letters, numbers, and special characters @#$%^&+=';
        }
        return null;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
            setError('Username contains invalid characters.');
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsLoading(true);

        try {
            await register(username, email, password);
            setSuccess('Account created successfully! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err: any) {
            setError(err.response?.data?.error || 'An error occurred during registration.');
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyle: React.CSSProperties = {
        background: 'var(--color-background)',
        border: '2px solid transparent',
        borderRadius: 'var(--radius-lg)',
        color: 'var(--color-primary)',
        padding: '12px 16px',
        fontSize: '14px',
        width: '100%',
        outline: 'none',
        transition: 'all 0.2s ease',
    };

    const inputFocusHandler = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.style.borderColor = 'var(--color-accent)';
        e.target.style.boxShadow = '0 0 0 4px rgba(13, 71, 161, 0.1)';
    };

    const inputBlurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.style.borderColor = 'transparent';
        e.target.style.boxShadow = 'none';
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--color-background)',
            padding: '20px',
        }}>
            <div style={{
                display: 'flex',
                maxWidth: '800px',
                width: '100%',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                background: 'var(--color-surface)',
            }}>
                {/* Left Image Section */}
                <div
                    className="d-none d-lg-flex"
                    style={{
                        flex: '1',
                        backgroundImage: 'url("/bus_create.jpg")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                        minHeight: '480px',
                        display: 'flex',
                        alignItems: 'flex-end',
                    }}
                >
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
                    }} />
                    <div style={{
                        position: 'relative',
                        zIndex: 1,
                        padding: '24px',
                    }}>
                        <h3 style={{
                            fontSize: '20px',
                            fontWeight: '600',
                            marginBottom: '4px',
                            color: '#FFFFFF',
                            textShadow: '0 2px 8px rgba(0,0,0,0.8)'
                        }}>
                            Start Your Journey
                        </h3>
                        <p style={{
                            fontSize: '13px',
                            margin: 0,
                            color: 'rgba(255,255,255,0.9)',
                            textShadow: '0 1px 4px rgba(0,0,0,0.6)'
                        }}>
                            Book your bus tickets seamlessly and travel with comfort.
                        </p>
                    </div>
                </div>

                {/* Right Form Section */}
                <div style={{
                    flex: '1',
                    padding: '32px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: 'var(--color-primary)',
                        marginBottom: '8px',
                    }}>
                        Create an account
                    </h2>
                    <p style={{
                        color: 'var(--color-secondary)',
                        marginBottom: '24px',
                        fontSize: '14px',
                    }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: '500' }}>
                            Log in
                        </Link>
                    </p>

                    {error && (
                        <FlashMessage message={error} type="danger" onClose={() => setError('')} />
                    )}
                    {success && (
                        <FlashMessage message={success} type="success" autoHide={false} />
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '14px' }}>
                            <input
                                type="text"
                                style={inputStyle}
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onFocus={inputFocusHandler}
                                onBlur={inputBlurHandler}
                                required
                                minLength={4}
                                maxLength={25}
                            />
                        </div>

                        <div style={{ marginBottom: '14px' }}>
                            <input
                                type="email"
                                style={inputStyle}
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={inputFocusHandler}
                                onBlur={inputBlurHandler}
                                required
                            />
                        </div>

                        <div style={{ marginBottom: '6px', position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                style={{ ...inputStyle, paddingRight: '40px' }}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={inputFocusHandler}
                                onBlur={inputBlurHandler}
                                required
                                minLength={6}
                                maxLength={25}
                            />
                            <button
                                type="button"
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--color-secondary)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 0,
                                }}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                            </button>
                        </div>
                        <p style={{ color: 'var(--color-secondary)', fontSize: '11px', marginBottom: '14px' }}>
                            Must contain letters, numbers, and special characters
                        </p>

                        <div style={{ marginBottom: '20px', position: 'relative' }}>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                style={{ ...inputStyle, paddingRight: '40px' }}
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onFocus={inputFocusHandler}
                                onBlur={inputBlurHandler}
                                required
                            />
                            <button
                                type="button"
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--color-secondary)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 0,
                                }}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: 'var(--color-accent-gradient)',
                                border: 'none',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '15px',
                                fontWeight: '600',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                opacity: isLoading ? 0.7 : 1,
                                transition: 'all 0.2s ease',
                            }}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Creating account...
                                </>
                            ) : (
                                'Create account'
                            )}
                        </button>
                    </form>

                    <p style={{
                        textAlign: 'center',
                        marginTop: '20px',
                        color: 'var(--color-secondary)',
                        fontSize: '13px',
                    }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: '500' }}>
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
