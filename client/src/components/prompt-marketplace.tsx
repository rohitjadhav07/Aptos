import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { purchasePrompt } from "@/lib/aptosOnchain";
import { useWallet } from "@/contexts/WalletProvider";
import { createModelInferencePayment, formatAPT, verifyPaymentTransaction } from "@/lib/aptosPayment";
import type { Prompt } from "@shared/schema";

export default function PromptMarketplace() {
  const { toast } = useToast();
  const { wallet, signAndSubmitTransaction, aptos, refreshBalance } = useWallet();

  const { data: prompts, isLoading } = useQuery<Prompt[]>({
    queryKey: ["/api/prompts"],
  });

  const purchaseMutation = useMutation({
    mutationFn: async (prompt: Prompt) => {
      // Check if wallet is connected
      if (!wallet.connected) {
        throw new Error("Please connect your Petra wallet to purchase this NFT");
      }

      // Get the price for this NFT
      let price = prompt.price;
      if (typeof price === 'string') price = parseFloat(price);
      
      // Check if user has sufficient balance
      if (wallet.balance < price) {
        throw new Error(`Insufficient balance. You need ${formatAPT(price)} APT but only have ${formatAPT(wallet.balance)} APT`);
      }

      // Create payment transaction for NFT purchase
      const paymentTransaction = {
        type: "entry_function_payload",
        function: "0x1::coin::transfer",
        type_arguments: ["0x1::aptos_coin::AptosCoin"],
        arguments: [
          "0x06ed61974ad9b10aa57c7ed03c7f6936797caf4b62fd5cc61985b4f592f80693", // Platform address
          Math.floor(price * 100000000).toString() // Convert APT to octas
        ]
      };

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

      // Now record the NFT purchase in backend
      const response = await apiRequest("POST", `/api/prompts/${prompt.id}/purchase`, {
        buyerId: 1, // Mock user ID
        transactionHash: txResult.hash,
        paidAmount: price
      });

      return {
        ...response.json(),
        txHash: txResult.hash,
        paidAmount: price,
        prompt
      };
    },
    onSuccess: (data) => {
      toast({
        title: "NFT Purchase Successful! 🎉",
        description: `Successfully purchased "${data.prompt.title}" NFT for ${formatAPT(data.paidAmount)} APT. Tx: ${data.txHash.slice(0, 10)}...`,
      });
    },
    onError: (error) => {
      toast({
        title: "NFT Purchase Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleBuyPrompt = (prompt: Prompt) => {
    // Check wallet connection first
    if (!wallet.connected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your Petra wallet to purchase this NFT",
        variant: "destructive",
      });
      return;
    }

    // Show confirmation toast with price
    let price = prompt.price;
    if (typeof price === 'string') price = parseFloat(price);
    
    toast({
      title: "Processing NFT Purchase...",
      description: `This will cost ${formatAPT(price)} APT from your wallet`,
    });

    purchaseMutation.mutate(prompt);
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
    <section id="prompts" className="compact-section bg-background constellation-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold holographic mb-2">🎨 AI Prompt Marketplace</h2>
          <p className="text-muted-foreground">Discover, buy, and sell premium AI prompts as NFTs across the cosmos</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse glass border-border">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded mb-4"></div>
                  <div className="h-3 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded mb-4"></div>
                  <div className="h-16 bg-muted rounded mb-4"></div>
                  <div className="h-8 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts?.map((prompt) => (
              <Card key={prompt.id} className="glass border-border hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{prompt.title}</h3>
                      <p className="text-sm text-muted-foreground">by @{prompt.creatorId === 1 ? 'ai_researcher' : prompt.creatorId === 2 ? 'blockchain_dev' : 'sound_artist'}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <i className="fas fa-certificate text-secondary"></i>
                      <Badge variant="secondary" className="text-xs">NFT</Badge>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">{prompt.description}</p>
                  <div className="bg-muted/30 p-3 rounded-lg mb-4 border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Preview:</p>
                    <p className="text-sm font-mono text-foreground truncate">
                      {prompt.content.substring(0, 80)}...
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
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
                    <span className="text-lg font-bold text-secondary">{prompt.price} APT</span>
                    <Button 
                      onClick={() => handleBuyPrompt(prompt)}
                      disabled={purchaseMutation.isPending}
                      className="gradient-secondary text-white hover:opacity-90"
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
          <Button className="gradient-secondary text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg hover-lift">
            <i className="fas fa-plus mr-2"></i>Create & Sell Your Prompt
          </Button>
        </div>
      </div>
    </section>
  );
}

