import React from 'react';
export function Mascot({ className = '' }: {className?: string;}) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}>
      
      <path
        d="M24 34C29.5228 34 34 29.5228 34 24V14C34 10.6863 31.3137 8 28 8H20C16.6863 8 14 10.6863 14 14V24C14 29.5228 18.4772 34 24 34Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round" />
      
      <path
        d="M24 34V42"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round" />
      
      <circle cx="24" cy="42" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M18 14V18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round" />
      
      <path
        d="M30 14V18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round" />
      
    </svg>);

}