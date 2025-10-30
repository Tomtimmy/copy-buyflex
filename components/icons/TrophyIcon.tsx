import React from 'react';

export const TrophyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18V8a4 4 0 018 0v2M5 10a4 4 0 018 0v2m-3-4a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2zM9 11h6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 21V9a2 2 0 00-2-2h-2a2 2 0 00-2 2v12m4 0h-4m4 0H9m6 0H9" />
        <path d="M12 6V5a2 2 0 114 0v1h-4z" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
);
// A simplified trophy icon
export const SimpleTrophyIcon: React.FC<{ className?: string }> = ({ className }) => (
<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9 9 0 119 0z" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 10.5h.008v.008h-.008v-.008zM6.75 10.5h.008v.008h-.008v-.008z" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 15.75l1.5 1.5 1.5-1.5" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 21h6v-4.5H9v4.5zM12 3v2m0 16v-2m-6.75-10.5a.75.75 0 01.75-.75h12a.75.75 0 01.75.75v3a.75.75 0 01-.75.75h-12a.75.75 0 01-.75-.75v-3z" />
</svg>
);