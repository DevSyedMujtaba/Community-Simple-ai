import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Plus, 
  Send, 
  Eye, 
  Calendar,
  Users,
  AlertTriangle,
  FileText,
  Edit
} from "lucide-react";

interface Notice {
  id: string;
  title: string;
  type: 'violation' | 'maintenance' | 'community' | 'urgent';
  recipient: string;
  unit?: string;
  createdDate: string;
  status: 'draft' | 'sent' | 'acknowledged';
  content: string;
}

/**
 * Notice Generation Component
 * Allows board members to create and send notices to residents
 * Supports different notice types and tracking
 */
const NoticeGeneration = () => {
  const [activeTab, setActiveTab] = useState<'notices' | 'create'>('notices');
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    type: 'community' as const,
    recipient: 'all',
    unit: '',
    content: ''
  });

  // Sample notices data
  const notices: Notice[] = [
    {
      id: '1',
      title: 'Parking Violation - Unit 101A',
      type: 'violation',
      recipient: 'Sarah Johnson',
      unit: '101A',
      createdDate: '2024-01-14',
      status: 'sent',
      content: 'Your vehicle has been parked in a visitor space for more than 24 hours...'
    },
    {
      id: '2',
      title: 'Pool Maintenance Schedule',
      type: 'maintenance',
      recipient: 'All Residents',
      createdDate: '2024-01-13',
      status: 'sent',
      content: 'The community pool will be closed for maintenance from January 20-22...'
    },
    {
      id: '3',
      title: 'HOA Board Meeting Reminder',
      type: 'community',
      recipient: 'All Residents',
      createdDate: '2024-01-12',
      status: 'draft',
      content: 'Monthly HOA board meeting scheduled for January 25th at 7:00 PM...'
    }
  ];

  const noticeTypes = [
    { value: 'violation', label: 'Violation Notice', color: 'text-red-600', icon: AlertTriangle },
    { value: 'maintenance', label: 'Maintenance Alert', color: 'text-orange-600', icon: Bell },
    { value: 'community', label: 'Community Update', color: 'text-blue-600', icon: Users },
    { value: 'urgent', label: 'Urgent Notice', color: 'text-purple-600', icon: AlertTriangle }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'acknowledged': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = noticeTypes.find(t => t.value === type);
    return typeConfig?.icon || FileText;
  };

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating notice:', noticeForm);
    // In real implementation, this would call API to create notice
    setNoticeForm({
      title: '',
      type: 'community',
      recipient: 'all',
      unit: '',
      content: ''
    });
    setActiveTab('notices');
  };

  const handleSendNotice = (noticeId: string) => {
    console.log('Sending notice:', noticeId);
    // In real implementation, this would call API to send notice
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('notices')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'notices'
              ? 'bg-white text-primary shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FileText className="h-4 w-4 inline mr-2" />
          All Notices ({notices.length})
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'create'
              ? 'bg-white text-primary shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Plus className="h-4 w-4 inline mr-2" />
          Create Notice
        </button>
      </div>

      {/* Notices List */}
      {activeTab === 'notices' && (
        <div className="space-y-3">
          {notices.map((notice) => {
            const IconComponent = getTypeIcon(notice.type);
            return (
              <Card key={notice.id} className="hover:shadow-md transition-shadow rounded-xl border border-gray-200">
                <CardContent className="p-2 xs:p-3 sm:p-4">
                  <div className="flex flex-col gap-2 min-w-0">
                    <div className="flex flex-row gap-2 min-w-0 items-start">
                      <div className="bg-gray-100 p-2 xs:p-3 rounded-lg flex-shrink-0">
                        <IconComponent className="h-5 w-5 xs:h-6 xs:w-6 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col gap-2 mb-1 min-w-0">
                          <h4 className="text-base xs:text-lg font-semibold text-gray-900 break-words min-w-0">{notice.title}</h4>
                          <div className="flex flex-wrap gap-2">
                            <Badge className={getStatusColor(notice.status) + ' text-xs'} variant="secondary">
                            {notice.status}
                          </Badge>
                            <Badge variant="outline" className="text-xs">{notice.type}</Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-2 text-xs xs:text-sm text-gray-600 mb-2 min-w-0">
                          <div className="flex items-center min-w-0">
                            <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="break-words min-w-0">{notice.recipient}</span>
                          </div>
                          {notice.unit && (
                            <div className="flex items-center min-w-0">
                              <span className="font-medium break-words min-w-0">Unit: {notice.unit}</span>
                            </div>
                          )}
                          <div className="flex items-center min-w-0">
                            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="break-words min-w-0">{new Date(notice.createdDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <p className="text-xs xs:text-sm text-gray-700 break-words min-w-0">{notice.content}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full mt-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {notice.status === 'draft' && (
                        <>
                          <Button variant="outline" size="sm" className="w-full">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleSendNotice(notice.id)}
                            className="bg-[#254F70] hover:bg-primary/90 w-full"
                            size="sm"
                          >
                            <Send className="h-4 w-4 mr-1" />
                            Send
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Notice Form */}
      {activeTab === 'create' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2 text-primary" />
              Create New Notice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateNotice} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notice Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={noticeForm.title}
                    onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                    placeholder="e.g., Parking Violation Notice"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notice Type *
                  </label>
                  <select
                    required
                    value={noticeForm.type}
                    onChange={(e) => setNoticeForm({ ...noticeForm, type: e.target.value as any })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    {noticeTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient *
                  </label>
                  <select
                    required
                    value={noticeForm.recipient}
                    onChange={(e) => setNoticeForm({ ...noticeForm, recipient: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="all">All Residents</option>
                    <option value="specific">Specific Resident</option>
                    <option value="unit">Specific Unit</option>
                  </select>
                </div>
                
                {(noticeForm.recipient === 'specific' || noticeForm.recipient === 'unit') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {noticeForm.recipient === 'specific' ? 'Resident Name' : 'Unit Number'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={noticeForm.unit}
                      onChange={(e) => setNoticeForm({ ...noticeForm, unit: e.target.value })}
                      placeholder={noticeForm.recipient === 'specific' ? 'Enter resident name' : 'e.g., 101A'}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notice Content *
                </label>
                <textarea
                  required
                  value={noticeForm.content}
                  onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                  placeholder="Enter the full content of your notice..."
                  rows={8}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This content will be sent to the selected recipients via email and displayed in their dashboard.
                </p>
              </div>
              
              <div className="flex space-x-3">
                <Button type="submit" className="bg-[#254F70] hover:bg-primary/90">
                  <FileText className="h-4 w-4 mr-2" />
                  Save as Draft
                </Button>
                <Button 
                  type="button"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={(e) => {
                    // Handle send immediately
                    handleCreateNotice(e as any);
                  }}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Immediately
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NoticeGeneration;
