
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  MapPin, 
  Users, 
  Calendar, 
  Edit, 
  Settings,
  Building,
  Search
} from "lucide-react";

interface HOA {
  id: string;
  name: string;
  city: string;
  state: string;
  totalUnits: number;
  activeMembers: number;
  createdDate: string;
  status: 'active' | 'pending' | 'inactive';
}

/**
 * HOA Management Component
 * Allows board members to create new HOAs and manage existing ones
 * Includes geographic tagging and member management
 */
const HOAManagement = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newHOA, setNewHOA] = useState({
    name: '',
    city: '',
    state: '',
    totalUnits: ''
  });

  // Sample HOAs data - in real app this would come from backend
  const hoas: HOA[] = [
    {
      id: '1',
      name: 'Sunrise Valley HOA',
      city: 'San Jose',
      state: 'CA',
      totalUnits: 156,
      activeMembers: 142,
      createdDate: '2023-03-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'Oakwood Community',
      city: 'Austin',
      state: 'TX',
      totalUnits: 89,
      activeMembers: 76,
      createdDate: '2023-07-20',
      status: 'active'
    }
  ];

  // US States for dropdown
  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  const filteredHOAs = hoas.filter(hoa =>
    hoa.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hoa.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hoa.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateHOA = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating HOA:', newHOA);
    // In real implementation, this would call API to create HOA
    setShowCreateForm(false);
    setNewHOA({ name: '', city: '', state: '', totalUnits: '' });
  };

  const handleEditHOA = (hoaId: string) => {
    console.log('Editing HOA:', hoaId);
    // In real implementation, this would open edit modal
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            HOA Communities ({filteredHOAs.length})
          </h3>
          <p className="text-sm text-gray-600">
            Create and manage your HOA communities
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New HOA
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search HOAs by name, city, or state..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      {/* Create HOA Form */}
      {showCreateForm && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="h-5 w-5 mr-2 text-primary" />
              Create New HOA Community
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateHOA} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    HOA Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newHOA.name}
                    onChange={(e) => setNewHOA({ ...newHOA, name: e.target.value })}
                    placeholder="e.g., Sunrise Valley HOA"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Units *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newHOA.totalUnits}
                    onChange={(e) => setNewHOA({ ...newHOA, totalUnits: e.target.value })}
                    placeholder="e.g., 150"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={newHOA.city}
                    onChange={(e) => setNewHOA({ ...newHOA, city: e.target.value })}
                    placeholder="e.g., San Jose"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <select
                    required
                    value={newHOA.state}
                    onChange={(e) => setNewHOA({ ...newHOA, state: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="">Select State</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  Create HOA
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* HOAs List */}
      <div className="space-y-4">
        {filteredHOAs.map((hoa) => (
          <Card key={hoa.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Building className="h-6 w-6 text-blue-600" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {hoa.name}
                      </h4>
                      <Badge className={getStatusColor(hoa.status)} variant="secondary">
                        {hoa.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {hoa.city}, {hoa.state}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        {hoa.activeMembers}/{hoa.totalUnits} Members
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Created {new Date(hoa.createdDate).toLocaleDateString()}
                      </div>
                    </div>
                    
                    {/* Quick Stats */}
                    <div className="flex flex-wrap gap-3 mt-3">
                      <div className="bg-green-50 px-3 py-1 rounded-full text-sm">
                        <span className="text-green-800 font-medium">
                          {Math.round((hoa.activeMembers / hoa.totalUnits) * 100)}% Occupied
                        </span>
                      </div>
                      <div className="bg-blue-50 px-3 py-1 rounded-full text-sm">
                        <span className="text-blue-800 font-medium">
                          {hoa.totalUnits - hoa.activeMembers} Available Units
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditHOA(hoa.id)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Manage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredHOAs.length === 0 && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <Building className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No HOAs found' : 'No HOAs created yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? `No HOAs match "${searchTerm}". Try a different search term.`
                : 'Create your first HOA community to get started with managing homeowners and documents.'
              }
            </p>
            {!searchTerm && (
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First HOA
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HOAManagement;
