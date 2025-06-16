
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
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <User className="h-5 w-5 mr-2 text-primary" />
              Profile Information
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="h-4 w-4 mr-1" />
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit Number
                  </label>
                  <input
                    type="text"
                    value={editForm.unitNumber}
                    onChange={(e) => setEditForm({ ...editForm, unitNumber: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button onClick={handleSaveProfile}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{userProfile.name}</p>
                      <p className="text-sm text-gray-600">Full Name</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{userProfile.email}</p>
                      <p className="text-sm text-gray-600">Email Address</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{userProfile.phone}</p>
                      <p className="text-sm text-gray-600">Phone Number</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Home className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Unit {userProfile.unitNumber}</p>
                      <p className="text-sm text-gray-600">Property Unit</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{userProfile.hoaName}</p>
                      <p className="text-sm text-gray-600">HOA Community</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(userProfile.status)} variant="secondary">
                          {userProfile.status.charAt(0).toUpperCase() + userProfile.status.slice(1)}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          since {new Date(userProfile.memberSince).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Membership Status</p>
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
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2 text-primary" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive notifications via email</p>
              </div>
              <Button
                variant={notifications.emailNotifications ? "default" : "outline"}
                size="sm"
                onClick={() => handleNotificationChange('emailNotifications')}
              >
                {notifications.emailNotifications ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">SMS Notifications</p>
                <p className="text-sm text-gray-600">Receive notifications via text message</p>
              </div>
              <Button
                variant={notifications.smsNotifications ? "default" : "outline"}
                size="sm"
                onClick={() => handleNotificationChange('smsNotifications')}
              >
                {notifications.smsNotifications ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Compliance Alerts</p>
                <p className="text-sm text-gray-600">Get notified about compliance issues</p>
              </div>
              <Button
                variant={notifications.complianceAlerts ? "default" : "outline"}
                size="sm"
                onClick={() => handleNotificationChange('complianceAlerts')}
              >
                {notifications.complianceAlerts ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Document Updates</p>
                <p className="text-sm text-gray-600">Get notified when HOA documents are updated</p>
              </div>
              <Button
                variant={notifications.documentUpdates ? "default" : "outline"}
                size="sm"
                onClick={() => handleNotificationChange('documentUpdates')}
              >
                {notifications.documentUpdates ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Community Announcements</p>
                <p className="text-sm text-gray-600">Receive community news and announcements</p>
              </div>
              <Button
                variant={notifications.communityAnnouncements ? "default" : "outline"}
                size="sm"
                onClick={() => handleNotificationChange('communityAnnouncements')}
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
          <CardTitle className="flex items-center">
            <SettingsIcon className="h-5 w-5 mr-2 text-primary" />
            Account Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Shield className="h-4 w-4 mr-2" />
              Change Password
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <Mail className="h-4 w-4 mr-2" />
              Update Email Address
            </Button>
            
            <Button variant="outline" className="w-full justify-start text-red-600 border-red-600 hover:bg-red-50">
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
