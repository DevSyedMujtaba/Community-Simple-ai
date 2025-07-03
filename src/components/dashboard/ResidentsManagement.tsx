import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Plus, 
  Edit, 
  Mail, 
  Phone, 
  MapPin, 
  Search,
  Check,
  X,
  Clock,
  UserPlus
} from "lucide-react";

interface Resident {
  id: string;
  name: string;
  email: string;
  phone: string;
  unit: string;
  status: 'active' | 'pending' | 'invited';
  joinDate: string;
  lastActive: string;
}

interface JoinRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  requestedUnit: string;
  requestDate: string;
  message?: string;
}

/**
 * Residents Management Component
 * Handles inviting homeowners, approving requests, and managing residents
 */
const ResidentsManagement = () => {
  const [activeSection, setActiveSection] = useState<'residents' | 'requests' | 'invite'>('residents');
  const [searchTerm, setSearchTerm] = useState('');
  const [inviteForm, setInviteForm] = useState({
    email: '',
    unit: '',
    message: ''
  });

  // Sample data - in real app this would come from backend
  const residents: Resident[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '(555) 123-4567',
      unit: '101A',
      status: 'active',
      joinDate: '2023-03-15',
      lastActive: '2024-01-14'
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      phone: '(555) 234-5678',
      unit: '102B',
      status: 'active',
      joinDate: '2023-05-20',
      lastActive: '2024-01-13'
    },
    {
      id: '3',
      name: 'Emma Thompson',
      email: 'emma.t@email.com',
      phone: '(555) 567-8901',
      unit: '105B',
      status: 'invited',
      joinDate: '2024-01-10',
      lastActive: 'Never'
    }
  ];

  const joinRequests: JoinRequest[] = [
    {
      id: '1',
      name: 'David Wilson',
      email: 'david.wilson@email.com',
      phone: '(555) 456-7890',
      requestedUnit: '104A',
      requestDate: '2024-01-12',
      message: 'Hi, I just purchased unit 104A and would like to join the HOA community.'
    },
    {
      id: '2',
      name: 'Lisa Garcia',
      email: 'lisa.garcia@email.com',
      phone: '(555) 678-9012',
      requestedUnit: '106C',
      requestDate: '2024-01-11',
      message: 'New resident in 106C, looking forward to being part of the community!'
    }
  ];

  const filteredResidents = residents.filter(resident =>
    resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'invited': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sending invite:', inviteForm);
    // In real implementation, this would call API to send invite
    setInviteForm({ email: '', unit: '', message: '' });
  };

  const handleApproveRequest = (requestId: string) => {
    console.log('Approving request:', requestId);
    // In real implementation, this would call API to approve request
  };

  const handleRejectRequest = (requestId: string) => {
    console.log('Rejecting request:', requestId);
    // In real implementation, this would call API to reject request
  };

  return (
    <div className="space-y-6">
      {/* Section Navigation */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveSection('residents')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeSection === 'residents'
              ? 'bg-white text-primary shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Users className="h-4 w-4 inline mr-2" />
          Current Residents ({residents.length})
        </button>
        <button
          onClick={() => setActiveSection('requests')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeSection === 'requests'
              ? 'bg-white text-primary shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Clock className="h-4 w-4 inline mr-2" />
          Join Requests ({joinRequests.length})
          {joinRequests.length > 0 && (
            <Badge variant="destructive" className="ml-2 text-xs">
              {joinRequests.length}
            </Badge>
          )}
        </button>
        <button
          onClick={() => setActiveSection('invite')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeSection === 'invite'
              ? 'bg-white text-primary shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <UserPlus className="h-4 w-4 inline mr-2" />
          Invite Residents
        </button>
      </div>

      {/* Current Residents Section */}
      {activeSection === 'residents' && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search residents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Residents List */}
          <div className="space-y-3">
            {filteredResidents.map((resident) => (
              <Card key={resident.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 min-w-0">
                    <div className="flex flex-col xs:flex-row xs:items-center gap-2 min-w-0 flex-1">
                      <div className="bg-blue-100 p-2 rounded-full flex-shrink-0 mx-auto xs:mx-0">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col xs:flex-row xs:items-center gap-2 mb-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate min-w-0">{resident.name}</h4>
                          <Badge className={getStatusColor(resident.status) + ' text-xs'} variant="secondary">
                            {resident.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs sm:text-sm text-gray-600 min-w-0">
                          <div className="flex items-center min-w-0">
                            <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">Unit {resident.unit}</span>
                          </div>
                          <div className="flex items-center min-w-0">
                            <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{resident.email}</span>
                          </div>
                          <div className="flex items-center min-w-0">
                            <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{resident.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col xs:flex-row gap-2 w-full xs:w-auto mt-2 xs:mt-0">
                      <Button variant="outline" size="sm" className="w-full xs:w-auto">
                        <Mail className="h-3 w-3 mr-1" />
                        Message
                      </Button>
                      <Button variant="outline" size="sm" className="w-full xs:w-auto">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Join Requests Section */}
      {activeSection === 'requests' && (
        <div className="space-y-4">
          {joinRequests.length === 0 ? (
            <Card className="border-dashed border-2 border-gray-300">
              <CardContent className="p-8 text-center">
                <Clock className="h-8 w-8 mx-auto text-gray-400 mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No pending requests</h3>
                <p className="text-gray-600">All join requests have been processed.</p>
              </CardContent>
            </Card>
          ) : (
            joinRequests.map((request) => (
              <Card key={request.id} className="border-orange-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {request.name}
                        </h4>
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                          Pending Review
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          {request.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          {request.phone}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          Unit {request.requestedUnit}
                        </div>
                      </div>
                      
                      {request.message && (
                        <div className="bg-gray-50 p-3 rounded-lg mb-4">
                          <p className="text-sm text-gray-700">{request.message}</p>
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-500">
                        Requested on {new Date(request.requestDate).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <Button
                        onClick={() => handleApproveRequest(request.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleRejectRequest(request.id)}
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        size="sm"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Invite Residents Section */}
      {activeSection === 'invite' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserPlus className="h-5 w-5 mr-2 text-primary" />
              Invite New Residents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendInvite} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                    placeholder="resident@email.com"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={inviteForm.unit}
                    onChange={(e) => setInviteForm({ ...inviteForm, unit: e.target.value })}
                    placeholder="e.g., 101A"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Welcome Message (Optional)
                </label>
                <textarea
                  value={inviteForm.message}
                  onChange={(e) => setInviteForm({ ...inviteForm, message: e.target.value })}
                  placeholder="Welcome to our community! We're excited to have you join us..."
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              
              <Button type="submit" className="bg-[#254F70] hover:bg-primary/90">
                <Mail className="h-4 w-4 mr-2" />
                Send Invitation
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResidentsManagement;
