
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Search, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle,
  Mail,
  Home,
  AlertCircle
} from "lucide-react";

interface HOAOption {
  id: string;
  name: string;
  city: string;
  state: string;
  memberCount: number;
  description?: string;
}

interface JoinRequest {
  id: string;
  hoaName: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  responseDate?: string;
}

/**
 * HOA Join Request Component
 * Allows homeowners to search for and join HOA communities
 * Handles state/city selection and join request management
 */
const HOAJoinRequest = () => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [joinRequestForm, setJoinRequestForm] = useState({
    message: '',
    unitNumber: '',
    phoneNumber: ''
  });

  // Sample data - in real app this would come from backend
  const states = ['California', 'Texas', 'Florida', 'New York', 'Illinois'];
  
  const cities = selectedState === 'California' 
    ? ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento']
    : selectedState === 'Texas'
    ? ['Houston', 'Dallas', 'Austin', 'San Antonio']
    : [];

  const availableHOAs: HOAOption[] = [
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

  const myJoinRequests: JoinRequest[] = [
    {
      id: '1',
      hoaName: 'Sunrise Valley HOA',
      status: 'pending',
      requestDate: '2024-01-10'
    }
  ];

  // Filter HOAs based on location and search
  const filteredHOAs = availableHOAs.filter(hoa => {
    const matchesLocation = selectedState ? hoa.state === selectedState : true;
    const matchesCity = selectedCity ? hoa.city === selectedCity : true;
    const matchesSearch = searchTerm 
      ? hoa.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    
    return matchesLocation && matchesCity && matchesSearch;
  });

  const handleJoinRequest = (hoaId: string) => {
    console.log('Sending join request for HOA:', hoaId, joinRequestForm);
    // In real implementation, this would call API to send join request
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Requests Status */}
      {myJoinRequests.length > 0 && (
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-900">
              <AlertCircle className="h-5 w-5 mr-2" />
              Your Join Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myJoinRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(request.status)}
                    <div>
                      <p className="font-medium text-gray-900">{request.hoaName}</p>
                      <p className="text-sm text-gray-600">
                        Requested on {new Date(request.requestDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(request.status)} variant="secondary">
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Location Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-primary" />
            Find Your HOA Community
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedCity(''); // Reset city when state changes
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={!selectedState}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search HOA Name
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* HOA Results */}
          {selectedState && selectedCity && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                HOA Communities in {selectedCity}, {selectedState} ({filteredHOAs.length})
              </h3>
              
              {filteredHOAs.length === 0 ? (
                <Card className="border-dashed border-2 border-gray-300">
                  <CardContent className="p-8 text-center">
                    <Home className="h-8 w-8 mx-auto text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No HOAs found</h3>
                    <p className="text-gray-600">
                      No HOA communities found in this area. Contact your board member to create one.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {filteredHOAs.map((hoa) => (
                    <Card key={hoa.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-lg font-semibold text-gray-900">{hoa.name}</h4>
                              <Badge variant="outline" className="text-blue-600 border-blue-600">
                                <Users className="h-3 w-3 mr-1" />
                                {hoa.memberCount} members
                              </Badge>
                            </div>
                            
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                              <MapPin className="h-4 w-4 mr-1" />
                              {hoa.city}, {hoa.state}
                            </div>
                            
                            {hoa.description && (
                              <p className="text-sm text-gray-700">{hoa.description}</p>
                            )}
                          </div>
                          
                          <Button
                            onClick={() => handleJoinRequest(hoa.id)}
                            className="ml-4"
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Request to Join
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Join Request Form (shown when user clicks Request to Join) */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle>Join Request Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit/Property Number
              </label>
              <input
                type="text"
                placeholder="e.g., 101A, 123 Main St"
                value={joinRequestForm.unitNumber}
                onChange={(e) => setJoinRequestForm({ ...joinRequestForm, unitNumber: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="(555) 123-4567"
                value={joinRequestForm.phoneNumber}
                onChange={(e) => setJoinRequestForm({ ...joinRequestForm, phoneNumber: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message to Board (Optional)
            </label>
            <textarea
              placeholder="Introduce yourself and mention any relevant information..."
              value={joinRequestForm.message}
              onChange={(e) => setJoinRequestForm({ ...joinRequestForm, message: e.target.value })}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          
          <p className="text-xs text-gray-500">
            Your request will be sent to the board members for approval. You'll receive an email notification once reviewed.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HOAJoinRequest;
