
import Link from "next/link"
import { Shield, ArrowLeft, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PrivacyPage() {
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
            <Shield size={200} />
          </div>

          <header className="mb-12 border-l-8 border-primary pl-8">
            <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-foreground leading-none">
              Privacy Protocol <br />
              <span className="text-primary">& Data Addendum</span>
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground mt-4">Effective: October 12, 2023 // Sector: Intelligence</p>
          </header>

          <div className="space-y-12 text-muted-foreground font-medium italic">
            <section className="space-y-4">
              <h2 className="text-xl font-black uppercase italic tracking-tight text-foreground flex items-center gap-3">
                <div className="h-2 w-2 bg-primary rotate-45" /> 1. DATA PROCESSING & RETENTION
              </h2>
              <div className="pl-5 border-l-2 border-border space-y-4 text-sm leading-relaxed">
                <p>To execute the Software Services & Asset Management Agreement, <span className="text-foreground font-bold">Gracie Barra AI Pilot</span> processes lead and student data on behalf of the Academy.</p>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <span className="text-primary font-black">//</span>
                    <span><strong className="text-foreground uppercase">90-Day Lead Attribution:</strong> Prospective lead data (name, phone, email, AI logs) is retained strictly to verify Software-Attributed Leads.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-black">//</span>
                    <span><strong className="text-foreground uppercase">Lifetime House Student Tracking:</strong> Data for "House Students" is retained for the lifetime of their membership to facilitate billing and asset management.</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black uppercase italic tracking-tight text-foreground flex items-center gap-3">
                <div className="h-2 w-2 bg-primary rotate-45" /> 2. INFRASTRUCTURE & SECURITY
              </h2>
              <div className="pl-5 border-l-2 border-border space-y-4 text-sm leading-relaxed">
                <p><strong className="text-foreground uppercase italic">The Edge:</strong> Localized Academy servers may be utilized for fast, private local data ingress.</p>
                <p><strong className="text-foreground uppercase italic">The Core:</strong> Outgoing AI communications are routed through encrypted AWS IoT/VPN tunnels to central AWS SES servers.</p>
                <p><strong className="text-foreground uppercase italic">Isolation Matrix:</strong> Academy data and marketing reputations are siloed via AWS Tenant Management systems. Cross-tenant data bleeding is restricted.</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black uppercase italic tracking-tight text-foreground flex items-center gap-3">
                <div className="h-2 w-2 bg-primary rotate-45" /> 3. TACTICAL AUDITS
              </h2>
              <div className="pl-5 border-l-2 border-border text-sm leading-relaxed">
                <p>We utilize secure, limited-access mechanisms to audit Academy CRM and Point-of-Sale data to verify enrollment statuses. This data is viewed strictly for auditing purposes, processed securely under the jurisdiction of our corporate headquarters in Mexico.</p>
              </div>
            </section>
          </div>

          <footer className="mt-16 pt-8 border-t-2 border-border flex justify-between items-center">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-50">© 2024 GRACIE BARRA AI PILOT SYSTEM. PRIVACY PROTOCOL V1.8</p>
            <Zap className="h-4 w-4 text-primary opacity-20" />
          </footer>
        </article>
      </div>
    </div>
  )
}
