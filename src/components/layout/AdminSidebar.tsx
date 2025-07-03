import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Shield, 
  Users, 
  BarChart3, 
  Building2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

/**
 * Admin Sidebar Component
 * Navigation sidebar for Admin Dashboard with responsive design
 * Features collapsible functionality for platform management
 */
export function AdminSidebar({ 
  activeTab,
  onTabChange
}: AdminSidebarProps) {
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === "collapsed";

  // Navigation items configuration
  const navigationItems = [
    { 
      id: 'overview', 
      label: 'Platform Overview', 
      icon: BarChart3,
      description: 'System statistics and health'
    },
    { 
      id: 'users', 
      label: 'User Management', 
      icon: Users,
      description: 'Manage all platform users'
    },
    { 
      id: 'hoas', 
      label: 'HOAs Management', 
      icon: Building2,
      description: 'View and manage all HOAs'
    }
  ];

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
  };

  const isActive = (tabId: string) => activeTab === tabId;

  return (
    <Sidebar collapsible="icon" className="border-r bg-white">
      <SidebarHeader className="border-b border-gray-200 bg-white h-16 flex items-center justify-center p-0">
        <img src="/logo2.png" alt="Logo" className="h-20 w-32 object-contain" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[#254F70]">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                const active = isActive(item.id);
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => handleTabClick(item.id)}
                      isActive={active}
                      tooltip={isCollapsed ? item.label : undefined}
                      className={`cursor-pointer ${active ? 'bg-blue-50 text-blue-700' : 'hover:bg-blue-50 text-gray-700'}`}
                    >
                      <IconComponent className={`h-4 w-4 ${active ? 'text-blue-600' : 'text-gray-400'}`} />
                      {!isCollapsed && (
                        <span className="flex-1">{item.label}</span>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
