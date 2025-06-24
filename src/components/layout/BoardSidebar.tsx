
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Users, MessageSquare, FileText, Settings, TrendingUp, Home, Bell, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, useSidebar } from "@/components/ui/sidebar";

interface BoardSidebarProps {
  communityName: string;
  pendingRequests?: number;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

/**
 * Board Sidebar Component
 * Navigation sidebar for Board Dashboard with responsive design
 * Features collapsible functionality and pending request indicators
 */
export function BoardSidebar({
  communityName,
  pendingRequests = 0,
  activeTab,
  onTabChange
}: BoardSidebarProps) {
  const {
    state
  } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === "collapsed";

  // Navigation items configuration
  const navigationItems = [{
    id: 'overview',
    label: 'Community Overview',
    icon: TrendingUp,
    description: 'Dashboard and analytics'
  }, {
    id: 'hoa-management',
    label: 'HOA Management',
    icon: Settings,
    description: 'Create and manage HOAs'
  }, {
    id: 'residents',
    label: 'Residents',
    icon: Users,
    description: 'Manage homeowners and invites',
    badge: pendingRequests > 0 ? pendingRequests : undefined
  }, {
    id: 'documents',
    label: 'Documents',
    icon: FileText,
    description: 'Upload and manage HOA documents'
  }, {
    id: 'messages',
    label: 'Messages',
    icon: MessageSquare,
    description: 'Communication with residents'
  }, {
    id: 'notices',
    label: 'Notices',
    icon: AlertTriangle,
    description: 'Create and manage notices'
  }, {
    id: 'compliance',
    label: 'Compliance',
    icon: Bell,
    description: 'Track violations and notices'
  }];

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
  };
  const isActive = (tabId: string) => activeTab === tabId;
  
  return <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b">
        <div className="flex items-center space-x-3 p-2">
          <div className="bg-green-100 p-2 rounded-lg">
            <Home className="h-5 w-5 text-green-600" />
          </div>
          {!isCollapsed && <div className="min-w-0 flex-1">
              <h1 className="text-sm font-semibold text-gray-900 truncate">
                Board Dashboard
              </h1>
              <p className="text-xs text-gray-600 truncate">{communityName}</p>
            </div>}
          {!isCollapsed && pendingRequests > 0}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map(item => {
              const IconComponent = item.icon;
              const active = isActive(item.id);
              return <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton onClick={() => handleTabClick(item.id)} isActive={active} tooltip={isCollapsed ? item.label : undefined} className="cursor-pointer">
                      <IconComponent className="h-4 w-4" />
                      {!isCollapsed && <>
                          <span className="flex-1">{item.label}</span>
                          {item.badge && <Badge variant="destructive" className="ml-auto text-xs">
                              {item.badge}
                            </Badge>}
                        </>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>;
            })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>;
}
