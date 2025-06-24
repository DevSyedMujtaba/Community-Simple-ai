import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-light px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 sm:p-12">
          <div className="text-6xl sm:text-8xl font-bold text-gray-300 mb-4">404</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            Page Not Found
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
          <div className="space-y-3 sm:space-y-0 sm:space-x-3 sm:flex sm:justify-center">
            <Button 
              onClick={() => navigate('/')}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white"
            >
              <Home className="h-4 w-4 mr-2" />
              Return to Home
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
