import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Mountain, Sun, Waves, TreePalm, Loader2, Scan, Sparkles } from 'lucide-react';

// =============================================================
//  Model files are in /public/tm-model/:
//    - model.json (model topology + weights manifest)
//    - metadata.json (class labels)
//    - weights.bin (model weights — binary file, replace with your trained weights)
// =============================================================
const MODEL_URL = '/tm-model/';
// =============================================================

type Category = {
  label: string;
  icon: typeof Mountain;
  color: string;
  bgColor: string;
};

const CATEGORIES: Record<string, Category> = {
  الجبال: { label: 'الجبال', icon: Mountain, color: 'text-saudi-gold-light', bgColor: 'from-saudi-green-deep to-saudi-green-dark' },
  الصحراء: { label: 'الصحراء', icon: Sun, color: 'text-saudi-sand', bgColor: 'from-amber-700 to-amber-900' },
  البحار: { label: 'البحار', icon: Waves, color: 'text-blue-300', bgColor: 'from-blue-600 to-blue-900' },
  النخيل: { label: 'النخيل', icon: TreePalm, color: 'text-saudi-gold-light', bgColor: 'from-saudi-green to-saudi-green-deep' },
};

type Prediction = {
  className: string;
  probability: number;
};

type Mode = 'idle' | 'camera' | 'image';

function TeachableMachine() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const modelRef = useRef<any>(null);

  const [mode, setMode] = useState<Mode>('idle');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Prediction[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelLoading, setModelLoading] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);

  // Load model on mount
  useEffect(() => {
    let cancelled = false;
    async function loadModel() {
      setModelLoading(true);
      setModelError(null);
      try {
        const tmImage = await import('@teachablemachine/image');
        await import('@tensorflow/tfjs');
        const modelURL = `${MODEL_URL}model.json`;
        const metadataURL = `${MODEL_URL}metadata.json`;
        const model = await tmImage.load(modelURL, metadataURL);
        if (cancelled) return;
        modelRef.current = model;
        setModelReady(true);
      } catch (err) {
        if (cancelled) return;
        console.error('Model load error:', err);
        setModelError('تعذر تحميل النموذج. تأكد من وجود ملفات النموذج في المجلد الصحيح.');
      } finally {
        if (!cancelled) setModelLoading(false);
      }
    }
    loadModel();
    return () => { cancelled = true; };
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    setError(null);
    setPredictions(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      setMode('camera');
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch {
      setError('تعذر الوصول إلى الكاميرا. يرجى السماح بالوصول ثم المحاولة مرة أخرى.');
    }
  }, []);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    stopCamera();
    setError(null);
    setPredictions(null);
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result as string);
      setMode('image');
    };
    reader.readAsDataURL(file);
  }, [stopCamera]);

  const runPrediction = useCallback(async () => {
    if (!modelRef.current) {
      setError('النموذج غير جاهز بعد. يرجى الانتظار.');
      return;
    }
    setLoading(true);
    setError(null);
    setPredictions(null);

    try {
      const model = modelRef.current;
      const maxPredictions = model.getMaxPredictions?.() ?? 4;

      let imageElement: HTMLImageElement | HTMLVideoElement;
      if (mode === 'camera' && videoRef.current) {
        imageElement = videoRef.current;
      } else if (mode === 'image' && imageRef.current) {
        imageElement = imageRef.current;
      } else {
        throw new Error('لا يوجد صورة للتعرّف عليها');
      }

      const results: Prediction[] = await model.predict(imageElement, maxPredictions);
      setPredictions(
        results
          .map((r: any) => ({ className: r.className, probability: r.probability }))
          .sort((a: Prediction, b: Prediction) => b.probability - a.probability)
      );
    } catch (err) {
      setError('حدث خطأ أثناء التعرّف على الصورة. حاول مرة أخرى.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [mode]);

  // Auto-predict on camera frames
  const [autoPredict, setAutoPredict] = useState(false);
  useEffect(() => {
    if (!autoPredict || !modelRef.current || mode !== 'camera') return;
    const interval = setInterval(() => {
      if (videoRef.current && modelRef.current && !loading) {
        runPrediction();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [autoPredict, mode, loading, runPrediction]);

  const topPrediction = predictions?.[0];
  const topCategory = topPrediction ? CATEGORIES[topPrediction.className] : null;

  return (
    <section id="classifier" className="relative bg-saudi-green-dark py-24 px-4 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 w-72 h-72 border-4 border-saudi-gold rounded-full" />
        <div className="absolute bottom-10 left-10 w-96 h-96 border-4 border-saudi-gold rounded-full" />
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-saudi-gold/15 border border-saudi-gold/30 mb-4">
            <Sparkles className="w-4 h-4 text-saudi-gold" />
            <span className="text-saudi-gold-light text-sm font-bold">الذكاء الاصطناعي</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-3">
            تعرّف على <span className="gold-shimmer">طبيعة وطننا</span>
          </h2>
          <p className="text-saudi-sand/70 text-lg max-w-2xl mx-auto">
            استخدم الكاميرا أو ارفع صورة، ودع الذكاء الاصطناعي يكتشف ما إذا كانت الجبال، الصحراء، البحار، أو النخيل
          </p>

          {/* Model status */}
          {modelLoading && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-saudi-gold/10 border border-saudi-gold/20">
              <Loader2 className="w-4 h-4 text-saudi-gold animate-spin" />
              <span className="text-saudi-gold-light text-sm">جاري تحميل النموذج...</span>
            </div>
          )}
          {modelReady && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-400/20">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-green-300 text-sm">النموذج جاهز</span>
            </div>
          )}
          {modelError && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-400/20">
              <span className="text-red-300 text-sm">{modelError}</span>
            </div>
          )}
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-8"
        >
          <button
            onClick={startCamera}
            className={`group flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${
              mode === 'camera'
                ? 'bg-saudi-gold text-saudi-green-dark'
                : 'bg-saudi-green/30 border border-saudi-gold/30 text-white hover:bg-saudi-green hover:border-saudi-gold'
            }`}
          >
            <Camera className="w-5 h-5 transition-transform group-hover:scale-110" />
            فتح الكاميرا
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className={`group flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${
              mode === 'image'
                ? 'bg-saudi-gold text-saudi-green-dark'
                : 'bg-saudi-green/30 border border-saudi-gold/30 text-white hover:bg-saudi-green hover:border-saudi-gold'
            }`}
          >
            <Upload className="w-5 h-5 transition-transform group-hover:scale-110" />
            تحميل صورة
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          {mode !== 'idle' && (
            <>
              {mode === 'camera' && modelReady && (
                <button
                  onClick={() => setAutoPredict((p) => !p)}
                  className={`px-6 py-4 rounded-2xl font-bold transition-all ${
                    autoPredict
                      ? 'bg-saudi-green-light text-white'
                      : 'bg-saudi-green/30 border border-saudi-gold/30 text-white hover:bg-saudi-green'
                  }`}
                >
                  {autoPredict ? 'إيقاف التعرّف التلقائي' : 'تعرّف تلقائي'}
                </button>
              )}
              <button
                onClick={() => {
                  stopCamera();
                  setMode('idle');
                  setAutoPredict(false);
                  setUploadedImage(null);
                  setPredictions(null);
                }}
                className="px-6 py-4 rounded-2xl font-bold bg-red-900/40 border border-red-500/30 text-red-300 hover:bg-red-900/60 transition-all"
              >
                إغلاق
              </button>
            </>
          )}
        </motion.div>

        {/* Display area */}
        <AnimatePresence mode="wait">
          {mode !== 'idle' && (
            <motion.div
              key="display"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {/* Image / Camera display */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-saudi-gold/30 bg-saudi-green-deep/50 aspect-video flex items-center justify-center">
                {mode === 'camera' && (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                )}
                {mode === 'image' && uploadedImage && (
                  <img
                    ref={imageRef}
                    src={uploadedImage}
                    alt="الصورة المرفوعة"
                    crossOrigin="anonymous"
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Scanning overlay */}
                {loading && (
                  <div className="absolute inset-0 bg-saudi-green-dark/60 flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
                    <Loader2 className="w-10 h-10 text-saudi-gold animate-spin" />
                    <span className="text-saudi-gold-light font-bold">جاري التعرّف...</span>
                  </div>
                )}

                {/* Auto-predict badge */}
                {autoPredict && mode === 'camera' && !loading && (
                  <div className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-saudi-green-dark/70 backdrop-blur-sm">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-green-300 text-xs font-bold">تعرّف مباشر</span>
                  </div>
                )}

                {/* Corner decorations */}
                <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-saudi-gold/60 rounded-tr-lg" />
                <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-saudi-gold/60 rounded-tl-lg" />
                <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-saudi-gold/60 rounded-br-lg" />
                <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-saudi-gold/60 rounded-bl-lg" />
              </div>

              {/* Prediction result */}
              <div className="rounded-3xl border-2 border-saudi-gold/30 bg-gradient-to-br from-saudi-green-deep/80 to-saudi-green-dark/80 p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <Scan className="w-5 h-5 text-saudi-gold" />
                  <h3 className="text-xl font-bold text-white">نتيجة التعرّف</h3>
                </div>

                {!predictions && !loading && !error && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 text-saudi-sand/60">
                    <Sparkles className="w-12 h-12 text-saudi-gold/40" />
                    <p>اضغط زر التعرّف لتحليل الصورة</p>
                  </div>
                )}

                {error && (
                  <div className="flex-1 flex items-center justify-center text-center text-red-300 bg-red-900/30 rounded-xl p-4">
                    {error}
                  </div>
                )}

                {loading && (
                  <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    <div className="space-y-3 w-full">
                      {Object.keys(CATEGORIES).map((name, i) => (
                        <div key={name} className="animate-pulse">
                          <div className="flex justify-between mb-1">
                            <div className="h-4 w-24 bg-saudi-gold/20 rounded" />
                            <div className="h-4 w-12 bg-saudi-gold/20 rounded" />
                          </div>
                          <motion.div
                            className="h-3 bg-saudi-gold/20 rounded-full overflow-hidden"
                            initial={{ width: 0 }}
                            animate={{ width: `${100 - i * 20}%` }}
                            transition={{ duration: 1, delay: i * 0.2, repeat: Infinity, repeatType: 'reverse' }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {predictions && !loading && topCategory && topPrediction && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 flex flex-col"
                  >
                    {/* Top result */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                      className={`bg-gradient-to-br ${topCategory.bgColor} rounded-2xl p-6 text-center mb-4 border border-saudi-gold/30`}
                    >
                      <topCategory.icon className={`w-16 h-16 mx-auto mb-2 ${topCategory.color}`} />
                      <p className="text-3xl font-display font-bold text-white">{topCategory.label}</p>
                      <p className="text-saudi-gold-light text-lg font-bold mt-1">
                        {Math.round(topPrediction.probability * 100)}%
                      </p>
                    </motion.div>

                    {/* All predictions */}
                    <div className="space-y-2">
                      {predictions.map((p, i) => {
                        const cat = CATEGORIES[p.className];
                        if (!cat) return null;
                        return (
                          <motion.div
                            key={p.className}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.15 }}
                            className="flex items-center gap-3"
                          >
                            <cat.icon className={`w-5 h-5 ${cat.color}`} />
                            <span className="text-white/80 text-sm w-20">{p.className}</span>
                            <div className="flex-1 h-2 bg-saudi-green-deep rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-l from-saudi-gold to-saudi-gold-light"
                                initial={{ width: 0 }}
                                animate={{ width: `${p.probability * 100}%` }}
                                transition={{ duration: 0.8, delay: i * 0.15 }}
                              />
                            </div>
                            <span className="text-saudi-gold-light text-sm font-bold w-12 text-left">
                              {Math.round(p.probability * 100)}%
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Run button */}
                {!loading && !autoPredict && (
                  <button
                    onClick={runPrediction}
                    disabled={!modelReady}
                    className="mt-4 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold bg-saudi-gold text-saudi-green-dark hover:bg-saudi-gold-light transition-all shadow-lg shadow-saudi-gold/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Sparkles className="w-5 h-5" />
                    ابدأ التعرّف
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {mode === 'idle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center text-center py-16 text-saudi-sand/50"
          >
            <div className="grid grid-cols-4 gap-4 mb-6 opacity-40">
              {Object.values(CATEGORIES).map((cat, i) => (
                <motion.div
                  key={cat.label}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                >
                  <cat.icon className={`w-12 h-12 ${cat.color}`} />
                </motion.div>
              ))}
            </div>
            <p className="text-lg">اختر طريقة لبدء التعرّف على عناصر الطبيعة</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default TeachableMachine;
