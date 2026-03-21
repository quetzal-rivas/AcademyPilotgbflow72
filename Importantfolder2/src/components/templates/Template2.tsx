import type { LandingPageData } from "@/lib/types";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Phone, Clock, Image as ImageIcon } from "lucide-react";

export function Template2(props: LandingPageData) {
  const {
    companyInfo,
    generatedContent,
    offerings,
    media,
  } = props;

  const heroImage = media?.coverImage;

  return (
    <div className="bg-secondary/50 text-foreground font-body">
      {/* Header */}
      <header className="bg-background shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <h2 className="font-headline text-2xl font-bold text-primary">{companyInfo?.name}</h2>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Contact Us</Button>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="bg-background">
        <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight">
                {generatedContent?.headline || `Achieve More with ${companyInfo?.name}`}
              </h1>
              <p className="text-lg text-muted-foreground">
                {generatedContent?.body || "Discover our innovative solutions and professional services tailored for your success."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                 <Button size="lg" className="bg-primary hover:bg-primary/90">
                    {generatedContent?.callToAction || "Get Started"}
                 </Button>
                 <Button size="lg" variant="outline">Learn More</Button>
              </div>
            </div>
            <div className="relative aspect-square rounded-xl overflow-hidden shadow-2xl">
              {heroImage ? (
                <Image
                  src={heroImage}
                  alt={`${companyInfo?.name} hero image`}
                  fill
                  className="object-cover"
                  data-ai-hint="modern office"
                />
              ) : (
                <div className="h-full w-full bg-slate-300 flex items-center justify-center">
                  <ImageIcon className="w-16 h-16 text-slate-500" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Offerings Section */}
      {offerings && offerings.length > 0 && offerings[0]?.name !== '' && (
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
                <h2 className="text-3xl md:text-4xl font-headline font-bold">What We Offer</h2>
                <p className="max-w-2xl mx-auto text-muted-foreground">
                    From innovative products to expert services, we provide the tools you need to excel.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {offerings.map((offering, index) => (
                <Card key={index} className="bg-background border-none shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                  {offering.image ? (
                    <div className="relative h-48 w-full">
                      <Image src={offering.image} alt={offering.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="h-48 w-full bg-slate-200 flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-slate-400" />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <CheckCircle className="w-8 h-8 text-accent mb-4" />
                    <h3 className="text-xl font-headline font-semibold mb-2">{offering.name}</h3>
                    <p className="text-muted-foreground">{offering.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-background py-16 md:py-24">
         <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">Ready to take the next step?</h2>
            <p className="max-w-xl mx-auto text-muted-foreground mb-8">
                Contact us today for a free consultation and see how we can help your business grow.
            </p>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6">
                {generatedContent?.callToAction || "Request a Quote"}
            </Button>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background">
        <div className="container mx-auto px-4 md:px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
                <p>&copy; {new Date().getFullYear()} {companyInfo?.name}. All rights reserved.</p>
                <div className="flex items-center gap-6">
                    {companyInfo?.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> <span>{companyInfo.phone}</span></div>}
                    {companyInfo?.hours && <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> <span>{companyInfo.hours}</span></div>}
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
}
