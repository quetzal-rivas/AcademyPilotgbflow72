
import type { LandingPageData } from "@/lib/types";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Phone, Clock, ExternalLink, Image as ImageIcon } from "lucide-react";

export function Template1(props: LandingPageData) {
  const {
    companyInfo,
    generatedContent,
    offerings,
    media,
  } = props;

  const heroImage = media?.coverImage;
  const aboutImage = media?.galleryImages?.[1];

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center w-full text-white text-center py-24 min-h-[60vh]">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={`${companyInfo?.name} hero image`}
            fill
            className="object-cover"
            data-ai-hint="business professional"
          />
        ) : (
          <div className="absolute inset-0 bg-slate-400" />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 p-4 container mx-auto">
          <h1 className="text-4xl md:text-6xl font-headline font-bold drop-shadow-lg">
            {generatedContent?.headline || `Welcome to ${companyInfo?.name}`}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl drop-shadow-md">
            {generatedContent?.body || "High-quality services to meet your needs."}
          </p>
          <Button size="lg" className="mt-8 bg-accent hover:bg-accent/90 text-accent-foreground">
            {generatedContent?.callToAction || "Get in Touch"}
          </Button>
        </div>
      </section>

      {/* Offerings Section */}
      {offerings && offerings.length > 0 && offerings[0]?.name !== '' && (
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">Our Offerings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {offerings.map((offering, index) => (
                <Card key={index} className="flex flex-col overflow-hidden">
                   {offering.image ? (
                    <div className="relative h-48 w-full">
                      <Image src={offering.image} alt={offering.name} fill className="object-cover"/>
                    </div>
                   ) : (
                    <div className="h-48 w-full bg-slate-200 flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-slate-400" />
                    </div>
                   )}
                  <CardHeader>
                    <CardTitle className="font-headline">{offering.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground">{offering.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
      
      <Separator />

      {/* About Section */}
      <section className="py-12 md:py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-headline font-bold">About {companyInfo?.name}</h2>
              <p className="text-lg text-muted-foreground">
                {companyInfo?.description}
              </p>
              <Button variant="link" className="p-0 h-auto text-base">Learn More &rarr;</Button>
            </div>
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
               {aboutImage ? (
                 <Image 
                  src={aboutImage}
                  alt={`About ${companyInfo?.name}`}
                  fill
                  className="object-cover"
                  data-ai-hint="team working"
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

      {/* Contact Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">Contact Us</h2>
          <p className="max-w-2xl mx-auto text-muted-foreground mb-8">
            We're here to help. Reach out to us through any of the methods below.
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-lg">
            {companyInfo?.phone && <div className="flex items-center gap-2"><Phone className="w-5 h-5 text-primary" /> <span>{companyInfo.phone}</span></div>}
            {companyInfo?.hours && <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-primary" /> <span>{companyInfo.hours}</span></div>}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-foreground text-background py-8">
        <div className="container mx-auto px-4 text-center">
            <p>&copy; {new Date().getFullYear()} {companyInfo?.name}. All Rights Reserved.</p>
            {companyInfo?.socialLinks && companyInfo.socialLinks.length > 0 && companyInfo.socialLinks[0] !== '' && (
              <div className="flex justify-center gap-4 mt-4">
                {companyInfo.socialLinks.map((link, i) => (
                  <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                    <ExternalLink className="w-5 h-5" />
                  </a>
                ))}
              </div>
            )}
        </div>
      </footer>
    </div>
  );
}
