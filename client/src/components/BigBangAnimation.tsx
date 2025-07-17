import { useState, useEffect } from 'react';

export default function BigBangAnimation() {
  const [isVisible, setIsVisible] = useState(true);
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    // More realistic timing for Big Bang sequence
    const timer1 = setTimeout(() => setAnimationPhase(1), 800);   // Singularity appears
    const timer2 = setTimeout(() => setAnimationPhase(2), 2000);  // Big Bang explosion
    const timer3 = setTimeout(() => setAnimationPhase(3), 3500);  // Cosmic microwave background
    const timer4 = setTimeout(() => setAnimationPhase(4), 5000);  // First stars form
    const timer5 = setTimeout(() => setAnimationPhase(5), 6500);  // Galaxies form
    const timer6 = setTimeout(() => setAnimationPhase(6), 8000);  // Modern universe
    const timer7 = setTimeout(() => setIsVisible(false), 9500);   // Fade to app

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
      clearTimeout(timer7);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden">
      {/* Cosmic Background */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-purple-900/10 to-black"></div>
      
      {/* Phase 0: Darkness before creation */}
      {animationPhase === 0 && (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <div className="w-1 h-1 bg-white rounded-full opacity-50 animate-pulse"></div>
        </div>
      )}

      {/* Phase 1: Singularity - The point of infinite density */}
      {animationPhase >= 1 && (
        <div className={`absolute transition-all duration-1500 ease-out ${
          animationPhase >= 2 ? 'scale-1000 opacity-30' : 'scale-1 opacity-100'
        }`}>
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" style={{
            boxShadow: '0 0 20px #fff, 0 0 40px #fff, 0 0 60px #fff, 0 0 80px #fff'
          }}></div>
        </div>
      )}

      {/* Phase 2: Big Bang Explosion - Rapid expansion */}
      {animationPhase >= 2 && (
        <>
          {/* Energy waves */}
          <div className="absolute w-32 h-32 border-4 border-white/50 rounded-full animate-ping"></div>
          <div className="absolute w-64 h-64 border-2 border-yellow-400/30 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
          <div className="absolute w-96 h-96 border-2 border-orange-500/20 rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
          <div className="absolute w-[600px] h-[600px] border-2 border-red-500/15 rounded-full animate-ping" style={{animationDelay: '0.6s'}}></div>
          
          {/* Primordial particles */}
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-bounce"
              style={{
                left: `${45 + Math.random() * 10}%`,
                top: `${45 + Math.random() * 10}%`,
                animationDelay: `${Math.random() * 1}s`,
                animationDuration: `${0.5 + Math.random() * 1}s`
              }}
            ></div>
          ))}
        </>
      )}

      {/* Phase 3: Cosmic Microwave Background - Universe cools */}
      {animationPhase >= 3 && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-black animate-pulse">
          {/* First atoms forming */}
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 bg-blue-300 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
      )}

      {/* Phase 4: First Stars - Nuclear fusion begins */}
      {animationPhase >= 4 && (
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            >
              <div className="w-3 h-3 bg-yellow-300 rounded-full" style={{
                boxShadow: '0 0 10px #fef08a, 0 0 20px #fef08a, 0 0 30px #fef08a'
              }}></div>
            </div>
          ))}
        </div>
      )}

      {/* Phase 5: Galaxy Formation - Gravity pulls matter together */}
      {animationPhase >= 5 && (
        <div className="absolute inset-0">
          {/* Spiral galaxies */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 animate-spin" style={{animationDuration: '20s'}}>
            <div className="w-full h-full bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-transparent rounded-full"></div>
          </div>
          <div className="absolute top-3/4 right-1/4 w-24 h-24 animate-spin" style={{animationDuration: '15s', animationDirection: 'reverse'}}>
            <div className="w-full h-full bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-transparent rounded-full"></div>
          </div>
          
          {/* Nebulae */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 80 + 10}%`,
                top: `${Math.random() * 80 + 10}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >
              <div className={`w-16 h-16 rounded-full blur-sm ${
                i % 3 === 0 ? 'bg-purple-500/20' : 
                i % 3 === 1 ? 'bg-blue-500/20' : 'bg-pink-500/20'
              }`}></div>
            </div>
          ))}
        </div>
      )}

      {/* Phase 6: Modern Universe - AptosAI Grid emerges */}
      {animationPhase >= 6 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center animate-fade-in">
            <div className="mb-8">
              <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center cosmic-glow mx-auto mb-4 animate-bounce">
                <i className="fas fa-rocket text-white text-3xl"></i>
              </div>
            </div>
            <div className="text-6xl holographic font-bold mb-4 animate-pulse">
              🌌 AptosAI Grid
            </div>
            <div className="text-xl text-gradient font-semibold animate-pulse">
              The Universe of Decentralized AI
            </div>
          </div>
        </div>
      )}

      {/* Loading Text with realistic progression */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center">
        <div className="text-2xl holographic font-semibold animate-pulse mb-2">
          {animationPhase === 0 && "🌑 Before the Beginning..."}
          {animationPhase === 1 && "⚫ Singularity Detected..."}
          {animationPhase === 2 && "💥 Big Bang in Progress..."}
          {animationPhase === 3 && "🌌 Universe Cooling & Expanding..."}
          {animationPhase === 4 && "⭐ First Stars Igniting..."}
          {animationPhase === 5 && "🌀 Galaxies Forming..."}
          {animationPhase === 6 && "🚀 Welcome to AptosAI Grid!"}
        </div>
        <div className="text-sm text-muted-foreground">
          {animationPhase === 0 && "13.8 billion years ago..."}
          {animationPhase === 1 && "T = 0 seconds"}
          {animationPhase === 2 && "T = 10⁻³² seconds"}
          {animationPhase === 3 && "T = 380,000 years"}
          {animationPhase === 4 && "T = 100 million years"}
          {animationPhase === 5 && "T = 1 billion years"}
          {animationPhase === 6 && "T = Today"}
        </div>
      </div>
    </div>
  );
}