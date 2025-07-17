const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

export default function Footer() {
  return (
    <footer className="glass constellation-bg border-t border-primary/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center cosmic-glow">
                <i className="fas fa-rocket text-white text-lg"></i>
              </div>
              <h3 className="text-2xl font-bold holographic">AptosAI Grid</h3>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              🌌 The first decentralized AI model sharing and execution protocol built on Aptos blockchain. 
              Launch your AI models to the cosmos and earn rewards! 🚀
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com/aptosai_grid" target="_blank" rel="noopener noreferrer" 
                 className="text-muted-foreground hover:text-cosmic-blue transition-all duration-300 hover:scale-110">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="https://github.com/rohitjadhav07/AptosAiGrid" target="_blank" rel="noopener noreferrer"
                 className="text-muted-foreground hover:text-stellar-pink transition-all duration-300 hover:scale-110">
                <i className="fab fa-github text-xl"></i>
              </a>
              <a href="https://discord.gg/aptosai" target="_blank" rel="noopener noreferrer"
                 className="text-muted-foreground hover:text-galaxy-green transition-all duration-300 hover:scale-110">
                <i className="fab fa-discord text-xl"></i>
              </a>
              <a href="https://t.me/aptosai_grid" target="_blank" rel="noopener noreferrer"
                 className="text-muted-foreground hover:text-solar-orange transition-all duration-300 hover:scale-110">
                <i className="fab fa-telegram text-xl"></i>
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-bold text-gradient mb-4 text-lg">🚀 Platform</h4>
            <ul className="space-y-3">
              <li>
                <button onClick={() => scrollToSection('models')} 
                        className="text-muted-foreground hover:text-white transition-colors hover:translate-x-1 transform duration-200 flex items-center">
                  <i className="fas fa-brain mr-2 text-stellar-pink"></i>Discover AI Models
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('upload')} 
                        className="text-muted-foreground hover:text-white transition-colors hover:translate-x-1 transform duration-200 flex items-center">
                  <i className="fas fa-upload mr-2 text-cosmic-blue"></i>Upload Your Model
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('prompts')} 
                        className="text-muted-foreground hover:text-white transition-colors hover:translate-x-1 transform duration-200 flex items-center">
                  <i className="fas fa-magic mr-2 text-galaxy-green"></i>Prompt Marketplace
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('leaderboard')} 
                        className="text-muted-foreground hover:text-white transition-colors hover:translate-x-1 transform duration-200 flex items-center">
                  <i className="fas fa-trophy mr-2 text-solar-orange"></i>Leaderboard
                </button>
              </li>
            </ul>
          </div>

          {/* Developer Resources */}
          <div>
            <h4 className="font-bold text-gradient mb-4 text-lg">👨‍💻 Developers</h4>
            <ul className="space-y-3">
              <li>
                <a href="https://docs.aptosai-grid.com/api" target="_blank" rel="noopener noreferrer"
                   className="text-muted-foreground hover:text-white transition-colors hover:translate-x-1 transform duration-200 flex items-center">
                  <i className="fas fa-code mr-2 text-stellar-pink"></i>API Documentation
                </a>
              </li>
              <li>
                <a href="https://github.com/rohitjadhav07/AptosAiGrid/tree/main/client/src/lib" target="_blank" rel="noopener noreferrer"
                   className="text-muted-foreground hover:text-white transition-colors hover:translate-x-1 transform duration-200 flex items-center">
                  <i className="fas fa-cube mr-2 text-cosmic-blue"></i>TypeScript SDK
                </a>
              </li>
              <li>
                <a href="https://github.com/rohitjadhav07/AptosAiGrid/tree/main/contracts" target="_blank" rel="noopener noreferrer"
                   className="text-muted-foreground hover:text-white transition-colors hover:translate-x-1 transform duration-200 flex items-center">
                  <i className="fas fa-file-contract mr-2 text-galaxy-green"></i>Smart Contracts
                </a>
              </li>
              <li>
                <a href="https://github.com/rohitjadhav07/AptosAiGrid" target="_blank" rel="noopener noreferrer"
                   className="text-muted-foreground hover:text-white transition-colors hover:translate-x-1 transform duration-200 flex items-center">
                  <i className="fab fa-github mr-2 text-solar-orange"></i>GitHub Repository
                </a>
              </li>
            </ul>
          </div>

          {/* Resources & Support */}
          <div>
            <h4 className="font-bold text-gradient mb-4 text-lg">📚 Resources</h4>
            <ul className="space-y-3">
              <li>
                <a href="https://help.aptosai-grid.com" target="_blank" rel="noopener noreferrer"
                   className="text-muted-foreground hover:text-white transition-colors hover:translate-x-1 transform duration-200 flex items-center">
                  <i className="fas fa-question-circle mr-2 text-stellar-pink"></i>Help Center
                </a>
              </li>
              <li>
                <a href="https://community.aptosai-grid.com" target="_blank" rel="noopener noreferrer"
                   className="text-muted-foreground hover:text-white transition-colors hover:translate-x-1 transform duration-200 flex items-center">
                  <i className="fas fa-users mr-2 text-cosmic-blue"></i>Community Forum
                </a>
              </li>
              <li>
                <a href="https://blog.aptosai-grid.com" target="_blank" rel="noopener noreferrer"
                   className="text-muted-foreground hover:text-white transition-colors hover:translate-x-1 transform duration-200 flex items-center">
                  <i className="fas fa-blog mr-2 text-galaxy-green"></i>Tech Blog
                </a>
              </li>
              <li>
                <a href="https://aptosai-grid.com/terms" target="_blank" rel="noopener noreferrer"
                   className="text-muted-foreground hover:text-white transition-colors hover:translate-x-1 transform duration-200 flex items-center">
                  <i className="fas fa-file-alt mr-2 text-solar-orange"></i>Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-primary/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-muted-foreground">
                &copy; 2024 <span className="holographic font-bold">AptosAI Grid</span>. 
                Built with 💜 on <span className="text-gradient font-semibold">Aptos Blockchain</span>
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <a href="https://aptosai-grid.com/privacy" className="text-muted-foreground hover:text-white transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="https://aptosai-grid.com/cookies" className="text-muted-foreground hover:text-white transition-colors text-sm">
                Cookie Policy
              </a>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-muted-foreground">Powered by</span>
                <i className="fas fa-rocket text-primary animate-pulse"></i>
                <span className="text-gradient font-bold">Aptos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
