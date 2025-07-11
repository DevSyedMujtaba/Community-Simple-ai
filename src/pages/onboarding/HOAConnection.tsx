import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Users, Building2, Home, ArrowLeft, CheckCircle } from "lucide-react";
import logo2 from '../../../public/logo2.png';
import { createClient } from "@supabase/supabase-js";

/**
 * HOA Connection Page Component
 * Handles HOA connection for both homeowners and board members
 * Homeowners can search and join existing HOAs
 * Board members can create new HOAs
 */
const HOAConnection = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userType = searchParams.get('userType') || 'homeowner';
  
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showCommunityForm, setShowCommunityForm] = useState(false);
  const [communityForm, setCommunityForm] = useState({
    name: "",
    state: "",
    city: "",
    address: "",
    units: "",
    contact_email: "",
    contact_phone: "",
    description: ""
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    // Get the current session on mount
    const getToken = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setAccessToken(session?.access_token || "");
    };
    getToken();

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAccessToken(session?.access_token || "");
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // Sample HOAs data
  const availableHOAs = [
    {
      id: '1',
      name: 'Sunrise Valley HOA',
      city: 'Los Angeles',
      state: 'California',
      memberCount: 156,
      description: 'A family-friendly community with great amenities'
    },
    {
      id: '2',
      name: 'Oak Creek Estates',
      city: 'Los Angeles',
      state: 'California',
      memberCount: 89,
      description: 'Luxury homes with golf course access'
    },
    {
      id: '3',
      name: 'Meadowbrook Community',
      city: 'San Francisco',
      state: 'California',
      memberCount: 234,
      description: 'Modern townhomes near downtown'
    }
  ];

  const states = ['California', 'Texas', 'Florida', 'New York', 'Illinois'];
  const cities = selectedState === 'California' 
    ? ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento']
    : selectedState === 'Texas'
    ? ['Houston', 'Dallas', 'Austin', 'San Antonio']
    : [];

  const filteredHOAs = availableHOAs.filter(hoa => {
    const matchesLocation = selectedState ? hoa.state === selectedState : true;
    const matchesCity = selectedCity ? hoa.city === selectedCity : true;
    const matchesSearch = searchTerm 
      ? hoa.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    
    return matchesLocation && matchesCity && matchesSearch;
  });

  const handleJoinHOA = async (hoaId: string) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsConnected(true);
      // In real implementation, send join request
      console.log('Joining HOA:', hoaId);
      // Auto-continue after showing success
      setTimeout(() => {
        navigate('/onboarding/welcome?userType=homeowner');
      }, 2000);
    }, 1500);
  };

  const handleCreateHOA = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsConnected(true);
      // In real implementation, create HOA
      console.log('Creating new HOA');
      // Auto-continue after showing success
      setTimeout(() => {
        navigate('/onboarding/welcome?userType=board');
      }, 2000);
    }, 1500);
  };

  const handleContinue = () => {
    navigate(`/onboarding/welcome?userType=${userType}`);
  };

  const board_member_id = searchParams.get("user_id");

  const handleCommunityInput = (e) => {
    const { name, value } = e.target;
    setCommunityForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleCommunitySubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");
    try {
      console.log("JWT accessToken:", accessToken);
      const response = await fetch(
        "https://yurteupcbisnkcrtjsbv.supabase.co/functions/v1/create_hoa_community",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(accessToken ? { "Authorization": `Bearer ${accessToken}` } : {})
          },
          body: JSON.stringify({ ...communityForm, units: Number(communityForm.units), board_member_id })
        }
      );
      const result = await response.json();
      if (response.ok && result.success) {
        setFormSuccess(true);
        setIsConnected(true); // Show the success dialog
      } else {
        setFormError(result.error || "Failed to create community.");
      }
    } catch (err) {
      setFormError("Network error.");
    }
    setFormLoading(false);
  };

  if (isConnected) {
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
                  {userType === 'homeowner' ? 'Join Request Sent!' : 'HOA Created!'}
                </h2>
                
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                  {userType === 'homeowner' 
                    ? 'Your request to join the HOA has been sent. You\'ll be notified once approved.'
                    : 'Your HOA has been successfully created. You can now invite homeowners to join.'
                  }
                </p>
                
                <Button 
                  onClick={handleContinue}
                  className="w-full h-11 sm:h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base"
                >
                  Continue to Welcome
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
          to="/onboarding/profile" 
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
            <span>Step 3 of 4</span>
            <span className="hidden sm:inline">HOA Connection</span>
            <span className="sm:hidden">HOA</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-3 sm:px-4 py-4 sm:py-8">
        <div className="w-full max-w-4xl">
          <Card className="shadow-lg border-0">
            <CardHeader className="text-center pb-4 sm:pb-6 px-4 sm:px-6">
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                {userType === 'homeowner' ? 'Find Your HOA' : 'Create Your HOA'}
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-gray-600">
                {userType === 'homeowner' 
                  ? 'Search for your HOA community and request to join'
                  : 'Set up your HOA community on the platform'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-6">
              {userType === 'homeowner' ? (
                /* Homeowner: Search and Join HOA */
                <div className="space-y-4 sm:space-y-6">
                  {/* Location Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </Label>
                      <select
                        value={selectedState}
                        onChange={(e) => {
                          setSelectedState(e.target.value);
                          setSelectedCity('');
                        }}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                      >
                        <option value="">Select State</option>
                        {states.map((state) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </Label>
                      <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        disabled={!selectedState}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-sm sm:text-base"
                      >
                        <option value="">Select City</option>
                        {cities.map((city) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="sm:col-span-2 lg:col-span-1">
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Search HOAs
                      </Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Search by HOA name..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 h-11 sm:h-12 text-sm sm:text-base"
                        />
                      </div>
                    </div>
                  </div>

                  {/* HOA Results */}
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                      Available HOAs ({filteredHOAs.length})
                    </h3>
                    
                    {filteredHOAs.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        {filteredHOAs.map((hoa) => (
                          <Card key={hoa.id} className="border-2 hover:border-blue-300 transition-colors">
                            <CardContent className="p-3 sm:p-4">
                              <div className="flex items-start justify-between mb-2 sm:mb-3">
                                <div>
                                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{hoa.name}</h4>
                                  <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {hoa.city}, {hoa.state}
                                  </p>
                                </div>
                                <Badge variant="outline" className="text-blue-600 border-blue-600 text-xs">
                                  <Users className="h-3 w-3 mr-1" />
                                  <span className="hidden sm:inline">{hoa.memberCount} members</span>
                                  <span className="sm:hidden">{hoa.memberCount}</span>
                                </Badge>
                              </div>
                              
                              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">{hoa.description}</p>
                              
                              <Button
                                onClick={() => handleJoinHOA(hoa.id)}
                                disabled={isLoading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base h-10 sm:h-11"
                              >
                                {isLoading ? 'Requesting...' : 'Request to Join'}
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 sm:py-8">
                        <Building2 className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                        <p className="text-sm sm:text-base text-gray-600">No HOAs found matching your criteria.</p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-2">
                          Try adjusting your search or location filters.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Board Member: Create HOA */
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1 text-sm sm:text-base">Create Your HOA Community</h4>
                        <p className="text-xs sm:text-sm text-blue-700">
                          Set up your HOA on Community Simple to start managing your community more effectively. 
                          You'll be able to invite homeowners, upload documents, and manage compliance.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">What you'll be able to do:</h3>
                      <ul className="space-y-2 sm:space-y-3">
                        <li className="flex items-start gap-2 sm:gap-3">
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-gray-700">Upload and manage HOA documents</span>
                        </li>
                        <li className="flex items-start gap-2 sm:gap-3">
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-gray-700">Invite homeowners to join your community</span>
                        </li>
                        <li className="flex items-start gap-2 sm:gap-3">
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-gray-700">Send notices and communicate with residents</span>
                        </li>
                        <li className="flex items-start gap-2 sm:gap-3">
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-gray-700">Track compliance and manage violations</span>
                        </li>
                        <li className="flex items-start gap-2 sm:gap-3">
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-gray-700">Get AI-powered assistance for rule interpretation</span>
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">Ready to get started?</h3>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Your HOA profile information from the previous step will be used to create your community. 
                        You can always update these details later.
                      </p>
                      {showCommunityForm ? (
                        <form onSubmit={handleCommunitySubmit} className="space-y-4 bg-white p-4 rounded-lg border border-gray-200">
                          <div>
                            <Label>Community Name</Label>
                            <Input name="name" value={communityForm.name} onChange={handleCommunityInput} required />
                          </div>
                          <div>
                            <Label>State</Label>
                            <Input name="state" value={communityForm.state} onChange={handleCommunityInput} required />
                          </div>
                          <div>
                            <Label>City</Label>
                            <Input name="city" value={communityForm.city} onChange={handleCommunityInput} required />
                          </div>
                          <div>
                            <Label>Address</Label>
                            <Input name="address" value={communityForm.address} onChange={handleCommunityInput} required />
                          </div>
                          <div>
                            <Label>Number of Units</Label>
                            <Input name="units" type="number" value={communityForm.units} onChange={handleCommunityInput} required />
                          </div>
                          <div>
                            <Label>Contact Email</Label>
                            <Input name="contact_email" type="email" value={communityForm.contact_email} onChange={handleCommunityInput} required />
                          </div>
                          <div>
                            <Label>Contact Phone</Label>
                            <Input name="contact_phone" value={communityForm.contact_phone} onChange={handleCommunityInput} required />
                          </div>
                          <div>
                            <Label>Description (optional)</Label>
                            <Input name="description" value={communityForm.description} onChange={handleCommunityInput} />
                          </div>
                          {formError && <div className="text-red-600 text-sm">{formError}</div>}
                          <Button type="submit" disabled={formLoading} className="w-full bg-blue-600 text-white">
                            {formLoading ? "Creating..." : "Create Community"}
                          </Button>
                        </form>
                      ) : (
                        <Button
                          onClick={() => navigate('/onboarding/welcome?userType=board')}
                          disabled={isLoading}
                          className="w-full h-11 sm:h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base"
                        >
                          Create My HOA Community
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default HOAConnection; 