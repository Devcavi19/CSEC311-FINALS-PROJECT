import { useState, useEffect } from 'react';

interface FlashMessageProps {
    message: string;
    type: 'success' | 'danger' | 'warning' | 'info';
    onClose?: () => void;
    autoHide?: boolean;
    duration?: number;
}

const FlashMessage = ({
    message,
    type,
    onClose,
    autoHide = true,
    duration = 5000
}: FlashMessageProps) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (autoHide) {
            const timer = setTimeout(() => {
                setVisible(false);
                onClose?.();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [autoHide, duration, onClose]);

    if (!visible) return null;

    return (
        <div className={`alert alert-${type} alert-dismissible fade show`} role="alert">
            {message}
            <button
                type="button"
                className="btn-close"
                onClick={() => {
                    setVisible(false);
                    onClose?.();
                }}
            ></button>
        </div>
    );
};

export default FlashMessage;
