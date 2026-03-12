
import Link from "next/link"
import { Shield, ArrowLeft, Zap, Scale } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="h-full w-full bg-[repeating-linear-gradient(0deg,transparent,transparent_1px,rgba(255,255,255,0.1)_1px,rgba(255,255,255,0.1)_2px)] bg-[length:100%_2px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-12 flex justify-between items-center border-b-4 border-border pb-8">
          <Link href="/" className="flex items-center gap-2 group text-primary font-black uppercase italic tracking-widest text-xs">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            ABORT TO BASE
          </Link>
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8">
              <img 
                src="https://graciebarra.com/wp-content/uploads/2025/07/logos-barra-shield.svg" 
                alt="Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-headline text-2xl font-black italic tracking-tighter text-primary uppercase">GRACIE BARRA AI</span>
          </div>
        </div>

        <article className="bg-card border-4 border-border p-8 sm:p-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Scale size={200} />
          </div>

          <header className="mb-12 border-l-8 border-primary pl-8">
            <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-foreground leading-none">
              Terms of <br />
              <span className="text-primary">Engagement</span>
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground mt-4">Professional Service & Asset Management Agreement // v2.1</p>
          </header>

          <div className="space-y-12 text-muted-foreground font-medium italic">
            <section className="space-y-4">
              <h2 className="text-xl font-black uppercase italic tracking-tight text-foreground flex items-center gap-3">
                <div className="h-2 w-2 bg-primary rotate-45" /> 1. NATURE OF RELATIONSHIP
              </h2>
              <p className="pl-5 border-l-2 border-border text-sm leading-relaxed">
                The Provider acts as a technology service provider and asset manager. In exchange for software access, the Provider receives fixed fees, performance bounties, and digital asset leaseholds (House Students).
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black uppercase italic tracking-tight text-foreground flex items-center gap-3">
                <div className="h-2 w-2 bg-primary rotate-45" /> 2. PERFORMANCE STUDY
              </h2>
              <p className="pl-5 border-l-2 border-border text-sm leading-relaxed">
                Service activation is preceded by a mandatory thirty (30) day Marketing Performance Study to categorize the Academy's operational status: Struggling, Stable, or Elite.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black uppercase italic tracking-tight text-foreground flex items-center gap-3">
                <div className="h-2 w-2 bg-primary rotate-45" /> 3. SERVICE FEES
              </h2>
              <div className="pl-5 border-l-2 border-border space-y-4 text-sm leading-relaxed">
                <p><strong className="text-foreground uppercase">3.1 Fixed Fee:</strong> $150 USD monthly membership for software and infrastructure access.</p>
                <p><strong className="text-foreground uppercase">3.2 Success Fee:</strong> $50 USD for every Software-Attributed Lead that enrolls, excluding House Students.</p>
                <p><strong className="text-foreground uppercase">3.3 Audit Rights:</strong> Provider reserves quarterly audit rights of sign-in sheets and CRM databases to verify signup integrity.</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black uppercase italic tracking-tight text-foreground flex items-center gap-3">
                <div className="h-2 w-2 bg-primary rotate-45" /> 4. THE "HOUSE STUDENT" PROTOCOL
              </h2>
              <div className="pl-5 border-l-2 border-border space-y-4 text-sm leading-relaxed text-primary">
                <p>The fifth (5th) signup of each calendar month is designated as a "House Student." 100% of membership dues for this unit belong to the Provider for the lifetime of their membership.</p>
              </div>
            </section>
          </div>

          <footer className="mt-16 pt-8 border-t-2 border-border flex justify-between items-center">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-50">© 2024 GRACIE BARRA AI PILOT SYSTEM. TERMS OF ENGAGEMENT V2.1</p>
            <Zap className="h-4 w-4 text-primary opacity-20" />
          </footer>
        </article>
      </div>
    </div>
  )
}
