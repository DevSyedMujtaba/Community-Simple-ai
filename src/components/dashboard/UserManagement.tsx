
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Search, Filter, Mail, Calendar, Activity, TrendingUp } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'homeowner' | 'board';
  hoaName: string;
  joinDate: string;
  lastActive: string;
  messagesSent: number;
  messagesReceived: number;
  tokenUsage: number;
  status: 'active' | 'inactive' | 'suspended';
}

/**
 * User Management Component for Admin Dashboard
 * Displays and manages all registered users across all HOAs
 * Provides filtering, search, and user analytics
 * Fully responsive design for mobile and desktop
 */
const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'homeowner' | 'board'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');

  // Sample users data
  const users: User[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      role: 'homeowner',
      hoaName: 'Sunrise Valley HOA',
      joinDate: '2023-03-15',
      lastActive: '2024-01-14',
      messagesSent: 12,
      messagesReceived: 8,
      tokenUsage: 15420,
      status: 'active'
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      role: 'homeowner',
      hoaName: 'Sunrise Valley HOA',
      joinDate: '2023-05-20',
      lastActive: '2024-01-13',
      messagesSent: 8,
      messagesReceived: 12,
      tokenUsage: 8750,
      status: 'active'
    },
    {
      id: '3',
      name: 'Lisa Park',
      email: 'lisa.park@email.com',
      role: 'board',
      hoaName: 'Sunrise Valley HOA',
      joinDate: '2023-01-10',
      lastActive: '2024-01-15',
      messagesSent: 45,
      messagesReceived: 67,
      tokenUsage: 32150,
      status: 'active'
    },
    {
      id: '4',
      name: 'David Wilson',
      email: 'david.wilson@email.com',
      role: 'homeowner',
      hoaName: 'Oak Ridge Community',
      joinDate: '2023-02-28',
      lastActive: '2023-12-20',
      messagesSent: 3,
      messagesReceived: 5,
      tokenUsage: 2340,
      status: 'inactive'
    },
    {
      id: '5',
      name: 'Robert Kim',
      email: 'robert.kim@email.com',
      role: 'board',
      hoaName: 'Oak Ridge Community',
      joinDate: '2023-02-15',
      lastActive: '2024-01-12',
      messagesSent: 38,
      messagesReceived: 52,
      tokenUsage: 28900,
      status: 'active'
    },
    {
      id: '6',
      name: 'Emma Thompson',
      email: 'emma.t@email.com',
      role: 'homeowner',
      hoaName: 'Meadowbrook Community',
      joinDate: '2024-01-10',
      lastActive: '2024-01-11',
      messagesSent: 2,
      messagesReceived: 1,
      tokenUsage: 890,
      status: 'active'
    },
    {
      id: '7',
      name: 'John Martinez',
      email: 'john.martinez@email.com',
      role: 'homeowner',
      hoaName: 'Sunrise Valley HOA',
      joinDate: '2023-08-05',
      lastActive: '2023-11-15',
      messagesSent: 0,
      messagesReceived: 2,
      tokenUsage: 450,
      status: 'suspended'
    }
  ];

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.hoaName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    homeowners: users.filter(u => u.role === 'homeowner').length,
    boardMembers: users.filter(u => u.role === 'board').length,
    totalMessages: users.reduce((sum, u) => sum + u.messagesSent + u.messagesReceived, 0),
    totalTokens: users.reduce((sum, u) => sum + u.tokenUsage, 0)
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get role color
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'homeowner': return 'bg-blue-100 text-blue-800';
      case 'board': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle user actions
  const handleViewUser = (userId: string) => {
    console.log('Viewing user details:', userId);
    // In real implementation, this would open user details modal
  };

  const handleSuspendUser = (userId: string) => {
    console.log('Suspending user:', userId);
    // In real implementation, this would suspend the user
  };

  return (
    <div className="space-y-6">
      {/* Platform Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-xl lg:text-2xl font-bold text-purple-600">{stats.total}</div>
            <div className="text-xs lg:text-sm text-gray-600">Total Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-xl lg:text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-xs lg:text-sm text-gray-600">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-xl lg:text-2xl font-bold text-blue-600">{stats.homeowners}</div>
            <div className="text-xs lg:text-sm text-gray-600">Homeowners</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-xl lg:text-2xl font-bold text-purple-600">{stats.boardMembers}</div>
            <div className="text-xs lg:text-sm text-gray-600">Board Members</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-xl lg:text-2xl font-bold text-orange-600">{stats.totalMessages.toLocaleString()}</div>
            <div className="text-xs lg:text-sm text-gray-600">Messages</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-xl lg:text-2xl font-bold text-red-600">{(stats.totalTokens / 1000000).toFixed(1)}M</div>
            <div className="text-xs lg:text-sm text-gray-600">Tokens Used</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users, emails, or HOAs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-600" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="all">All Roles</option>
              <option value="homeowner">Homeowners</option>
              <option value="board">Board Members</option>
            </select>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 lg:p-6">
              <div className="space-y-4">
                {/* User Header */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex items-start space-x-4 min-w-0 flex-1">
                    <div className="bg-gray-100 p-3 rounded-full flex-shrink-0">
                      <Users className="h-6 w-6 text-gray-600" />
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{user.name}</h3>
                        <div className="flex gap-2">
                          <Badge className={getRoleColor(user.role)} variant="secondary">
                            {user.role}
                          </Badge>
                          <Badge className={getStatusColor(user.status)} variant="secondary">
                            {user.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{user.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{user.hoaName}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Activity className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span>Active {new Date(user.lastActive).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewUser(user.id)}
                      className="text-blue-600 border-blue-600 hover:bg-blue-50"
                    >
                      View Details
                    </Button>
                    {user.status !== 'suspended' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuspendUser(user.id)}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        Suspend
                      </Button>
                    )}
                  </div>
                </div>

                {/* Usage Statistics */}
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div className="bg-blue-50 p-3 rounded">
                    <div className="font-medium text-blue-900">Messages Sent</div>
                    <div className="text-blue-700 text-lg font-semibold">{user.messagesSent}</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <div className="font-medium text-green-900">Messages Received</div>
                    <div className="text-green-700 text-lg font-semibold">{user.messagesReceived}</div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded">
                    <div className="font-medium text-purple-900">Token Usage</div>
                    <div className="text-purple-700 text-lg font-semibold">{user.tokenUsage.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">
              {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
                ? 'Adjust your search criteria or filters to see more results.'
                : 'No users registered in the system yet.'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Export and Bulk Actions */}
      <Card>
        <CardContent className="p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Bulk Actions</h3>
              <p className="text-sm text-gray-600">
                Manage multiple users or export user data for analysis
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="w-full sm:w-auto">
                Export CSV
              </Button>
              <Button variant="outline" className="w-full sm:w-auto">
                Send Notification
              </Button>
              <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                <TrendingUp className="h-4 w-4 mr-2" />
                Usage Analytics
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
