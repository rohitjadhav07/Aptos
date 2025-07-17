import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/contexts/WalletProvider";
import { AptosAIGridContract } from "@/lib/aptosContract";

export default function ModelUpload() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    pricePerInference: "",
    storageType: "ipfs",
  });
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { wallet, signAndSubmitTransaction } = useWallet();

  const uploadMutation = useMutation({
    mutationFn: async (formData: any) => {
      if (!wallet.connected) {
        throw new Error("Please connect your wallet first");
      }

      // Convert APT to octas for the smart contract
      const priceInOctas = AptosAIGridContract.aptToOctas(parseFloat(formData.pricePerInference));
      
      // Create the transaction for the smart contract
      const transaction = await AptosAIGridContract.uploadModel(
        formData.name,
        formData.description,
        priceInOctas
      );

      // Sign and submit the transaction
      const result = await signAndSubmitTransaction(transaction);
      
      return {
        name: formData.name,
        transactionHash: result.hash,
        ...result
      };
    },
    onSuccess: (data) => {
      toast({
        title: "Model Uploaded to Blockchain!",
        description: `Your model "${data.name}" has been uploaded to Aptos testnet. Transaction: ${data.transactionHash?.slice(0, 10)}...`,
      });
      setFormData({
        name: "",
        category: "",
        description: "",
        pricePerInference: "",
        storageType: "ipfs",
      });
      setFile(null);
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!wallet.connected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your Aptos wallet to upload models",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name || !formData.description || !formData.pricePerInference) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    uploadMutation.mutate(formData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const categories = ["Computer Vision", "Natural Language", "Audio Processing", "Multimodal"];
  const storageOptions = [
    { value: "ipfs", label: "IPFS (Decentralized)" },
    { value: "filecoin", label: "Filecoin (Long-term)" },
    { value: "ocean", label: "Ocean Protocol" },
  ];

  return (
    <section id="upload" className="compact-section constellation-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold holographic mb-6">🚀 Upload Your AI Model</h2>
          <p className="text-muted-foreground text-xl">Share your AI innovations with the cosmos and start earning APT tokens</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="glass border-border">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-6">Model Information</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name" className="text-foreground">Model Name</Label>
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Enter model name"
                          className="glass border-primary/30 text-white placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="category" className="text-foreground">Category</Label>
                        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                          <SelectTrigger className="glass border-primary/30 text-white focus:border-primary focus:ring-2 focus:ring-primary/20">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent className="glass border-primary/30 bg-background/90">
                            {categories.map((category) => (
                              <SelectItem key={category} value={category} className="text-white hover:bg-primary/20">
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="description" className="text-foreground">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Describe your model's capabilities..."
                          className="glass border-primary/30 text-white placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                          rows={4}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="price" className="text-foreground">Price per Inference (APT)</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={formData.pricePerInference}
                          onChange={(e) => setFormData({ ...formData, pricePerInference: e.target.value })}
                          placeholder="0.00"
                          className="glass border-primary/30 text-white placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-6">Model Files</h3>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center hover:border-primary/60 transition-all duration-300 cursor-pointer glass cosmic-glow">
                        <i className="fas fa-rocket text-5xl text-gradient mb-4 animate-pulse"></i>
                        <p className="text-foreground mb-2 font-semibold">🌌 Launch your model to the cosmos</p>
                        <p className="text-sm text-muted-foreground">or click to browse your stellar files</p>
                        <p className="text-xs text-muted-foreground mt-2">Supports: .pkl, .pt, .h5, .onnx, .zip</p>
                        <Input
                          type="file"
                          onChange={handleFileChange}
                          accept=".pkl,.pt,.h5,.onnx,.zip"
                          className="hidden"
                          id="file-upload"
                        />
                        <Label htmlFor="file-upload" className="cursor-pointer">
                          <Button type="button" variant="outline" className="mt-4 border-border text-foreground hover:bg-muted">
                            Choose File
                          </Button>
                        </Label>
                        {file && (
                          <p className="mt-2 text-sm text-foreground">Selected: {file.name}</p>
                        )}
                      </div>
                      
                      <Card className="glass border-border">
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-3 text-foreground">Storage Options</h4>
                          <div className="space-y-2">
                            {storageOptions.map((option) => (
                              <Label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                                <input
                                  type="radio"
                                  name="storage"
                                  value={option.value}
                                  checked={formData.storageType === option.value}
                                  onChange={(e) => setFormData({ ...formData, storageType: e.target.value })}
                                  className="text-primary"
                                />
                                <span className="text-sm text-foreground">{option.label}</span>
                              </Label>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-secondary/10 border-secondary/20">
                        <CardContent className="p-4">
                          <h4 className="font-medium text-secondary mb-2">Estimated Earnings</h4>
                          <p className="text-sm text-muted-foreground">Based on similar models in your category</p>
                          <p className="text-2xl font-bold text-secondary mt-2">~45 APT/month</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      type="submit"
                      disabled={uploadMutation.isPending}
                      className="btn-stellar gradient-primary text-white px-8 py-4 rounded-xl font-semibold cosmic-glow"
                    >
                      {uploadMutation.isPending ? (
                        <>
                          <div className="cosmic-spinner mr-2"></div>
                          🚀 Launching to Blockchain...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-rocket mr-2"></i>
                          🌟 Launch Model to Cosmos
                        </>
                      )}
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      className="btn-stellar glass border-primary/30 text-foreground px-8 py-4 rounded-xl font-semibold hover:bg-primary/10 transition-all"
                    >
                      <i className="fas fa-eye mr-2"></i>👁️ Preview Model
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
