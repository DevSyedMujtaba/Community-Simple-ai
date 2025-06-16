
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * Header component with navigation and branding
 * Displays the Neighbor.Simple logo and home navigation
 */
const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="bg-primary text-white p-2 rounded-lg mr-3">
              <Home className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">Neighbor</span>
              <span className="text-xl font-bold text-primary">.Simple</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            {!isHome && (
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="hidden sm:flex"
              >
                Back to Home
              </Button>
            )}
            <Button 
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Get Started
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
