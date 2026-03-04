
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { aiAdContentGenerator, type AiAdContentGeneratorOutput } from "@/ai/flows/ai-ad-content-generator";
import { Sparkles, Megaphone, Loader2, Plus, X, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdCampaignTool() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [productService, setProductService] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [tone, setTone] = useState("energetic");
  const [keyPoints, setKeyPoints] = useState<string[]>([""]);
  const [generatedContent, setGeneratedContent] = useState<AiAdContentGeneratorOutput | null>(null);

  const handleAddPoint = () => setKeyPoints([...keyPoints, ""]);
  const handleRemovePoint = (index: number) => setKeyPoints(keyPoints.filter((_, i) => i !== index));
  const handlePointChange = (index: number, val: string) => {
    const newPoints = [...keyPoints];
    newPoints[index] = val;
    setKeyPoints(newPoints);
  };

  const handleGenerate = async () => {
    if (!productService || !targetAudience) {
      toast({ title: "Error", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const result = await aiAdContentGenerator({
        productService,
        targetAudience,
        keySellingPoints: keyPoints.filter(p => p.trim() !== ""),
        desiredTone: tone
      });
      setGeneratedContent(result);
    } catch (error) {
      toast({ title: "Error", description: "Failed to generate ad content.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">AI Ad Campaign Tool</h1>
        <p className="text-muted-foreground">Configure and launch optimized Meta ad campaigns using generative AI.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-card border-border shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-primary" />
              Campaign Configuration
            </CardTitle>
            <CardDescription>Tell the AI about your academy and offerings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="product">Product or Service</Label>
              <Input 
                id="product" 
                placeholder="e.g. 3-Month Martial Arts Intensive" 
                value={productService}
                onChange={(e) => setProductService(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience">Target Audience</Label>
              <Input 
                id="audience" 
                placeholder="e.g. Parents of children aged 6-12" 
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Key Selling Points</Label>
              {keyPoints.map((point, index) => (
                <div key={index} className="flex gap-2">
                  <Input 
                    placeholder={`Point ${index + 1}`} 
                    value={point}
                    onChange={(e) => handlePointChange(index, e.target.value)}
                  />
                  {keyPoints.length > 1 && (
                    <Button variant="ghost" size="icon" onClick={() => handleRemovePoint(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" className="mt-2 w-full" onClick={handleAddPoint}>
                <Plus className="h-4 w-4 mr-2" /> Add Key Point
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Desired Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="energetic">Energetic</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="empathetic">Empathetic</SelectItem>
                  <SelectItem value="inspiring">Inspiring</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              className="w-full rounded-xl bg-primary hover:bg-primary/90 h-12" 
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
              ) : (
                <><Sparkles className="mr-2 h-4 w-4" /> Generate Ad Content</>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {generatedContent ? (
            <>
              <Card className="bg-card border-border shadow-md">
                <CardHeader>
                  <CardTitle className="text-sm font-headline uppercase tracking-wider text-accent">AI Ad Copy Variations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {generatedContent.adCopies.map((copy, idx) => (
                    <div key={idx} className="p-4 bg-secondary/50 rounded-xl border border-border group relative">
                      <p className="text-sm leading-relaxed">{copy}</p>
                      <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-card border-border shadow-md">
                <CardHeader>
                  <CardTitle className="text-sm font-headline uppercase tracking-wider text-accent">AI Image Suggestions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {generatedContent.imageSuggestions.map((suggestion, idx) => (
                    <div key={idx} className="p-4 bg-primary/5 rounded-xl border border-primary/20 flex gap-4 items-start">
                      <div className="mt-1 h-6 w-6 bg-primary text-white flex items-center justify-center rounded-full text-xs font-bold flex-shrink-0">
                        {idx + 1}
                      </div>
                      <p className="text-sm italic">{suggestion}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="h-full border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
              <Sparkles className="h-12 w-12 mb-4 opacity-20" />
              <p>Generation results will appear here after you configure and launch the process.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
