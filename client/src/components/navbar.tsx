import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isConnected, setIsConnected] = useState(false);
  const [aptBalance] = useState("1,247.5");

  const handleConnectWallet = () => {
    // Simulate wallet connection
    setIsConnected(true);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <i className="fas fa-brain text-white text-sm"></i>
              </div>
              <h1 className="text-xl font-bold text-neutral-900">AptosAI Grid</h1>
            </div>
            <div className="hidden md:flex space-x-6">
              <button 
                onClick={() => scrollToSection('models')}
                className="text-neutral-600 hover:text-primary transition-colors"
              >
                Discover Models
              </button>
              <button 
                onClick={() => scrollToSection('prompts')}
                className="text-neutral-600 hover:text-primary transition-colors"
              >
                Prompt Marketplace
              </button>
              <button 
                onClick={() => scrollToSection('leaderboard')}
                className="text-neutral-600 hover:text-primary transition-colors"
              >
                Leaderboard
              </button>
              <button className="text-neutral-600 hover:text-primary transition-colors">
                Docs
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isConnected && (
              <div className="hidden md:flex items-center space-x-2 bg-neutral-100 px-3 py-2 rounded-lg">
                <i className="fas fa-coins text-accent"></i>
                <span className="text-sm font-medium">{aptBalance} APT</span>
              </div>
            )}
            <Button 
              onClick={handleConnectWallet}
              className="bg-primary text-white hover:bg-primary/90"
              disabled={isConnected}
            >
              <i className="fas fa-wallet mr-2"></i>
              {isConnected ? 'Connected' : 'Connect Wallet'}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
