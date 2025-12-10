import React, { useEffect, useState } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    window.addEventListener('mousemove', updatePosition);
    
    // Add event listeners for hoverable elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('.cursor-pointer') ||
        target.closest('[role="button"]')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Main Dot */}
      <div 
        className="fixed top-0 left-0 w-2 h-2 bg-cyan-400 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          transform: `translate(${position.x - 4}px, ${position.y - 4}px)`,
          transition: 'transform 0.05s linear'
        }}
      />
      {/* Trailing Ring */}
      <div 
        className={`fixed top-0 left-0 border border-cyan-400/50 rounded-full pointer-events-none z-[9998] transition-all duration-300 ease-out mix-blend-difference
          ${isHovering ? 'w-12 h-12 border-2 bg-cyan-400/10' : 'w-8 h-8'}
        `}
        style={{
          transform: `translate(${position.x - (isHovering ? 24 : 16)}px, ${position.y - (isHovering ? 24 : 16)}px)`,
        }}
      />
    </>
  );
};

export default CustomCursor;
