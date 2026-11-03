import React from 'react';

export const SkipLink: React.FC = () => {
  return (
    <a
      href="/main/"
      className="fixed left-3 top-3 z-[100] bg-[#13261D] text-white px-[18px] py-3 rounded-full text-sm font-medium transition-transform duration-200 -translate-y-[180%] focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[#1F6B45]"
    >
      Skip to content
    </a>
  );
};
