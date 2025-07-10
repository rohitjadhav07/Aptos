import { Button } from "@/components/ui/button";
import { useAptos } from "@/hooks/useAptos";
import { useToast } from "@/hooks/use-toast";

export default function Navbar() {
  const { wallet, connectWallet, isLoading } = useAptos();
  const { connected: isConnected, balance: aptBalance } = wallet;
  const { toast } = useToast();

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to Aptos wallet",
      });
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center aptos-glow">
                <i className="fas fa-brain text-white text-sm"></i>
              </div>
              <h1 className="text-xl font-bold text-foreground">AptosAI Grid</h1>
            </div>
            <div className="hidden md:flex space-x-6">
              <button 
                onClick={() => scrollToSection('models')}
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                Discover Models
              </button>
              <button 
                onClick={() => scrollToSection('prompts')}
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                Prompt Marketplace
              </button>
              <button 
                onClick={() => scrollToSection('leaderboard')}
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                Leaderboard
              </button>
              <button className="text-muted-foreground hover:text-primary transition-colors font-medium">
                Docs
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isConnected && (
              <div className="hidden md:flex items-center space-x-2 bg-secondary/20 px-3 py-2 rounded-lg border border-secondary/30">
                <i className="fas fa-coins text-secondary"></i>
                <span className="text-sm font-medium text-foreground">{aptBalance?.toFixed(2)} APT</span>
              </div>
            )}
            <Button 
              onClick={handleConnectWallet}
              className="gradient-primary text-white hover:opacity-90 font-medium"
              disabled={isConnected || isLoading}
            >
              <i className="fas fa-wallet mr-2"></i>
              {isLoading ? 'Connecting...' : isConnected ? 'Connected' : 'Connect Wallet'}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
