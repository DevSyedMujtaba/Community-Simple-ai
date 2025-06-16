import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Users, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";

/**
 * Landing page component that provides access to three different dashboards
 * Features a clean, modern design consistent with the brand identity
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
  return <div className="min-h-screen bg-gradient-light">
      <Header />
      
      {/* Hero Section */}
      <div className="gradient-bg text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Stay Legal, Stay Protected
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            AI-powered HOA compliance made simple. Convert dense documents into plain-English 
            summaries and get instant answers to your community questions.
          </p>
        </div>
      </div>

      {/* Dashboard Selection */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Dashboard
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select the dashboard that matches your role in your HOA community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {dashboards.map((dashboard, index) => {
            const IconComponent = dashboard.icon;
            return <Card key={index} className={`${dashboard.bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105`} onClick={() => navigate(dashboard.path)}>
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 p-4 rounded-full bg-white shadow-md">
                      <IconComponent className={`h-8 w-8 ${dashboard.color}`} />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {dashboard.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-gray-700 mb-6 min-h-[60px]">
                      {dashboard.description}
                    </CardDescription>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white font-medium" onClick={e => {
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

      {/* Features Section */}
      
    </div>;
};
export default Index;