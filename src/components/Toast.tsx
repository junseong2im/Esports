import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getBackgroundColor = () => {
    switch (type) {
      case 'success': return 'rgba(0, 200, 81, 0.9)';
      case 'error': return 'rgba(255, 68, 68, 0.9)';
      case 'warning': return 'rgba(255, 187, 51, 0.9)';
      default: return 'rgba(29, 161, 242, 0.9)';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: `translate(-50%, ${isVisible ? '0' : '100px'})`,
        backgroundColor: getBackgroundColor(),
        color: '#ffffff',
        padding: '12px 24px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.3s ease',
        zIndex: 9999,
        maxWidth: '90%',
        textAlign: 'center',
        fontSize: '0.9rem',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      {message}
    </div>
  );
};

export default Toast; 