import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
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
import { supabase } from "@/lib/supabaseClient";

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
  const { state, isMobile, setOpenMobile } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === "collapsed";
  const navigate = useNavigate();

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
    if (isMobile) setOpenMobile(false);
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
