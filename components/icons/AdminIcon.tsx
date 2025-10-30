import React from 'react';

export const AdminIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
    strokeWidth={2}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M9 3.785a2.25 2.25 0 013.267 1.258l.493.984a2.25 2.25 0 001.69 1.258l.984.493a2.25 2.25 0 011.258 3.267l-.493.984a2.25 2.25 0 00-1.258 1.69l-.493.984a2.25 2.25 0 01-3.267 1.258l-.984-.493a2.25 2.25 0 00-1.69-1.258l-.984-.493a2.25 2.25 0 01-1.258-3.267l.493-.984a2.25 2.25 0 001.258-1.69l.493-.984A2.25 2.25 0 019 3.785z" 
    />
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
    />
  </svg>
);
