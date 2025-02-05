import React, { ReactNode } from 'react';

interface ButtonProps {
  variant?: 'ghost' | 'solid'; 
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'solid', children, className, ...props }) => {
  const baseStyles = 'px-6 py-3 text-lg font-semibold rounded-md focus:outline-none transition duration-200';

  const variants = {
    ghost: 'bg-transparent text-gray-900 border border-gray-900 hover:bg-gray-900 hover:text-white',
    solid: 'bg-gray-900 text-white hover:bg-gray-700',
  };

  return (
    <button
      {...props}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
