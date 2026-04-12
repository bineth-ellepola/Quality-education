import React, { useState, useEffect, useRef } from 'react';
import img1 from '../../../../assets/nw15.jpg';

function Pencil() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const parallaxX = mousePos.x * 12;
  const parallaxY = mousePos.y * 8;
  const tiltX = mousePos.y * -6;
  const tiltY = mousePos.x * 6;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-black font-sans antialiased text-white"
      style={{ perspective: '1200px' }}
    >

      {/* Background Image — subtle 3D parallax */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          transform: `scale(1.08) translate(${mousePos.x * -8}px, ${mousePos.y * -6}px)`,
          transition: 'transform 0.12s ease-out',
          willChange: 'transform',
        }}
      >
        <img
          src={img1}
          alt="Apple Pencil Pro"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-start justify-center h-full px-12 md:px-24 lg:px-32 max-w-[1400px]">

        {/* Main Headline — 3D tilt + staggered entrance */}
        <div
          style={{
            transformStyle: 'preserve-3d',
            transform: mounted
              ? `rotateX(${tiltX * 0.4}deg) rotateY(${tiltY * 0.3}deg) translate(${parallaxX * 0.3}px, ${parallaxY * 0.3}px)`
              : 'rotateX(20deg) rotateY(-10deg) translateZ(-60px)',
            transition: mounted
              ? 'transform 0.15s ease-out'
              : 'transform 1s cubic-bezier(0.23, 1, 0.32, 1)',
            willChange: 'transform',
          }}
        >
          {['Upgrade your Creativity.', 'Engineered', 'limitless', 'creativity.'].map((line, i) => (
            <div
              key={i}
              style={{
                overflow: 'hidden',
              }}
            >
              <h1
                className="text-6xl md:text-8xl font-semibold leading-[1.05] tracking-tight select-none"
                style={{
                  display: 'block',
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0) translateZ(0)' : 'translateY(60px) translateZ(-30px)',
                  transition: `opacity 0.7s ease ${0.2 + i * 0.12}s, transform 0.9s cubic-bezier(0.23, 1, 0.32, 1) ${0.2 + i * 0.12}s`,
                  willChange: 'transform, opacity',
                  textShadow: `${mousePos.x * -4}px ${mousePos.y * -4}px 20px rgba(0,0,0,0.4)`,
                }}
              >
                {line}
              </h1>
            </div>
          ))}
        </div>

        {/* Bottom Action Area */}
        <div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0) translateZ(0)' : 'translateY(40px) translateZ(-20px)',
            transition: 'opacity 0.8s ease 0.9s, transform 0.9s cubic-bezier(0.23, 1, 0.32, 1) 0.9s',
            willChange: 'transform, opacity',
            transformStyle: 'preserve-3d',
          }}
        >

          {/* Expandable Menu — 3D flip in */}
          <div
            className={`flex items-center gap-3 p-2 bg-[#1d1d1f]/80 backdrop-blur-2xl border border-white/10 rounded-full`}
            style={{
              opacity: isOpen ? 1 : 0,
              pointerEvents: isOpen ? 'auto' : 'none',
              transform: isOpen
                ? 'translateY(0) rotateX(0deg) scale(1)'
                : 'translateY(16px) rotateX(-25deg) scale(0.92)',
              transformOrigin: 'bottom center',
              transition: 'opacity 0.4s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transformStyle: 'preserve-3d',
            }}
          >
            <button className="px-5 py-2 text-sm font-medium hover:bg-white/10 rounded-full transition-colors"
              style={{ transition: 'transform 0.2s ease, background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateZ(4px) scale(1.04)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateZ(0) scale(1)'}
            >
              Self Practice
            </button>
            <div className="w-[1px] h-4 bg-white/20"></div>
            <button className="px-5 py-2 text-sm font-medium hover:bg-white/10 rounded-full transition-colors"
              style={{ transition: 'transform 0.2s ease, background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateZ(4px) scale(1.04)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateZ(0) scale(1)'}
            >
              Browse Courses
            </button>
          </div>

          {/* Main Toggle Button — 3D hover lift */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-3 px-6 py-4 bg-[#1d1d1f]/80 backdrop-blur-xl border border-white/10 rounded-full hover:bg-[#2d2d2f] group"
            style={{
              transition: 'background 0.3s, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s',
              transformStyle: 'preserve-3d',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px) translateZ(12px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.5)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0) translateZ(0) scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            onMouseDown={e => {
              e.currentTarget.style.transform = 'translateY(-1px) translateZ(4px) scale(0.98)';
            }}
            onMouseUp={e => {
              e.currentTarget.style.transform = 'translateY(-4px) translateZ(12px) scale(1.02)';
            }}
          >
            <span className="text-lg font-normal tracking-wide">
              {isOpen ? 'Close menu' : 'View Apple Pencil Pro in action'}
            </span>
            <div
              className="flex items-center justify-center w-6 h-6 bg-[#0071e3] rounded-full"
              style={{
                transform: isOpen ? 'rotate(45deg) translateZ(4px)' : 'rotate(0deg) translateZ(0)',
                transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              <span className="text-white text-xl leading-none mb-0.5">+</span>
            </div>
          </button>
        </div>

      </div>

      {/* Bottom Shadow Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>

    </div>
  );
}

export default Pencil;