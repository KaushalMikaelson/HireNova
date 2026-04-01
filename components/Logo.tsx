import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center gap-2.5 cursor-pointer group">
      {/* Modern Star/Nova SVG Icon */}
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-md transition-all duration-300 group-hover:shadow-purple-500/40 group-hover:scale-105">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="white" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="w-5 h-5 relative z-10 transition-transform duration-500 group-hover:rotate-180"
        >
          <path d="M12 2v20" />
          <path d="M2 12h20" />
          <path d="m4.93 4.93 14.14 14.14" />
          <path d="m4.93 19.07 14.14-14.14" />
        </svg>
      </div>

      {/* Clean Typography */}
      <div className="flex items-baseline tracking-tight">
        <span className="text-2xl font-extrabold text-foreground transition-colors group-hover:text-purple-400">
          Hire
        </span>
        <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
          Nova
        </span>
      </div>
    </div>
  );
};

export default Logo;
