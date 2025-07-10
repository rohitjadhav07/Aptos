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
    <section className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-6">
          Decentralized AI Model <br />
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Sharing & Execution
          </span>
        </h1>
        <p className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto">
          Upload, share, and monetize AI models on the Aptos blockchain. Execute inference calls, earn rewards, and build the future of decentralized AI.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => scrollToSection('upload')}
            className="bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg"
          >
            <i className="fas fa-cloud-upload-alt mr-2"></i>Upload Your Model
          </Button>
          <Button 
            onClick={() => scrollToSection('models')}
            variant="outline"
            className="bg-white text-primary border-2 border-primary px-8 py-4 rounded-xl font-semibold hover:bg-primary/5 transition-colors"
          >
            <i className="fas fa-search mr-2"></i>Explore Models
          </Button>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-neutral-200">
            <div className="text-3xl font-bold text-accent mb-2">
              {stats?.activeModels || 0}
            </div>
            <div className="text-neutral-600">Active Models</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-neutral-200">
            <div className="text-3xl font-bold text-primary mb-2">
              {stats?.totalInferences?.toLocaleString() || 0}
            </div>
            <div className="text-neutral-600">Total Inferences</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-neutral-200">
            <div className="text-3xl font-bold text-secondary mb-2">
              {stats?.aptDistributed || 0}K
            </div>
            <div className="text-neutral-600">APT Distributed</div>
          </div>
        </div>
      </div>
    </section>
  );
}
