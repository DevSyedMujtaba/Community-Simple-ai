import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  MessageSquare, 
  FileText, 
  AlertCircle, 
  Home,
  Users,
  Settings,
  Menu,
  X
} from "lucide-react";

interface HomeownerNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  hoaName?: string;
  pendingDocuments?: number;
}

/**
 * Homeowner Navigation Component
 * Provides mobile-friendly navigation for homeowner dashboard
 * Features collapsible mobile menu and responsive design
 */
const HomeownerNavigation = ({ 
  activeTab, 
  onTabChange, 
  hoaName = "Select HOA",
  pendingDocuments = 0 
}: HomeownerNavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navigation tabs configuration
  const tabs = [
    { 
      id: 'join-hoa', 
      label: 'Join HOA', 
      icon: Users, 
      description: 'Find and join your HOA community'
    },
    { 
      id: 'upload', 
      label: 'Upload Documents', 
      icon: Upload, 
      description: 'Upload HOA documents for AI analysis'
    },
    { 
      id: 'chat', 
      label: 'AI Assistant', 
      icon: MessageSquare, 
      description: 'Ask questions about your documents'
    },
    { 
      id: 'documents', 
      label: 'My Documents', 
      icon: FileText, 
      description: 'View uploaded documents and summaries',
      badge: pendingDocuments > 0 ? pendingDocuments : undefined
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    setIsMobileMenuOpen(false); // Close mobile menu on selection
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/logo2.png" alt="Logo" className="h-8 w-8 object-contain" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Homeowner Dashboard</h1>
              <p className="text-xs text-gray-600">{hoaName}</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobileMenu}
            className="p-2"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white">
          <div className="border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
              <Button variant="ghost" size="sm" onClick={toggleMobileMenu}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="px-4 py-6 space-y-2">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`w-full text-left p-4 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className="h-5 w-5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{tab.label}</span>
                        {tab.badge && (
                          <Badge variant="destructive" className="ml-2">
                            {tab.badge}
                          </Badge>
                        )}
                      </div>
                      <p className={`text-xs mt-1 ${
                        isActive ? 'text-white/80' : 'text-gray-500'
                      }`}>
                        {tab.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Desktop Navigation */}
      <div className="hidden lg:block bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <img src="/logo2.png" alt="Logo" className="h-10 w-10 object-contain" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Homeowner Dashboard</h1>
                <p className="text-sm text-gray-600">{hoaName}</p>
              </div>
            </div>
            
            <Badge variant="outline" className="text-[#254F70] border-[#254F70]">
              {hoaName}
            </Badge>
          </div>
          
          {/* Desktop Tab Navigation */}
          <nav className="flex space-x-1 overflow-x-auto pb-1">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
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
      </div>
    </>
  );
};

export default HomeownerNavigation;
