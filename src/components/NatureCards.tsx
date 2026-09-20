import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mountain, Sun, Waves, TreePalm, Check, X, ChevronDown, MapPin } from 'lucide-react';

type Category = {
  id: string;
  label: string;
  icon: typeof Mountain;
  gradient: string;
  iconColor: string;
  accent: string;
  description: string;
  question: {
    text: string;
    options: { text: string; correct: boolean }[];
  };
};

const CATEGORIES: Category[] = [
  {
    id: 'mountains',
    label: 'الجبال',
    icon: Mountain,
    gradient: 'from-emerald-800 via-saudi-green-deep to-saudi-green-dark',
    iconColor: 'text-saudi-gold-light',
    accent: 'saudi-gold',
    description:
      'تمتد سلسلة جبال السروات على طول الجزء الغربي من المملكة لمسافة تزيد عن 1500 كيلومتر، وتُعدّ درة الطبيعة السعودية بأعلى قمة فيها — جبل السودة في عسير الذي يبلغ ارتفاعه نحو 3000 متر. تتميز هذه الجبال بغطاء نباتي كثيف ومدرجات زراعية وخُضر يانعة تجعلها مقصداً سياحياً على مدار العام.',
    question: {
      text: 'ما هو أعلى جبل في المملكة العربية السعودية؟',
      options: [
        { text: 'جبل السودة', correct: true },
        { text: 'جبل أحد', correct: false },
        { text: 'جبل النبي شعيب', correct: false },
      ],
    },
  },
  {
    id: 'desert',
    label: 'الصحراء',
    icon: Sun,
    gradient: 'from-amber-700 via-amber-800 to-amber-950',
    iconColor: 'text-saudi-sand',
    accent: 'saudi-sand',
    description:
      'تغطي الصحراء ما يقارب 60% من مساحة المملكة، وتتنوع بين الرمال الذهبية في الربع الخالي أكبر صحراء رملية متصلة في العالم، وصحراء النفود الكبير في الشمال. تشكّل هذه الصحاري بيئة فريدة تضمن تاريخاً عريقاً وكنزاً بيئياً قابلاً للحياة، وتُعدّ الوجهة الأولى للسياحة الصحراوية والمغامرات.',
    question: {
      text: 'ما هي أكبر صحراء رملية متصلة في العالم الواقعة في المملكة؟',
      options: [
        { text: 'صحراء النفود الكبير', correct: false },
        { text: 'الربع الخالي', correct: true },
        { text: 'صحراء الدهناء', correct: false },
      ],
    },
  },
  {
    id: 'seas',
    label: 'البحار',
    icon: Waves,
    gradient: 'from-cyan-700 via-blue-800 to-blue-950',
    iconColor: 'text-blue-300',
    accent: 'cyan-400',
    description:
      'تمتد سواحل المملكة على البحر الأحمر غرباً لمسافة تتجاوز 1800 كيلومتر، وعلى الخليج العربي شرقاً لنحو 600 كيلومتر. تضم مياه البحر الأحمر شعاباً مرجانية من بين الأكثر تنوعاً في العالم، وتُعدّ ملاذاً للحياة البحرية ومقصد الغوص والاستجمام في مشاريع نيوم والبحر الأحمر.',
    question: {
      text: 'كم تبلغ تقريباً مساحة ساحل البحر الأحمر في المملكة؟',
      options: [
        { text: 'أقل من 500 كم', correct: false },
        { text: 'أكثر من 1800 كم', correct: true },
        { text: 'حوالي 1000 كم', correct: false },
      ],
    },
  },
  {
    id: 'palms',
    label: 'النخيل',
    icon: TreePalm,
    gradient: 'from-saudi-green via-saudi-green-deep to-emerald-950',
    iconColor: 'text-saudi-gold-light',
    accent: 'saudi-gold',
    description:
      'تضم المملكة العربية السعودية أكثر من 36 مليون نخلة، تنتج أجود أنواع التمور في العالم مثل المجدول والسكري والخلاص والعجوة. وتُعدّ واحات الأحساء — أكبر واحات النخيل في العالم — موئلاً لما يزيد عن ثلاثة ملايين نخلة، وذُكرت النخلة في القرآن الكريم أكثر من عشرين مرة.',
    question: {
      text: 'كم يبلغ عدد النخيل تقريباً في المملكة العربية السعودية؟',
      options: [
        { text: 'أكثر من 36 مليون نخلة', correct: true },
        { text: 'حوالي 5 ملايين نخلة', correct: false },
        { text: 'حوالي 50 ألف نخلة', correct: false },
      ],
    },
  },
];

function NatureCards() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<Record<string, number | null>>({});

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
    if (expandedId !== id) {
      setSelectedAnswer((prev) => ({ ...prev, [id]: null }));
    }
  };

  const handleAnswer = (categoryId: string, optionIndex: number) => {
    setSelectedAnswer((prev) => ({ ...prev, [categoryId]: optionIndex }));
  };

  return (
    <section id="nature" className="relative bg-gradient-to-b from-saudi-green-dark to-saudi-green-deep py-24 px-4">
      {/* Decorative */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-l from-transparent via-saudi-gold to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-saudi-gold/15 border border-saudi-gold/30 mb-4">
            <MapPin className="w-4 h-4 text-saudi-gold" />
            <span className="text-saudi-gold-light text-sm font-bold">عناصر الطبيعة</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-3">
            طبيعة <span className="gold-shimmer">المملكة</span> الأربعة
          </h2>
          <p className="text-saudi-sand/70 text-lg max-w-2xl mx-auto">
            تعرّف على عناصر الطبيعة في وطننا وأجب عن سؤال سريع لكل عنصر
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat, index) => {
            const isExpanded = expandedId === cat.id;
            const selected = selectedAnswer[cat.id];
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -8 }}
                className={`relative rounded-3xl overflow-hidden cursor-pointer border-2 transition-all duration-500 ${
                  isExpanded ? 'border-saudi-gold shadow-2xl shadow-saudi-gold/20' : 'border-saudi-gold/20'
                }`}
                onClick={() => handleToggle(cat.id)}
              >
                {/* Card background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient}`} />

                {/* Texture overlay */}
                <div className="absolute inset-0 bg-black/20" />
                <motion.div
                  className="absolute inset-0 opacity-20"
                  animate={isExpanded ? { opacity: 0.3 } : { opacity: 0.15 }}
                >
                  <div className="absolute -top-8 -right-8 w-40 h-40 border-4 border-white/20 rounded-full" />
                  <div className="absolute -bottom-12 -left-12 w-52 h-52 border-4 border-white/20 rounded-full" />
                </motion.div>

                {/* Content */}
                <div className="relative p-6 flex flex-col items-center text-center min-h-[340px]">
                  {/* Icon */}
                  <motion.div
                    animate={isExpanded ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="mb-4 mt-2"
                  >
                    <cat.icon className={`w-16 h-16 ${cat.iconColor}`} />
                  </motion.div>

                  {/* Label */}
                  <h3 className="font-display text-3xl font-bold text-white mb-2">{cat.label}</h3>

                  {/* Tap to expand hint */}
                  {!isExpanded && (
                    <motion.div
                      animate={{ y: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="flex flex-col items-center gap-1 mt-auto text-white/60"
                    >
                      <span className="text-xs">اضغط للتفاصيل</span>
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  )}

                  {/* Expanded content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4 }}
                        className="w-full mt-2 text-right"
                      >
                        {/* Description */}
                        <p className="text-white/85 text-sm leading-relaxed mb-4 text-justify">
                          {cat.description}
                        </p>

                        {/* Quick question */}
                        <div className="bg-black/30 rounded-xl p-4 border border-saudi-gold/20">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-saudi-gold animate-pulse" />
                            <span className="text-saudi-gold-light text-xs font-bold">سؤال سريع</span>
                          </div>
                          <p className="text-white text-sm font-bold mb-3">{cat.question.text}</p>
                          <div className="space-y-2">
                            {cat.question.options.map((opt, i) => {
                              const isSelected = selected === i;
                              const showResult = selected !== null && selected !== undefined;
                              return (
                                <button
                                  key={i}
                                  disabled={showResult}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAnswer(cat.id, i);
                                  }}
                                  className={`w-full text-right px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                                    showResult
                                      ? opt.correct
                                        ? 'bg-green-500/30 border-green-400 text-green-200'
                                        : isSelected
                                          ? 'bg-red-500/30 border-red-400 text-red-200'
                                          : 'bg-white/5 border-white/10 text-white/50'
                                      : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-saudi-gold/40'
                                  }`}
                                >
                                  <span className="flex items-center justify-between">
                                    {opt.text}
                                    {showResult && opt.correct && <Check className="w-4 h-4" />}
                                    {showResult && !opt.correct && isSelected && <X className="w-4 h-4" />}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                          {selected !== null && selected !== undefined && (
                            <motion.p
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`text-center mt-3 text-sm font-bold ${
                                cat.question.options[selected].correct ? 'text-green-300' : 'text-red-300'
                              }`}
                            >
                              {cat.question.options[selected].correct
                                ? 'إجابة صحيحة! أحسنت'
                                : 'إجابة غير صحيحة. حاول مرة أخرى'}
                            </motion.p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default NatureCards;
