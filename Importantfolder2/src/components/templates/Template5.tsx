import type { LandingPageData } from "@/lib/types";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Twitter, Instagram, Facebook, Image as ImageIcon } from "lucide-react";

export function Template5(props: LandingPageData) {
  const {
    companyInfo,
    generatedContent,
    media,
  } = props;

  const heroImage = media?.coverImage;

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      {/* Header */}
      <header className="container mx-auto px-6 py-6 flex justify-between items-center">
        <h2 className="font-headline text-xl font-bold tracking-widest uppercase">{companyInfo?.name}</h2>
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#about" className="hover:text-primary transition-colors">About</a>
          <a href="#work" className="hover:text-primary transition-colors">Work</a>
          <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
        </nav>
        <Button variant="outline" className="hidden md:block border-primary text-primary hover:bg-primary hover:text-gray-900">
          {generatedContent?.callToAction || "Get In Touch"}
        </Button>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-10 pb-20 md:pt-20 md:pb-32">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-headline font-thin tracking-tighter">
              {generatedContent?.headline || "Design That Inspires"}
            </h1>
            <p className="text-lg text-gray-400">
              {generatedContent?.body || "We create stunning digital experiences that captivate and engage."}
            </p>
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 group">
              View Our Work <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          <div className="relative h-80 md:h-[500px] w-full shadow-2xl shadow-primary/10">
            {heroImage ? (
              <Image
                src={heroImage}
                alt={`${companyInfo?.name} hero image`}
                fill
                className="object-cover rounded-lg"
                data-ai-hint="dark moody"
              />
            ) : (
              <div className="h-full w-full bg-gray-800 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-16 h-16 text-gray-600" />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* About Section */}
      <section id="about" className="bg-gray-900/50 py-20">
          <div className="container mx-auto px-6 max-w-4xl text-center">
              <h2 className="text-3xl font-headline font-thin mb-4">About Us</h2>
              <p className="text-gray-400 text-lg">{companyInfo?.description}</p>
          </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 py-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-500">&copy; {new Date().getFullYear()} {companyInfo?.name}. All rights reserved.</p>
          {companyInfo?.socialLinks && companyInfo.socialLinks.length > 0 && companyInfo.socialLinks[0] !== '' && (
            <div className="flex justify-center gap-6 mt-6">
              {companyInfo.socialLinks.map((link, i) => {
                  let Icon = Twitter;
                  if (link.includes('instagram')) Icon = Instagram;
                  if (link.includes('facebook')) Icon = Facebook;
                  return (
                    <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary transition-colors">
                        <Icon className="w-6 h-6" />
                    </a>
                  )
              })}
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
