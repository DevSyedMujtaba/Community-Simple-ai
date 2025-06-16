
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  MessageSquare, 
  FileText, 
  Settings, 
  TrendingUp, 
  Plus,
  Menu,
  X,
  Home,
  Bell
} from "lucide-react";

interface BoardNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  communityName: string;
  pendingRequests?: number;
}

/**
 * Mobile-friendly navigation component for Board Dashboard
 * Features collapsible mobile menu with proper accessibility
 */
const BoardNavigation = ({ 
  activeTab, 
  onTabChange, 
  communityName,
  pendingRequests = 0 
}: BoardNavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navigation tabs configuration
  const tabs = [
    { 
      id: 'overview', 
      label: 'Community Overview', 
      icon: TrendingUp,
      description: 'Dashboard and analytics'
    },
    { 
      id: 'hoa-management', 
      label: 'HOA Management', 
      icon: Settings,
      description: 'Create and manage HOAs'
    },
    { 
      id: 'residents', 
      label: 'Residents', 
      icon: Users,
      description: 'Manage homeowners and invites',
      badge: pendingRequests > 0 ? pendingRequests : undefined
    },
    { 
      id: 'documents', 
      label: 'Documents', 
      icon: FileText,
      description: 'Upload and manage HOA documents'
    },
    { 
      id: 'messages', 
      label: 'Communications', 
      icon: MessageSquare,
      description: 'Messaging and notices'
    },
    { 
      id: 'compliance', 
      label: 'Compliance', 
      icon: Bell,
      description: 'Track violations and notices'
    }
  ];

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    setIsMobileMenuOpen(false); // Close mobile menu on selection
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden lg:block border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent className="h-5 w-5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <Badge variant="destructive" className="ml-1 text-xs">
                    {tab.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Navigation Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 mb-6">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Home className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{communityName}</h2>
              <p className="text-sm text-gray-600">Board Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {pendingRequests > 0 && (
              <Badge variant="destructive" className="text-xs">
                {pendingRequests} pending
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="p-2"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Current Tab Indicator */}
        <div className="px-4 pb-3">
          {tabs.map((tab) => {
            if (tab.id === activeTab) {
              const IconComponent = tab.icon;
              return (
                <div key={tab.id} className="flex items-center space-x-2 text-primary">
                  <IconComponent className="h-4 w-4" />
                  <span className="font-medium text-sm">{tab.label}</span>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={toggleMobileMenu}>
          <div 
            className="fixed inset-y-0 left-0 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Navigation</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMobileMenu}
                  className="p-2"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div className="p-4 space-y-2">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`w-full text-left p-3 rounded-lg flex items-center space-x-3 transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <IconComponent className="h-5 w-5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{tab.label}</div>
                      <div className="text-xs text-gray-500">{tab.description}</div>
                    </div>
                    {tab.badge && (
                      <Badge variant="destructive" className="text-xs">
                        {tab.badge}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BoardNavigation;
