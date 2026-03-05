
"use client";

import QRCode from "react-qr-code";
import { QrCode } from "lucide-react";

export function CheckInQR() {
  const checkInUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/checkin`;

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative group p-4 border-8 border-border bg-white shadow-2xl">
        <div className="absolute -inset-2 bg-primary blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
        <div className="relative bg-white p-4">
          <QRCode
            value={checkInUrl}
            size={256}
            bgColor="white"
            fgColor="#000000"
            level="H"
          />
        </div>
      </div>
      
      <div className="text-center space-y-3">
        <h3 className="text-3xl font-black uppercase italic tracking-tighter flex items-center justify-center gap-3">
          <QrCode className="w-8 h-8 text-primary" />
          Tactical Check-In
        </h3>
        <p className="text-muted-foreground max-w-[250px] text-[10px] font-bold uppercase tracking-[0.2em] leading-relaxed mx-auto">
          Scan Matrix to Establish Enrollment Presence
        </p>
      </div>
    </div>
  );
}
