
import Link from "next/link"
import { Shield, ArrowLeft, Zap, Landmark } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TaxationPage() {
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
            <Landmark size={200} />
          </div>

          <header className="mb-12 border-l-8 border-primary pl-8">
            <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-foreground leading-none">
              Taxation <br />
              <span className="text-primary">Compliance</span>
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground mt-4">Tactical Advisory Memo for Academy Accountants // v2.4</p>
          </header>

          <div className="space-y-12 text-muted-foreground font-medium italic">
            <section className="p-6 bg-primary/5 border-2 border-primary/20 rounded-none italic mb-8">
              <p className="text-sm font-bold text-foreground uppercase tracking-tight">Classification: Foreign Source Service Fees</p>
              <p className="text-xs mt-2 leading-relaxed">This directive explains the classification of varying monthly invoices and their exemption status regarding U.S. withholding protocols.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black uppercase italic tracking-tight text-foreground flex items-center gap-3">
                <div className="h-2 w-2 bg-primary rotate-45" /> 1. VARIABLE INVOICING MATRIX
              </h2>
              <p className="pl-5 border-l-2 border-border text-sm leading-relaxed">
                Monthly invoices vary based on performance bonuses and revenue-share calculations (specifically the "5th Student Rule"). These fees are definitively classified as <strong className="text-foreground">"Foreign Source Service Fees"</strong> for software management and marketing optimization services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black uppercase italic tracking-tight text-foreground flex items-center gap-3">
                <div className="h-2 w-2 bg-primary rotate-45" /> 2. NO WITHHOLDING (IRS PUB 515)
              </h2>
              <p className="pl-5 border-l-2 border-border text-sm leading-relaxed">
                Per IRS Publication 515, variable success fees paid to Gracie Barra AI Pilot do not trigger U.S. withholding requirements. The service is performed entirely outside the United States, originating from our corporate headquarters in Mexico.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black uppercase italic tracking-tight text-foreground flex items-center gap-3">
                <div className="h-2 w-2 bg-primary rotate-45" /> 3. CA SALES TAX NEXUS
              </h2>
              <p className="pl-5 border-l-2 border-border text-sm leading-relaxed">
                Our operations are structured to maintain compliance with California's economic nexus thresholds. Total gross sales remain under the $500,000 threshold that would trigger sales tax collection obligations.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black uppercase italic tracking-tight text-foreground flex items-center gap-3">
                <div className="h-2 w-2 bg-primary rotate-45" /> 4. FORM W-8BEN-E
              </h2>
              <p className="pl-5 border-l-2 border-border text-sm leading-relaxed">
                We provide a valid Form W-8BEN-E to all Academy clients, serving as the official certification of foreign status for beneficial owners.
              </p>
            </section>
          </div>

          <footer className="mt-16 pt-8 border-t-2 border-border flex justify-between items-center">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-50">© 2024 GRACIE BARRA AI PILOT SYSTEM. TAX ADVISORY V2.4</p>
            <Zap className="h-4 w-4 text-primary opacity-20" />
          </footer>
        </article>
      </div>
    </div>
  )
}
