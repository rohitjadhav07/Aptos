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
    if (index === 0) return "bg-gradient-to-r from-accent/5 to-accent/10 border border-accent/20";
    return "bg-neutral-50";
  };

  return (
    <section id="leaderboard" className="py-20 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-neutral-900 mb-4">Top Contributors</h2>
          <p className="text-neutral-600 text-lg">Recognize the best AI model creators and highest earners in our ecosystem</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Earners */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-neutral-900 mb-6 flex items-center">
                <i className="fas fa-trophy text-accent mr-2"></i>Top Earners
              </h3>
              <div className="space-y-4">
                {topEarners?.map((user, index) => (
                  <div
                    key={user.id}
                    className={`flex items-center justify-between p-4 rounded-lg ${getRankBg(index)}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-bold ${index === 0 ? 'bg-accent' : 'bg-neutral-400'}`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900">@{user.username}</p>
                        <p className="text-sm text-neutral-500">
                          Reputation: {user.reputation}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${index === 0 ? 'text-accent' : 'text-neutral-700'}`}>
                        {parseFloat(user.totalEarnings).toLocaleString()} APT
                      </p>
                      <p className="text-sm text-neutral-500">earned</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Most Popular Models */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-neutral-900 mb-6 flex items-center">
                <i className="fas fa-fire text-red-500 mr-2"></i>Most Popular Models
              </h3>
              <div className="space-y-4">
                {topModels?.map((model, index) => (
                  <div
                    key={model.id}
                    className={`flex items-center justify-between p-4 rounded-lg ${getRankBg(index)}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 text-white rounded-full flex items-center justify-center font-bold ${index === 0 ? 'bg-primary' : 'bg-neutral-400'}`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900">{model.name}</p>
                        <p className="text-sm text-neutral-500">{model.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${index === 0 ? 'text-primary' : 'text-neutral-700'}`}>
                        {model.usageCount.toLocaleString()}
                      </p>
                      <p className="text-sm text-neutral-500">uses</p>
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
