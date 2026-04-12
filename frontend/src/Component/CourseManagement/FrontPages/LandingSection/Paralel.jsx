import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import vd1 from '../../../../assets/vd1.mp4';

// Splits text into individually animated characters
function SplitText({ text, style, className, delay = 0, stagger = 0.03 }) {
  const words = text.split(' ');
  return (
    <motion.span style={style} className={className}>
      {words.map((word, wi) => (
        <span key={wi} style={{ display: 'inline-block', overflow: 'hidden', marginRight: '0.25em' }}>
          {word.split('').map((char, ci) => (
            <motion.span
              key={ci}
              style={{ display: 'inline-block' }}
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{
                duration: 0.7,
                delay: delay + wi * 0.08 + ci * stagger,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.span>
  );
}

// Floating particle that drifts and fades
function Particle({ x, y, size, duration, delay, color }) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        filter: 'blur(1px)',
        pointerEvents: 'none',
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.6, 0],
        scale: [0, 1, 0.5],
        y: [0, -80 - Math.random() * 60],
        x: [0, (Math.random() - 0.5) * 60],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 3,
        ease: 'easeOut',
      }}
    />
  );
}

// Ambient particles layer
function AmbientParticles({ visible }) {
  const particles = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    x: `${5 + Math.random() * 90}%`,
    y: `${20 + Math.random() * 70}%`,
    size: 2 + Math.random() * 4,
    duration: 3 + Math.random() * 4,
    delay: Math.random() * 5,
    color: i % 3 === 0 ? 'rgba(255,255,255,0.7)' : i % 3 === 1 ? 'rgba(180,180,255,0.5)' : 'rgba(255,220,150,0.5)',
  }));

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 15 }}
        >
          {particles.map(p => <Particle key={p.id} {...p} />)}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Glowing horizontal line that sweeps across
function ScanLine({ progress }) {
  const y = useTransform(progress, [0.14, 0.25], ['110%', '-10%']);
  const opacity = useTransform(progress, [0.14, 0.18, 0.22, 0.25], [0, 1, 1, 0]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: y,
        height: '1px',
        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 30%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.8) 70%, transparent 100%)',
        boxShadow: '0 0 20px 4px rgba(255,255,255,0.3)',
        zIndex: 25,
        opacity,
        pointerEvents: 'none',
      }}
    />
  );
}

// Vignette overlay with scroll-reactive color
function ChromaticVignette({ progress }) {
  const hue = useTransform(progress, [0, 0.5, 1], [220, 280, 200]);
  const vigOpacity = useTransform(progress, [0, 0.1, 0.9, 1], [0, 0.4, 0.4, 0]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 5,
        pointerEvents: 'none',
        opacity: vigOpacity,
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)',
      }}
    />
  );
}

// Word-by-word reveal for large headline
function KineticHeadline({ text, highlighted, style, visible }) {
  const words = text.split(' ');
  return (
    <motion.div style={style}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          style={{ display: 'inline-block', marginRight: '0.2em' }}
          initial={{ opacity: 0, filter: 'blur(12px)', y: 30 }}
          animate={visible ? { opacity: 1, filter: 'blur(0px)', y: 0 } : { opacity: 0, filter: 'blur(12px)', y: 30 }}
          transition={{ duration: 0.9, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
        >
          {word}
        </motion.span>
      ))}
      {highlighted && (
        <motion.span
          style={{ display: 'inline-block', color: 'rgb(115,115,115)' }}
          initial={{ opacity: 0, filter: 'blur(12px)', y: 30 }}
          animate={visible ? { opacity: 1, filter: 'blur(0px)', y: 0 } : { opacity: 0, filter: 'blur(12px)', y: 30 }}
          transition={{ duration: 0.9, delay: words.length * 0.12, ease: [0.16, 1, 0.3, 1] }}
        >
          {highlighted}
        </motion.span>
      )}
    </motion.div>
  );
}

function AppleHero() {
  const containerRef = useRef(null);
  const [showParticles, setShowParticles] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [subVisible, setSubVisible] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 30,
    damping: 20,
    restDelta: 0.001,
  });

  // --- Video Reveal ---
  const videoScale = useTransform(smoothProgress, [0, 0.2], [0.78, 1]);
  const videoRadius = useTransform(smoothProgress, [0, 0.15], ['44px', '0px']);
  const videoBlur = useTransform(smoothProgress, [0.85, 1], [0, 8]);

  // --- Scan line lives in SEQUENCE 2 ---
  // (used in ScanLine component above)

  // --- Title ---
  const titleOpacity = useTransform(smoothProgress, [0.15, 0.22, 0.35, 0.44], [0, 1, 1, 0]);
  const titleScale = useTransform(smoothProgress, [0.15, 0.25], [0.92, 1]);
  const titleLetterSpacing = useTransform(smoothProgress, [0.15, 0.26], ['0.15em', '-0.02em']);

  // --- Sub text ---
  const subTextOpacity = useTransform(smoothProgress, [0.45, 0.54, 0.7, 0.8], [0, 1, 1, 0]);
  const subTextY = useTransform(smoothProgress, [0.45, 0.55], [50, 0]);

  // --- CTA ---
  const ctaOpacity = useTransform(smoothProgress, [0.8, 0.9], [0, 1]);
  const ctaScale = useTransform(smoothProgress, [0.8, 0.9], [0.85, 1]);
  const ctaBlur = useTransform(smoothProgress, [0.8, 0.9], [16, 0]);

  // --- Final fade ---
  const finalFade = useTransform(smoothProgress, [0.9, 1], [0, 1]);

  // --- Scroll-reactive color bleed on video ---
  const colorBleedOpacity = useTransform(smoothProgress, [0.3, 0.5, 0.7, 0.85], [0, 0.15, 0.2, 0]);

  // Sync visibility states for character animation triggers
  useEffect(() => {
    const unsubscribe = smoothProgress.on('change', v => {
      setTitleVisible(v > 0.17 && v < 0.43);
      setSubVisible(v > 0.47 && v < 0.78);
      setShowParticles(v > 0.18 && v < 0.42);
    });
    return unsubscribe;
  }, [smoothProgress]);

  return (
    <div className="bg-black">
      <section ref={containerRef} className="relative h-[1000vh] w-full">
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">

          {/* BACKGROUND VIDEO */}
          <motion.div
            style={{
              scale: videoScale,
              borderRadius: videoRadius,
              filter: useTransform(videoBlur, v => `blur(${v}px)`),
            }}
            className="absolute inset-0 z-0 overflow-hidden bg-zinc-900"
          >
            <video autoPlay loop muted playsInline className="w-full h-full object-cover">
              <source src={vd1} type="video/mp4" />
            </video>

            {/* OLED vignette */}
            <div className="absolute inset-0 bg-black/25" />

            {/* Chromatic color bleed (scroll-reactive purple-blue tint) */}
            <motion.div
              style={{ opacity: colorBleedOpacity }}
              className="absolute inset-0"
              css={{ background: 'radial-gradient(ellipse at 60% 40%, rgba(120,80,255,0.5) 0%, transparent 70%)' }}
            />
          </motion.div>

          {/* CHROMATIC VIGNETTE */}
          <ChromaticVignette progress={smoothProgress} />

          {/* SCAN LINE */}
          <ScanLine progress={smoothProgress} />

          {/* AMBIENT PARTICLES */}
          <AmbientParticles visible={showParticles} />

          {/* STAGE 1: KINETIC TITLE */}
          <motion.div
            style={{ opacity: titleOpacity, scale: titleScale }}
            className="relative z-10 text-center px-6 select-none"
          >
            <KineticHeadline
              text="FLOBIT"
              highlighted=" ULTRA."
              visible={titleVisible}
              style={{
                fontSize: 'clamp(4rem, 12vw, 11rem)',
                fontWeight: 700,
                color: 'white',
                lineHeight: 1,
                letterSpacing: '-0.02em',
                display: 'block',
              }}
            />

            {/* Animated underline */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={titleVisible ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                marginTop: '1rem',
                transformOrigin: 'center',
              }}
            />

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={titleVisible ? { opacity: 0.5, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              style={{
                color: 'white',
                fontSize: 'clamp(0.75rem, 1.5vw, 1rem)',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                marginTop: '1.5rem',
                fontWeight: 400,
              }}
            >
              The next dimension of performance
            </motion.p>
          </motion.div>

          {/* STAGE 2: FEATURE DESCRIPTION — blur-in word by word */}
          <motion.div
            style={{ opacity: subTextOpacity, y: subTextY }}
            className="absolute z-20 text-center px-10 max-w-5xl select-none"
          >
            <motion.h2
              className="font-bold text-white tracking-tight leading-tight"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
            >
              {subVisible && (
                <>
                  <SplitText
                    text="Aerospace-grade speed."
                    delay={0}
                    stagger={0.025}
                    style={{ display: 'block' }}
                  />
                  <br />
                  <SplitText
                    text="Beyond your imagination."
                    delay={0.4}
                    stagger={0.025}
                    style={{ display: 'block', color: 'rgb(115,115,115)' }}
                  />
                </>
              )}
            </motion.h2>

            {/* Decorative side lines */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={subVisible ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              style={{
                position: 'absolute',
                left: '1.5rem',
                top: '10%',
                bottom: '10%',
                width: '1px',
                background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.3), transparent)',
                transformOrigin: 'top',
              }}
            />
            <motion.div
              initial={{ scaleY: 0 }}
              animate={subVisible ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 1.2, delay: 0.5 }}
              style={{
                position: 'absolute',
                right: '1.5rem',
                top: '10%',
                bottom: '10%',
                width: '1px',
                background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.3), transparent)',
                transformOrigin: 'top',
              }}
            />
          </motion.div>

          {/* STAGE 3: CTA — blurs in with scale */}
          <motion.div
            style={{
              opacity: ctaOpacity,
              scale: ctaScale,
              filter: useTransform(ctaBlur, v => `blur(${v}px)`),
            }}
            className="absolute z-30 flex flex-col items-center gap-8"
          >
            <motion.h3
              className="text-white font-medium text-center"
              style={{ fontSize: 'clamp(1.25rem, 3vw, 2.25rem)', letterSpacing: '-0.01em' }}
            >
              Ready to build?
            </motion.h3>

            {/* Button with shimmer */}
            <div style={{ position: 'relative' }}>
              <motion.button
                className="font-bold text-black rounded-full shadow-2xl"
                style={{
                  padding: '1.25rem 3.5rem',
                  fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
                  background: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                Get Started
                {/* Shimmer overlay */}
                <motion.div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.6) 50%, transparent 70%)',
                    backgroundSize: '200% 100%',
                  }}
                  animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5, ease: 'linear' }}
                />
              </motion.button>

              {/* Ghost button */}
              <motion.button
                className="rounded-full font-medium"
                style={{
                  position: 'absolute',
                  left: '110%',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  whiteSpace: 'nowrap',
                  padding: '1rem 2rem',
                  fontSize: 'clamp(0.85rem, 1.2vw, 1rem)',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.25)',
                  color: 'rgba(255,255,255,0.8)',
                  cursor: 'pointer',
                  marginLeft: '1rem',
                }}
                whileHover={{ borderColor: 'rgba(255,255,255,0.6)', color: 'white' }}
                transition={{ duration: 0.2 }}
              >
                Learn more
              </motion.button>
            </div>
          </motion.div>

          {/* FINAL FADE TO BLACK */}
          <motion.div
            style={{ opacity: finalFade }}
            className="absolute inset-0 bg-black z-40 pointer-events-none"
          />
        </div>
      </section>

      {/* END SECTION */}
      <section className="h-screen bg-black flex flex-col items-center justify-center gap-6">
        <motion.p
          className="text-zinc-600 tracking-[0.3em] uppercase text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          Fin.
        </motion.p>
      </section>
    </div>
  );
}

export default AppleHero;