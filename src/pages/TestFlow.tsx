import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Home, Building2, Mail, User, Users } from "lucide-react";
import logo2 from '../../public/logo2.png';

/**
 * Test Flow Page Component
 * Allows testing the onboarding flow from any step
 * Useful for development and demonstration purposes
 */
const TestFlow = () => {
  const testScenarios = [
    {
      title: "Homeowner Flow",
      description: "Test the complete homeowner onboarding experience",
      userType: "homeowner",
      steps: [
        { name: "Signup", path: "/signup", icon: User },
        { name: "Email Verification", path: "/email-verification?email=demo@example.com&userType=homeowner", icon: Mail },
        { name: "Profile Setup", path: "/onboarding/profile?userType=homeowner", icon: User },
        { name: "HOA Connection", path: "/onboarding/hoa-connection?userType=homeowner", icon: Users },
        { name: "Welcome", path: "/onboarding/welcome?userType=homeowner", icon: Home },
        { name: "Dashboard", path: "/homeowner", icon: Home }
      ]
    },
    {
      title: "Board Member Flow",
      description: "Test the complete board member onboarding experience",
      userType: "board",
      steps: [
        { name: "Signup", path: "/signup", icon: User },
        { name: "Email Verification", path: "/email-verification?email=demo@example.com&userType=board", icon: Mail },
        { name: "Profile Setup", path: "/onboarding/profile?userType=board", icon: User },
        { name: "HOA Connection", path: "/onboarding/hoa-connection?userType=board", icon: Building2 },
        { name: "Welcome", path: "/onboarding/welcome?userType=board", icon: Building2 },
        { name: "Dashboard", path: "/board", icon: Building2 }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#f5faff] flex flex-col">
      {/* Top blue compliance bar */}
      <div className="w-full bg-blue-600 text-white text-xs text-center py-1 font-medium tracking-wide">
        FILE NOW TO COMPLY WITH THE CORPORATE TRANSPARENCY ACT
      </div>
      
      {/* Header */}
      <header className="w-full bg-white shadow-sm flex items-center justify-between px-4 sm:px-8 py-3">
        <div className="flex items-center gap-2">
          <img
            src={logo2}
            alt="Community Simple Logo"
            className="h-10 sm:h-12 w-auto"
            style={{ maxWidth: '140px' }}
          />
        </div>
        <Link 
          to="/" 
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition text-sm"
        >
          Back to Home
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Onboarding Flow Test
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Test the complete user onboarding flow for both homeowners and board members. 
              Click on any step to jump directly to that part of the flow.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {testScenarios.map((scenario, scenarioIndex) => (
              <Card key={scenarioIndex} className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {scenario.userType === 'homeowner' ? (
                      <Home className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Building2 className="h-5 w-5 text-purple-600" />
                    )}
                    {scenario.title}
                  </CardTitle>
                  <CardDescription>
                    {scenario.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {scenario.steps.map((step, stepIndex) => {
                      const IconComponent = step.icon;
                      return (
                        <div key={stepIndex} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-100 rounded-full p-2">
                              <IconComponent className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                Step {stepIndex + 1}: {step.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {step.path}
                              </div>
                            </div>
                          </div>
                          
                          <Link to={step.path}>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-blue-600 border-blue-600 hover:bg-blue-50"
                            >
                              Test
                              <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 border-t">
                    <Link to={scenario.steps[0].path}>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        Start Complete {scenario.title}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Test Section */}
          <div className="mt-12">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Quick Test Options</CardTitle>
                <CardDescription>
                  Jump directly to specific parts of the flow for testing
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link to="/signup">
                    <Button variant="outline" className="w-full h-16 flex flex-col gap-2">
                      <User className="h-5 w-5" />
                      <span>Start Signup</span>
                    </Button>
                  </Link>
                  
                  <Link to="/email-verification?email=test@example.com&userType=homeowner">
                    <Button variant="outline" className="w-full h-16 flex flex-col gap-2">
                      <Mail className="h-5 w-5" />
                      <span>Email Verification</span>
                    </Button>
                  </Link>
                  
                  <Link to="/onboarding/profile?userType=homeowner">
                    <Button variant="outline" className="w-full h-16 flex flex-col gap-2">
                      <User className="h-5 w-5" />
                      <span>Profile Setup</span>
                    </Button>
                  </Link>
                  
                  <Link to="/onboarding/hoa-connection?userType=homeowner">
                    <Button variant="outline" className="w-full h-16 flex flex-col gap-2">
                      <Users className="h-5 w-5" />
                      <span>HOA Connection</span>
                    </Button>
                  </Link>
                  
                  <Link to="/onboarding/welcome?userType=homeowner">
                    <Button variant="outline" className="w-full h-16 flex flex-col gap-2">
                      <Home className="h-5 w-5" />
                      <span>Welcome Tutorial</span>
                    </Button>
                  </Link>
                  
                  <Link to="/homeowner">
                    <Button variant="outline" className="w-full h-16 flex flex-col gap-2">
                      <Home className="h-5 w-5" />
                      <span>Homeowner Dashboard</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Testing Tips */}
          <div className="mt-8">
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <h3 className="font-semibold text-blue-900 mb-3">Testing Tips:</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>• Use the "Auto-fill Demo Code (123456)" button on the email verification page</li>
                  <li>• Use the "Auto-fill Demo Data" button on the profile setup page</li>
                  <li>• All forms will auto-submit after a brief loading simulation</li>
                  <li>• The flow will automatically progress through all steps</li>
                  <li>• You can jump to any step using the links above</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TestFlow; 