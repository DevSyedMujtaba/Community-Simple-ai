import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Search, Filter, Calendar, MapPin, Mail, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";
import { useRef } from "react";
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
  const [accessToken, setAccessToken] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);
  const [myCommunity, setMyCommunity] = useState(null);
  const [communityLoading, setCommunityLoading] = useState(true);
  const [showCommunityForm, setShowCommunityForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const fileInputRef = useRef(null);
  const [userId, setUserId] = useState("");

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

  useEffect(() => {
    const fetchCommunity = async () => {
      setCommunityLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setMyCommunity(null);
        setCommunityLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("hoa_communities")
        .select("id, name, state, city, address, units, contact_email, contact_phone, description, created_at")
        .eq("board_member_id", user.id)
        .single();
      setMyCommunity(data || null);
      setCommunityLoading(false);
    };
    fetchCommunity();
  }, []);

  useEffect(() => {
    if (formSuccess) {
      setShowCommunityForm(false);
    }
  }, [formSuccess]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || "");
    };
    fetchUser();
  }, []);

  const handleCommunityInput = (e) => {
    const { name, value } = e.target;
    setCommunityForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCommunitySubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");
    setFormSuccess(false);

    if (!accessToken) {
      setFormError("You must be logged in as a board member to create a community.");
      setFormLoading(false);
      return;
    }

    try {
      const response = await fetch("https://yurteupcbisnkcrtjsbv.supabase.co/functions/v1/create_hoa_community", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(communityForm)
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setFormSuccess(true);
        setCommunityForm({
          name: "",
          state: "",
          city: "",
          address: "",
          units: "",
          contact_email: "",
          contact_phone: "",
          description: ""
        });
      } else {
        setFormError(result.error || "Failed to create community.");
      }
    } catch (err) {
      setFormError("An unexpected error occurred.");
    } finally {
      setFormLoading(false);
    }
  };

  // Remove the static hoas array and related logic
  // Only show the board member's own community in the list
  let displayHOAs = [];
  if (myCommunity) {
    const matchesSearch = myCommunity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      myCommunity.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      myCommunity.state.toLowerCase().includes(searchTerm.toLowerCase());
    // Add status filter logic if needed (for now, always true)
    if (matchesSearch) {
      displayHOAs = [{
        id: myCommunity.id,
        name: myCommunity.name,
        address: myCommunity.address,
        city: myCommunity.city,
        state: myCommunity.state,
        totalUnits: myCommunity.units,
        createdDate: myCommunity.created_at,
        boardMembers: 1,
        activeMembers: 0,
        pendingRequests: 0,
        contactEmail: myCommunity.contact_email,
        contactPhone: myCommunity.contact_phone,
        members: [],
      }];
    }
  }

  // Calculate platform statistics
  const stats = {
    totalHOAs: myCommunity ? 1 : 0,
    totalUnits: myCommunity ? Number(myCommunity.units) : 0,
    totalMembers: 0, // Placeholder, update if you fetch members
    pendingRequests: 0 // Placeholder, update if you fetch requests
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
      {/* Create Community Button and Form */}
      {!showCommunityForm && (
        <Button
          className="w-full h-11 sm:h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base mb-4"
          onClick={() => setShowCommunityForm(true)}
        >
          Create Community
        </Button>
      )}
      {showCommunityForm && (
        <Card className="rounded-xl border w-full mb-4">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Create New HOA Community</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCommunitySubmit} className="space-y-4 bg-white p-4 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
              <div>
                <Label>Description (optional)</Label>
                <Input name="description" value={communityForm.description} onChange={handleCommunityInput} />
              </div>
              {formError && <div className="text-red-600 text-sm mb-2">{formError}</div>}
              {formSuccess && <div className="text-green-600 text-sm mb-2">Community created successfully!</div>}
              <div className="flex gap-2">
                <Button type="submit" disabled={formLoading} className="w-full h-11 sm:h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base rounded-lg">
                  {formLoading ? "Creating..." : "Create Community"}
                </Button>
                <Button type="button" variant="outline" className="w-full h-11 sm:h-12" onClick={() => setShowCommunityForm(false)} disabled={formLoading}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
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
        {displayHOAs.map(hoa => <Card key={hoa.id} className="hover:shadow-md transition-shadow">
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
                    <Button variant="outline" size="sm" onClick={() => toggleHOAExpansion(hoa.id)} className="text-[#254F70] border-[#254F70] hover:bg-blue-50">
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

      {/* File upload UI above the documents list */}
      {/* Remove the file upload UI from HOA Management tab */}
      {/* (Delete or comment out the <input type="file" ... /> and related upload logic in this file) */}

      {displayHOAs.length === 0 && <Card className="border-dashed border-2 border-gray-300">
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