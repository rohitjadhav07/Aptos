import { useEffect, useState } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
  color: string;
}

export default function ShootingStars() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const colors = [
      'hsl(280, 100%, 70%)', // nebula-purple
      'hsl(200, 100%, 60%)', // cosmic-blue
      'hsl(320, 100%, 65%)', // stellar-pink
      'hsl(140, 100%, 50%)', // galaxy-green
      'hsl(30, 100%, 60%)',  // solar-orange
      '#ffffff'              // white
    ];

    const generateStars = () => {
      const newStars: Star[] = [];
      for (let i = 0; i < 8; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 10,
          duration: 2 + Math.random() * 3,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
      setStars(newStars);
    };

    generateStars();
    const interval = setInterval(generateStars, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute w-1 h-1 rounded-full shooting-star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            backgroundColor: star.color,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
            boxShadow: `0 0 10px ${star.color}, 0 0 20px ${star.color}, 0 0 30px ${star.color}`
          }}
        ></div>
      ))}
    </div>
  );
}