import Header from './components/Header';
import Hero from './components/Hero';
import AINewsSection from './components/AINewsSection';
import ToysSection from './components/ToysSection';
import GamesSection from './components/GamesSection';
import Footer from './components/Footer';
import { todayPush } from '@/lib/data';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />

      <Hero date={todayPush.date} />

      <div id="today">
        <AINewsSection
          keywords={todayPush.aiNews.keywords}
          items={todayPush.aiNews.items}
        />

        <ToysSection
          bandai={todayPush.bandai}
          hotToys={todayPush.hotToys}
        />

        <GamesSection
          steam={todayPush.gameDeals.steam}
          playstation={todayPush.gameDeals.playstation}
          nintendo={todayPush.gameDeals.nintendo}
        />
      </div>

      <Footer />
    </main>
  );
}
