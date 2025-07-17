import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/contexts/WalletProvider";
import { AptosAIGridContract } from "@/lib/aptosContract";
import { apiRequest } from "@/lib/queryClient";
import { createModelInferencePayment, getModelPrice, formatAPT, verifyPaymentTransaction } from "@/lib/aptosPayment";
import type { AiModel } from "@shared/schema";

export default function ModelDiscovery() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const { toast } = useToast();
  const { wallet, signAndSubmitTransaction, aptos, refreshBalance } = useWallet();

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
    mutationFn: async ({ model, input }: { model: AiModel; input: any }) => {
      // Check if wallet is connected
      if (!wallet.connected) {
        throw new Error("Please connect your Petra wallet to try this model");
      }

      // Get the price for this model
      const modelPrice = getModelPrice(model.name);
      
      // Check if user has sufficient balance
      if (wallet.balance < modelPrice) {
        throw new Error(`Insufficient balance. You need ${formatAPT(modelPrice)} APT but only have ${formatAPT(wallet.balance)} APT`);
      }

      // Create payment transaction
      const paymentTransaction = await createModelInferencePayment(
        aptos,
        wallet.address!,
        model.id.toString(),
        model.name
      );

      // Sign and submit the payment transaction
      const txResult = await signAndSubmitTransaction(paymentTransaction);
      
      if (!txResult.hash) {
        throw new Error("Payment transaction failed");
      }

      // Verify the payment transaction
      const isPaymentValid = await verifyPaymentTransaction(aptos, txResult.hash);
      if (!isPaymentValid) {
        throw new Error("Payment verification failed");
      }

      // Refresh balance after payment
      await refreshBalance();

      // Now execute the model inference
      const response = await apiRequest("POST", `/api/models/${model.id}/infer`, {
        input,
        userId: 1, // Mock user ID
        paymentTxHash: txResult.hash,
        paidAmount: modelPrice
      });

      return {
        ...response.json(),
        txHash: txResult.hash,
        paidAmount: modelPrice
      };
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Model Inference Complete! 🎉",
        description: `Successfully paid ${formatAPT(data.paidAmount)} APT and executed ${variables.model.name}. Tx: ${data.txHash.slice(0, 10)}...`,
      });
    },
    onError: (error) => {
      toast({
        title: "Model Inference Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleTryModel = (model: AiModel) => {
    // Check wallet connection first
    if (!wallet.connected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your Petra wallet to try this model",
        variant: "destructive",
      });
      return;
    }

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

    // Show confirmation toast with price
    const modelPrice = getModelPrice(model.name);
    toast({
      title: "Processing Payment...",
      description: `This will cost ${formatAPT(modelPrice)} APT from your wallet`,
    });

    inferenceMutation.mutate({ model, input });
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
    <section id="models" className="compact-section bg-background constellation-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold holographic mb-2">🔭 Discover AI Models</h2>
            <p className="text-muted-foreground">Browse, test, and use cutting-edge AI models from the cosmos</p>
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
                      {formatAPT(getModelPrice(model.name))} APT/query
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

        {/* Blockchain Test Section */}
        <BlockchainTestSection />
      </div>
    </section>
  );
}

function BlockchainTestSection() {
  const { wallet, signAndSubmitTransaction } = useWallet();
  const { toast } = useToast();
  const [testModelId, setTestModelId] = useState("1");

  const testInferenceMutation = useMutation({
    mutationFn: async (modelId: number) => {
      if (!wallet.connected) {
        throw new Error("Please connect your wallet first");
      }

      const transaction = await AptosAIGridContract.executeInference(modelId);
      const result = await signAndSubmitTransaction(transaction);
      return result;
    },
    onSuccess: (data) => {
      toast({
        title: "Blockchain Transaction Successful!",
        description: `Inference executed on testnet. Transaction: ${data.hash?.slice(0, 10)}...`,
      });
    },
    onError: (error) => {
      toast({
        title: "Transaction Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const { data: blockchainStats, refetch: refetchStats } = useQuery({
    queryKey: ["blockchain-test-stats"],
    queryFn: async () => {
      const [totalModels, totalInferences] = await Promise.all([
        AptosAIGridContract.getTotalModels(),
        AptosAIGridContract.getTotalInferences(),
      ]);
      return { totalModels, totalInferences };
    },
    refetchInterval: 5000,
  });

  return (
    <div className="mt-16 pt-16 border-t border-border">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-foreground mb-2">🧪 Blockchain Test Zone</h3>
        <p className="text-muted-foreground">Test smart contract interactions on Aptos testnet</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="glass border-primary/20">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-2">
              {blockchainStats?.totalModels || 0}
            </div>
            <div className="text-muted-foreground">Models on Chain</div>
          </CardContent>
        </Card>
        
        <Card className="glass border-secondary/20">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-secondary mb-2">
              {blockchainStats?.totalInferences || 0}
            </div>
            <div className="text-muted-foreground">Total Inferences</div>
          </CardContent>
        </Card>

        <Card className="glass border-accent/20">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-accent mb-2">
              {wallet.connected ? wallet.balance.toFixed(4) : '0.0000'}
            </div>
            <div className="text-muted-foreground">Your APT Balance</div>
          </CardContent>
        </Card>
      </div>

      {wallet.connected ? (
        <Card className="glass border-border">
          <CardContent className="p-6">
            <h4 className="font-semibold text-foreground mb-4">Test Smart Contract Interaction</h4>
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Model ID to Test
                </label>
                <Input
                  type="number"
                  value={testModelId}
                  onChange={(e) => setTestModelId(e.target.value)}
                  placeholder="Enter model ID"
                  className="bg-background/50 border-border"
                />
              </div>
              <Button
                onClick={() => testInferenceMutation.mutate(parseInt(testModelId))}
                disabled={testInferenceMutation.isPending || !testModelId}
                className="gradient-primary text-white"
              >
                {testInferenceMutation.isPending ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Executing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-rocket mr-2"></i>
                    Test Inference
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              This will execute a real transaction on Aptos testnet and may cost a small amount of APT.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="glass border-border">
          <CardContent className="p-6 text-center">
            <i className="fas fa-wallet text-4xl text-muted-foreground mb-4"></i>
            <h4 className="font-semibold text-foreground mb-2">Connect Your Wallet</h4>
            <p className="text-muted-foreground">
              Connect your Petra wallet to test blockchain interactions
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
