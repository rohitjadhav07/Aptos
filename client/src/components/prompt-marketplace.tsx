import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Prompt } from "@shared/schema";

export default function PromptMarketplace() {
  const { toast } = useToast();

  const { data: prompts, isLoading } = useQuery<Prompt[]>({
    queryKey: ["/api/prompts"],
  });

  const purchaseMutation = useMutation({
    mutationFn: async (promptId: number) => {
      const response = await apiRequest("POST", `/api/prompts/${promptId}/purchase`, {
        buyerId: 1, // Mock user ID
        transactionHash: `0x${Math.random().toString(16).slice(2)}`,
      });
      return response.json();
    },
    onSuccess: (data, promptId) => {
      const prompt = prompts?.find(p => p.id === promptId);
      toast({
        title: "Purchase Successful",
        description: `You have successfully purchased "${prompt?.title}" NFT for ${prompt?.price} APT`,
      });
    },
    onError: (error) => {
      toast({
        title: "Purchase Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleBuyPrompt = (promptId: number) => {
    purchaseMutation.mutate(promptId);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Photography": return "bg-accent/10 text-accent";
      case "Development": return "bg-primary/10 text-primary";
      case "Art": return "bg-secondary/10 text-secondary";
      default: return "bg-neutral/10 text-neutral";
    }
  };

  return (
    <section id="prompts" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-neutral-900 mb-4">AI Prompt Marketplace</h2>
          <p className="text-neutral-600 text-lg">Discover, buy, and sell premium AI prompts as NFTs with full licensing</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-neutral-200 rounded mb-4"></div>
                  <div className="h-3 bg-neutral-200 rounded mb-2"></div>
                  <div className="h-3 bg-neutral-200 rounded mb-4"></div>
                  <div className="h-16 bg-neutral-200 rounded mb-4"></div>
                  <div className="h-8 bg-neutral-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts?.map((prompt) => (
              <Card key={prompt.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-neutral-900 mb-1">{prompt.title}</h3>
                      <p className="text-sm text-neutral-500">by @{prompt.creatorId === 1 ? 'ai_researcher' : prompt.creatorId === 2 ? 'blockchain_dev' : 'sound_artist'}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <i className="fas fa-certificate text-secondary"></i>
                      <Badge variant="secondary" className="text-xs">NFT</Badge>
                    </div>
                  </div>
                  <p className="text-neutral-600 text-sm mb-4">{prompt.description}</p>
                  <div className="bg-neutral-50 p-3 rounded-lg mb-4">
                    <p className="text-xs text-neutral-500 mb-1">Preview:</p>
                    <p className="text-sm font-mono text-neutral-700 truncate">
                      {prompt.content.substring(0, 80)}...
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-sm text-neutral-500 mb-4">
                    <span>
                      <i className="fas fa-download mr-1"></i>
                      {prompt.salesCount} sales
                    </span>
                    <span>
                      <i className="fas fa-star mr-1"></i>
                      {prompt.rating} rating
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-accent">{prompt.price} APT</span>
                    <Button 
                      onClick={() => handleBuyPrompt(prompt.id)}
                      disabled={purchaseMutation.isPending}
                      className="bg-secondary text-white hover:bg-secondary/90"
                    >
                      {purchaseMutation.isPending ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Buying...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-shopping-cart mr-2"></i>
                          Buy NFT
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button className="bg-secondary text-white px-8 py-4 rounded-xl font-semibold hover:bg-secondary/90 transition-colors shadow-lg">
            <i className="fas fa-plus mr-2"></i>Create & Sell Your Prompt
          </Button>
        </div>
      </div>
    </section>
  );
}
