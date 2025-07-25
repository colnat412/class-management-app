'use client';

import { AppSidebar } from '@/components/app-sidebar';
import TopBar from '@/components/top-bar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AuthProvider, useAuth } from '@/contexts/auth-context';

const DashboardContent = ({ children }: { children: React.ReactNode }) => {
  const { role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen">
          <div className="w-64 h-screen bg-white border-r animate-pulse" />
          <main className="flex-grow overflow-auto">{children}</main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar role={role} />
        <main className="flex-grow overflow-auto">{children}</main>
      </div>
    </SidebarProvider>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <div className="h-screen flex flex-col">
        <TopBar />
        <div className="flex-grow overflow-hidden">
          <DashboardContent>{children}</DashboardContent>
        </div>
      </div>
    </AuthProvider>
  );
}
