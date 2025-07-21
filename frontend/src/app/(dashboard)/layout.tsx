import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body className="">
      <SidebarProvider>
        <AppSidebar />
        {/* <SidebarTrigger /> */}
        <Toaster richColors position="top-right" />
        {children}
      </SidebarProvider>
    </body>
  );
}
