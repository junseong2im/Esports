import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium',
  color = '#1da1f2'
}) => {
  const sizeMap = {
    small: '16px',
    medium: '24px',
    large: '32px'
  };

  const spinnerSize = sizeMap[size];

  return (
    <div
      style={{
        display: 'inline-block',
        width: spinnerSize,
        height: spinnerSize,
        border: `2px solid ${color}`,
        borderRadius: '50%',
        borderTopColor: 'transparent',
        animation: 'spin 0.8s linear infinite',
      }}
    />
  );
};

export default LoadingSpinner; 