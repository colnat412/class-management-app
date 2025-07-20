import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">
        <SidebarProvider>
          <AppSidebar />
          {/* <SidebarTrigger /> */}
          {children}
        </SidebarProvider>
      </body>
    </html>
  );
}
