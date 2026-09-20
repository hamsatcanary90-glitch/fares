import { motion } from 'framer-motion';
import { useMemo } from 'react';

function Hero() {
  const particles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 6 + 2,
        duration: Math.random() * 15 + 10,
        delay: Math.random() * 10,
      })),
    []
  );

  return (
    <section
      id="hero"
      className="animated-green-bg relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle absolute rounded-full bg-saudi-gold/40"
            style={{
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Decorative circles */}
      <motion.div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-saudi-gold/10 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-saudi-green-light/10 blur-3xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.25, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Saudi emblem silhouette (decorative) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.08, scale: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="text-[280px] md:text-[420px] font-display leading-none">س</div>
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-5xl">
        {/* Year badge */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-3 mb-8 px-6 py-3 rounded-full border border-saudi-gold/40 bg-saudi-green-dark/40 backdrop-blur-sm"
        >
          <span className="w-2 h-2 rounded-full bg-saudi-gold animate-pulse" />
          <span className="text-saudi-gold-light font-bold text-sm md:text-base tracking-wider">
            1448 هـ — 2026 م
          </span>
          <span className="w-2 h-2 rounded-full bg-saudi-gold animate-pulse" />
        </motion.div>

        {/* Slogan */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
          className="font-display text-7xl md:text-9xl lg:text-[10rem] font-bold leading-tight text-shadow-gold"
        >
          <span className="gold-shimmer">عزنا بطبعنا</span>
        </motion.h1>

        {/* Divider */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '60%' }}
          transition={{ duration: 1.2, delay: 1 }}
          className="h-[2px] mx-auto my-6 bg-gradient-to-l from-transparent via-saudi-gold to-transparent"
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-2xl md:text-4xl font-bold text-white/90 mb-4"
        >
          اليوم الوطني السعودي 96
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="text-lg md:text-xl text-saudi-sand/80 font-light max-w-2xl mx-auto leading-relaxed"
        >
          نحتفي بطبيعة المملكة العربية السعودية الأصيلة — من قمم الجبال الشامخة إلى امتداد البحار وواحة النخيل الباسقة
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute -bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-saudi-gold/60 text-sm">اكتشف المزيد</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-saudi-gold/40 flex items-start justify-center p-2"
          >
            <div className="w-1 h-2 rounded-full bg-saudi-gold" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
