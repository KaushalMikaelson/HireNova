import React from 'react';
import Image from 'next/image';

const Logo = () => {
  return (
    <div className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105">
      <Image 
        src="/logo1.png" 
        alt="HireNova Logo" 
        width={150} 
        height={40} 
        className="object-contain h-10 w-auto"
        priority
      />
    </div>
  );
};

export default Logo;
