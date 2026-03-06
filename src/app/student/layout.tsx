
"use client";

import { CheckInProvider } from '@/context/checkin-context';
import { StudentNav } from '@/components/layout/student-nav';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CheckInProvider>
      <div className="min-h-screen bg-background pb-32">
        {children}
        <StudentNav />
      </div>
    </CheckInProvider>
  );
}
