# 🌌 AptosAI Grid - Cosmic Intelligence Hub

![AptosAI Grid Banner](https://img.shields.io/badge/AptosAI-Grid-purple?style=for-the-badge&logo=rocket)
![Aptos](https://img.shields.io/badge/Built%20on-Aptos-green?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

> 🚀 The first decentralized AI model sharing and execution protocol built on Aptos blockchain. Launch your AI models to the cosmos and earn rewards!

## ✨ Features

### 🧠 AI Model Marketplace
- **Discover Models**: Browse cutting-edge AI models from the community
- **Upload & Monetize**: Share your AI models and earn APT tokens
- **Real-time Inference**: Execute AI models with blockchain-verified payments
- **Decentralized Storage**: Models stored on IPFS and Filecoin

### 🎨 NFT Prompt Marketplace
- **Buy & Sell Prompts**: Trade premium AI prompts as NFTs
- **Full Licensing**: Complete ownership and usage rights
- **Quality Curation**: Community-verified prompt collections

### 🏆 Gamification
- **Leaderboards**: Track top performers and earners
- **Reputation System**: Build your cosmic reputation
- **Rewards Program**: Earn bonus APT for contributions

### 🔐 Blockchain Features
- **Aptos Integration**: Built on fast, secure Aptos blockchain
- **Petra Wallet**: Seamless wallet integration
- **Smart Contracts**: Transparent, auditable transactions
- **Testnet Ready**: Full testnet deployment and testing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Petra Wallet browser extension

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rohitjadhav07/AptosAiGrid.git
   cd AptosAiGrid
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### 🔧 Environment Setup

Create a `.env` file in the root directory:
```env
VITE_APTOS_NETWORK=testnet
VITE_CONTRACT_ADDRESS=0x8fd669458715f59eee97ff0baa117b648c8649f9d43f423578261dd26e663a3a
```

## 🏗️ Architecture

### Frontend Stack
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Vite** - Lightning-fast build tool
- **Tanstack Query** - Data fetching and caching

### Blockchain Stack
- **Aptos Blockchain** - Layer 1 blockchain
- **Move Language** - Smart contract development
- **Petra Wallet** - Web3 wallet integration
- **Aptos TypeScript SDK** - Blockchain interaction

### Backend Stack
- **Express.js** - REST API server
- **Drizzle ORM** - Database management
- **WebSocket** - Real-time updates

## 📁 Project Structure

```
AptosAiGrid/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts (Wallet, etc.)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility libraries
│   │   └── pages/          # Application pages
├── server/                 # Backend Express server
├── contracts/              # Move smart contracts
├── shared/                 # Shared types and schemas
└── docs/                   # Documentation
```

## 🎮 Usage Guide

### For AI Model Creators
1. **Connect Petra Wallet** - Link your Aptos testnet wallet
2. **Upload Model** - Share your AI model with pricing
3. **Earn Rewards** - Get paid in APT for each inference call
4. **Track Performance** - Monitor usage and earnings

### For AI Users
1. **Browse Models** - Explore available AI models
2. **Try Models** - Pay small amounts to test functionality
3. **Buy Prompts** - Purchase premium prompts as NFTs
4. **Build Applications** - Integrate models into your projects

## 🔗 Smart Contracts

### Main Contract Functions
- `upload_model()` - Register new AI model
- `execute_inference()` - Run model inference
- `purchase_prompt()` - Buy prompt NFT
- `get_model_stats()` - Retrieve model statistics

### Contract Address (Testnet)
```
0x8fd669458715f59eee97ff0baa117b648c8649f9d43f423578261dd26e663a3a
```

## 🌐 API Documentation

### Model Endpoints
```typescript
GET    /api/models          # List all models
POST   /api/models          # Upload new model
GET    /api/models/:id      # Get model details
POST   /api/models/:id/infer # Execute inference
```

### Prompt Endpoints
```typescript
GET    /api/prompts         # List all prompts
POST   /api/prompts         # Create new prompt
POST   /api/prompts/:id/purchase # Buy prompt NFT
```

## 🎨 UI/UX Features

### Space-Themed Design
- **Big Bang Animation** - Realistic universe formation on app load
- **Shooting Stars** - Dynamic background animations
- **Cosmic Effects** - Glowing buttons and holographic text
- **Responsive Design** - Works on all devices

### Visual Effects
- **Glassmorphism** - Modern glass-like UI elements
- **Gradient Animations** - Dynamic color transitions
- **Particle Systems** - Floating cosmic particles
- **Smooth Transitions** - Buttery smooth animations

## 🚀 Deployment

### Vercel Deployment
1. **Connect GitHub** - Link your repository to Vercel
2. **Configure Build** - Set build command to `npm run build`
3. **Set Environment Variables** - Add your environment variables
4. **Deploy** - Automatic deployment on push

### Build Commands
```bash
npm run build     # Build for production
npm run preview   # Preview production build
npm run check     # Type checking
```

## 🤝 Contributing

We welcome contributions from the cosmic community! 

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/cosmic-feature`)
3. Commit your changes (`git commit -m 'Add cosmic feature'`)
4. Push to the branch (`git push origin feature/cosmic-feature`)
5. Open a Pull Request

### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features

## 📊 Roadmap

### Phase 1: Foundation ✅
- [x] Basic UI/UX with space theme
- [x] Petra wallet integration
- [x] Smart contract deployment
- [x] Model upload functionality

### Phase 2: Enhancement 🚧
- [ ] Advanced model categories
- [ ] Reputation system
- [ ] Mobile app development
- [ ] Multi-wallet support

### Phase 3: Expansion 🔮
- [ ] Cross-chain integration
- [ ] AI model training rewards
- [ ] DAO governance
- [ ] Enterprise features

## 🏆 Team

- **Rohit Jadhav** - Full Stack Developer & Blockchain Engineer
- **Community Contributors** - Amazing developers from around the cosmos

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Support

- **GitHub Issues** - Report bugs and request features
- **Discord** - Join our community chat
- **Twitter** - Follow for updates
- **Documentation** - Comprehensive guides and tutorials

## 🙏 Acknowledgments

- **Aptos Labs** - For the amazing blockchain platform
- **Move Language** - For secure smart contract development
- **React Community** - For the incredible ecosystem
- **Open Source Contributors** - For making this possible

---

<div align="center">

**🌌 Built with 💜 on Aptos Blockchain 🚀**

[Website](https://aptosai-grid.vercel.app) • [Documentation](https://docs.aptosai-grid.com) • [Discord](https://discord.gg/aptosai) • [Twitter](https://twitter.com/aptosai_grid)

</div>