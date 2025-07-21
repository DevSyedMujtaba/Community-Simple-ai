import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { 
  MessageSquare, 
  FileText, 
  AlertCircle, 
  Home,
  Users,
  Settings,
  Bell,
  Mail
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
import { supabase } from "@/lib/supabaseClient";

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
  const navigate = useNavigate();

  // Navigation items configuration
  const navigationItems = [
    { 
      id: 'join-hoa', 
      label: 'Join HOA', 
      icon: Users, 
      description: 'Find and join your HOA community'
    },
    {
      id: 'invitations',
      label: 'Invitations',
      icon: Mail,
      description: 'View and manage your HOA invitations'
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
      badge: unreadNotices && unreadNotices > 0 ? unreadNotices : undefined
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
    // { 
    //   id: 'alerts', 
    //   label: 'Compliance', 
    //   icon: AlertCircle, 
    //   description: 'View compliance alerts and rules'
    // },
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <Sidebar collapsible="icon" className="border-r flex flex-col h-full">
      <SidebarHeader className="border-b border-gray-200 bg-white h-16 flex items-center justify-center p-0">
        <img src="/logo2.png" alt="Logo" className="h-20 w-32 object-contain" />
      </SidebarHeader>

      <SidebarContent className="flex-1">
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
