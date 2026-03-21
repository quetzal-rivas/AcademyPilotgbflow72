import type { LandingPageData } from "@/lib/types";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { PlayCircle, Image as ImageIcon } from "lucide-react";

export function Template6(props: LandingPageData) {
  const {
    companyInfo,
    generatedContent,
    offerings,
    media,
  } = props;

  return (
    <div className="bg-[#FDF6E3] text-[#4F4F4F] font-serif">
      {/* Header */}
      <header className="container mx-auto px-8 py-6 flex justify-between items-center">
        <h2 className="font-headline text-2xl font-bold text-[#E53935]">{companyInfo?.name}</h2>
        <Button className="bg-[#4CAF50] text-white hover:bg-[#43A047] rounded-full px-6 text-base">
          {generatedContent?.callToAction || "Sign Up"}
        </Button>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-8 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-headline font-black text-[#1E88E5] leading-tight">
            {generatedContent?.headline || "Unleash Your Creativity"}
          </h1>
          <p className="mt-6 text-xl">
            {generatedContent?.body || "A new way to experience digital products."}
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Button size="lg" className="bg-[#E53935] text-white hover:bg-[#D32F2F] rounded-full px-8 py-6 text-lg">
              Get Started
            </Button>
            {media?.promotionalVideo && (
              <Button asChild size="lg" variant="outline" className="border-[#1E88E5] text-[#1E88E5] hover:bg-[#1E88E5]/10 rounded-full px-8 py-6 text-lg">
                <a href={media.promotionalVideo} target="_blank" rel="noopener noreferrer">
                  <PlayCircle className="mr-2" /> Watch Video
                </a>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Product Section */}
      {offerings && offerings.length > 0 && offerings[0]?.name !== '' && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-8">
            <h2 className="text-4xl font-headline font-bold text-center mb-12 text-[#1E88E5]">Our Features</h2>
            <div className="grid md:grid-cols-3 gap-10">
              {offerings.slice(0,3).map((offering, index) => (
                <Card key={index} className="bg-[#FDF6E3] border-2 border-[#4F4F4F] rounded-xl shadow-[8px_8px_0px_#4F4F4F]">
                  <CardContent className="p-8">
                    <div className="relative aspect-square mb-6 rounded-lg overflow-hidden">
                        {offering.image ? (
                          <Image src={offering.image} alt={offering.name} fill className="object-cover" data-ai-hint="colorful abstract"/>
                        ) : (
                          <div className="h-full w-full bg-yellow-100 flex items-center justify-center">
                            <ImageIcon className="w-16 h-16 text-yellow-500" />
                          </div>
                        )}
                    </div>
                    <CardTitle className="text-2xl font-headline font-bold text-[#E53935]">{offering.name}</CardTitle>
                    <p className="mt-2 text-base">{offering.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-[#4F4F4F] text-white py-10">
        <div className="container mx-auto px-8 text-center">
          <p>&copy; {new Date().getFullYear()} {companyInfo?.name}. Let's create something amazing.</p>
          {companyInfo?.phone && <p className="mt-2 text-lg">{companyInfo.phone}</p>}
        </div>
      </footer>
    </div>
  );
}
