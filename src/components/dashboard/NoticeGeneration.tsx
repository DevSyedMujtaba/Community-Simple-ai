/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
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
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface Notice {
  id: string;
  title: string;
  type: string; // allow any string to match backend values
  recipient: string;
  unit?: string;
  createdDate?: string;
  created_at?: string;
  status: 'draft' | 'sent' | 'responded' | 'acknowledged';
  content: string;
  recipient_type?: string;
  recipient_unit?: string;
  recipient_user_id?: string;
  response?: string; // Added for homeowner response
  due_date?: string;
  recipient_name?: string;
}

interface NoticeGenerationProps {
  hoaId?: string;
  userId?: string;
}

/**
 * Notice Generation Component
 * Allows board members to create and send notices to residents
 * Supports different notice types and tracking
 */
const NoticeGeneration = ({ hoaId, userId }: NoticeGenerationProps) => {
  console.log('NoticeGeneration component mounted');
  console.log('hoaId:', hoaId, 'userId:', userId);
  const [activeTab, setActiveTab] = useState<'notices' | 'create'>('notices');
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    type: 'community' as string,
    recipient: 'all' as string,
    unit: '',
    content: '',
    dueDate: ''
  });
  const { toast } = useToast();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [viewingNotice, setViewingNotice] = useState<Notice | null>(null);

  useEffect(() => {
    console.log('useEffect triggered, hoaId:', hoaId);
    console.debug('NoticeGeneration useEffect - hoaId:', hoaId); // Debug hoaId
    const fetchNotices = async () => {
      setLoading(true);
      if (!hoaId) { 
        setNotices([]); 
        setLoading(false); 
        return; 
      }
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .eq('hoa_id', hoaId)
        .order('created_at', { ascending: false });
      console.log('Supabase fetch result:', { data, error }); // Debug log for Supabase fetch
      if (data) {
        // Map notice_type to type for compatibility with UI
        // 1. Collect all unique recipient_user_id values
        const userIds = Array.from(new Set(data.map(n => n.recipient_user_id).filter(Boolean)));
        const userProfiles = {};
        if (userIds.length > 0) {
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, first_name, last_name')
            .in('id', userIds);
          if (profilesData) {
            profilesData.forEach(profile => {
              userProfiles[profile.id] = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
            });
          }
        }
        const mapped = data.map(n => ({
          ...n,
          type: n.notice_type,
          recipient_name: n.recipient_user_id ? (userProfiles[n.recipient_user_id] || n.recipient_user_id) : '',
        }));
        console.debug('Fetched notices (mapped):', mapped);
        setNotices(mapped);
        setTimeout(() => {
          console.debug('Notices state after set:', mapped);
        }, 100);
      }
      setLoading(false);
    };
    fetchNotices();
  }, [hoaId]);

  const noticeTypes = [
    { value: 'violation', label: 'Violation Notice', color: 'text-red-600', icon: AlertTriangle },
    { value: 'maintenance', label: 'Maintenance Alert', color: 'text-orange-600', icon: Bell },
    { value: 'community', label: 'Community Update', color: 'text-blue-600', icon: Users },
    { value: 'urgent', label: 'Urgent Notice', color: 'text-purple-600', icon: AlertTriangle }
  ];

  // Add a function to get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'responded': return 'bg-purple-100 text-purple-800';
      case 'acknowledged': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = noticeTypes.find(t => t.value === type);
    return typeConfig?.icon || FileText;
  };

  // Edit handler: prefill form and switch to create tab
  const handleEditDraft = (notice: Notice) => {
    setNoticeForm({
      title: notice.title,
      type: notice.type,
      recipient: notice.recipient_type === 'community' ? 'all' : (notice.recipient_type === 'unit' ? 'unit' : 'specific'),
      unit: notice.recipient_unit || '',
      content: notice.content,
      dueDate: notice.due_date || '' // Add dueDate to prefill
    });
    setEditingNotice(notice);
    setActiveTab('create');
  };

  // Update or create notice
  const handleCreateNotice = async (e: React.FormEvent, status: 'draft' | 'sent') => {
    e.preventDefault();
    if (!hoaId || !userId) {
      toast({
        title: 'Missing Information',
        description: 'Missing HOA or user information.',
        variant: 'destructive'
      });
      return;
    }
    const loadingToast = toast({
      title: editingNotice ? 'Updating Notice...' : 'Creating Notice...',
      description: editingNotice ? 'Please wait while your notice is being updated.' : 'Please wait while your notice is being created.',
      variant: 'default',
      className: 'bg-[#254F70] text-white'
    });
    let recipient_type = 'community';
    let recipient_user_id = null;
    let recipient_unit = null;
    if (noticeForm.recipient === 'all') {
      recipient_type = 'community';
    } else if (noticeForm.recipient === 'unit') {
      recipient_type = 'unit';
      recipient_unit = noticeForm.unit;
      // Lookup user by unit number in homeowner_details
      const { data: detail, error } = await supabase
        .from('homeowner_details')
        .select('user_id')
        .eq('unit_number', noticeForm.unit)
        .single();
      if (error || !detail) {
        toast({
          title: 'Unit Not Found',
          description: 'No resident with this unit number exists. Please check the unit number and try again.',
          variant: 'destructive'
        });
        return;
      }
      recipient_user_id = detail.user_id;
    } else if (noticeForm.recipient === 'specific') {
      recipient_type = 'homeowner';
      // Lookup user by first_name and last_name (noticeForm.unit is assumed to be the resident name)
      const nameParts = noticeForm.unit.trim().split(/\s+/);
      if (nameParts.length < 2) {
        toast({
          title: 'Invalid Name Format',
          description: 'Please enter the resident\'s full name (first and last).',
          variant: 'destructive'
        });
        return;
      }
      const [first_name, ...lastParts] = nameParts;
      const last_name = lastParts.join(' ');
      const { data: user, error } = await supabase
        .from('profiles')
        .select('id')
        .ilike('first_name', first_name)
        .ilike('last_name', last_name)
        .single();
      if (error || !user) {
        toast({
          title: 'Resident Not Found',
          description: 'No resident with this first and last name exists. Please check the name and try again.',
          variant: 'destructive'
        });
        return;
      }
      recipient_user_id = user.id;
    }
    const payload = {
      hoa_id: hoaId,
      title: noticeForm.title,
      content: noticeForm.content,
      notice_type: noticeForm.type,
      recipient_type,
      recipient_user_id,
      recipient_unit,
      created_by: userId,
      status,
      ...(noticeForm.dueDate ? { due_date: noticeForm.dueDate } : {})
    };
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      let response, result;
      if (editingNotice) {
        // Only allow PATCH if the notice has a real UUID
        if (!editingNotice.id || editingNotice.id.length < 10) {
          toast({ title: 'Invalid Notice', description: 'Cannot update a notice without a valid ID.', variant: 'destructive' });
          return;
        }
        response = await fetch(`https://yurteupcbisnkcrtjsbv.supabase.co/rest/v1/notices?id=eq.${editingNotice.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Failed to update notice:', errorText);
        }
        let result = null;
        if (response.ok && response.status !== 204) {
          result = await response.json();
        }
      } else {
        // Create new notice
        response = await fetch('https://yurteupcbisnkcrtjsbv.supabase.co/functions/v1/create-notice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(payload)
        });
        result = await response.json();
      }
      if (response.ok) {
        toast({
          title: status === 'draft' ? (editingNotice ? 'Draft Updated' : 'Draft Saved') : 'Notice Created',
          description: status === 'draft' ? 'Notice saved as draft.' : 'Notice created successfully!',
          variant: 'success' as any
        });
        // Update local state for instant UI update
        if (editingNotice) {
          setNotices(prev => prev.map(n => n.id === editingNotice.id ? { ...n, ...payload, status } : n));
        } else {
          // Refetch notices from backend to get real IDs
          const fetchNotices = async () => {
            setLoading(true);
            if (!hoaId) { 
              setNotices([]); 
              setLoading(false); 
              return; 
            }
            const { data, error } = await supabase
              .from('notices')
              .select('*')
              .eq('hoa_id', hoaId)
              .order('created_at', { ascending: false });
            if (data) {
              const mapped = data.map(n => ({
                ...n,
                type: n.notice_type
              }));
              setNotices(mapped);
              setTimeout(() => {
                console.debug('Notices state after set:', mapped);
              }, 100);
            }
            setLoading(false);
          };
          fetchNotices();
        }
        setNoticeForm({
          title: '',
          type: 'community',
          recipient: 'all',
          unit: '',
          content: '',
          dueDate: ''
        });
        setEditingNotice(null);
        setActiveTab('notices');
      } else {
        toast({
          title: 'Failed to Create Notice',
          description: result.error || 'Unknown error',
          variant: 'destructive'
        });
      }
    } catch (err) {
      console.error('Error updating/creating notice:', err);
      toast({
        title: 'Unexpected Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive'
      });
    }
  };

  // Send handler for draft: update status to sent
  const handleSendNotice = async (noticeId: string) => {
    const notice = notices.find(n => n.id === noticeId);
    if (!notice) return;
    // Only allow PATCH if the notice has a real UUID
    if (!notice.id || notice.id.length < 10) {
      toast({ title: 'Invalid Notice', description: 'Cannot send a notice without a valid ID.', variant: 'destructive' });
      return;
    }
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      const response = await fetch(`https://yurteupcbisnkcrtjsbv.supabase.co/rest/v1/notices?id=eq.${noticeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ status: 'sent' })
      });
      if (response.ok) {
        setNotices(prev => prev.map(n => n.id === noticeId ? { ...n, status: 'sent' } : n));
        toast({ title: 'Notice Sent', description: 'Notice has been sent.', variant: 'success' as any });
      } else {
        const errorText = await response.text();
        console.error('Failed to send notice:', errorText);
        toast({ title: 'Failed to Send Notice', description: 'Could not update notice status.', variant: 'destructive' });
      }
    } catch (err) {
      console.error('Error sending notice:', err);
      toast({ title: 'Unexpected Error', description: 'An unexpected error occurred.', variant: 'destructive' });
    }
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
        loading ? (
          <div>Loading notices...</div>
        ) : (
          <div className="space-y-3">
            {/* Show all notices, not just sent */}
            {notices.map((notice) => {
              const IconComponent = getTypeIcon(notice.type);
              const typeLabel = (noticeTypes.find(t => t.value === notice.type)?.label || notice.type);
              const dateStr = notice.created_at
                ? new Date(notice.created_at).toLocaleDateString()
                : (notice.createdDate ? new Date(notice.createdDate).toLocaleDateString() : 'No Date');
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
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(notice.status)}`}>{notice.status}</span>
                              <span className="px-2 py-1 rounded-full text-xs font-semibold border border-gray-300">{typeLabel}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 gap-2 text-xs xs:text-sm text-gray-600 mb-2 min-w-0">
                            {/* Show recipient info if not community */}
                            {notice.recipient_type === 'unit' && notice.recipient_unit && (
                              <div className="flex items-center min-w-0">
                                <span className="font-medium break-words min-w-0">Unit: {notice.recipient_unit}</span>
                              </div>
                            )}
                            {notice.recipient_type === 'homeowner' && notice.recipient_user_id && (
                              <div className="flex items-center min-w-0">
                                <span className="font-medium break-words min-w-0">Resident: {notice.recipient_name}</span>
                              </div>
                            )}
                            <div className="flex items-center min-w-0">
                              <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span className="break-words min-w-0">{notice.created_at
                                ? new Date(notice.created_at).toLocaleDateString()
                                : (notice.createdDate ? new Date(notice.createdDate).toLocaleDateString() : 'No Date')}</span>
                            </div>
                          </div>
                          <p className="text-xs xs:text-sm text-gray-700 break-words min-w-0">{notice.content}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 w-full mt-2">
                        {notice.status === 'responded' && (
                          <Button variant="outline" size="sm" onClick={() => setViewingNotice(notice)} className="text-xs min-w-[80px]">
                            <Eye className="h-3 w-3 mr-1" />
                            View Response
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {/* Draft notices at the end */}
            {notices.filter(n => n.status === 'draft').map((notice) => {
              const IconComponent = getTypeIcon(notice.type);
              const typeLabel = (noticeTypes.find(t => t.value === notice.type)?.label || notice.type);
              console.debug('Draft Notice:', notice);
              console.debug('Draft Notice Type:', notice.type, 'Resolved Label:', typeLabel);
              return (
                <Card
                  key={notice.id}
                  className="hover:shadow-md transition-shadow rounded-xl border-2 border-yellow-300 bg-yellow-50"
                >
                  <CardContent className="p-2 xs:p-3 sm:p-4">
                    <div className="flex flex-col gap-2 min-w-0">
                      <div className="flex flex-row gap-2 min-w-0 items-start">
                        <div className="bg-yellow-100 p-2 xs:p-3 rounded-lg flex-shrink-0">
                          <IconComponent className="h-5 w-5 xs:h-6 xs:w-6 text-yellow-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col gap-2 mb-1 min-w-0">
                            <h4 className="text-base xs:text-lg font-semibold text-gray-900 break-words min-w-0">{notice.title}</h4>
                            <div className="flex flex-wrap gap-2">
                              <Badge className="bg-yellow-200 text-yellow-800 text-xs">Draft</Badge>
                              <Badge variant="outline" className="text-xs">{typeLabel}</Badge>
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
                          </div>
                          <p className="text-xs xs:text-sm text-gray-700 break-words min-w-0">{notice.content}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 w-full mt-2">
                        <Button variant="outline" size="sm" className="w-full" onClick={() => handleEditDraft(notice)}>
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
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )
      )}

      {/* Create Notice Form */}
      {activeTab === 'create' && (
        <Card className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2 text-primary" />
              Create New Notice
            </CardTitle>
          </CardHeader>
          <CardContent>
          <form onSubmit={e => handleCreateNotice(e,editingNotice ? editingNotice.status === 'sent'? 'sent' : 'draft': 'draft')} className="space-y-6">
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
              
              {(noticeForm.recipient === 'specific' || noticeForm.recipient === 'unit') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={noticeForm.dueDate}
                    onChange={e => setNoticeForm(f => ({ ...f, dueDate: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              )}
              
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
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button type="button" className="w-full sm:w-auto bg-[#254F70] hover:bg-primary/90" onClick={(e) => handleCreateNotice(e as any, 'draft')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Save as Draft
                </Button>
                <Button 
                  type="button"
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                  onClick={(e) => handleCreateNotice(e as any, 'sent')}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Immediately
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      <Dialog open={!!viewingNotice} onOpenChange={open => { if (!open) setViewingNotice(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Homeowner Response</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-gray-700 whitespace-pre-line min-h-[60px]">
            {viewingNotice?.response || 'No response.'}
          </div>
          <DialogFooter>
            <Button onClick={() => setViewingNotice(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NoticeGeneration;
