import React from 'react';

interface CardProps {
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={`bg-white shadow rounded-lg ${className}`}>
      <div className="px-4 py-5 sm:p-6">{children}</div>
    </div>
  );
};

export default Card;