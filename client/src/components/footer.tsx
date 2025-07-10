export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <i className="fas fa-brain text-white text-sm"></i>
              </div>
              <h3 className="text-xl font-bold text-white">AptosAI Grid</h3>
            </div>
            <p className="text-neutral-400 mb-4">
              Decentralized AI model sharing and execution protocol built on Aptos blockchain.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <i className="fab fa-github"></i>
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <i className="fab fa-discord"></i>
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Discover Models</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Upload Model</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Prompt Marketplace</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Leaderboard</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Developers</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">API Documentation</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">SDK</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Smart Contracts</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">GitHub</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Community</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-neutral-800 mt-12 pt-8 text-center text-neutral-500">
          <p>&copy; 2024 AptosAI Grid. Built on Aptos blockchain.</p>
        </div>
      </div>
    </footer>
  );
}
