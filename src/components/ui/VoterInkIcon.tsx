import React from 'react';

export const VoterInkIcon = ({ size = 100 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.1))" }}
  >
    {/* Finger Shape */}
    <path 
      d="M35 85 C 35 90, 65 90, 65 85 L 65 35 C 65 15, 35 15, 35 35 Z" 
      fill="#FDE6D2" 
      stroke="#E5C7B0" 
      strokeWidth="1"
    />
    {/* Nail */}
    <path 
      d="M40 30 C 40 22, 60 22, 60 30 L 60 45 C 60 50, 40 50, 40 45 Z" 
      fill="#FFF4EB" 
      stroke="#E5C7B0" 
      strokeWidth="0.5"
    />
    {/* Indelible Ink Mark (The vertical purple line) */}
    <rect 
      x="47" 
      y="22" 
      width="6" 
      height="28" 
      rx="1" 
      fill="#4B0082" 
      className="animate-pulse"
    />
    {/* Ink splatter detail */}
    <circle cx="50" cy="52" r="1.5" fill="#4B0082" opacity="0.6" />
    <circle cx="54" cy="55" r="1" fill="#4B0082" opacity="0.4" />
  </svg>
);
