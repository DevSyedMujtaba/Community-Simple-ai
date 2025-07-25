import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Building2, Home } from "lucide-react";
import logo2 from '../../public/logo2.png';
import { supabase } from '../lib/supabaseClient';
import { useToast } from "@/components/ui/use-toast";
import { log } from "console";


/**
 * Signup Page Component
 * Features clean, modern design consistent with the brand identity
 * Fully mobile responsive with proper form validation and user type selection
 */
const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { toast } = useToast();
  const handleGoogleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({
      title: "Coming Soon",
      description: "Google sign-in is in development.",
      variant: "default",
      duration: 2000,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (!formData.userType) {
      alert('Please select a user type');
      return;
    }
    if (!formData.phone) {
      alert('Please enter your phone number');
      return;
    }
    setIsLoading(true);
    // Supabase signup
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });
    if (error || !data.user) {
      setIsLoading(false);
      alert(error?.message || 'Signup failed');
      return;
    }
    // Wait for session to be available
    let userId = data.user.id;
    try {
      // Wait for session to be available (sometimes needed)
      let sessionUserId = null;
      for (let i = 0; i < 10; i++) {
        const { data: sessionData } = await supabase.auth.getSession();
        sessionUserId = sessionData?.session?.user?.id;
        if (sessionUserId) break;
        await new Promise(res => setTimeout(res, 200));
      }
      if (sessionUserId) userId = sessionUserId;
    } catch (e) {console.log(e);}
    // Now insert profile with the correct user id
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: userId,
          role: formData.userType === 'homeowner' ? 'homeowner' : 'board',
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone || null,
          verified: true // Set verified true by default
        },
      ]);
    // Call send_verification_code edge function
    await fetch('https://yurteupcbisnkcrtjsbv.supabase.co/functions/v1/send_verification_code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + import.meta.env.VITE_SUPABASE_ANON_KEY
      },
      body: JSON.stringify({ email: formData.email, user_id: userId }),
    });
    setIsLoading(false);
    if (profileError) {
      alert(profileError.message || 'Profile creation failed');
      return;
    }
    // Redirect to onboarding based on user type
    window.location.href = `/onboarding/profile?userType=${formData.userType}&user_id=${userId}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      userType: value
    }));
  };

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
        <Link 
          to="/" 
          className="flex items-center gap-1 sm:gap-2 text-blue-600 hover:text-blue-700 font-medium transition text-xs sm:text-sm"
        >
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Back to Home</span>
          <span className="sm:hidden">Back</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-3 sm:px-4 py-4 sm:py-8">
        <div className="w-full max-w-lg">
          <Card className="shadow-lg border-0">
            <CardHeader className="text-center pb-4 sm:pb-6 px-4 sm:px-6">
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                Create Your Account
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-gray-600">
                Join Community Simple and simplify your HOA compliance
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* User Type Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    I am a...
                  </Label>
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      type="button"
                      onClick={() => handleSelectChange('homeowner')}
                      className={`p-3 sm:p-4 border-2 rounded-lg text-left transition ${
                        formData.userType === 'homeowner'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Home className={`h-4 w-4 sm:h-5 sm:w-5 ${
                          formData.userType === 'homeowner' ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                        <div>
                          <div className="font-medium text-gray-900 text-sm sm:text-base">Homeowner</div>
                          <div className="text-xs sm:text-sm text-gray-500">I live in an HOA community</div>
                        </div>
                      </div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleSelectChange('board')}
                      className={`p-3 sm:p-4 border-2 rounded-lg text-left transition ${
                        formData.userType === 'board'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Building2 className={`h-4 w-4 sm:h-5 sm:w-5 ${
                          formData.userType === 'board' ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                        <div>
                          <div className="font-medium text-gray-900 text-sm sm:text-base">Board Member</div>
                          <div className="text-xs sm:text-sm text-gray-500">I manage an HOA community</div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                      First Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="pl-10 h-11 sm:h-12 text-sm sm:text-base"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                      Last Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="pl-10 h-11 sm:h-12 text-sm sm:text-base"
                      />
                    </div>
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="pl-10 h-11 sm:h-12 text-sm sm:text-base"
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="h-11 sm:h-12 text-sm sm:text-base"
                  />
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="pl-10 pr-10 h-11 sm:h-12 text-sm sm:text-base"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        className="pl-10 pr-10 h-11 sm:h-12 text-sm sm:text-base"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    className="mt-1"
                  />
                  <div className="text-xs sm:text-sm text-gray-600">
                    <label htmlFor="terms" className="cursor-pointer">
                      I agree to the{' '}
                      <Link to="/terms-and-conditions" className="text-blue-600 hover:text-blue-700 font-medium">
                        Terms and Conditions
                      </Link>
                      {' '}and{' '}
                      <Link to="/privacy-policy" className="text-blue-600 hover:text-blue-700 font-medium">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full h-11 sm:h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base transition"
                  disabled={isLoading || !agreedToTerms}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="hidden sm:inline">Creating Account...</span>
                      <span className="sm:hidden">Creating...</span>
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-xs sm:text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* Social Signup Buttons */}
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full h-11 sm:h-12 border-gray-300 hover:bg-gray-50 text-gray-700 font-medium text-sm sm:text-base"
                  onClick={handleGoogleClick}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="hidden sm:inline">Continue with Google</span>
                  <span className="sm:hidden">Google</span>
                </Button>
              </div>

              {/* Sign In Link */}
              <div className="text-center pt-4">
                <p className="text-xs sm:text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="text-blue-600 hover:text-blue-700 font-semibold transition"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Signup; 