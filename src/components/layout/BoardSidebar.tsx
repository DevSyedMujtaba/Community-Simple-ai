import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Users, MessageSquare, FileText, Settings, TrendingUp, Home, Bell, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, useSidebar } from "@/components/ui/sidebar";
import { supabase } from "@/lib/supabaseClient";

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
  const navigate = useNavigate();

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
  }
  // , {
  //   id: 'compliance',
  //   label: 'Compliance',
  //   icon: Bell,
  //   description: 'Track violations and notices'
  // }
  ];

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
  };
  const isActive = (tabId: string) => activeTab === tabId;
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <Sidebar collapsible="icon" className="border-r flex flex-col h-full">
      <SidebarHeader className="border-b h-16 flex-shrink-0 flex items-center justify-center">
        <img src="/logo2.png" alt="Logo" className="h-20 w-32 object-contain" />
      </SidebarHeader>

      <SidebarContent className="flex-1">
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map(item => {
                const IconComponent = item.icon;
                const active = isActive(item.id);
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton onClick={() => handleTabClick(item.id)} isActive={active} tooltip={isCollapsed ? item.label : undefined} className="cursor-pointer">
                      <IconComponent className="h-4 w-4" />
                      {!isCollapsed && <>
                        <span className="flex-1">{item.label}</span>
                        {item.badge && <Badge variant="destructive" className="ml-auto text-xs">{item.badge}</Badge>}
                      </>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Logout Button at the bottom */}
      <div className="p-4 border-t flex-shrink-0">
        <button
          onClick={handleLogout}
          className="w-full py-2 px-4 rounded-lg border border-red-500 text-red-600 font-semibold hover:bg-red-50 transition"
        >
          Logout
        </button>
      </div>
    </Sidebar>
  );
}
