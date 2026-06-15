'use client';

import { AuthGuard } from '@/components/auth/auth-guard';
import { Sidebar } from '@/components/dashboard/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </AuthGuard>
  );
}