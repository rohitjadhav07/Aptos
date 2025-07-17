import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletProvider";
import { useToast } from "@/hooks/use-toast";

export default function Navbar() {
  const { wallet, connectWallet, disconnectWallet, isLoading } = useWallet();
  const { connected: isConnected, balance: aptBalance, address } = wallet;
  const { toast } = useToast();

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to Aptos testnet wallet",
      });
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet. Please install Petra wallet.",
        variant: "destructive",
      });
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      await disconnectWallet();
      toast({
        title: "Wallet Disconnected",
        description: "Successfully disconnected from wallet",
      });
    } catch (error: any) {
      toast({
        title: "Disconnection Failed",
        description: error.message || "Failed to disconnect wallet",
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
    <nav className="glass constellation-bg border-b border-border/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center cosmic-glow">
                <i className="fas fa-rocket text-white text-lg"></i>
              </div>
              <h1 className="text-2xl font-bold holographic">AptosAI Grid</h1>
            </div>
            <div className="hidden md:flex space-x-6">
              <button 
                onClick={() => scrollToSection('models')}
                className="text-muted-foreground hover:text-gradient transition-all duration-300 font-medium hover:scale-105"
              >
                <i className="fas fa-brain mr-2"></i>Discover Models
              </button>
              <button 
                onClick={() => scrollToSection('prompts')}
                className="text-muted-foreground hover:text-gradient transition-all duration-300 font-medium hover:scale-105"
              >
                <i className="fas fa-magic mr-2"></i>Prompt Marketplace
              </button>
              <button 
                onClick={() => scrollToSection('leaderboard')}
                className="text-muted-foreground hover:text-gradient transition-all duration-300 font-medium hover:scale-105"
              >
                <i className="fas fa-trophy mr-2"></i>Leaderboard
              </button>
              <button className="text-muted-foreground hover:text-gradient transition-all duration-300 font-medium hover:scale-105">
                <i className="fas fa-book mr-2"></i>Docs
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isConnected && (
              <>
                <div className="hidden md:flex items-center space-x-2 balance-display px-4 py-2 rounded-xl cosmic-glow">
                  <i className="fas fa-coins text-yellow-400 animate-pulse text-lg"></i>
                  <span className="text-lg font-bold text-white">{aptBalance?.toFixed(4)} APT</span>
                </div>
                <div className="hidden md:flex items-center space-x-2 glass px-4 py-2 rounded-xl border border-primary/30">
                  <i className="fas fa-user-astronaut text-primary"></i>
                  <span className="text-xs font-mono text-white font-bold">
                    {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
                  </span>
                </div>
              </>
            )}
            {isConnected ? (
              <Button 
                onClick={handleDisconnectWallet}
                variant="outline"
                className="btn-stellar border-destructive/30 text-destructive hover:bg-destructive/20 font-medium glass"
              >
                <i className="fas fa-rocket mr-2 rotate-180"></i>
                Disconnect
              </Button>
            ) : (
              <Button 
                onClick={handleConnectWallet}
                className="btn-stellar gradient-primary text-white font-medium cosmic-glow"
                disabled={isLoading}
              >
                <i className="fas fa-wallet mr-2"></i>
                {isLoading ? (
                  <>
                    <div className="cosmic-spinner mr-2"></div>
                    Connecting...
                  </>
                ) : (
                  'Connect Wallet'
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
