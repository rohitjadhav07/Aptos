import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import type { User, AiModel } from "@shared/schema";

export default function Leaderboard() {
  const { data: topEarners } = useQuery<User[]>({
    queryKey: ["/api/leaderboard/earners/10"],
  });

  const { data: topModels } = useQuery<AiModel[]>({
    queryKey: ["/api/models/top/10"],
  });

  const getRankIcon = (index: number) => {
    if (index === 0) return "text-accent";
    if (index === 1) return "text-neutral-400";
    if (index === 2) return "text-neutral-400";
    return "text-neutral-400";
  };

  const getRankBg = (index: number) => {
    if (index === 0) return "glass border border-secondary/30 bg-gradient-to-r from-secondary/5 to-secondary/10";
    return "glass border-border";
  };

  return (
    <section id="leaderboard" className="py-20 bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Top Contributors</h2>
          <p className="text-muted-foreground text-lg">Recognize the best AI model creators and highest earners in our ecosystem</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Earners */}
          <Card className="glass border-border">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center">
                <i className="fas fa-trophy text-secondary mr-2"></i>Top Earners
              </h3>
              <div className="space-y-4">
                {topEarners?.map((user, index) => (
                  <div
                    key={user.id}
                    className={`flex items-center justify-between p-4 rounded-lg ${getRankBg(index)}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 text-white rounded-full flex items-center justify-center font-bold ${index === 0 ? 'bg-secondary' : 'bg-muted-foreground'}`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">@{user.username}</p>
                        <p className="text-sm text-muted-foreground">
                          Reputation: {user.reputation}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${index === 0 ? 'text-secondary' : 'text-foreground'}`}>
                        {parseFloat(user.totalEarnings).toLocaleString()} APT
                      </p>
                      <p className="text-sm text-muted-foreground">earned</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Most Popular Models */}
          <Card className="glass border-border">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center">
                <i className="fas fa-fire text-red-500 mr-2"></i>Most Popular Models
              </h3>
              <div className="space-y-4">
                {topModels?.map((model, index) => (
                  <div
                    key={model.id}
                    className={`flex items-center justify-between p-4 rounded-lg ${getRankBg(index)}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 text-white rounded-full flex items-center justify-center font-bold ${index === 0 ? 'bg-primary' : 'bg-muted-foreground'}`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{model.name}</p>
                        <p className="text-sm text-muted-foreground">{model.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${index === 0 ? 'text-primary' : 'text-foreground'}`}>
                        {model.usageCount.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">uses</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
