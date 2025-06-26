import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Search, Filter, Calendar, MapPin, Mail, Phone } from "lucide-react";
interface HOAMember {
  id: string;
  name: string;
  email: string;
  role: 'homeowner' | 'board';
  joinDate: string;
  status: 'active' | 'pending' | 'inactive';
}
interface HOA {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  totalUnits: number;
  createdDate: string;
  boardMembers: number;
  activeMembers: number;
  pendingRequests: number;
  contactEmail: string;
  contactPhone: string;
  members: HOAMember[];
}

/**
 * HOA Management Component for Admin Dashboard
 * Displays all HOAs on the platform with their members and statistics
 * Provides filtering, search, and HOA management capabilities
 */
const HOAManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [expandedHOA, setExpandedHOA] = useState<string | null>(null);

  // Sample HOAs data
  const hoas: HOA[] = [{
    id: '1',
    name: 'Sunrise Valley HOA',
    address: '123 Valley Drive',
    city: 'Phoenix',
    state: 'Arizona',
    totalUnits: 156,
    createdDate: '2023-01-15',
    boardMembers: 2,
    activeMembers: 78,
    pendingRequests: 3,
    contactEmail: 'board@sunrisevalley.com',
    contactPhone: '(555) 123-4567',
    members: [{
      id: '1',
      name: 'Lisa Park',
      email: 'lisa.park@email.com',
      role: 'board',
      joinDate: '2023-01-10',
      status: 'active'
    }, {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      role: 'homeowner',
      joinDate: '2023-03-15',
      status: 'active'
    }, {
      id: '3',
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      role: 'homeowner',
      joinDate: '2023-05-20',
      status: 'active'
    }]
  }, {
    id: '2',
    name: 'Oak Ridge Community',
    address: '456 Oak Street',
    city: 'Austin',
    state: 'Texas',
    totalUnits: 203,
    createdDate: '2023-02-20',
    boardMembers: 1,
    activeMembers: 124,
    pendingRequests: 1,
    contactEmail: 'admin@oakridge.com',
    contactPhone: '(555) 987-6543',
    members: [{
      id: '4',
      name: 'Robert Kim',
      email: 'robert.kim@email.com',
      role: 'board',
      joinDate: '2023-02-15',
      status: 'active'
    }, {
      id: '5',
      name: 'David Wilson',
      email: 'david.wilson@email.com',
      role: 'homeowner',
      joinDate: '2023-02-28',
      status: 'inactive'
    }]
  }, {
    id: '3',
    name: 'Meadowbrook Community',
    address: '789 Meadow Lane',
    city: 'Denver',
    state: 'Colorado',
    totalUnits: 89,
    createdDate: '2024-01-10',
    boardMembers: 1,
    activeMembers: 45,
    pendingRequests: 5,
    contactEmail: 'contact@meadowbrook.com',
    contactPhone: '(555) 456-7890',
    members: [{
      id: '6',
      name: 'Emma Thompson',
      email: 'emma.t@email.com',
      role: 'homeowner',
      joinDate: '2024-01-10',
      status: 'active'
    }]
  }];

  // Filter HOAs based on search and filters
  const filteredHOAs = hoas.filter(hoa => {
    const matchesSearch = hoa.name.toLowerCase().includes(searchTerm.toLowerCase()) || hoa.city.toLowerCase().includes(searchTerm.toLowerCase()) || hoa.state.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || statusFilter === 'active' && hoa.activeMembers > 0 || statusFilter === 'inactive' && hoa.activeMembers === 0;
    return matchesSearch && matchesStatus;
  });

  // Calculate platform statistics
  const stats = {
    totalHOAs: hoas.length,
    totalUnits: hoas.reduce((sum, hoa) => sum + hoa.totalUnits, 0),
    totalMembers: hoas.reduce((sum, hoa) => sum + hoa.activeMembers, 0),
    pendingRequests: hoas.reduce((sum, hoa) => sum + hoa.pendingRequests, 0)
  };

  // Get status color for members
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get role color
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'homeowner':
        return 'bg-blue-100 text-blue-800';
      case 'board':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle HOA expansion
  const toggleHOAExpansion = (hoaId: string) => {
    setExpandedHOA(expandedHOA === hoaId ? null : hoaId);
  };
  return <div className="space-y-6">
      {/* Platform Statistics */}
      <div className="flex flex-col gap-2 w-full">
        <Card className="rounded-xl border w-full">
          <CardContent className="p-2 xs:p-3 sm:p-4 text-center w-full">
            <div className="text-base xs:text-lg md:text-xl font-bold text-purple-600 break-words">{stats.totalHOAs}</div>
            <div className="text-xs xs:text-sm md:text-sm text-gray-600 break-words">Total HOAs</div>
          </CardContent>
        </Card>
        <Card className="rounded-xl border w-full">
          <CardContent className="p-2 xs:p-3 sm:p-4 text-center w-full">
            <div className="text-base xs:text-lg md:text-xl font-bold text-blue-600 break-words">{stats.totalUnits.toLocaleString()}</div>
            <div className="text-xs xs:text-sm md:text-sm text-gray-600 break-words">Total Units</div>
          </CardContent>
        </Card>
        <Card className="rounded-xl border w-full">
          <CardContent className="p-2 xs:p-3 sm:p-4 text-center w-full">
            <div className="text-base xs:text-lg md:text-xl font-bold text-green-600 break-words">{stats.totalMembers.toLocaleString()}</div>
            <div className="text-xs xs:text-sm md:text-sm text-gray-600 break-words">Active Members</div>
          </CardContent>
        </Card>
        <Card className="rounded-xl border w-full">
          <CardContent className="p-2 xs:p-3 sm:p-4 text-center w-full">
            <div className="text-base xs:text-lg md:text-xl font-bold text-orange-600 break-words">{stats.pendingRequests}</div>
            <div className="text-xs xs:text-sm md:text-sm text-gray-600 break-words">Pending Requests</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input type="text" placeholder="Search HOAs, cities, or states..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-600" />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary">
            <option value="all">All HOAs</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* HOAs List */}
      <div className="space-y-4">
        {filteredHOAs.map(hoa => <Card key={hoa.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* HOA Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Building2 className="h-6 w-6 text-purple-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{hoa.name}</h3>
                        <Badge variant="outline" className="w-fit">
                          {hoa.totalUnits} units
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{hoa.city}, {hoa.state}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span>Created {new Date(hoa.createdDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{hoa.contactEmail}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span>{hoa.contactPhone}</span>
                        </div>
                      </div>
                      
                      {/* Quick Stats */}
                      <div className="grid grid-cols-3 gap-4 text-xs">
                        
                        <div className="bg-green-50 p-2 rounded">
                          <div className="font-medium text-green-900">Active Members</div>
                          <div className="text-green-700">{hoa.activeMembers}</div>
                        </div>
                        <div className="bg-orange-50 p-2 rounded">
                          <div className="font-medium text-orange-900">Pending</div>
                          <div className="text-orange-700">{hoa.pendingRequests}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" size="sm" onClick={() => toggleHOAExpansion(hoa.id)} className="text-blue-600 border-blue-600 hover:bg-blue-50">
                      {expandedHOA === hoa.id ? 'Hide Members' : 'View Members'}
                    </Button>
                    
                  </div>
                </div>

                {/* Expanded Members List */}
                {expandedHOA === hoa.id && <div className="border-t pt-4">
                    <h4 className="text-md font-semibold text-gray-900 mb-3">
                      Members ({hoa.members.length})
                    </h4>
                    <div className="space-y-3">
                      {hoa.members.map(member => <div key={member.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
                            <div className="bg-gray-200 p-2 rounded-full">
                              <Users className="h-4 w-4 text-gray-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                <span className="font-medium text-gray-900 truncate">{member.name}</span>
                                <div className="flex gap-2">
                                  <Badge className={getRoleColor(member.role)} variant="secondary">
                                    {member.role}
                                  </Badge>
                                  <Badge className={getStatusColor(member.status)} variant="secondary">
                                    {member.status}
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                <span className="truncate block sm:inline">{member.email}</span>
                                <span className="hidden sm:inline"> • </span>
                                <span className="block sm:inline">Joined {new Date(member.joinDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="text-gray-600 border-gray-600 hover:bg-gray-100 w-full sm:w-auto">
                            View Profile
                          </Button>
                        </div>)}
                    </div>
                  </div>}
              </div>
            </CardContent>
          </Card>)}
      </div>

      {filteredHOAs.length === 0 && <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <Building2 className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No HOAs found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' ? 'Adjust your search criteria or filters to see more results.' : 'No HOAs registered in the system yet.'}
            </p>
          </CardContent>
        </Card>}
    </div>;
};
export default HOAManagement;