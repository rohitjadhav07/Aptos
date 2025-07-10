import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
          Decentralized AI Model <br />
          <span className="text-gradient">
            Sharing & Execution
          </span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Upload, share, and monetize AI models on the Aptos blockchain. Execute inference calls, earn rewards, and build the future of decentralized AI.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => scrollToSection('upload')}
            className="gradient-primary text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg hover-lift"
          >
            <i className="fas fa-cloud-upload-alt mr-2"></i>Upload Your Model
          </Button>
          <Button 
            onClick={() => scrollToSection('models')}
            variant="outline"
            className="bg-card/50 text-primary border-2 border-primary px-8 py-4 rounded-xl font-semibold hover:bg-primary/10 transition-all hover-lift"
          >
            <i className="fas fa-search mr-2"></i>Explore Models
          </Button>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="glass p-6 rounded-xl border border-border hover-lift">
            <div className="text-3xl font-bold text-secondary mb-2">
              {stats?.activeModels || 0}
            </div>
            <div className="text-muted-foreground">Active Models</div>
          </div>
          <div className="glass p-6 rounded-xl border border-border hover-lift">
            <div className="text-3xl font-bold text-primary mb-2">
              {stats?.totalInferences?.toLocaleString() || 0}
            </div>
            <div className="text-muted-foreground">Total Inferences</div>
          </div>
          <div className="glass p-6 rounded-xl border border-border hover-lift">
            <div className="text-3xl font-bold text-secondary mb-2">
              {stats?.aptDistributed || 0}K
            </div>
            <div className="text-muted-foreground">APT Distributed</div>
          </div>
        </div>
      </div>
    </section>
  );
}
