
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Edit, Mail, Phone, MapPin, Search } from "lucide-react";

interface Homeowner {
  id: string;
  name: string;
  unit: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  lastActive: string;
}

/**
 * Community Management Component for Board Members
 * Manages homeowner accounts, units, and community settings
 * Provides tools for adding/editing homeowners and viewing community stats
 */
const CommunityManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHomeowner, setSelectedHomeowner] = useState<string | null>(null);

  // Sample homeowners data
  const homeowners: Homeowner[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      unit: '101A',
      email: 'sarah.johnson@email.com',
      phone: '(555) 123-4567',
      status: 'active',
      joinDate: '2023-03-15',
      lastActive: '2024-01-14'
    },
    {
      id: '2',
      name: 'Mike Chen',
      unit: '102B',
      email: 'mike.chen@email.com',
      phone: '(555) 234-5678',
      status: 'active',
      joinDate: '2023-05-20',
      lastActive: '2024-01-13'
    },
    {
      id: '3',
      name: 'Linda Rodriguez',
      unit: '103C',
      email: 'linda.r@email.com',
      phone: '(555) 345-6789',
      status: 'active',
      joinDate: '2023-07-10',
      lastActive: '2024-01-12'
    },
    {
      id: '4',
      name: 'David Wilson',
      unit: '104A',
      email: 'david.wilson@email.com',
      phone: '(555) 456-7890',
      status: 'inactive',
      joinDate: '2023-02-28',
      lastActive: '2023-12-20'
    },
    {
      id: '5',
      name: 'Emma Thompson',
      unit: '105B',
      email: 'emma.t@email.com',
      phone: '(555) 567-8901',
      status: 'pending',
      joinDate: '2024-01-10',
      lastActive: 'Never'
    },
    {
      id: '6',
      name: 'Robert Kim',
      unit: '106C',
      email: 'robert.kim@email.com',
      phone: '(555) 678-9012',
      status: 'active',
      joinDate: '2023-09-05',
      lastActive: '2024-01-11'
    }
  ];

  // Filter homeowners based on search term
  const filteredHomeowners = homeowners.filter(homeowner =>
    homeowner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    homeowner.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
    homeowner.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle homeowner actions
  const handleEditHomeowner = (id: string) => {
    console.log('Editing homeowner:', id);
    // In real implementation, this would open an edit modal
  };

  const handleContactHomeowner = (homeowner: Homeowner) => {
    console.log('Contacting homeowner:', homeowner.name);
    // In real implementation, this would open messaging interface
  };

  return (
    <div className="space-y-6">
      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {homeowners.filter(h => h.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">Active Members</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {homeowners.filter(h => h.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">
              {homeowners.filter(h => h.status === 'inactive').length}
            </div>
            <div className="text-sm text-gray-600">Inactive</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">156</div>
            <div className="text-sm text-gray-600">Total Units</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search homeowners, units, or emails..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Homeowner
        </Button>
      </div>

      {/* Homeowners List */}
      <div className="space-y-4">
        {filteredHomeowners.map((homeowner) => (
          <Card key={homeowner.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {homeowner.name}
                      </h3>
                      <Badge className={getStatusColor(homeowner.status)} variant="secondary">
                        {homeowner.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        Unit {homeowner.unit}
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        {homeowner.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        {homeowner.phone}
                      </div>
                      <div className="text-gray-500">
                        Joined: {new Date(homeowner.joinDate).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-500">
                      Last active: {homeowner.lastActive === 'Never' ? 'Never' : new Date(homeowner.lastActive).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleContactHomeowner(homeowner)}
                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    Contact
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditHomeowner(homeowner.id)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredHomeowners.length === 0 && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No homeowners found</h3>
            <p className="text-gray-600">
              {searchTerm 
                ? `No homeowners match "${searchTerm}". Try a different search term.`
                : 'No homeowners registered yet. Add the first homeowner to get started.'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Community Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <div className="flex items-center w-full mb-2">
                <Plus className="h-5 w-5 mr-2 text-blue-600" />
                <span className="font-medium">Bulk Import</span>
              </div>
              <span className="text-sm text-gray-600 text-left">
                Import multiple homeowners from CSV file
              </span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <div className="flex items-center w-full mb-2">
                <Mail className="h-5 w-5 mr-2 text-green-600" />
                <span className="font-medium">Send Newsletter</span>
              </div>
              <span className="text-sm text-gray-600 text-left">
                Send community updates to all members
              </span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <div className="flex items-center w-full mb-2">
                <Users className="h-5 w-5 mr-2 text-purple-600" />
                <span className="font-medium">Generate Report</span>
              </div>
              <span className="text-sm text-gray-600 text-left">
                Export community member activity report
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityManagement;
