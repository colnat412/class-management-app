'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
import TopBar from '@/components/top-bar';

const DashboardContent = ({ children }: { children: React.ReactNode }) => {
  const { role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <body className="">
        <SidebarProvider>
          <div className="w-64 h-screen bg-white border-r animate-pulse" />
          <Toaster richColors position="top-right" />
          {children}
        </SidebarProvider>
      </body>
    );
  }

  return (
    <body className="">
      <SidebarProvider>
        <AppSidebar role={role} />
        <Toaster richColors position="top-right" />
        {children}
      </SidebarProvider>
    </body>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <TopBar />
      <DashboardContent>{children}</DashboardContent>
    </AuthProvider>
  );
}
