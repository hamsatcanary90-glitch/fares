import Hero from '@/components/Hero';
import TeachableMachine from '@/components/TeachableMachine';
import NatureCards from '@/components/NatureCards';
import Statistics from '@/components/Statistics';

function App() {
  return (
    <main dir="rtl" className="min-h-screen bg-saudi-green-dark">
      {/* 1 — Hero */}
      <Hero />

      {/* 2 — Teachable Machine AI Classifier */}
      <TeachableMachine />

      {/* 3 — Nature Categories & Quick Quiz */}
      <NatureCards />

      {/* 4 — Statistics */}
      <Statistics />

      {/* Footer */}
      <footer className="bg-saudi-green-deep py-8 px-4 text-center border-t border-saudi-gold/10">
        <p className="font-display text-2xl gold-shimmer mb-2">عزنا بطبعنا</p>
        <p className="text-saudi-sand/50 text-sm">
          اليوم الوطني السعودي 96 — ١٤٤٨ هـ
        </p>
      </footer>
    </main>
  );
}

export default App;
