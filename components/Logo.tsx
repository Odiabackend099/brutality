import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon';
}

export default function Logo({ 
  className = '', 
  showText = true, 
  size = 'md',
  variant = 'full'
}: LogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  if (variant === 'icon') {
    return (
      <div className={`flex items-center ${className}`}>
        <svg 
          className={sizeClasses[size]} 
          viewBox="0 0 64 64" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="phoneGradientIcon" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor:'#8B5CF6',stopOpacity:1}} />
              <stop offset="50%" style={{stopColor:'#3B82F6',stopOpacity:1}} />
              <stop offset="100%" style={{stopColor:'#10B981',stopOpacity:1}} />
            </linearGradient>
            <pattern id="circuitPatternIcon" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
              <circle cx="4" cy="4" r="0.5" fill="#60A5FA" opacity="0.6"/>
              <path d="M4,2 L6,4 M4,6 L2,4 M6,4 L8,4 M2,4 L0,4" stroke="#60A5FA" strokeWidth="0.3" fill="none"/>
            </pattern>
          </defs>
          
          <circle cx="32" cy="32" r="30" fill="#1E293B" stroke="#334155" strokeWidth="2"/>
          <path d="M20,20 Q20,12 28,12 Q36,12 36,20 Q36,28 28,28 Q20,28 20,20 Z M24,16 Q28,16 28,20 Q28,24 24,24 Q20,24 20,20 Q20,16 24,16 Z" 
                fill="url(#phoneGradientIcon)" 
                stroke="none"/>
          <path d="M24,16 Q28,16 28,20 Q28,24 24,24 Q20,24 20,20 Q20,16 24,16 Z" 
                fill="url(#circuitPatternIcon)" 
                opacity="0.8"/>
          <g stroke="#60A5FA" strokeWidth="1.5" fill="none" opacity="0.7">
            <line x1="36" y1="20" x2="44" y2="16"/>
            <line x1="36" y1="24" x2="44" y2="28"/>
            <circle cx="44" cy="16" r="1" fill="#60A5FA"/>
            <circle cx="44" cy="28" r="1" fill="#60A5FA"/>
            <line x1="44" y1="16" x2="48" y2="14"/>
            <line x1="44" y1="28" x2="48" y2="30"/>
          </g>
        </svg>
        {showText && (
          <span className={`ml-2 font-bold ${textSizeClasses[size]} text-white`}>
            CallWaiting AI
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      <svg 
        className={sizeClasses[size]} 
        viewBox="0 0 200 60" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="phoneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:'#8B5CF6',stopOpacity:1}} />
            <stop offset="50%" style={{stopColor:'#3B82F6',stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:'#10B981',stopOpacity:1}} />
          </linearGradient>
          <pattern id="circuitPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1" fill="#60A5FA" opacity="0.6"/>
            <path d="M10,5 L15,10 M10,15 L5,10 M15,10 L20,10 M5,10 L0,10" stroke="#60A5FA" strokeWidth="0.5" fill="none"/>
          </pattern>
        </defs>
        
        <path d="M15,15 Q15,5 25,5 Q35,5 35,15 Q35,25 25,25 Q15,25 15,15 Z M20,10 Q25,10 25,15 Q25,20 20,20 Q15,20 15,15 Q15,10 20,10 Z" 
              fill="url(#phoneGradient)" 
              stroke="none"/>
        <path d="M20,10 Q25,10 25,15 Q25,20 20,20 Q15,20 15,15 Q15,10 20,10 Z" 
              fill="url(#circuitPattern)" 
              opacity="0.8"/>
        <g stroke="#60A5FA" strokeWidth="1" fill="none" opacity="0.7">
          <line x1="35" y1="15" x2="45" y2="10"/>
          <line x1="35" y1="20" x2="45" y2="25"/>
          <circle cx="45" cy="10" r="1.5" fill="#60A5FA"/>
          <circle cx="45" cy="25" r="1.5" fill="#60A5FA"/>
          <line x1="45" y1="10" x2="50" y2="8"/>
          <line x1="45" y1="25" x2="50" y2="27"/>
        </g>
        
        <text x="50" y="25" fontFamily="Inter, -apple-system, BlinkMacSystemFont, sans-serif" fontSize="18" fontWeight="700" fill="#1E40AF">
          CallWaiting
        </text>
        <text x="50" y="45" fontFamily="Inter, -apple-system, BlinkMacSystemFont, sans-serif" fontSize="18" fontWeight="700" fill="#10B981">
          AI
        </text>
      </svg>
    </div>
  );
}
