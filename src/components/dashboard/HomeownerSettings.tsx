import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Bell, 
  Shield, 
  Save,
  Edit,
  Home,
  Settings as SettingsIcon
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  unitNumber: string;
  hoaName: string;
  memberSince: string;
  status: 'active' | 'pending' | 'inactive';
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  complianceAlerts: boolean;
  documentUpdates: boolean;
  communityAnnouncements: boolean;
}

/**
 * Homeowner Settings Component
 * Manages user profile, notification preferences, and account settings
 * Provides interface for updating personal information and preferences
 */
const HomeownerSettings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    unitNumber: '',
    hoaName: '',
    memberSince: '',
    status: 'pending',
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    complianceAlerts: true,
    documentUpdates: true,
    communityAnnouncements: true
  });

  const [editForm, setEditForm] = useState<UserProfile>(userProfile);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      console.log('Supabase session user:', user); // Debug: log the current user
      if (!user) return;
      // Fetch profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('first_name, last_name, phone')
        .eq('id', user.id)
        .single();
      console.log('Fetched profile:', profile, 'Error:', profileError); // Debug: log the fetched profile and any error
      // Fetch join request (active membership)
      const { data: join, error: joinError } = await supabase
        .from('hoa_join_requests')
        .select('hoa_id, status, created_at, hoa_communities(name)')
        .eq('user_id', user.id)
        .in('status', ['active', 'pending'])
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      console.log('Fetched join request:', join, 'Error:', joinError); // Debug: log the join request and any error
      // Fetch unit_number from homeowner_details
      const { data: details, error: detailsError } = await supabase
        .from('homeowner_details')
        .select('unit_number')
        .eq('user_id', user.id)
        .single();
      console.log('Fetched homeowner_details:', details, 'Error:', detailsError); // Debug: log the fetched homeowner_details and any error
      setUserProfile({
        name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : '',
        email: user.email || '',
        phone: profile?.phone || '',
        unitNumber: details?.unit_number || '',
        hoaName: join?.hoa_communities?.name || '',
        memberSince: join?.created_at || '',
        status: join?.status || 'pending',
      });
    };
    fetchProfile();
  }, []);

  // Add this effect to sync editForm with userProfile when userProfile changes
  useEffect(() => {
    setEditForm(userProfile);
  }, [userProfile]);

  const handleSaveProfile = async () => {
    setIsEditing(false);
    // Split full name into first and last name
    const [first_name, ...rest] = editForm.name.trim().split(' ');
    const last_name = rest.join(' ');
    // Get current user
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;
    if (!user) return;
    // Update the profile in Supabase
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        first_name,
        last_name,
        phone: editForm.phone,
      })
      .eq('id', user.id);
    // Update the unit_number in homeowner_details
    const { error: detailsError } = await supabase
      .from('homeowner_details')
      .update({
        unit_number: editForm.unitNumber,
      })
      .eq('user_id', user.id);
    if (profileError || detailsError) {
      toast({
        title: 'Profile Update Failed',
        description: 'There was an error updating your profile. Please try again.',
        variant: 'destructive',
      });
      console.error('Failed to update profile:', profileError, detailsError);
    } else {
      toast({
        title: 'Profile Updated',
        description: 'Your profile information has been updated successfully.',
        variant: 'default',
      });
      setUserProfile(editForm);
    }
  };

  const handleCancelEdit = () => {
    setEditForm(userProfile);
    setIsEditing(false);
  };

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2">
            <div className="flex items-center min-w-0">
              <User className="h-5 w-5 mr-2 text-[#254F70] flex-shrink-0" />
              <span className="truncate text-base sm:text-lg">Profile Information</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs px-3 py-1"
            >
              <Edit className="h-4 w-4 mr-1" />
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-xs sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-xs sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-xs sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Unit Number</label>
                  <input
                    type="text"
                    value={editForm.unitNumber}
                    onChange={(e) => setEditForm({ ...editForm, unitNumber: e.target.value })}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-xs sm:text-base"
                  />
                </div>
              </div>
              <div className="flex flex-col xs:flex-row gap-2 xs:gap-3">
                <Button onClick={handleSaveProfile} className="text-xs px-3 py-2"> <Save className="h-4 w-4 mr-2" /> Save Changes </Button>
                <Button variant="outline" onClick={handleCancelEdit} className="text-xs px-3 py-2"> Cancel </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                <div className="space-y-3 sm:space-y-4 min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <User className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate break-words min-w-0">{userProfile.name}</p>
                      <p className="text-xs sm:text-sm text-gray-600">Full Name</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    <Mail className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate break-words min-w-0">{userProfile.email}</p>
                      <p className="text-xs sm:text-sm text-gray-600">Email Address</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    <Phone className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate break-words min-w-0">{userProfile.phone}</p>
                      <p className="text-xs sm:text-sm text-gray-600">Phone Number</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-4 min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <Home className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate break-words min-w-0">Unit {userProfile.unitNumber}</p>
                      <p className="text-xs sm:text-sm text-gray-600">Property Unit</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate break-words min-w-0">{userProfile.hoaName}</p>
                      <p className="text-xs sm:text-sm text-gray-600">HOA Community</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    <Shield className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 min-w-0 flex-wrap">
                        <Badge className={getStatusColor(userProfile.status) + ' text-xs'} variant="secondary">
                          {userProfile.status.charAt(0).toUpperCase() + userProfile.status.slice(1)}
                        </Badge>
                        <span className="text-xs sm:text-sm text-gray-600 truncate">since {new Date(userProfile.memberSince).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600">Membership Status</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-base sm:text-lg">
            <Bell className="h-5 w-5 mr-2 text-[#254F70] flex-shrink-0" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg">
              <div className="min-w-0">
                <p className="font-medium text-gray-900 text-xs sm:text-sm break-words">Email Notifications</p>
                <p className="text-xs sm:text-sm text-gray-600 break-words">Receive notifications via email</p>
              </div>
              <Button
                variant={notifications.emailNotifications ? "default" : "outline"}
                size="sm"
                onClick={() => handleNotificationChange('emailNotifications')}
                className="w-full xs:w-auto text-xs px-3 py-2 bg-[#254F70] hover:bg-primary/90"
              >
                {notifications.emailNotifications ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
            <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg">
              <div className="min-w-0">
                <p className="font-medium text-gray-900 text-xs sm:text-sm break-words">SMS Notifications</p>
                <p className="text-xs sm:text-sm text-gray-600 break-words">Receive notifications via text message</p>
              </div>
              <Button
                variant={notifications.smsNotifications ? "default" : "outline"}
                size="sm"
                onClick={() => handleNotificationChange('smsNotifications')}
                className="w-full xs:w-auto text-xs px-3 py-2"
              >
                {notifications.smsNotifications ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
            <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg">
              <div className="min-w-0">
                <p className="font-medium text-gray-900 text-xs sm:text-sm break-words">Compliance Alerts</p>
                <p className="text-xs sm:text-sm text-gray-600 break-words">Get notified about compliance issues</p>
              </div>
              <Button
                variant={notifications.complianceAlerts ? "default" : "outline"}
                size="sm"
                onClick={() => handleNotificationChange('complianceAlerts')}
                className="w-full xs:w-auto text-xs px-3 py-2 bg-[#254F70] hover:bg-primary/90"
              >
                {notifications.complianceAlerts ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
            <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg">
              <div className="min-w-0">
                <p className="font-medium text-gray-900 text-xs sm:text-sm break-words">Document Updates</p>
                <p className="text-xs sm:text-sm text-gray-600 break-words">Get notified when HOA documents are updated</p>
              </div>
              <Button
                variant={notifications.documentUpdates ? "default" : "outline"}
                size="sm"
                onClick={() => handleNotificationChange('documentUpdates')}
                className="w-full xs:w-auto text-xs px-3 py-2 bg-[#254F70] hover:bg-primary/90"
              >
                {notifications.documentUpdates ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
            <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg">
              <div className="min-w-0">
                <p className="font-medium text-gray-900 text-xs sm:text-sm break-words">Community Announcements</p>
                <p className="text-xs sm:text-sm text-gray-600 break-words">Receive community news and announcements</p>
              </div>
              <Button
                variant={notifications.communityAnnouncements ? "default" : "outline"}
                size="sm"
                onClick={() => handleNotificationChange('communityAnnouncements')}
                className="w-full xs:w-auto text-xs px-3 py-2 bg-[#254F70] hover:bg-primary/90"
              >
                {notifications.communityAnnouncements ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-base sm:text-lg">
            <SettingsIcon className="h-5 w-5 mr-2 text-[#254F70] flex-shrink-0" />
            Account Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 sm:space-y-3">
            <Button variant="outline" className="w-full justify-start text-xs px-3 py-2">
              <Shield className="h-4 w-4 mr-2" />
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start text-xs px-3 py-2">
              <Mail className="h-4 w-4 mr-2" />
              Update Email Address
            </Button>
            <Button variant="outline" className="w-full justify-start text-xs px-3 py-2 text-red-600 border-red-600 hover:bg-red-50">
              <User className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomeownerSettings;
