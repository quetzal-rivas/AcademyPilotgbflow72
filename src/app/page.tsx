
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { 
  Megaphone, 
  MessageSquare, 
  Mic, 
  CheckCircle, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  Zap 
} from 'lucide-react';

export default function LandingPage() {
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-automation');
  const dashboardImg = PlaceHolderImages.find(img => img.id === 'dashboard-preview');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-8 w-8 text-primary" />
            <span className="font-headline text-2xl font-bold tracking-tight">Academia Pilot</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="#features" className="hover:text-accent transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-accent transition-colors">How it Works</Link>
            <Link href="/login" className="hover:text-accent transition-colors">Login</Link>
          </nav>
          <Button asChild className="bg-primary hover:bg-primary/90 text-white font-medium">
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </header>

      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="py-24 md:py-32 relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full z-0" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-bottom-4 duration-700">
                Revolutionizing Academy Sales
              </div>
              <h1 className="font-headline text-5xl md:text-7xl font-bold leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                Scale Your Academy with <span className="text-accent">AI Automation</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                Automate your marketing, qualify leads instantly via voice and chat, and manage your entire commercial pipeline with a single AI-powered platform.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                <Button size="lg" className="bg-primary hover:bg-primary/90 px-8 py-6 text-lg h-auto w-full sm:w-auto rounded-xl">
                  Start Your Pilot <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="px-8 py-6 text-lg h-auto w-full sm:w-auto rounded-xl">
                  View Demo
                </Button>
              </div>
            </div>

            <div className="mt-20 rounded-2xl border border-border bg-card p-4 shadow-2xl animate-in fade-in zoom-in duration-1000 delay-500">
              <div className="aspect-video relative rounded-xl overflow-hidden bg-muted">
                <Image 
                  src={dashboardImg?.imageUrl || 'https://picsum.photos/seed/academia2/800/600'} 
                  alt="Dashboard Preview" 
                  fill 
                  className="object-cover"
                  data-ai-hint="dashboard software"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
              <h2 className="font-headline text-3xl md:text-5xl font-bold">Powerful AI Features</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Everything you need to automate your commercial process from lead capture to enrollment.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Megaphone className="h-8 w-8 text-accent" />}
                title="AI Ad Campaigns"
                description="Generate optimized Meta ad copy and images instantly. Launch campaigns that convert without the creative headache."
              />
              <FeatureCard 
                icon={<MessageSquare className="h-8 w-8 text-accent" />}
                title="Omnichannel Assistants"
                description="AI-driven agents for WhatsApp, Messenger, and SMS that capture and qualify leads 24/7."
              />
              <FeatureCard 
                icon={<Mic className="h-8 w-8 text-accent" />}
                title="AI Voice Qualification"
                description="Advanced voice agents that handle inbound calls, qualify students, and book appointments automatically."
              />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="flex-1 space-y-8">
                <h2 className="font-headline text-4xl font-bold leading-tight">From Integration to <span className="text-primary">Automation</span> in Minutes</h2>
                <div className="space-y-6">
                  <Step icon={<TrendingUp />} title="Connect Your APIs" description="Securely link your Meta, Twilio, and ElevenLabs accounts to our centralized hub." />
                  <Step icon={<CheckCircle />} title="Configure Your Agents" description="Customize how your AI agents talk to your potential students using our simple tools." />
                  <Step icon={<ShieldCheck />} title="Monitor Performance" description="Track every lead and conversion through a unified dashboard with real-time metrics." />
                </div>
                <Button className="mt-4 rounded-xl px-8 py-6 h-auto text-lg">Launch Your First Campaign</Button>
              </div>
              <div className="flex-1 relative">
                <div className="aspect-square relative rounded-3xl overflow-hidden border border-border shadow-2xl">
                   <Image 
                    src={heroImg?.imageUrl || 'https://picsum.photos/seed/academia1/1200/800'} 
                    alt="Automation Concept" 
                    fill 
                    className="object-cover"
                    data-ai-hint="technology automation"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary">
          <div className="container mx-auto px-4 text-center text-white space-y-8">
            <h2 className="font-headline text-4xl md:text-5xl font-bold">Ready to take off?</h2>
            <p className="text-primary-foreground/80 text-xl max-w-2xl mx-auto">Join dozens of academies that have scaled their enrollment by 40% using Academia Pilot automation.</p>
            <Button size="lg" variant="secondary" className="px-10 py-7 text-lg h-auto rounded-xl font-bold">
              Get Started for Free
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              <span className="font-headline text-xl font-bold">Academia Pilot</span>
            </div>
            <div className="flex gap-8 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground">Privacy Policy</Link>
              <Link href="#" className="hover:text-foreground">Terms of Service</Link>
              <Link href="#" className="hover:text-foreground">Contact Us</Link>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 Academia Pilot. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-all group">
      <div className="mb-6 p-3 bg-secondary rounded-xl inline-block group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-headline text-xl font-bold mb-4">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function Step({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 h-10 w-10 flex-shrink-0 bg-primary/10 text-primary flex items-center justify-center rounded-lg">
        {icon}
      </div>
      <div>
        <h4 className="font-headline text-lg font-bold">{title}</h4>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
