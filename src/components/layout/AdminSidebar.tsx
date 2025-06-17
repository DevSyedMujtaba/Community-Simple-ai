
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
    <Sidebar collapsible="icon" className="border-r bg-gradient-to-b from-purple-50 to-white">
      <SidebarHeader className="border-b bg-gradient-to-r from-purple-600 to-purple-700">
        <div className="flex items-center space-x-3 p-2">
          <div className="bg-white bg-opacity-20 p-2 rounded-lg">
            <Shield className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <h1 className="text-sm font-semibold text-white truncate">
                Admin Dashboard
              </h1>
              <p className="text-xs text-purple-100 truncate">Platform Management</p>
            </div>
          )}
          {!isCollapsed && (
            <Badge variant="secondary" className="bg-white bg-opacity-20 text-white border-white border-opacity-20 text-xs">
              Admin
            </Badge>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
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
                      className="cursor-pointer"
                    >
                      <IconComponent className="h-4 w-4" />
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
