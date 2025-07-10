import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import ModelDiscovery from "@/components/model-discovery";
import Leaderboard from "@/components/leaderboard";
import PromptMarketplace from "@/components/prompt-marketplace";
import ModelUpload from "@/components/model-upload";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <ModelDiscovery />
      <Leaderboard />
      <PromptMarketplace />
      <ModelUpload />
      <Footer />
    </div>
  );
}
