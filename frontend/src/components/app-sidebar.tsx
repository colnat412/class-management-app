'use client';

import React from 'react';
import {
  Users,
  BookOpen,
  MessageSquare,
  GraduationCap,
  LogOut,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Button } from './ui/button';

const instructorNavItems = [
  {
    title: 'Manage Students',
    url: '/instructor/manage-student',
    icon: Users,
  },
  {
    title: 'Manage Lessons',
    url: '/instructor/manage-lesson',
    icon: BookOpen,
  },
  {
    title: 'Message',
    url: '/message',
    icon: MessageSquare,
  },
];

const studentNavItems = [
  {
    title: 'My Lessons',
    url: '/student',
    icon: BookOpen,
  },
  {
    title: 'Message',
    url: '/messages',
    icon: MessageSquare,
  },
];

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  role?: 'instructor' | 'student';
}

const AppSidebarComponent = ({
  role = 'instructor',
  ...props
}: AppSidebarProps) => {
  const pathname = usePathname();
  const navItems = React.useMemo(
    () => (role === 'instructor' ? instructorNavItems : studentNavItems),
    [role]
  );

  const handleSignOut = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center gap-2 px-2 py-3">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <GraduationCap className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold text-gray-900">ClassApp</span>
                  <span className="text-xs text-gray-500">Portal</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link
                      href={item.url}
                      className="flex items-center gap-3 px-3 py-2"
                    >
                      <item.icon className="size-4" />
                      <span className="text-md">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="mt-auto px-3 pb-4">
          <SidebarMenu>
            <SidebarMenuItem className="flex justify-center items-center">
              <SidebarMenuButton asChild>
                <Button
                  type="button"
                  className="flex w-3/4 items-center justify-center gap-3 p-2 hover:cursor-pointer hover:bg-black hover:text-white"
                  onClick={handleSignOut}
                >
                  <LogOut />
                  <span className="text-md">Sign out</span>
                </Button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};

export const AppSidebar = React.memo(
  AppSidebarComponent,
  (prevProps, nextProps) => {
    return prevProps.role === nextProps.role;
  }
);
