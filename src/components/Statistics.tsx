import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { Mountain, Sun, Waves, TreePalm, BarChart3 } from 'lucide-react';

type Stat = {
  label: string;
  percentage: number;
  icon: typeof Mountain;
  gradient: string;
  iconColor: string;
  barGradient: string;
};

const STATS: Stat[] = [
  {
    label: 'الصحراء',
    percentage: 60,
    icon: Sun,
    gradient: 'from-amber-600 to-amber-800',
    iconColor: 'text-saudi-sand',
    barGradient: 'from-amber-400 to-amber-600',
  },
  {
    label: 'الجبال',
    percentage: 20,
    icon: Mountain,
    gradient: 'from-emerald-600 to-emerald-800',
    iconColor: 'text-saudi-gold-light',
    barGradient: 'from-emerald-400 to-emerald-600',
  },
  {
    label: 'البحار والسواحل',
    percentage: 10,
    icon: Waves,
    gradient: 'from-cyan-600 to-blue-800',
    iconColor: 'text-blue-300',
    barGradient: 'from-cyan-400 to-blue-500',
  },
  {
    label: 'واحات النخيل',
    percentage: 10,
    icon: TreePalm,
    gradient: 'from-saudi-green to-saudi-green-deep',
    iconColor: 'text-saudi-gold-light',
    barGradient: 'from-saudi-green-light to-saudi-green',
  },
];

function AnimatedBar({ stat, index, inView }: { stat: Stat; index: number; inView: boolean }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => `${Math.round(v)}%`);
  const [displayValue, setDisplayValue] = useState('0%');

  useEffect(() => {
    const unsub = rounded.on('change', (v) => setDisplayValue(v));
    return () => unsub();
  }, [rounded]);

  useEffect(() => {
    if (inView) {
      const controls = animate(count, stat.percentage, {
        duration: 2,
        delay: index * 0.3,
        ease: 'easeOut',
      });
      return controls.stop;
    }
  }, [inView, count, stat.percentage, index]);

  return (
    <div className="flex items-center gap-4 md:gap-6">
      {/* Icon badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.2, type: 'spring', stiffness: 200 }}
        className={`flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg border border-white/10`}
      >
        <stat.icon className={`w-7 h-7 md:w-8 md:h-8 ${stat.iconColor}`} />
      </motion.div>

      {/* Bar area */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            className="text-white font-bold text-lg md:text-xl"
          >
            {stat.label}
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 + 0.5 }}
            className="font-display font-bold text-2xl md:text-3xl text-saudi-gold-light tabular-nums"
          >
            {displayValue}
          </motion.span>
        </div>

        {/* Bar track */}
        <div className="relative h-4 md:h-5 bg-saudi-green-deep/60 rounded-full overflow-hidden border border-white/5">
          {/* Shimmer track bg */}
          <div className="absolute inset-0 bg-gradient-to-l from-white/5 to-transparent" />
          <motion.div
            className={`absolute top-0 right-0 h-full bg-gradient-to-l ${stat.barGradient} rounded-full`}
            initial={{ width: 0 }}
            whileInView={{ width: `${stat.percentage}%` }}
            viewport={{ once: true }}
            transition={{ duration: 2, delay: index * 0.3, ease: 'easeOut' }}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-l from-transparent via-white/30 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, delay: index * 0.3 + 2 }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Statistics() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section id="stats" className="relative bg-gradient-to-b from-saudi-green-deep to-saudi-green-dark py-24 px-4 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 right-1/4 w-80 h-80 rounded-full border-4 border-saudi-gold" />
        <div className="absolute bottom-20 left-1/4 w-96 h-96 rounded-full border-4 border-saudi-gold" />
      </div>

      <div ref={sectionRef} className="relative max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-saudi-gold/15 border border-saudi-gold/30 mb-4">
            <BarChart3 className="w-4 h-4 text-saudi-gold" />
            <span className="text-saudi-gold-light text-sm font-bold">بالأرقام</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-3">
            توزيع <span className="gold-shimmer">الطبيعة</span> في المملكة
          </h2>
          <p className="text-saudi-sand/70 text-lg max-w-2xl mx-auto">
            نسب تقريبية لتوزيع عناصر الطبيعة الأربعة على مساحة المملكة العربية السعودية
          </p>
        </motion.div>

        {/* Stats bars */}
        <div className="space-y-8">
          {STATS.map((stat, index) => (
            <AnimatedBar key={stat.label} stat={stat} index={index} inView={inView} />
          ))}
        </div>

        {/* Total indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-12 flex justify-center"
        >
          <div className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-saudi-gold/10 border border-saudi-gold/30">
            <span className="text-saudi-gold-light font-bold">إجمالي مساحة المملكة:</span>
            <span className="font-display text-2xl font-bold gold-shimmer">2,149,690 كم²</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Statistics;
