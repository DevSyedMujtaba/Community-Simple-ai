import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Eye, 
  Calendar,
  AlertTriangle,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Filter,
  Search
} from "lucide-react";
import React, { useEffect } from "react";
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/lib/supabaseClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface Notice {
  id: string;
  title: string;
  type: 'violation' | 'maintenance' | 'community' | 'urgent';
  content: string;
  createdDate: string;
  dueDate?: string;
  status: 'unread' | 'read' | 'acknowledged' | 'responded';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  sender: string;
  requiresResponse?: boolean;
  notice_type?: string;
  response?: string; // Added response field
}

interface HomeownerNoticesProps {
  notices: Notice[];
  onUnreadCountChange?: (count: number) => void;
}

/**
 * Homeowner Notices Component
 * Displays notices sent to homeowners with filtering and status tracking
 * Mobile-responsive design with proper accessibility
 */
const HomeownerNotices = ({ notices = [], onUnreadCountChange }: HomeownerNoticesProps) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread' | 'urgent'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [localNotices, setLocalNotices] = useState(notices);
  const { toast } = useToast();
  const [respondingNoticeId, setRespondingNoticeId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const [submittingResponse, setSubmittingResponse] = useState(false);
  // Assume userId is available from session
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id || null);
    };
    getUser();
  }, []);

  // Sync localNotices with prop changes
  React.useEffect(() => {
    setLocalNotices(notices);
  }, [notices]);

  // Filter notices based on selected filter and search term
  const filteredNotices = localNotices.filter(notice => {
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'unread' && notice.status === 'unread') ||
      (selectedFilter === 'urgent' && notice.priority === 'urgent');
    
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Get status configuration
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'unread':
        return { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Unread' };
      case 'read':
        return { color: 'bg-[#e6eef3] text-[#254F70]', icon: Eye, label: 'Read' };
      case 'acknowledged':
        return { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Acknowledged' };
      case 'responded':
        return { color: 'bg-purple-100 text-purple-800', icon: CheckCircle, label: 'Responded' };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: Clock, label: 'Unknown' };
    }
  };

  // Get priority configuration
  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return { color: 'text-red-600', icon: AlertTriangle };
      case 'high':
        return { color: 'text-orange-600', icon: AlertTriangle };
      case 'medium':
        return { color: 'text-yellow-600', icon: Bell };
      default:
        return { color: 'text-gray-600', icon: Bell };
    }
  };

  // Get type configuration
  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'violation':
        return { color: 'text-red-600', icon: AlertTriangle, label: 'Violation' };
      case 'maintenance':
        return { color: 'text-orange-600', icon: Bell, label: 'Maintenance' };
      case 'community':
        return { color: 'text-[#254F70]', icon: FileText, label: 'Community' };
      case 'urgent':
        return { color: 'text-purple-600', icon: AlertTriangle, label: 'Urgent' };
      default:
        return { color: 'text-gray-600', icon: FileText, label: 'Notice' };
    }
  };

  // Update unreadCount to use localNotices
  const unreadCount = localNotices.filter(n => n.status === 'unread').length;

  // Notify parent of unread count changes
  useEffect(() => {
    if (onUnreadCountChange) onUnreadCountChange(unreadCount);
  }, [unreadCount, onUnreadCountChange]);

  // Update urgentCount to count notices with type or notice_type 'urgent'
  const urgentCount = localNotices.filter(n => (n.type === 'urgent' || n.notice_type === 'urgent')).length;

  // Handle notice actions
  const handleMarkAsRead = async (noticeId: string) => {
    const { error } = await supabase
      .from('notices')
      .update({ status: 'read' })
      .eq('id', noticeId);
    if (error) {
      toast({ title: 'Failed to mark as read', description: 'Could not update notice status.', variant: 'destructive' });
      return;
    }
    setLocalNotices(prev => {
      const updated = prev.map(n => n.id === noticeId ? { ...n, status: 'read' } : n);
      if (onUnreadCountChange) onUnreadCountChange(updated.filter(n => n.status === 'unread').length);
      return updated;
    });
  };

  const handleAcknowledge = async (noticeId: string) => {
    // Update in DB first
    const { error } = await supabase
      .from('notices')
      .update({ status: 'acknowledged' })
      .eq('id', noticeId);
    if (error) {
      toast({
        title: 'Failed to acknowledge',
        description: 'Could not update notice status in the database.',
        variant: 'destructive'
      });
      return;
    }
    setLocalNotices(prev => {
      const updated = prev.map(n => n.id === noticeId ? { ...n, status: 'acknowledged' } : n);
      if (onUnreadCountChange) onUnreadCountChange(updated.filter(n => n.status === 'unread').length);
      return updated;
    });
  };

  const handleRespond = (noticeId: string) => {
    setRespondingNoticeId(noticeId);
    setResponseText('');
  };

  const handleSubmitResponse = async () => {
    if (!respondingNoticeId) return;
    setSubmittingResponse(true);
    // Update the notice with the response and status
    const { error } = await supabase
      .from('notices')
      .update({
        response: responseText,
        status: 'responded'
      })
      .eq('id', respondingNoticeId);
    if (error) {
      toast({ title: 'Failed to send response', description: 'Could not save your response.', variant: 'destructive' });
      setSubmittingResponse(false);
      return;
    }
    setLocalNotices(prev => {
      const updated = prev.map(n => n.id === respondingNoticeId ? { ...n, status: 'responded', response: responseText } : n);
      if (onUnreadCountChange) onUnreadCountChange(updated.filter(n => n.status === 'unread').length);
      return updated;
    });
    toast({ title: 'Response sent', description: 'Your response has been sent.', variant: 'success' });
    setSubmittingResponse(false);
    setRespondingNoticeId(null);
    setResponseText('');
  };

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-gray-900">{notices.length}</div>
              <Bell className="h-6 w-6 text-[#254F70] ml-auto" />
            </div>
            <p className="text-sm text-gray-600 mt-1">Total Notices</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-gray-900">{unreadCount}</div>
              <AlertCircle className="h-6 w-6 text-red-600 ml-auto" />
            </div>
            <p className="text-sm text-gray-600 mt-1">Unread</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-gray-900">{urgentCount}</div>
              <AlertTriangle className="h-6 w-6 text-orange-600 ml-auto" />
            </div>
            <p className="text-sm text-gray-600 mt-1">Urgent</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search notices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm sm:text-base"
              />
            </div>
            
            {/* Filter buttons */}
            <div className="flex flex-row flex-wrap gap-2 sm:space-x-2">
              <Button
                variant={selectedFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('all')}
                className="text-xs min-w-[70px] bg-[#254F70] hover:bg-primary/90"
              >
                All ({notices.length})
              </Button>
              <Button
                variant={selectedFilter === 'unread' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('unread')}
                className="text-xs min-w-[70px]"
              >
                Unread ({unreadCount})
              </Button>
              <Button
                variant={selectedFilter === 'urgent' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('urgent')}
                className="text-xs min-w-[70px]"
              >
                Urgent ({urgentCount})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notices List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredNotices.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="p-8 text-center">
              <Bell className="h-8 w-8 mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notices found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search terms.' : 'You have no notices matching the selected filter.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotices.map((notice) => {
            const statusConfig = getStatusConfig(notice.status);
            const priorityConfig = getPriorityConfig(notice.priority);
            const typeConfig = getTypeConfig(notice.type);
            const StatusIcon = statusConfig.icon;
            const PriorityIcon = priorityConfig.icon;
            const TypeIcon = typeConfig.icon;

            return (
              <Card key={notice.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-3 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 min-w-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start space-x-2 sm:space-x-3 mb-3 min-w-0">
                        <div className="bg-gray-100 p-2 rounded-lg flex-shrink-0">
                          <TypeIcon className={`h-5 w-5 ${typeConfig.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2 min-w-0">
                            <h4 className="text-base sm:text-lg font-semibold text-gray-900 break-words min-w-0">
                              {notice.title}
                            </h4>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge className={statusConfig.color + ' text-xs'} variant="secondary">
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {statusConfig.label}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {typeConfig.label}
                              </Badge>
                              {(notice.type === 'urgent' || notice.notice_type === 'urgent') && (
                                <Badge variant="destructive" className="text-xs">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Urgent
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-600 mb-3 break-words">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              Sent: {new Date(notice.createdDate).toLocaleDateString()}
                            </div>
                            {notice.dueDate && (
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2" />
                                Due: {new Date(notice.dueDate).toLocaleDateString()}
                              </div>
                            )}
                            <div className="flex items-center">
                              <span className="font-medium break-words">From: {notice.sender}</span>
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-700 mb-4 break-words">
                            {notice.content}
                          </p>
                          {notice.response && (
                            <div className="mt-2 text-xs text-gray-600">
                              <strong>Your response:</strong> {notice.response}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                      {notice.status !== 'responded' && (
                        notice.dueDate ? (
                          <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkAsRead(notice.id)}
                          className="text-xs min-w-[80px]"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Mark Read
                        </Button>
                            <Button
                              size="sm"
                              onClick={() => handleRespond(notice.id)}
                              className="bg-[#254F70] hover:bg-primary/90 text-xs min-w-[80px]"
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              Respond
                            </Button>
                          </>
                        ) : (
                          notice.status !== 'acknowledged' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAcknowledge(notice.id)}
                          className="text-xs min-w-[80px]"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Acknowledge
                        </Button>
                          )
                        )
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
      <Dialog open={!!respondingNoticeId} onOpenChange={open => { if (!open) setRespondingNoticeId(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Respond to Notice</DialogTitle>
          </DialogHeader>
          <Input
            as="textarea"
            value={responseText}
            onChange={e => setResponseText(e.target.value)}
            placeholder="Enter your response..."
            className="w-full min-h-[100px]"
            disabled={submittingResponse}
          />
          <DialogFooter>
            <Button onClick={handleSubmitResponse} disabled={submittingResponse || !responseText.trim()}>
              {submittingResponse ? 'Sending...' : 'Send Response'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomeownerNotices;
