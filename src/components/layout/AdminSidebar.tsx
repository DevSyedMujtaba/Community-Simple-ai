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
      <SidebarHeader className="border-b border-gray-200 bg-white h-16 flex items-center p-0">
        <div className="flex items-center space-x-3 px-3 h-full w-full">
          <div className="bg-blue-100 p-2 rounded-lg flex items-center justify-center h-10 w-10">
            <Shield className="h-5 w-5 text-blue-600" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <h1 className="text-sm font-semibold text-blue-900 truncate">
                Admin Dashboard
              </h1>
              <p className="text-xs text-blue-500 truncate">Platform Management</p>
            </div>
          )}
          {!isCollapsed && (
            <Badge variant="outline" className="text-blue-600 border-blue-600 bg-blue-50 text-xs">
              Admin
            </Badge>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-blue-700">Navigation</SidebarGroupLabel>
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
