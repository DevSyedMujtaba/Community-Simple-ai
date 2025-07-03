import { Button } from "@/components/ui/button";
import { Home, Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

/**
 * Header component with navigation and branding
 * Displays the Community Simple logo and home navigation
 * Fully mobile responsive with collapsible navigation
 */
const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="bg-primary text-white p-2 rounded-lg mr-2 sm:mr-3">
              <Home className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold text-gray-900">Neighbor</span>
              <span className="text-lg sm:text-xl font-bold text-primary">.Simple</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex items-center space-x-4">
            {!isHome && (
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="text-sm"
              >
                Back to Home
              </Button>
            )}
            <Button 
              className="bg-primary hover:bg-primary/90 text-white text-sm"
            >
              Get Started
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="sm:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {!isHome && (
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    navigate('/');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start text-sm"
                >
                  Back to Home
                </Button>
              )}
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-white text-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
