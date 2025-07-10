import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { AiModel } from "@shared/schema";

export default function ModelDiscovery() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const { toast } = useToast();

  const { data: models, isLoading } = useQuery<AiModel[]>({
    queryKey: ["/api/models", selectedCategory !== "All Categories" ? selectedCategory : undefined, searchTerm || undefined],
    queryFn: async ({ queryKey }) => {
      const [url, category, search] = queryKey;
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (search) params.set('search', search);
      
      const response = await fetch(`${url}?${params}`);
      if (!response.ok) throw new Error('Failed to fetch models');
      return response.json();
    },
  });

  const inferenceMutation = useMutation({
    mutationFn: async ({ modelId, input }: { modelId: number; input: any }) => {
      const response = await apiRequest("POST", `/api/models/${modelId}/infer`, {
        input,
        userId: 1, // Mock user ID
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Inference Complete",
        description: `Model executed successfully. Cost: ${data.cost} APT`,
      });
    },
    onError: (error) => {
      toast({
        title: "Inference Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleTryModel = (model: AiModel) => {
    // Mock input based on model category
    let input;
    switch (model.category) {
      case "Computer Vision":
        input = { image_url: "https://example.com/test-image.jpg" };
        break;
      case "Language":
        input = { prompt: "Write a smart contract for token transfer" };
        break;
      case "Audio":
        input = { description: "Epic orchestral music with piano" };
        break;
      default:
        input = { data: "test input" };
    }

    inferenceMutation.mutate({ modelId: model.id, input });
  };

  const categories = ["All Categories", "Computer Vision", "Language", "Audio", "Multimodal"];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Computer Vision": return "fas fa-eye";
      case "Language": return "fas fa-comments";
      case "Audio": return "fas fa-music";
      default: return "fas fa-brain";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Computer Vision": return "bg-accent/10 text-accent";
      case "Language": return "bg-primary/10 text-primary";
      case "Audio": return "bg-secondary/10 text-secondary";
      default: return "bg-neutral/10 text-neutral";
    }
  };

  return (
    <section id="models" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-4">Discover AI Models</h2>
            <p className="text-muted-foreground text-lg">Browse, test, and use cutting-edge AI models from the community</p>
          </div>
          <div className="mt-6 lg:mt-0 flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search models..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-80 pl-10"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse glass border-border">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded mb-4"></div>
                  <div className="h-3 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded mb-4"></div>
                  <div className="h-8 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {models?.map((model) => (
              <Card key={model.id} className="glass border-border hover-lift cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center">
                        <i className={`${getCategoryIcon(model.category)} text-white`}></i>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{model.name}</h3>
                        <p className="text-sm text-muted-foreground">by @{model.creatorId === 1 ? 'ai_researcher' : model.creatorId === 2 ? 'blockchain_dev' : 'sound_artist'}</p>
                      </div>
                    </div>
                    <Badge className={getCategoryColor(model.category)}>
                      {model.category}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">{model.description}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>
                      <i className="fas fa-download mr-1"></i>
                      {model.usageCount.toLocaleString()} uses
                    </span>
                    <span>
                      <i className="fas fa-star mr-1"></i>
                      {model.rating} rating
                    </span>
                    <span className="text-secondary font-medium">
                      {model.pricePerInference} APT/query
                    </span>
                  </div>
                  <Button 
                    onClick={() => handleTryModel(model)}
                    disabled={inferenceMutation.isPending}
                    className="w-full gradient-primary text-white hover:opacity-90"
                  >
                    {inferenceMutation.isPending ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-play mr-2"></i>
                        Try Model
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {models && models.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No models found matching your criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
}
