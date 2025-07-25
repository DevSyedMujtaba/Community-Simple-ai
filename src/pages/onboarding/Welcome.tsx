import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  FileText, 
  AlertCircle, 
  Users, 
  Settings, 
  CheckCircle,
  ArrowRight,
  Play,
  SkipForward
} from "lucide-react";
import logo2 from '../../../public/logo2.png';

/**
 * Welcome Page Component
 * Provides platform introduction and tutorial for new users
 * Customized based on user type (homeowner vs board member)
 */
const Welcome = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userType = searchParams.get('userType') || 'homeowner';
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const homeownerFeatures = [
    {
      icon: MessageSquare,
      title: "AI Chat Assistant",
      description: "Ask questions about your HOA rules and get instant, accurate answers",
      color: "text-blue-600"
    },
    {
      icon: FileText,
      title: "Document Access",
      description: "View and download all your HOA documents in one place",
      color: "text-green-600"
    },
    {
      icon: AlertCircle,
      title: "Compliance Alerts",
      description: "Stay informed about important rules and avoid violations",
      color: "text-orange-600"
    },
    {
      icon: Users,
      title: "Community Communication",
      description: "Message your board members and stay updated on community news",
      color: "text-purple-600"
    }
  ];

  const boardFeatures = [
    {
      icon: FileText,
      title: "Document Management",
      description: "Upload and organize all your HOA documents with AI-powered summaries",
      color: "text-blue-600"
    },
    {
      icon: Users,
      title: "Resident Management",
      description: "Invite homeowners, approve requests, and manage your community",
      color: "text-green-600"
    },
    {
      icon: MessageSquare,
      title: "Communication Hub",
      description: "Send notices, respond to inquiries, and broadcast updates",
      color: "text-purple-600"
    },
    {
      icon: AlertCircle,
      title: "Compliance Tracking",
      description: "Monitor violations, generate notices, and maintain community standards",
      color: "text-orange-600"
    }
  ];

  const tutorialSteps = [
    {
      title: "Welcome to Community Simple",
      description: "Let's take a quick tour of your new HOA management platform",
      action: "Start Tour"
    },
    {
      title: "Your Dashboard",
      description: "Everything you need is just a click away from your personalized dashboard",
      action: "Next"
    },
    {
      title: "Key Features",
      description: "Discover the powerful tools designed to make HOA management simple",
      action: "Next"
    },
    {
      title: "You're All Set!",
      description: "Ready to start using Community Simple? Let's get you to your dashboard",
      action: "Go to Dashboard"
    }
  ];

  const handleNextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    setIsLoading(true);
    
    // Simulate redirect
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to appropriate dashboard
      if (userType === 'homeowner') {
        navigate('/homeowner');
      } else {
        navigate('/board');
      }
    }, 1500);
  };

  const features = userType === 'homeowner' ? homeownerFeatures : boardFeatures;

  return (
    <div className="min-h-screen bg-[#f5faff] flex flex-col">
      {/* Top blue compliance bar */}
      {/* <div className="w-full bg-blue-600 text-white text-xs text-center py-1 px-2 font-medium tracking-wide">
        <span className="hidden sm:inline">FILE NOW TO COMPLY WITH THE CORPORATE TRANSPARENCY ACT</span>
        <span className="sm:hidden">COMPLY WITH CORPORATE TRANSPARENCY ACT</span>
      </div> */}
      
      {/* Header */}
      <header className="w-full bg-white shadow-sm flex items-center justify-between px-3 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-2">
          <img
            src={logo2}
            alt="Community Simple Logo"
            className="h-8 sm:h-10 lg:h-12 w-auto"
            style={{ maxWidth: '120px' }}
          />
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full bg-white border-b px-3 sm:px-4 py-2">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-2">
            <span>Step 4 of 4</span>
            <span className="hidden sm:inline">Welcome & Tutorial</span>
            <span className="sm:hidden">Welcome</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-3 sm:px-4 py-4 sm:py-8">
        <div className="w-full max-w-4xl">
          <Card className="shadow-lg border-0">
            <CardHeader className="text-center pb-4 sm:pb-6 px-4 sm:px-6">
              <div className="bg-green-100 rounded-full p-3 sm:p-4 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                Welcome to Community Simple!
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-gray-600">
                {userType === 'homeowner' 
                  ? 'Your HOA compliance journey starts here'
                  : 'Your HOA management platform is ready'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6 sm:space-y-8 px-4 sm:px-6 pb-6">
              {/* Tutorial Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-blue-900">
                    {tutorialSteps[currentStep].title}
                  </h3>
                  <Badge variant="outline" className="text-blue-600 border-blue-600 text-xs">
                    {currentStep + 1} of {tutorialSteps.length}
                  </Badge>
                </div>
                
                <p className="text-sm sm:text-base text-blue-700 mb-4 sm:mb-6">
                  {tutorialSteps[currentStep].description}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button
                    onClick={handleNextStep}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base h-10 sm:h-11"
                  >
                    {tutorialSteps[currentStep].action}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleSkip}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 text-sm sm:text-base h-10 sm:h-11"
                  >
                    <SkipForward className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Skip Tutorial</span>
                    <span className="sm:hidden">Skip</span>
                  </Button>
                </div>
              </div>

              {/* Features Section */}
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 text-center">
                  {userType === 'homeowner' 
                    ? 'What you can do with Community Simple'
                    : 'Powerful features for HOA management'
                  }
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {features.map((feature, index) => {
                    const IconComponent = feature.icon;
                    return (
                      <Card key={index} className="border-2 hover:border-blue-300 transition-colors">
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex items-start gap-3 sm:gap-4">
                            <div className={`bg-blue-50 rounded-lg p-2 sm:p-3 ${feature.color}`}>
                              <IconComponent className="h-5 w-5 sm:h-6 sm:w-6" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">
                                {feature.title}
                              </h4>
                              <p className="text-xs sm:text-sm text-gray-600">
                                {feature.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                  Quick Start Guide
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                  <div className="text-center">
                    <div className="bg-blue-100 rounded-full p-2 sm:p-3 w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm sm:text-lg">1</span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">Explore Your Dashboard</h4>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Familiarize yourself with the layout and navigation
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-blue-100 rounded-full p-2 sm:p-3 w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm sm:text-lg">2</span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">
                      {userType === 'homeowner' ? 'Try the AI Chat' : 'Upload Documents'}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {userType === 'homeowner' 
                        ? 'Ask questions about your HOA rules'
                        : 'Add your HOA documents to get started'
                      }
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-blue-100 rounded-full p-2 sm:p-3 w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm sm:text-lg">3</span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">
                      {userType === 'homeowner' ? 'Join Community' : 'Invite Residents'}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {userType === 'homeowner' 
                        ? 'Connect with your HOA community'
                        : 'Start building your community'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Final CTA */}
              <div className="text-center">
                <Button
                  onClick={handleComplete}
                  disabled={isLoading}
                  className="h-11 sm:h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base px-6 sm:px-8"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="hidden sm:inline">Loading Dashboard...</span>
                      <span className="sm:hidden">Loading...</span>
                    </div>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Get Started
                    </>
                  )}
                </Button>
                
                <p className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3">
                  You can always access tutorials and help from your dashboard
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Welcome; 