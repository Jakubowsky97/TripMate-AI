import React, { ReactNode } from 'react';

interface ButtonProps {
  variant?: 'ghost' | 'solid' | 'themeMain' | 'themeSecondary' | 'themeMainWhite' | 'dakrModeMain' | 'next' | 'outline'; 
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'solid', children, className, ...props }) => {
  const baseStyles = 'px-6 py-3 text-lg font-semibold rounded-3xl focus:outline-none transition duration-200';

  const variants = {
    ghost: 'bg-transparent text-[#FFB86F] border border-gray-900 hover:text-white',
    solid: 'bg-gray-900 text-white hover:bg-gray-700',
    themeMain: 'bg-[#142F32] text-[#E3FFCC]',
    themeMainWhite: 'bg-[#142F32] text-[#f8f8f8]',
    themeSecondary: 'bg-[#E3FFCC] text-[#142F32]',
    dakrModeMain: 'bg-[#1a1e1f] text-[#f8f8f8]',
    next: 'bg-[#007bff] text-white hover:bg-[#0056b3]',
    outline: 'bg-transparent border border-current text-current hover:bg-gray-100 dark:hover:bg-gray-800'
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
