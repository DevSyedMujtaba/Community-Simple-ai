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
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

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
  status: 'pending' | 'approved' | 'rejected';
}

interface ResidentsManagementProps {
  joinRequests: JoinRequest[];
  residents: Resident[];
  hoaId: string;
}

/**
 * Residents Management Component
 * Handles inviting homeowners, approving requests, and managing residents
 */
const ResidentsManagement = ({ joinRequests, residents, hoaId }: ResidentsManagementProps) => {
  const [activeSection, setActiveSection] = useState<'residents' | 'requests' | 'invite'>('residents');
  const [searchTerm, setSearchTerm] = useState('');
  const [inviteForm, setInviteForm] = useState({
    email: '',
    unit: '',
    message: ''
  });
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [inviteLoading, setInviteLoading] = useState(false);
  const { toast } = useToast();

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

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = inviteForm.email.trim().toLowerCase();
    const unit = inviteForm.unit.trim();
    const message = inviteForm.message.trim();
    if (!email || !unit) {
      toast({ title: "Email and Unit Number are required.", variant: "destructive" });
      return;
    }
    // 3. Call Edge Function to send invitation with access token
    try {
      setInviteLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      // Get the current board member's user id
      const { data: userData } = await supabase.auth.getUser();
      const board_member_id = userData?.user?.id;
      if (!board_member_id) {
        toast({ title: "Could not determine board member ID.", variant: "destructive" });
        setInviteLoading(false);
        return;
      }
      const response = await fetch('https://yurteupcbisnkcrtjsbv.supabase.co/functions/v1/invite_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          email,
          hoa_id: hoaId,
          unit_number: unit,
          message,
          board_member_id,
        }),
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        toast({ title: "Error sending invitation.", description: data.error || 'Unknown error', variant: "destructive" });
        setInviteLoading(false);
        return;
      }
      toast({ title: "Invitation sent!", description: `Invitation sent to ${email}.`, variant: "default" });
      setInviteForm({ email: '', unit: '', message: '' });
      setInviteLoading(false);
    } catch (err) {
      toast({ title: "Error sending invitation.", description: String(err), variant: "destructive" });
      setInviteLoading(false);
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    setLoadingId(requestId);
    const { error } = await supabase
      .from('hoa_join_requests')
      .update({ status: 'approved' })
      .eq('id', requestId);
    setLoadingId(null);
    window.location.reload(); // quick refresh to show updated status
  };

  const handleRejectRequest = async (requestId: string) => {
    setLoadingId(requestId);
    const { error } = await supabase
      .from('hoa_join_requests')
      .update({ status: 'rejected' })
      .eq('id', requestId);
    setLoadingId(null);
    window.location.reload(); // quick refresh to show updated status
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
            <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-200 rounded-lg">
              <Clock className="h-8 w-8 text-gray-400 mb-2" />
              <div className="font-semibold text-gray-600">No pending requests</div>
              <div className="text-gray-400 text-sm">All join requests have been processed.</div>
            </div>
          ) : (
            <div className="space-y-4">
              {joinRequests.map((request) => (
                <Card key={request.id} className="border-orange-200">
                  <CardContent className="py-4 px-6 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-base text-gray-900">{request.name}</span>
                        <Badge
                          variant="outline"
                          className={
                            request.status === "pending"
                              ? "bg-orange-100 text-orange-800 border-orange-200 text-xs"
                              : request.status === "approved"
                              ? "bg-green-100 text-green-800 border-green-200 text-xs"
                              : "bg-red-100 text-red-800 border-red-200 text-xs"
                          }
                        >
                          {request.status === "pending"
                            ? "Pending Review"
                            : request.status === "approved"
                            ? "Approved"
                            : "Rejected"}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-10 text-sm text-gray-700 mb-2">
                        <span className="flex items-center gap-2 mr-6"><Mail className="h-4 w-4" />{request.email}</span>
                        <span className="flex items-center gap-2 mr-6"><Phone className="h-4 w-4" />{request.phone}</span>
                        <span className="flex items-center gap-2"><MapPin className="h-4 w-4" />Unit {request.requestedUnit}</span>
                      </div>
                      {request.message && (
                        <div className="bg-gray-50 rounded p-2 text-gray-700 text-sm mb-1">
                          {request.message}
                        </div>
                      )}
                      <div className="text-xs text-gray-400 mt-1">Requested on {request.requestDate}</div>
                    </div>
                    <div className="flex flex-row gap-2 mt-2 sm:mt-0">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleApproveRequest(request.id)} disabled={loadingId === request.id}>
                        <Check className="h-4 w-4 mr-1" />Approve
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-400 text-red-600 hover:bg-red-50" onClick={() => handleRejectRequest(request.id)} disabled={loadingId === request.id}>
                        <X className="h-4 w-4 mr-1" />Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
              
              <Button type="submit" className="bg-[#254F70] hover:bg-primary/90" disabled={inviteLoading}>
                {inviteLoading ? 'Sending...' : 'Send Invitation'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResidentsManagement;
