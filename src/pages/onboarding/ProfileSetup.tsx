import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { User, Mail, Phone, MapPin, Building2, Home, ArrowLeft, CheckCircle } from "lucide-react";
import logo2 from '../../../public/logo2.png';
import { supabase } from "@/lib/supabaseClient";

/**
 * Profile Setup Page Component
 * Handles profile completion for both homeowners and board members
 * Collects additional information needed for platform functionality
 */
const ProfileSetup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userType = searchParams.get('userType') || 'homeowner';
  const user_id = searchParams.get('user_id'); // Extract user_id from URL
  
  const [formData, setFormData] = useState({
    // Common fields
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Homeowner specific
    unitNumber: '',
    propertyType: '',
    
    // Board member specific
    hoaName: '',
    hoaAddress: '',
    hoaCity: '',
    hoaState: '',
    hoaZipCode: '',
    totalUnits: '',
    boardPosition: '',
    contactEmail: '',
    contactPhone: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Prefill phone number from profiles table
    const fetchPhone = async () => {
      if (!user_id) return;
      const { data: profile } = await supabase
        .from('profiles')
        .select('phone')
        .eq('id', user_id)
        .single();
      if (profile && profile.phone) {
        setFormData(prev => ({ ...prev, phone: profile.phone }));
      }
    };
    fetchPhone();
  }, [user_id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let response;
    if (userType === 'homeowner') {
      response = await fetch('https://yurteupcbisnkcrtjsbv.supabase.co/functions/v1/submit_homeowner_details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + import.meta.env.VITE_SUPABASE_ANON_KEY
        },
        body: JSON.stringify({
          user_id,
          property_type: formData.propertyType,
          unit_number: formData.unitNumber,
          property_address: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zipCode
        }),
      });
    } else {
      response = await fetch('https://yurteupcbisnkcrtjsbv.supabase.co/functions/v1/submit_board_member_details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + import.meta.env.VITE_SUPABASE_ANON_KEY
        },
        body: JSON.stringify({
          user_id,
          hoa_name: formData.hoaName,
          position: formData.boardPosition,
          hoa_address: formData.hoaAddress,
          city: formData.hoaCity,
          state: formData.hoaState,
          zip_code: formData.hoaZipCode,
          total_units: formData.totalUnits,
          hoa_contact_email: formData.contactEmail,
          hoa_contact_phone: formData.contactPhone
        }),
      });
    }

    setIsLoading(false);

    if (response.ok) {
      // Mark profile as verified and set correct role
      await supabase
        .from('profiles')
        .update({ verified: true, role: userType })
        .eq('id', user_id);
      setIsSuccess(true);
      // Optionally, you can keep the setTimeout for auto-redirect, or just use the button below
      // setTimeout(() => {
      //   if (userType === 'homeowner') {
      //     navigate('/onboarding/hoa-connection?userType=homeowner');
      //   } else {
      //     navigate('/onboarding/hoa-connection?userType=board');
      //   }
      // }, 1500);
    } else {
      const error = await response.json();
      window.alert('Failed to save profile: ' + (error.error || 'Unknown error'));
    }
  };

  // Demo mode - auto-fill form for testing
  const handleDemoFill = () => {
    if (userType === 'homeowner') {
      setFormData({
        ...formData,
        phone: '(555) 123-4567',
        address: '123 Main Street',
        city: 'Los Angeles',
        state: 'California',
        zipCode: '90210',
        unitNumber: 'Apt 5B',
        propertyType: 'Condo'
      });
    } else {
      setFormData({
        ...formData,
        phone: '(555) 987-6543',
        hoaName: 'Sunrise Valley HOA',
        hoaAddress: '456 Valley Drive',
        hoaCity: 'Los Angeles',
        hoaState: 'California',
        hoaZipCode: '90210',
        totalUnits: '156',
        boardPosition: 'President',
        contactEmail: 'board@sunrisevalley.com',
        contactPhone: '(555) 123-4567'
      });
    }
  };

  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming'
  ];

  const propertyTypes = [
    'Single Family Home',
    'Townhouse',
    'Condo',
    'Apartment',
    'Duplex',
    'Other'
  ];

  const boardPositions = [
    'President',
    'Vice President',
    'Secretary',
    'Treasurer',
    'Board Member',
    'Property Manager'
  ];

  if (isSuccess) {
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
            <img src={logo2} alt="Community Simple Logo" className="h-8 sm:h-10 lg:h-12 w-auto" style={{ maxWidth: '120px' }} />
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
                  Profile Saved!
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                  Your profile information has been saved successfully. Continue to the next step.
                </p>
                <Button
                  className="w-full h-11 sm:h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base"
                  onClick={() => {
                    if (userType === 'homeowner') {
                      navigate('/onboarding/hoa-connection?userType=homeowner');
                    } else {
                      navigate('/onboarding/hoa-connection?userType=board');
                    }
                  }}
                >
                  Continue
                </Button>
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
          to="/email-verification" 
          className="flex items-center gap-1 sm:gap-2 text-blue-600 hover:text-blue-700 font-medium transition text-xs sm:text-sm"
        >
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Back</span>
          <span className="sm:hidden">Back</span>
        </Link>
      </header>

      {/* Progress Bar */}
      <div className="w-full bg-white border-b px-3 sm:px-4 py-2">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-2">
            <span>Step 2 of 4</span>
            <span className="hidden sm:inline">Profile Setup</span>
            <span className="sm:hidden">Profile</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '50%' }}></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-3 sm:px-4 py-4 sm:py-8">
        <div className="w-full max-w-2xl">
          <Card className="shadow-lg border-0">
            <CardHeader className="text-center pb-4 sm:pb-6 px-4 sm:px-6">
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                Complete Your Profile
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-gray-600">
                {userType === 'homeowner' 
                  ? 'Tell us about your property so we can connect you with your HOA'
                  : 'Set up your HOA community information'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="px-4 sm:px-6 pb-6">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Common Information */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                    Contact Information
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                        Phone Number
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="(555) 123-4567"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="pl-10 h-11 sm:h-12 text-sm sm:text-base"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {userType === 'homeowner' ? (
                  /* Homeowner Specific Fields */
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Home className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                      Property Information
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="propertyType" className="text-sm font-medium text-gray-700">
                          Property Type
                        </Label>
                        <Select value={formData.propertyType} onValueChange={(value) => handleSelectChange('propertyType', value)}>
                          <SelectTrigger className="h-11 sm:h-12 text-sm sm:text-base">
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                          <SelectContent>
                            {propertyTypes.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="unitNumber" className="text-sm font-medium text-gray-700">
                          Unit Number
                        </Label>
                        <Input
                          id="unitNumber"
                          name="unitNumber"
                          type="text"
                          placeholder="e.g., 123A, Unit 5"
                          value={formData.unitNumber}
                          onChange={handleInputChange}
                          className="h-11 sm:h-12 text-sm sm:text-base"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                        Property Address
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="address"
                          name="address"
                          type="text"
                          placeholder="Street address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="pl-10 h-11 sm:h-12 text-sm sm:text-base"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                          City
                        </Label>
                        <Input
                          id="city"
                          name="city"
                          type="text"
                          placeholder="City"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="h-11 sm:h-12 text-sm sm:text-base"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                          State
                        </Label>
                        <Select value={formData.state} onValueChange={(value) => handleSelectChange('state', value)}>
                          <SelectTrigger className="h-11 sm:h-12 text-sm sm:text-base">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {states.map((state) => (
                              <SelectItem key={state} value={state}>{state}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="zipCode" className="text-sm font-medium text-gray-700">
                          ZIP Code
                        </Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          type="text"
                          placeholder="12345"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className="h-11 sm:h-12 text-sm sm:text-base"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Board Member Specific Fields */
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                      HOA Information
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="hoaName" className="text-sm font-medium text-gray-700">
                          HOA Name
                        </Label>
                        <Input
                          id="hoaName"
                          name="hoaName"
                          type="text"
                          placeholder="e.g., Sunrise Valley HOA"
                          value={formData.hoaName}
                          onChange={handleInputChange}
                          className="h-11 sm:h-12 text-sm sm:text-base"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="boardPosition" className="text-sm font-medium text-gray-700">
                          Your Position
                        </Label>
                        <Select value={formData.boardPosition} onValueChange={(value) => handleSelectChange('boardPosition', value)}>
                          <SelectTrigger className="h-11 sm:h-12 text-sm sm:text-base">
                            <SelectValue placeholder="Select position" />
                          </SelectTrigger>
                          <SelectContent>
                            {boardPositions.map((position) => (
                              <SelectItem key={position} value={position}>{position}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="hoaAddress" className="text-sm font-medium text-gray-700">
                        HOA Address
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="hoaAddress"
                          name="hoaAddress"
                          type="text"
                          placeholder="HOA office or management address"
                          value={formData.hoaAddress}
                          onChange={handleInputChange}
                          className="pl-10 h-11 sm:h-12 text-sm sm:text-base"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="hoaCity" className="text-sm font-medium text-gray-700">
                          City
                        </Label>
                        <Input
                          id="hoaCity"
                          name="hoaCity"
                          type="text"
                          placeholder="City"
                          value={formData.hoaCity}
                          onChange={handleInputChange}
                          className="h-11 sm:h-12 text-sm sm:text-base"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="hoaState" className="text-sm font-medium text-gray-700">
                          State
                        </Label>
                        <Select value={formData.hoaState} onValueChange={(value) => handleSelectChange('hoaState', value)}>
                          <SelectTrigger className="h-11 sm:h-12 text-sm sm:text-base">
                            <SelectValue placeholder="State" />
                          </SelectTrigger>
                          <SelectContent>
                            {states.map((state) => (
                              <SelectItem key={state} value={state}>{state}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="hoaZipCode" className="text-sm font-medium text-gray-700">
                          ZIP Code
                        </Label>
                        <Input
                          id="hoaZipCode"
                          name="hoaZipCode"
                          type="text"
                          placeholder="12345"
                          value={formData.hoaZipCode}
                          onChange={handleInputChange}
                          className="h-11 sm:h-12 text-sm sm:text-base"
                        />
                      </div>
                      
                      {/*
                      <div className="space-y-2">
                        <Label htmlFor="totalUnits" className="text-sm font-medium text-gray-700">
                          Total Units
                        </Label>
                        <Input
                          id="totalUnits"
                          name="totalUnits"
                          type="number"
                          placeholder="156"
                          value={formData.totalUnits}
                          onChange={handleInputChange}
                          className="h-11 sm:h-12 text-sm sm:text-base"
                        />
                      </div>
                      */}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contactEmail" className="text-sm font-medium text-gray-700">
                          HOA Contact Email
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="contactEmail"
                            name="contactEmail"
                            type="email"
                            placeholder="board@hoa.com"
                            value={formData.contactEmail}
                            onChange={handleInputChange}
                            className="pl-10 h-11 sm:h-12 text-sm sm:text-base"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="contactPhone" className="text-sm font-medium text-gray-700">
                          HOA Contact Phone
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="contactPhone"
                            name="contactPhone"
                            type="tel"
                            placeholder="(555) 123-4567"
                            value={formData.contactPhone}
                            onChange={handleInputChange}
                            className="pl-10 h-11 sm:h-12 text-sm sm:text-base"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

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
                      onClick={handleDemoFill}
                      className="text-xs mb-3 sm:mb-4 h-8 sm:h-9"
                    >
                      Auto-fill Demo Data
                    </Button>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4 sm:pt-6">
                  <Button 
                    type="submit" 
                    className="w-full h-11 sm:h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base transition"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="hidden sm:inline">Saving Profile...</span>
                        <span className="sm:hidden">Saving...</span>
                      </div>
                    ) : (
                      'Continue'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ProfileSetup; 