
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Search, Filter, Mail, Calendar, Activity, TrendingUp } from "lucide-react";
import useAdminUsers from "@/hooks/useAdminUsers";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

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
  status: 'active' | 'inactive' | 'suspended' | 'rejected';
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
  const [detailsUser, setDetailsUser] = useState<User | null>(null);
  const [suspendUser, setSuspendUser] = useState<User | null>(null);
  const [suspendLoading, setSuspendLoading] = useState(false);
  const [suspendError, setSuspendError] = useState<string | null>(null);

  // Use the custom hook to fetch users
  const { users, loading, error, refetch } = useAdminUsers();

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

  // Add a helper to format token usage
  const formatTokenUsage = (value: number) => {
    if (value < 1000) return value.toString();
    if (value < 1000000) return (value / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return (value / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'rejected': return 'bg-gray-100 text-gray-800';
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
    const user = users.find(u => u.id === userId);
    setDetailsUser(user || null);
  };

  const handleSuspendUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    setSuspendUser(user || null);
    setSuspendError(null);
  };

  const handleActivateUser = async (userId: string) => {
    setSuspendLoading(true);
    setSuspendError(null);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: 'active' })
        .eq('id', userId);
      if (error) throw error;
      await refetch();
    } catch (err: any) {
      setSuspendError(err.message || 'Failed to activate user');
    } finally {
      setSuspendLoading(false);
    }
  };

  const confirmSuspendUser = async () => {
    if (!suspendUser) return;
    setSuspendLoading(true);
    setSuspendError(null);
    try {
      // Update user status in Supabase (set status to 'suspended')
      const { error } = await supabase
        .from('profiles')
        .update({ status: 'suspended' })
        .eq('id', suspendUser.id);
      if (error) throw error;
      await refetch();
      setSuspendUser(null);
      setDetailsUser(null);
    } catch (err: any) {
      setSuspendError(err.message || 'Failed to suspend user');
    } finally {
      setSuspendLoading(false);
    }
  };

  // Add loading and error states
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <span className="text-lg text-red-500">{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Platform Statistics */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
        <Card className="rounded-xl border">
          <CardContent className="p-2 xs:p-3 sm:p-4 text-center">
            <div className="text-base xs:text-xl lg:text-2xl font-bold text-purple-600">{stats.total}</div>
            <div className="text-xs xs:text-sm lg:text-sm text-gray-600">Total Users</div>
          </CardContent>
        </Card>
        <Card className="rounded-xl border">
          <CardContent className="p-2 xs:p-3 sm:p-4 text-center">
            <div className="text-base xs:text-xl lg:text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-xs xs:text-sm lg:text-sm text-gray-600">Active</div>
          </CardContent>
        </Card>
        <Card className="rounded-xl border">
          <CardContent className="p-2 xs:p-3 sm:p-4 text-center">
            <div className="text-base xs:text-xl lg:text-2xl font-bold text-blue-600">{stats.homeowners}</div>
            <div className="text-xs xs:text-sm lg:text-sm text-gray-600">Homeowners</div>
          </CardContent>
        </Card>
        <Card className="rounded-xl border">
          <CardContent className="p-2 xs:p-3 sm:p-4 text-center">
            <div className="text-base xs:text-xl lg:text-2xl font-bold text-purple-600">{stats.boardMembers}</div>
            <div className="text-xs xs:text-sm lg:text-sm text-gray-600">Board Members</div>
          </CardContent>
        </Card>
        <Card className="rounded-xl border">
          <CardContent className="p-2 xs:p-3 sm:p-4 text-center">
            <div className="text-base xs:text-xl lg:text-2xl font-bold text-orange-600">{stats.totalMessages.toLocaleString()}</div>
            <div className="text-xs xs:text-sm lg:text-sm text-gray-600">Messages</div>
          </CardContent>
        </Card>
        <Card className="rounded-xl border">
          <CardContent className="p-4 sm:p-6 text-center">
            <div className="text-2xl font-bold text-red-600">{formatTokenUsage(stats.totalTokens)}</div>
            <div className="text-xs text-gray-600 mt-1">Tokens Used</div>
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
          (() => { console.log('User status:', user.status, user); })(),
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
                          {(user.status === 'active' || user.status === 'inactive' || user.status === 'suspended') && (
                            <Badge className={getStatusColor(user.status)} variant="secondary">
                              {user.status}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{user.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">
                            {user.status === 'rejected'
                              ? 'Not a member of any community'
                              : user.hoaName}
                          </span>
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
                      className="text-[#254F70] border-[#254F70] hover:bg-blue-50"
                    >
                      View Details
                    </Button>
                    {user.status === 'suspended' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleActivateUser(user.id)}
                        className="text-green-600 border-green-600 hover:bg-green-50"
                        disabled={suspendLoading}
                      >
                        {suspendLoading ? 'Activating...' : 'Activate'}
                      </Button>
                    ) : user.status !== 'suspended' && (
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

      {/* View Details Dialog */}
      <Dialog open={!!detailsUser} onOpenChange={() => setDetailsUser(null)}>
        <DialogContent className="max-w-3xl min-w-[400px] h-[500px] flex flex-col justify-between p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary mb-6">User Details</DialogTitle>
          </DialogHeader>
          {detailsUser && (
            <div className="flex flex-col h-full justify-between">
              {/* Top row: Name, badges, email */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-xl font-semibold text-gray-900">{detailsUser.name}</span>
                  <Badge className={getRoleColor(detailsUser.role)} variant="secondary">{detailsUser.role}</Badge>
                  <Badge className={getStatusColor(detailsUser.status)} variant="secondary">{detailsUser.status}</Badge>
                </div>
                <div className="text-sm text-gray-600 sm:text-right sm:self-center">{detailsUser.email}</div>
              </div>
              {/* Info row: Community, Joined, Last Active */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-base mb-2">
                <div>
                  <span className="font-medium text-gray-700">Community:</span>
                  <span className="ml-2">{detailsUser.status === 'rejected' ? 'Not a member of any community' : detailsUser.hoaName}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Joined:</span>
                  <span className="ml-2">{new Date(detailsUser.joinDate).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Last Active:</span>
                  <span className="ml-2">{new Date(detailsUser.lastActive).toLocaleDateString()}</span>
                </div>
              </div>
              {/* Divider */}
              <div className="border-t border-gray-200 my-4"></div>
              {/* Stats row: Messages/Token Usage */}
              <div className="grid grid-cols-3 gap-8 text-center mt-2">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Messages Sent</div>
                  <div className="text-2xl font-bold text-blue-700">{detailsUser.messagesSent}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Messages Received</div>
                  <div className="text-2xl font-bold text-green-700">{detailsUser.messagesReceived}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Token Usage</div>
                  <div className="text-2xl font-bold text-purple-700">{detailsUser.tokenUsage.toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="mt-8">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suspend Confirmation Dialog */}
      <Dialog open={!!suspendUser} onOpenChange={() => setSuspendUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend User</DialogTitle>
            <DialogDescription>
              Are you sure you want to suspend this user? This will deactivate their account.
            </DialogDescription>
          </DialogHeader>
          {suspendError && <div className="text-red-600 mb-2">{suspendError}</div>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuspendUser(null)} disabled={suspendLoading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmSuspendUser} disabled={suspendLoading}>
              {suspendLoading ? 'Suspending...' : 'Yes, Suspend'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
      {/*
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
              <Button className="bg-[#254F70] hover:bg-primary/90 w-full sm:w-auto">
                <TrendingUp className="h-4 w-4 mr-2" />
                Usage Analytics
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      */}
    </div>
  );
};

export default UserManagement;
