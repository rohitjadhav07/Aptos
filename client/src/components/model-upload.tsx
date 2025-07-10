import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

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

  const uploadMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch("/api/models", {
        method: "POST",
        body: data,
      });
      if (!response.ok) throw new Error("Failed to upload model");
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Model Uploaded Successfully",
        description: `Your model "${data.name}" has been uploaded and is now available for inference.`,
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
    
    const data = new FormData();
    data.append("name", formData.name);
    data.append("category", formData.category);
    data.append("description", formData.description);
    data.append("pricePerInference", formData.pricePerInference);
    data.append("storageType", formData.storageType);
    data.append("creatorId", "1"); // Mock creator ID
    
    if (file) {
      data.append("modelFile", file);
    }

    uploadMutation.mutate(data);
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
    <section id="upload" className="py-20 bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Upload Your AI Model</h2>
          <p className="text-muted-foreground text-lg">Share your AI innovations with the world and start earning APT tokens</p>
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
                          className="bg-background/50 border-border text-foreground placeholder-muted-foreground"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="category" className="text-foreground">Category</Label>
                        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                          <SelectTrigger className="bg-background/50 border-border text-foreground">
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
                      <div>
                        <Label htmlFor="description" className="text-foreground">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Describe your model's capabilities..."
                          className="bg-background/50 border-border text-foreground placeholder-muted-foreground"
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
                          className="bg-background/50 border-border text-foreground placeholder-muted-foreground"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-6">Model Files</h3>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/40 transition-colors cursor-pointer">
                        <i className="fas fa-cloud-upload-alt text-4xl text-muted-foreground mb-4"></i>
                        <p className="text-foreground mb-2">Drag & drop your model files here</p>
                        <p className="text-sm text-muted-foreground">or click to browse</p>
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
                      className="gradient-primary text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg hover-lift"
                    >
                      {uploadMutation.isPending ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-upload mr-2"></i>
                          Upload Model
                        </>
                      )}
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      className="glass border-border text-foreground px-8 py-4 rounded-xl font-semibold hover:bg-muted/50 transition-all"
                    >
                      <i className="fas fa-eye mr-2"></i>Preview
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
