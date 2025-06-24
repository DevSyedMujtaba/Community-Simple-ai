
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  MessageSquare, 
  FileText, 
  AlertCircle, 
  Home,
  Users,
  Settings,
  Bell
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

interface HomeownerSidebarProps {
  hoaName?: string;
  unreadMessages?: number;
  unreadNotices?: number;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

/**
 * Homeowner Sidebar Component
 * Provides navigation for homeowner dashboard with mobile-friendly design
 * Features collapsible sidebar with proper responsive behavior
 */
export function HomeownerSidebar({ 
  hoaName = "Select HOA",
  unreadMessages = 0,
  unreadNotices = 0,
  activeTab,
  onTabChange
}: HomeownerSidebarProps) {
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === "collapsed";

  // Navigation items configuration
  const navigationItems = [
    { 
      id: 'join-hoa', 
      label: 'Join HOA', 
      icon: Users, 
      description: 'Find and join your HOA community'
    },
    { 
      id: 'messages', 
      label: 'Messages', 
      icon: MessageSquare, 
      description: 'Communicate with your HOA board',
      badge: unreadMessages > 0 ? unreadMessages : undefined
    },
    { 
      id: 'notices', 
      label: 'Notices', 
      icon: Bell, 
      description: 'View notices from your HOA board',
      badge: unreadNotices > 0 ? unreadNotices : undefined
    },
    { 
      id: 'chat', 
      label: 'AI Assistant', 
      icon: MessageSquare, 
      description: 'Ask questions about HOA documents'
    },
    { 
      id: 'hoa-documents', 
      label: 'HOA Documents', 
      icon: FileText, 
      description: 'View official HOA documents and policies'
    },
    { 
      id: 'alerts', 
      label: 'Compliance', 
      icon: AlertCircle, 
      description: 'View compliance alerts and rules'
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings, 
      description: 'Manage your account and preferences'
    }
  ];

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
  };

  const isActive = (tabId: string) => activeTab === tabId;

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b">
        <div className="flex items-center space-x-3 p-2">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Home className="h-5 w-5 text-blue-600" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <h1 className="text-sm font-semibold text-gray-900 truncate">
                Homeowner Dashboard
              </h1>
              <p className="text-xs text-gray-600 truncate">{hoaName}</p>
            </div>
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
                        <>
                          <span className="flex-1">{item.label}</span>
                          {item.badge && (
                            <Badge variant="destructive" className="ml-auto text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </>
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
