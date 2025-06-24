import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Users, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";

/**
 * Landing page component that provides access to three different dashboards
 * Features a clean, modern design consistent with the brand identity
 * Fully mobile responsive with optimized layout for all screen sizes
 */
const Index = () => {
  const navigate = useNavigate();

  // Dashboard configuration with navigation details
  const dashboards = [{
    title: "Homeowner Dashboard",
    description: "Upload HOA documents, get AI summaries, and chat with your documents for compliance guidance.",
    icon: Home,
    path: "/homeowner",
    color: "text-blue-600",
    bgColor: "bg-blue-50 hover:bg-blue-100"
  }, {
    title: "Board Member Dashboard",
    description: "Manage your HOA community, communicate with homeowners, and oversee compliance matters.",
    icon: Users,
    path: "/board",
    color: "text-green-600",
    bgColor: "bg-green-50 hover:bg-green-100"
  }, {
    title: "Admin Dashboard",
    description: "Internal use only. Monitor platform statistics, user management, and system analytics.",
    icon: Shield,
    path: "/admin",
    color: "text-purple-600",
    bgColor: "bg-purple-50 hover:bg-purple-100"
  }];
  
  return (
    <div className="min-h-screen bg-gradient-light">
      <Header />
      
      {/* Hero Section */}
      <div className="gradient-bg text-white py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 animate-fade-in leading-tight">
            Stay Legal, Stay Protected
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed px-2">
            AI-powered HOA compliance made simple. Convert dense documents into plain-English 
            summaries and get instant answers to your community questions.
          </p>
        </div>
      </div>

      {/* Dashboard Selection */}
      <div className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Choose Your Dashboard
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
              Select the dashboard that matches your role in your HOA community
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {dashboards.map((dashboard, index) => {
            const IconComponent = dashboard.icon;
              return <Card key={index} className={`${dashboard.bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 min-h-[280px] sm:min-h-[320px] flex flex-col`} onClick={() => navigate(dashboard.path)}>
                    <CardHeader className="text-center pb-3 sm:pb-4 flex-shrink-0">
                      <div className="mx-auto mb-3 sm:mb-4 p-3 sm:p-4 rounded-full bg-white shadow-md">
                        <IconComponent className={`h-6 w-6 sm:h-8 sm:w-8 ${dashboard.color}`} />
                    </div>
                      <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                      {dashboard.title}
                    </CardTitle>
                  </CardHeader>
                    <CardContent className="text-center flex-1 flex flex-col justify-between">
                      <CardDescription className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 flex-1 leading-relaxed">
                      {dashboard.description}
                    </CardDescription>
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white font-medium text-sm sm:text-base py-2 sm:py-3" onClick={e => {
                  e.stopPropagation();
                  navigate(dashboard.path);
                }}>
                      Access Dashboard
                    </Button>
                  </CardContent>
                </Card>;
          })}
          </div>
        </div>
      </div>

      {/* Features Section - Mobile Responsive */}
      <div className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Why Choose HOA Clarity AI?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
              Powerful AI technology designed specifically for HOA communities
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Smart Document Analysis</h3>
              <p className="text-sm sm:text-base text-gray-600">
                AI-powered document processing that understands HOA terminology and regulations
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Community Management</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Streamlined communication and management tools for board members and residents
              </p>
            </div>

            <div className="text-center p-6 sm:col-span-2 lg:col-span-1">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Compliance Protection</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Stay compliant with automated alerts and guidance based on your community's rules
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;