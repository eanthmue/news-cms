import React from 'react';

interface SampleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export function SampleButton({ children, onClick }: SampleButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
    >
      {children}
    </button>
  );
}
