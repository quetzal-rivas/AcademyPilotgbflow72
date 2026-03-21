import type { LandingPageData } from "@/lib/types";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MessageSquare, Image as ImageIcon } from "lucide-react";

export function Template3(props: LandingPageData) {
  const {
    companyInfo,
    generatedContent,
    offerings,
    media,
  } = props;

  const galleryImages = media?.galleryImages?.slice(0, 3);

  return (
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 text-gray-800 font-sans">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-headline font-extrabold text-gray-900 drop-shadow-sm">
          {generatedContent?.headline || `The Future is ${companyInfo?.name}`}
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
          {generatedContent?.body || "We build creative solutions for bold brands."}
        </p>
        <Button size="lg" className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg transform hover:scale-105 transition-transform">
          {generatedContent?.callToAction || "Start Your Project"}
        </Button>
      </section>

      {/* Offerings Section */}
      {offerings && offerings.length > 0 && offerings[0]?.name !== '' && (
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {offerings.slice(0,3).map((offering, index) => (
                <div key={index} className="text-center">
                  {offering.image ? (
                    <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden shadow-lg">
                      <Image src={offering.image} alt={offering.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-24 w-24 mx-auto bg-primary/10 text-primary rounded-full mb-4">
                       <Star className="h-8 w-8" />
                    </div>
                  )}
                  <h3 className="text-xl font-headline font-bold mb-2">{offering.name}</h3>
                  <p className="text-gray-600">{offering.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">Our Work</h2>
            {(galleryImages && galleryImages.length > 0) ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {galleryImages.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden shadow-lg group">
                        <Image
                            src={img}
                            alt={`Gallery image ${i + 1}`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            data-ai-hint="creative portfolio"
                        />
                    </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground border-2 border-dashed rounded-lg p-12">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-400"/>
                <p>Upload some business images to see your gallery here.</p>
              </div>
            )}
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20">
          <div className="container mx-auto px-6 max-w-4xl">
               <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">What Our Clients Say</h2>
               <Card className="bg-white/50 shadow-lg border-0">
                   <CardContent className="p-8 text-center">
                       <MessageSquare className="w-10 h-10 text-primary mx-auto mb-4" />
                       <p className="text-xl italic text-gray-700">"{companyInfo?.name} delivered beyond our expectations. Their creativity and professionalism are unmatched."</p>
                       <p className="mt-4 font-bold font-headline">- A Happy Client</p>
                   </CardContent>
               </Card>
          </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
            <p>&copy; {new Date().getFullYear()} {companyInfo?.name}. We bring ideas to life.</p>
            {companyInfo?.phone && <p className="mt-2">Call us: {companyInfo.phone}</p>}
        </div>
      </footer>
    </div>
  );
}
