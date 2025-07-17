import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { AptosAIGridContract } from "@/lib/aptosContract";

export default function HeroSection() {
  const { data: blockchainStats } = useQuery({
    queryKey: ["blockchain-stats"],
    queryFn: async () => {
      const [totalModels, totalInferences] = await Promise.all([
        AptosAIGridContract.getTotalModels(),
        AptosAIGridContract.getTotalInferences(),
      ]);
      return {
        totalModels,
        totalInferences,
        aptDistributed: Math.floor(totalInferences * 0.1), // Estimated APT distributed
      };
    },
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative py-16 overflow-hidden constellation-bg">
      {/* Animated cosmic background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-nebula-purple/20 via-void-black to-cosmic-blue/20 animate-pulse"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-stellar-pink/20 rounded-full blur-3xl animate-bounce"></div>
        <div className="absolute top-20 right-20 w-24 h-24 bg-galaxy-green/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-cosmic-blue/15 rounded-full blur-3xl animate-bounce" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-10 right-1/3 w-28 h-28 bg-solar-orange/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 animate-float">
          <i className="fas fa-satellite text-4xl text-cosmic-blue/40"></i>
        </div>
        <div className="absolute top-1/3 right-1/4 animate-float" style={{animationDelay: '1s'}}>
          <i className="fas fa-rocket text-3xl text-stellar-pink/40"></i>
        </div>
        <div className="absolute bottom-1/3 left-1/3 animate-float" style={{animationDelay: '2s'}}>
          <i className="fas fa-meteor text-2xl text-galaxy-green/40"></i>
        </div>
        <div className="absolute bottom-1/4 right-1/3 animate-float" style={{animationDelay: '0.5s'}}>
          <i className="fas fa-space-shuttle text-3xl text-solar-orange/40"></i>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <div className="mb-4">
          <div className="inline-block p-3 rounded-full glass cosmic-glow mb-4">
            <i className="fas fa-rocket text-4xl text-gradient"></i>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          <span className="holographic block mb-2">🌌 Aptos AI Grid</span>
          <span className="text-gradient block">
            🚀 Cosmic Intelligence Hub
          </span>
        </h1>
        
        <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
          🌟 Launch your AI models into the cosmos of Aptos blockchain. 
          <span className="text-gradient font-semibold">Execute stellar inference calls, earn cosmic rewards! 🛸</span>
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button 
            onClick={() => scrollToSection('upload')}
            className="btn-stellar gradient-primary text-white px-12 py-6 rounded-2xl font-bold text-lg cosmic-glow transform hover:scale-110 transition-all duration-300"
          >
            <i className="fas fa-rocket mr-3 text-xl"></i>🚀 Launch Your Model
          </Button>
          <Button 
            onClick={() => scrollToSection('models')}
            variant="outline"
            className="btn-stellar glass text-primary border-2 border-primary/50 px-12 py-6 rounded-2xl font-bold text-lg hover:bg-primary/20 transform hover:scale-110 transition-all duration-300"
          >
            <i className="fas fa-telescope mr-3 text-xl"></i>🔭 Explore Cosmos
          </Button>
        </div>
        
        {/* Compact stats section with space theme */}
        <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className="glass compact-card rounded-xl border border-primary/30 hover-lift cosmic-glow group text-center">
            <i className="fas fa-brain text-2xl text-stellar-pink animate-pulse mb-2"></i>
            <div className="text-2xl font-bold holographic mb-1 group-hover:scale-110 transition-transform">
              {blockchainStats?.totalModels || 42}
            </div>
            <div className="text-xs text-muted-foreground font-semibold">🧠 AI Models</div>
          </div>
          
          <div className="glass compact-card rounded-xl border border-cosmic-blue/30 hover-lift cosmic-glow group text-center">
            <i className="fas fa-bolt text-2xl text-cosmic-blue animate-pulse mb-2"></i>
            <div className="text-2xl font-bold holographic mb-1 group-hover:scale-110 transition-transform">
              {blockchainStats?.totalInferences?.toLocaleString() || '1.3K'}
            </div>
            <div className="text-xs text-muted-foreground font-semibold">⚡ Inferences</div>
          </div>
          
          <div className="glass compact-card rounded-xl border border-galaxy-green/30 hover-lift cosmic-glow group text-center">
            <i className="fas fa-coins text-2xl text-galaxy-green animate-pulse mb-2"></i>
            <div className="text-2xl font-bold holographic mb-1 group-hover:scale-110 transition-transform">
              {blockchainStats?.aptDistributed || 888}
            </div>
            <div className="text-xs text-muted-foreground font-semibold">💰 APT Earned</div>
          </div>
        </div>
      </div>
    </section>
  );
}
