import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, CheckCircle, Clock, ArrowLeft, RefreshCw } from "lucide-react";
import logo2 from '../../public/logo2.png';

/**
 * Email Verification Page Component
 * Handles email verification with resend functionality
 * Matches the existing theme and provides clear user guidance
 */
const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const userType = searchParams.get('userType') || 'homeowner';
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim()) return;

    setIsLoading(true);
    
    // Simulate verification API call
    setTimeout(() => {
      setIsLoading(false);
      setIsVerified(true);
      // In real implementation, verify the code and redirect
      console.log('Verifying code:', verificationCode);
      // Redirect to profile setup after a brief delay
      setTimeout(() => {
        window.location.href = `/onboarding/profile?userType=${userType}`;
      }, 1500);
    }, 1500);
  };

  // Demo mode - auto-fill verification code for testing
  const handleDemoMode = () => {
    setVerificationCode('123456');
  };

  const handleResendCode = async () => {
    setIsResending(true);
    
    // Simulate resend API call
    setTimeout(() => {
      setIsResending(false);
      setCountdown(60); // 60 second cooldown
      console.log('Resending verification code to:', email);
    }, 1500);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  if (isVerified) {
    return (
      <div className="min-h-screen bg-[#f5faff] flex flex-col">
        {/* Top blue compliance bar */}
        <div className="w-full bg-blue-600 text-white text-xs text-center py-1 px-2 font-medium tracking-wide">
          <span className="hidden sm:inline">FILE NOW TO COMPLY WITH THE CORPORATE TRANSPARENCY ACT</span>
          <span className="sm:hidden">COMPLY WITH CORPORATE TRANSPARENCY ACT</span>
        </div>
        
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

        {/* Success Content */}
        <main className="flex-1 flex items-center justify-center px-3 sm:px-4 py-4 sm:py-8">
          <div className="w-full max-w-md">
            <Card className="shadow-lg border-0">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="bg-green-100 rounded-full p-3 sm:p-4 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                </div>
                
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Email Verified!
                </h2>
                
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                  Your email has been successfully verified. You can now complete your profile setup.
                </p>
                
                <Link to="/onboarding/profile">
                  <Button className="w-full h-11 sm:h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base">
                    Continue to Profile Setup
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5faff] flex flex-col">
      {/* Top blue compliance bar */}
      <div className="w-full bg-blue-600 text-white text-xs text-center py-1 px-2 font-medium tracking-wide">
        <span className="hidden sm:inline">FILE NOW TO COMPLY WITH THE CORPORATE TRANSPARENCY ACT</span>
        <span className="sm:hidden">COMPLY WITH CORPORATE TRANSPARENCY ACT</span>
      </div>
      
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
        <Link 
          to="/signup" 
          className="flex items-center gap-1 sm:gap-2 text-blue-600 hover:text-blue-700 font-medium transition text-xs sm:text-sm"
        >
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Back to Signup</span>
          <span className="sm:hidden">Back</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-3 sm:px-4 py-4 sm:py-8">
        <div className="w-full max-w-md">
          <Card className="shadow-lg border-0">
            <CardHeader className="text-center pb-4 sm:pb-6 px-4 sm:px-6">
              <div className="bg-blue-100 rounded-full p-3 sm:p-4 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <Mail className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                Verify Your Email
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-gray-600">
                We've sent a verification code to your email address
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-6">
              <form onSubmit={handleVerification} className="space-y-4">
                {/* Email Display/Edit */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="Enter your email"
                      className="pl-10 h-11 sm:h-12 text-sm sm:text-base"
                    />
                  </div>
                </div>

                {/* Verification Code */}
                <div className="space-y-2">
                  <Label htmlFor="verificationCode" className="text-sm font-medium text-gray-700">
                    Verification Code
                  </Label>
                  <Input
                    id="verificationCode"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
                    className="h-11 sm:h-12 text-sm sm:text-base text-center text-lg font-mono tracking-widest"
                  />
                  <p className="text-xs text-gray-500">
                    Enter the 6-digit code sent to your email
                  </p>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full h-11 sm:h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base transition"
                  disabled={isLoading || !verificationCode.trim()}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="hidden sm:inline">Verifying...</span>
                      <span className="sm:hidden">Verifying...</span>
                    </div>
                  ) : (
                    'Verify Email'
                  )}
                </Button>
              </form>

              {/* Resend Code Section */}
              <div className="border-t pt-4 sm:pt-6">
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                    Didn't receive the code?
                  </p>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResendCode}
                    disabled={isResending || countdown > 0}
                    className="w-full h-11 sm:h-12 border-gray-300 hover:bg-gray-50 text-gray-700 font-medium text-sm sm:text-base"
                  >
                    {isResending ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span className="hidden sm:inline">Resending...</span>
                        <span className="sm:hidden">Resending...</span>
                      </div>
                    ) : countdown > 0 ? (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span className="hidden sm:inline">Resend in {countdown}s</span>
                        <span className="sm:hidden">{countdown}s</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span className="hidden sm:inline">Resend Verification Code</span>
                        <span className="sm:hidden">Resend Code</span>
                      </div>
                    )}
                  </Button>
                </div>
              </div>

              {/* Demo Mode for Testing */}
              <div className="border-t pt-3 sm:pt-4">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-2">
                    Demo Mode (for testing)
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleDemoMode}
                    className="text-xs h-8 sm:h-9"
                  >
                    Auto-fill Demo Code (123456)
                  </Button>
                </div>
              </div>

              {/* Help Text */}
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Check your spam folder if you don't see the email
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default EmailVerification; 