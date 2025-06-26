import { useState } from "react";
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
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    unitNumber: '101A',
    hoaName: 'Sunrise Valley HOA',
    memberSince: '2023-03-15',
    status: 'active'
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    complianceAlerts: true,
    documentUpdates: true,
    communityAnnouncements: true
  });

  const [editForm, setEditForm] = useState(userProfile);

  const handleSaveProfile = () => {
    setUserProfile(editForm);
    setIsEditing(false);
    console.log('Saving profile:', editForm);
    // In real implementation, this would call API to update profile
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
              <User className="h-5 w-5 mr-2 text-primary flex-shrink-0" />
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
            <Bell className="h-5 w-5 mr-2 text-primary flex-shrink-0" />
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
                className="w-full xs:w-auto text-xs px-3 py-2"
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
                className="w-full xs:w-auto text-xs px-3 py-2"
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
                className="w-full xs:w-auto text-xs px-3 py-2"
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
                className="w-full xs:w-auto text-xs px-3 py-2"
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
            <SettingsIcon className="h-5 w-5 mr-2 text-primary flex-shrink-0" />
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
