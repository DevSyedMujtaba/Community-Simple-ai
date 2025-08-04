/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  FileText,
  AlertCircle,
  Home,
  User,
  Mail,
  Bell,
  MapPin,
  Clock,
} from "lucide-react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { HomeownerSidebar } from "@/components/layout/HomeownerSidebar";
import ChatInterface from "@/components/dashboard/ChatInterface";
import ComplianceAlerts from "@/components/dashboard/ComplianceAlerts";
import HOAJoinRequest from "@/components/dashboard/HOAJoinRequest";
import HomeownerSettings from "@/components/dashboard/HomeownerSettings";
import HomeownerMessages from "@/components/dashboard/HomeownerMessages";
import HOADocumentsList from "@/components/dashboard/HOADocumentsList";
import HomeownerNotices from "@/components/dashboard/HomeownerNotices";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import DocumentUpload from "@/components/dashboard/DocumentUpload";

/**
 * Homeowner Dashboard - Enhanced with sidebar navigation
 * Features comprehensive homeowner management tools with responsive design
 */
const HomeownerDashboard = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session || !session.user) {
        navigate("/login", { replace: true });
      }
    };
    checkAuth();
  }, [navigate]);

  const [activeTab, setActiveTab] = useState<string>("join-hoa");
  const [userName, setUserName] = useState<string | null>(null);
  const [hoaCommunities, setHoaCommunities] = useState<any[]>([]);
  const [communitiesLoading, setCommunitiesLoading] = useState(false);
  const [communitiesError, setCommunitiesError] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState<any | null>(null);
  const [unitNumber, setUnitNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [pendingRequests, setPendingRequests] = useState<any[]>([]); // was pendingRequest
  const [approvedMemberships, setApprovedMemberships] = useState<any[]>([]); // was approvedMembership
  const [invitations, setInvitations] = useState<any[]>([]);
  const { toast } = useToast();
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [joinDialogMessage, setJoinDialogMessage] = useState("");
  const [documentCount, setDocumentCount] = useState(0);
  const [docRefreshTrigger, setDocRefreshTrigger] = useState(0);

  // Add state and city options for filtering
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [loadingLocationOptions, setLoadingLocationOptions] = useState(false);

  // Add state for approved membership
  const [notices, setNotices] = useState<any[]>([]);
  const [noticesLoading, setNoticesLoading] = useState(false);

  // Helper function for robust string comparison
  const normalizeString = (str: string | null | undefined): string => {
    if (!str) return '';
    return str
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/[^\w\s]/g, ''); // Remove special characters except letters, numbers, and spaces
  };

  // Add a state for documents
  const [documents, setDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);

  // Add state for chatDocuments
  const [chatDocuments, setChatDocuments] = useState([]);
  const [loadingChatDocuments, setLoadingChatDocuments] = useState(false);

  // Fetch document count when membership is approved
  useEffect(() => {
    if (approvedMemberships.length > 0 && approvedMemberships[0]?.hoa_id) {
      const fetchDocCount = async () => {
        const { count, error } = await supabase
          .from("hoa_documents")
          .select("id", { count: "exact", head: true })
          .eq("hoa_id", approvedMemberships[0].hoa_id);

        if (!error && count !== null) {
          setDocumentCount(count);
        }
      };
      fetchDocCount();
    }
  }, [approvedMemberships]);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", user.id)
          .single();
        if (!error && data) {
          setUserName(
            `${data.first_name || ""} ${data.last_name || ""}`.trim() || "User"
          );
        } else {
          setUserName("User");
        }
      }
    };
    fetchProfile();
  }, []);

  // Fetch available states and cities from communities
  useEffect(() => {
    const fetchLocationOptions = async () => {
      setLoadingLocationOptions(true);
      const { data, error } = await supabase
        .from("hoa_communities")
        .select("state, city");
      
      if (!error && data) {
        // Get unique states - improved deduplication with case normalization
        const uniqueStates = Array.from(
          new Set(
            data
              .map(c => c.state?.trim()) // Trim whitespace
              .filter(Boolean) // Remove null/undefined values
              .map(state => state.charAt(0).toUpperCase() + state.slice(1).toLowerCase()) // Normalize case
          )
        ).sort();
        
        setAvailableStates(uniqueStates);
        
        // Get cities for selected state - improved deduplication with case normalization
        if (selectedState) {
          const uniqueCities = Array.from(
            new Set(
              data
                .filter(c => c.state?.trim().toLowerCase() === selectedState.toLowerCase())
                .map(c => c.city?.trim()) // Trim whitespace
                .filter(Boolean) // Remove null/undefined values
                .map(city => city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()) // Normalize case
            )
          ).sort();
          setAvailableCities(uniqueCities);
        } else {
          setAvailableCities([]);
        }
      } else {
        // Handle case where no communities exist yet
        setAvailableStates([]);
        setAvailableCities([]);
      }
      setLoadingLocationOptions(false);
    };
    
    fetchLocationOptions();
  }, [selectedState]);

  // Fetch HOA communities when state/city/search changes
  useEffect(() => {
    setCommunitiesLoading(true);
    setCommunitiesError(null);
    
    // Fetch all communities and filter client-side to ensure we get all matches
    const fetchAndFilterCommunities = async () => {
      try {
        const { data, error } = await supabase
          .from("hoa_communities")
          .select("id, name, city, state, description, board_member_id");
        
        console.log('All communities from DB:', data); // Debug log
        
        if (error) {
          setCommunitiesError("Failed to load communities.");
          setHoaCommunities([]);
          setCommunitiesLoading(false);
          return;
        }

        if (data && data.length > 0) {
          // Filter communities client-side
          let filteredCommunities = data;
          
          console.log('Initial communities:', filteredCommunities.map(c => ({ name: c.name, state: c.state, city: c.city })));
          
          if (selectedState) {
            console.log('Filtering by state:', selectedState);
            filteredCommunities = filteredCommunities.filter(community => {
              const dbState = normalizeString(community.state);
              const filterState = normalizeString(selectedState);
              const matches = dbState === filterState;
              console.log(`Community ${community.name}: state="${community.state}" (normalized: "${dbState}") matches="${selectedState}" (normalized: "${filterState}") = ${matches}`);
              return matches;
            });
            console.log('After state filter:', filteredCommunities.map(c => ({ name: c.name, state: c.state, city: c.city })));
          }
          
          if (selectedCity) {
            console.log('Filtering by city:', selectedCity);
            filteredCommunities = filteredCommunities.filter(community => {
              const dbCity = normalizeString(community.city);
              const filterCity = normalizeString(selectedCity);
              const matches = dbCity === filterCity;
              console.log(`Community ${community.name}: city="${community.city}" (normalized: "${dbCity}") matches="${selectedCity}" (normalized: "${filterCity}") = ${matches}`);
              return matches;
            });
            console.log('After city filter:', filteredCommunities.map(c => ({ name: c.name, state: c.state, city: c.city })));
          }
          
          if (searchTerm) {
            filteredCommunities = filteredCommunities.filter(community => 
              community.name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
          }
          
          console.log('Filtered communities:', { 
            selectedState, 
            selectedCity, 
            searchTerm, 
            filteredCommunities,
            originalData: data.map(c => ({ name: c.name, state: c.state, city: c.city }))
          }); // Debug log
          
          if (filteredCommunities.length > 0) {
            const communityIds = filteredCommunities.map((c) => c.id);
            const { data: requests, error: requestsError } = await supabase
              .from("hoa_join_requests")
              .select("hoa_id, status")
              .in("hoa_id", communityIds)
              .eq("status", "approved");

            const communitiesWithCounts = filteredCommunities.map((community) => {
              const memberCount = requestsError
                ? 0
                : requests.filter((r) => r.hoa_id === community.id).length;
              return { ...community, memberCount };
            });
            setHoaCommunities(communitiesWithCounts);
          } else {
            setHoaCommunities([]);
          }
        } else {
          setHoaCommunities([]);
        }
      } catch (err) {
        console.error('Error fetching communities:', err);
        setCommunitiesError("Failed to load communities.");
        setHoaCommunities([]);
      }
      
      setCommunitiesLoading(false);
    };
    
    fetchAndFilterCommunities();
  }, [selectedState, selectedCity, searchTerm]);

  // Update the effect that fetches join requests to also check for approved membership
  useEffect(() => {
    const fetchMembershipStatus = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) {
        setPendingRequests([]);
        setApprovedMemberships([]);
        return;
      }
      // Fetch all pending requests
      const { data: pendingData } = await supabase
        .from("hoa_join_requests")
        .select(
          "id, hoa_id, status, created_at, hoa_communities(name, city, state)"
        )
        .eq("user_id", user.id)
        .in("status", ["pending"])
        .order("created_at", { ascending: false });
      setPendingRequests(pendingData || []);
      // Fetch all approved memberships
      const { data: approvedData } = await supabase
        .from("hoa_join_requests")
        .select(
          "id, hoa_id, status, created_at, hoa_communities(name, city, state)"
        )
        .eq("user_id", user.id)
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      setApprovedMemberships(approvedData || []);
    };
    fetchMembershipStatus();
  }, [submitSuccess]);

  // Fetch invitations for the user
  useEffect(() => {
    const fetchInvitations = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) {
        setInvitations([]);
        return;
      }
      // Fetch by user_id and by email separately, include community name join
      const [byId, byEmail] = await Promise.all([
        supabase
          .from("hoa_invitations")
          .select(
            "id, hoa_id, status, created_at, email, unit_number, message, board_member_id, hoa_communities(name)"
          )
          .eq("user_id", user.id)
          .eq("status", "invited")
          .order("created_at", { ascending: false }),
        supabase
          .from("hoa_invitations")
          .select(
            "id, hoa_id, status, created_at, email, unit_number, message, board_member_id, hoa_communities(name)"
          )
          .eq("email", user.email)
          .eq("status", "invited")
          .order("created_at", { ascending: false }),
      ]);
      const invitations = [...(byId.data || []), ...(byEmail.data || [])];
      // Deduplicate by id
      const uniqueInvitations = Array.from(
        new Map(invitations.map((i) => [i.id, i])).values()
      );
      setInvitations(uniqueInvitations);
    };
    fetchInvitations();
  }, []);

  // Update handleJoinRequest to check for approved membership
  const handleJoinRequest = async (communityId: string) => {
    // No restriction: allow joining multiple communities
    const comm = hoaCommunities.find((c) => c.id === communityId);
    setSelectedCommunity(comm);
  };

  const handleSubmitJoinRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;
    const session = sessionData.session;
    if (!user || !selectedCommunity || !session) {
      setSubmitError("You must be logged in and select a community.");
      setSubmitting(false);
      return;
    }
    const board_member_id = selectedCommunity.board_member_id;
    if (!board_member_id) {
      setSubmitError("This community does not have a board member assigned.");
      setSubmitting(false);
      return;
    }
    const payload = {
      hoa_id: selectedCommunity.id,
      board_member_id,
      user_id: user.id,
      unit_number: unitNumber,
      phone_number: phoneNumber,
      message,
    };
    try {
      const response = await fetch(
        "https://yurteupcbisnkcrtjsbv.supabase.co/functions/v1/submit_join_request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      if (!response.ok || data.error) {
        setSubmitError(data?.error || "Failed to submit request.");
      } else {
        setSubmitSuccess(true);
        setUnitNumber("");
        setPhoneNumber("");
        setMessage("");
        setSelectedCommunity(null);
        toast({
          title: "Request Sent",
          description:
            "Your join request has been sent and is pending board approval.",
        });
      }
    } catch (err: any) {
      setSubmitError("Failed to submit request.");
    }
    setSubmitting(false);
  };

  // User status - in real app this would come from authentication
  const userStatus = {
    isJoinedToHOA: false, // Set to true if user has joined an HOA
    hoaName: "Sunrise Valley HOA",
    unreadMessages: 3,
    unreadNotices: 2,
  };

  // Sample HOA documents for AI chat - these would be the board-uploaded documents
  const hoaDocuments = [
    {
      id: "1",
      name: "CC&Rs - Covenants, Conditions & Restrictions 2024",
      uploadDate: "2024-01-10",
      summary:
        "Official governing document outlining community rules and homeowner responsibilities.",
      size: 2456789,
    },
    {
      id: "2",
      name: "Parking and Vehicle Regulations",
      uploadDate: "2024-01-08",
      summary:
        "Comprehensive parking rules and towing procedures for the community.",
      size: 1234567,
    },
  ];

  const [unreadMessages, setUnreadMessages] = useState(0);
  const [userId, setUserId] = useState("");
  const [unreadNotices, setUnreadNotices] = useState(0);

  // Fetch unread count for the homeowner
  const fetchUnread = async (homeownerId: string) => {
    const { count, error } = await supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("receiver_id", homeownerId)
      .eq("isread", false);
    if (!error && typeof count === "number") {
      setUnreadMessages(count);
    }
  };

  useEffect(() => {
    // Get user ID and fetch unread count on mount
    const getUserAndFetch = async () => {
      let homeownerId = userId;
      if (!homeownerId) {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        homeownerId = session?.user?.id;
        setUserId(homeownerId);
      }
      if (homeownerId) {
        fetchUnread(homeownerId);
      }
    };
    getUserAndFetch();
  }, [userId]);

  // Real-time subscription for unread badge updates
  useEffect(() => {
    if (!userId) return;
    let userEmail = null;
    // Fetch user email once for notification
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      userEmail = user?.email;
    })();
    const channel = supabase
      .channel("messages-realtime-badge-homeowner")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${userId}`,
        },
        async (payload) => {
          fetchUnread(userId);
          // Only send email for INSERT (new message)
          if (payload.eventType === "INSERT" && userEmail) {
            await fetch("https://yurteupcbisnkcrtjsbv.supabase.co/functions/v1/send-message-notification", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + import.meta.env.VITE_SUPABASE_ANON_KEY
              },
              body: JSON.stringify({
                email: userEmail,
                name: userName
              })
            });
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, userName]);

  // Fetch notices and set unread count
  useEffect(() => {
    const fetchNotices = async () => {
      setNoticesLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) {
        setNotices([]);
        setUnreadNotices(0);
        setNoticesLoading(false);
        return;
      }
      // Fetch user's unit number from homeowner_details
      const { data: details } = await supabase
        .from("homeowner_details")
        .select("unit_number")
        .eq("user_id", user.id)
        .single();
      const userUnit = details?.unit_number || "";
      // Fetch notices for this user
      const { data, error } = await supabase
        .from("notices")
        .select("*")
        .or(
          `recipient_type.eq.community,recipient_user_id.eq.${user.id},recipient_unit.eq.${userUnit}`
        )
        .in("status", ["sent", "acknowledged", "responded", "read"])
        .order("created_at", { ascending: false });
      if (!error && data) {
        // Map notice_type to type for UI compatibility
        // 1. Collect all unique created_by user IDs
        const boardIds = Array.from(
          new Set(data.map((n) => n.created_by).filter(Boolean))
        );
        const boardProfiles = {};
        if (boardIds.length > 0) {
          const { data: profilesData } = await supabase
            .from("profiles")
            .select("id, first_name, last_name")
            .in("id", boardIds);
          if (profilesData) {
            profilesData.forEach((profile) => {
              boardProfiles[profile.id] =
                `${profile.first_name || ""} ${
                  profile.last_name || ""
                }`.trim() || "HOA Board";
            });
          }
        }
        // 2. Map notices with sender, type, createdDate, status, requiresResponse
        const mapped = data.map((n) => ({
          ...n,
          type: n.notice_type || "notice",
          createdDate: n.created_at, // for UI compatibility
          dueDate: n.due_date || "", // map due_date from DB to dueDate for UI
          sender: boardProfiles[n.created_by] || "HOA Board",
          status: ["unread", "read", "acknowledged", "responded"].includes(
            n.status
          )
            ? n.status
            : "unread",
          requiresResponse:
            typeof n.requiresResponse === "boolean"
              ? n.requiresResponse
              : false,
        }));
        setNotices(mapped);
        setUnreadNotices(mapped.filter((n) => n.status === "unread").length);
      } else {
        setUnreadNotices(0);
      }
      setNoticesLoading(false);
    };
    fetchNotices();
  }, []);

  // Real-time subscription for unread badge updates
  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel("notices-realtime-badge-homeowner")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notices",
          // No filter: listen for all changes
        },
        () => {
          // Re-fetch notices and update unread count
          (async () => {
            setNoticesLoading(true);
            const { data: sessionData } = await supabase.auth.getSession();
            const user = sessionData.session?.user;
            if (!user) {
              setNotices([]);
              setUnreadNotices(0);
              setNoticesLoading(false);
              return;
            }
            const { data: details } = await supabase
              .from("homeowner_details")
              .select("unit_number")
              .eq("user_id", user.id)
              .single();
            const userUnit = details?.unit_number || "";
            const { data, error } = await supabase
              .from("notices")
              .select("*")
              .or(
                `recipient_type.eq.community,recipient_user_id.eq.${user.id},recipient_unit.eq.${userUnit}`
              )
              .in("status", ["sent", "acknowledged", "responded", "read"])
              .order("created_at", { ascending: false });
            if (!error && data) {
              const boardIds = Array.from(
                new Set(data.map((n) => n.created_by).filter(Boolean))
              );
              const boardProfiles = {};
              if (boardIds.length > 0) {
                const { data: profilesData } = await supabase
                  .from("profiles")
                  .select("id, first_name, last_name")
                  .in("id", boardIds);
                if (profilesData) {
                  profilesData.forEach((profile) => {
                    boardProfiles[profile.id] =
                      `${profile.first_name || ""} ${
                        profile.last_name || ""
                      }`.trim() || "HOA Board";
                  });
                }
              }
              const mapped = data.map((n) => ({
                ...n,
                type: n.notice_type || "notice",
                createdDate: n.created_at, // for UI compatibility
                dueDate: n.due_date || "", // map due_date from DB to dueDate for UI
                sender: boardProfiles[n.created_by] || "HOA Board",
                status: [
                  "unread",
                  "read",
                  "acknowledged",
                  "responded",
                ].includes(n.status)
                  ? n.status
                  : "unread",
                requiresResponse:
                  typeof n.requiresResponse === "boolean"
                    ? n.requiresResponse
                    : false,
              }));
              setNotices(mapped);
              setUnreadNotices(
                mapped.filter((n) => n.status === "unread").length
              );
            } else {
              setUnreadNotices(0);
            }
            setNoticesLoading(false);
          })();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // When marking as read/acknowledged/responded, update unreadNotices immediately
  // Example for handleAcknowledge (similar for Mark Read):
  // setLocalNotices(prev => {
  //   const updated = prev.map(n => n.id === noticeId ? { ...n, status: 'acknowledged' } : n);
  //   setUnreadNotices(updated.filter(n => n.status === 'unread').length);
  //   return updated;
  // });

  useEffect(() => {
    const fetchMembershipAndNotices = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) return;
      // 1. Fetch approved membership
      const { data: membership } = await supabase
        .from("hoa_join_requests")
        .select("hoa_id")
        .eq("user_id", userId)
        .eq("status", "approved")
        .single();
      setApprovedMemberships(membership ? [membership] : []);
      if (membership && membership.hoa_id) {
        setNoticesLoading(true);
        // 2. Fetch notices for the user's HOA
        const { data: noticesData } = await supabase
          .from("notices")
          .select("*")
          .eq("hoa_id", membership.hoa_id);
        setNotices(noticesData || []);
        setNoticesLoading(false);
      } else {
        setNotices([]);
      }
    };
    fetchMembershipAndNotices();
  }, []);

  // Add this effect to prefill unitNumber and phoneNumber when selectedCommunity changes
  useEffect(() => {
    const fetchPrefillFields = async () => {
      if (!selectedCommunity) return;
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) return;
      // Only prefill if the fields are empty
      if (!unitNumber) {
        const { data: details } = await supabase
          .from("homeowner_details")
          .select("unit_number")
          .eq("user_id", user.id)
          .single();
        if (details && details.unit_number) {
          setUnitNumber(details.unit_number);
        }
      }
      if (!phoneNumber) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("phone")
          .eq("id", user.id)
          .single();
        if (profile && profile.phone) {
          setPhoneNumber(profile.phone);
        }
      }
    };
    fetchPrefillFields();
    // Only run when selectedCommunity changes
  }, [selectedCommunity]);

  // Fetch and filter documents for ChatInterface
  useEffect(() => {
    const fetchChatDocs = async () => {
      if (
        !(
          approvedMemberships.length > 0 &&
          approvedMemberships[0]?.hoa_id &&
          userId
        )
      ) {
        setChatDocuments([]);
        return;
      }
      setLoadingChatDocuments(true);
      const hoaId = approvedMemberships[0].hoa_id;
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const currentUserId = user?.id;
      const { data, error } = await supabase
        .from("hoa_documents")
        .select("*, profiles:profiles!uploader_id(first_name, last_name, role)")
        .eq("hoa_id", hoaId)
        .order("uploaded_at", { ascending: false });
      // Only show: (1) board/admin uploads, (2) docs uploaded by current user
      const filteredDocs = (data || []).filter(
        (doc) =>
          doc.uploader_id === null ||
          (doc.profiles &&
            (doc.profiles.role === "board" || doc.profiles.role === "admin")) ||
          doc.uploader_id === currentUserId
      );
      setChatDocuments(filteredDocs);
      setLoadingChatDocuments(false);
    };
    fetchChatDocs();
  }, [approvedMemberships, userId, docRefreshTrigger]);

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-gray-50">
        <HomeownerSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          hoaName={userStatus.isJoinedToHOA ? userStatus.hoaName : "Select HOA"}
          unreadMessages={unreadMessages}
          unreadNotices={unreadNotices}
        />

        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-3 sm:px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2 text-sm flex-1 min-w-0">
              <span className="font-semibold truncate">
                Homeowner Dashboard
              </span>
              {userStatus.isJoinedToHOA && (
                <Badge
                  variant="outline"
                  className="text-[#254F70] border-[#254F70] text-xs sm:text-sm flex-shrink-0"
                >
                  {userStatus.hoaName}
                </Badge>
              )}
              <button
                className="ml-4 px-3 py-1 bg-gray-200 text-[#254F70] rounded text-xs font-semibold cursor-not-allowed opacity-80"
                disabled
              >
                HOA - Property Lawyer Market Place
                <span className="ml-2 text-[10px] text-gray-500 font-normal">
                  Beta - In Development - Coming soon
                </span>
              </button>
            </div>
            {/* User Name Display - styled as a badge */}
            <span className="ml-auto hidden sm:flex items-center gap-2 bg-[#254F70] text-white px-3 py-1 rounded-full font-medium text-sm shadow-sm">
              <User className="w-4 h-4 mr-1 text-white opacity-80" />
              {userName === null ? "Loading..." : userName}
            </span>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-3 sm:p-4 lg:p-6">
            {activeTab === "join-hoa" && (
              <>
                {pendingRequests.length > 0 && (
                  <div className="mb-6">
                    {pendingRequests.map((pendingRequest) => (
                      <Card
                        key={pendingRequest.id}
                        className="border-blue-200 bg-blue-50 mb-2"
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center text-blue-900 text-lg">
                            <AlertCircle className="h-5 w-5 mr-2" />
                            Your Join Request
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="py-2">
                          <div className="flex items-center justify-between p-3 rounded-lg border border-blue-200 bg-white mb-2">
                            <div>
                              <p className="font-bold text-gray-900 mb-1">
                                {pendingRequest.hoa_communities?.name}
                              </p>
                              <div className="flex items-center text-sm text-gray-700 mb-1">
                                <Clock className="h-4 w-4 text-yellow-600 mr-1" />
                                Requested on{" "}
                                {new Date(
                                  pendingRequest.created_at
                                ).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-gray-600">
                                {pendingRequest.hoa_communities?.city},{" "}
                                {pendingRequest.hoa_communities?.state}
                              </div>
                            </div>
                            <Badge
                              className="bg-yellow-100 text-yellow-800"
                              variant="secondary"
                            >
                              Pending
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                <Card>
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="flex items-center text-lg sm:text-xl">
                      <Home className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-primary flex-shrink-0" />
                      Find Your HOA Community
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      Find and request to join your HOA community to access
                      documents, compliance information, and communicate with
                      your board.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {/* State, City, Search Inputs */}
                    <div className="flex flex-col sm:flex-row gap-2 mb-4">
                      <select
                        className="border rounded px-3 py-2 text-sm"
                        value={selectedState}
                        onChange={(e) => {
                          setSelectedState(e.target.value);
                          setSelectedCity(""); // Reset city when state changes
                        }}
                        disabled={loadingLocationOptions}
                      >
                        <option value="">
                          {loadingLocationOptions ? "Loading states..." : "Select State"}
                        </option>
                        {availableStates.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                      <select
                        className={`border rounded px-3 py-2 text-sm ${
                          !selectedState || loadingLocationOptions
                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                            : 'bg-white'
                        }`}
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        disabled={!selectedState || loadingLocationOptions}
                      >
                        <option value="">
                          {!selectedState 
                            ? "Select City" 
                            : loadingLocationOptions 
                              ? "Loading cities..." 
                              : "Select City"
                          }
                        </option>
                        {availableCities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                      <input
                        className="border rounded px-3 py-2 text-sm flex-1"
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    {/* Filter Summary and Clear Button */}
                    {(selectedState || selectedCity || searchTerm) && (
                      <div className="flex items-center justify-between mb-4 p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm text-blue-700">
                          <span className="font-medium">Filters applied:</span>
                          {selectedState && <span className="ml-2">State: {selectedState}</span>}
                          {selectedCity && <span className="ml-2">City: {selectedCity}</span>}
                          {searchTerm && <span className="ml-2">Search: "{searchTerm}"</span>}
                          <span className="ml-2">({hoaCommunities.length} result{hoaCommunities.length !== 1 ? 's' : ''})</span>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedState("");
                            setSelectedCity("");
                            setSearchTerm("");
                          }}
                          className="text-sm text-blue-600 hover:text-blue-800 underline"
                        >
                          Clear filters
                        </button>
                      </div>
                    )}

                    {/* Communities List */}
                    {communitiesLoading ? (
                      <div className="text-center py-4 text-gray-500">
                        Loading communities...
                      </div>
                    ) : communitiesError ? (
                      <div className="text-center py-4 text-red-500">
                        {communitiesError}
                      </div>
                    ) : hoaCommunities.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        {selectedState || selectedCity || searchTerm 
                          ? "No communities found matching your filters." 
                          : "No communities found."}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {hoaCommunities.map((comm) => {
                          const hasPending = pendingRequests.some(
                            (r) => r.hoa_id === comm.id
                          );
                          const isMember = approvedMemberships.some(
                            (r) => r.hoa_id === comm.id
                          );
                          return (
                            <div
                              key={comm.id}
                              className="bg-white border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between"
                            >
                              <div>
                                <div className="font-bold text-black text-lg flex items-center gap-2">
                                  {comm.name}
                                  <span className="ml-2 px-2 py-0.5 rounded-full border border-primary text-primary text-xs flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    {comm.memberCount || 0} members
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                  <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                                  {comm.city}, {comm.state}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                  {comm.description}
                                </div>
                              </div>
                              <div className="flex flex-col sm:flex-row gap-2">
                                {isMember ? (
                                  <span className="mt-3 sm:mt-0 sm:ml-4 px-4 py-2 bg-green-100 text-green-700 rounded font-semibold text-sm flex items-center gap-2 shadow cursor-not-allowed">
                                    Member
                                  </span>
                                ) : hasPending ? (
                                  <span className="mt-3 sm:mt-0 sm:ml-4 px-4 py-2 bg-yellow-100 text-yellow-700 rounded font-semibold text-sm flex items-center gap-2 shadow cursor-not-allowed">
                                    Request Sent
                                  </span>
                                ) : (
                                  <button
                                    className="mt-3 sm:mt-0 sm:ml-4 px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded font-semibold text-sm flex items-center gap-2 shadow"
                                    onClick={() => handleJoinRequest(comm.id)}
                                  >
                                    <Mail className="w-4 h-4" /> Request to Join
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {/* Show join form below the list */}
                    {selectedCommunity && (
                      <form
                        onSubmit={handleSubmitJoinRequest}
                        className="mt-6 bg-gray-50 p-4 rounded-lg border w-full"
                      >
                        <div className="font-bold text-lg mb-2">
                          Join {selectedCommunity.name}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Unit/Property Number
                            </label>
                            <input
                              type="text"
                              required
                              value={unitNumber}
                              onChange={(e) => setUnitNumber(e.target.value)}
                              placeholder="e.g., 101A, 123 Main St"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              required
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              placeholder="(555) 123-4567"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                            />
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Message to Board (Optional)
                          </label>
                          <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Introduce yourself and mention any relevant information..."
                            rows={3}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full mt-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded px-4 py-2 font-semibold text-sm"
                          disabled={submitting}
                        >
                          {submitting ? "Submitting..." : "Submit Join Request"}
                        </button>
                        {submitError && (
                          <div className="text-red-600 text-sm mt-2">
                            {submitError}
                          </div>
                        )}
                        {submitSuccess && (
                          <div className="text-green-600 text-sm mt-2">
                            Request sent successfully!
                          </div>
                        )}
                      </form>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            {activeTab === "messages" && (
              <>
                {approvedMemberships.length > 0 ? (
                  <HomeownerMessages hoaIds={approvedMemberships.map(m => m.hoa_id)} />
                ) : (
                  <Card>
                    <CardHeader className="pb-3 sm:pb-4">
                      <CardTitle className="flex items-center text-lg sm:text-xl">
                        <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-[#254F70] flex-shrink-0" />
                        Messages
                      </CardTitle>
                      <CardDescription className="text-sm sm:text-base">
                        Communicate with your HOA board and other community members.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-center py-12">
                        <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          You haven't joined any community yet
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                          To access messages and communicate with your HOA board, you'll need to join a community first.
                        </p>
                        <button
                          onClick={() => setActiveTab("join-hoa")}
                          className="bg-[#254F70] hover:bg-[#1e3a56] text-white font-semibold px-6 py-3 rounded-md shadow transition"
                        >
                          Join a Community
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {activeTab === "notices" && (
              <Card>
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center text-lg sm:text-xl">
                    <Bell className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-[#254F70] flex-shrink-0" />
                    Notices
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    View official notices from your HOA board including
                    violations, maintenance updates, and community
                    announcements.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  {approvedMemberships.length > 0 &&
                  approvedMemberships[0]?.hoa_id ? (
                    <HomeownerNotices
                      notices={notices}
                      onUnreadCountChange={setUnreadNotices}
                    />
                  ) : (
                    <div className="text-center py-12">
                      <Bell className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        You haven't joined any community yet
                      </h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        To access notices and stay updated with your HOA board, you'll need to join a community first.
                      </p>
                      <button
                        onClick={() => setActiveTab("join-hoa")}
                        className="bg-[#254F70] hover:bg-[#1e3a56] text-white font-semibold px-6 py-3 rounded-md shadow transition"
                      >
                        Join a Community
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === "chat" && (
              <div className="space-y-4 sm:space-y-6">
                <Card>
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="flex items-center text-lg sm:text-xl">
                      <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-primary flex-shrink-0" />
                      AI Assistant
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      Ask questions about your HOA documents and get instant,
                      accurate answers based on official community documents.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="mb-4">
                      {loadingChatDocuments ? (
                        <div className="text-gray-500">
                          Loading documents...
                        </div>
                      ) : (
                        <div className="bg-green-50 border border-green-200 rounded-md px-4 py-3 mb-4 flex items-center gap-3">
                          <span className="text-green-700 font-semibold">
                            {chatDocuments.length} document
                            {chatDocuments.length !== 1 ? "s" : ""} loaded
                          </span>
                          <span className="text-green-600 text-sm ml-2">
                            AI is ready to answer questions about your HOA
                            documents.
                          </span>
                        </div>
                      )}
                    </div>
                    <ChatInterface
                      hoaId={approvedMemberships[0]?.hoa_id}
                      hoaIds={(() => { const ids = approvedMemberships.map(m => m.hoa_id); console.log('ChatInterface hoaIds:', ids); return ids; })()}
                      documents={chatDocuments}
                    />
                  </CardContent>
                </Card>

                {hoaDocuments.length === 0 && (
                  <Card className="border-dashed border-2 border-gray-300">
                    <CardContent className="p-6 sm:p-8 text-center">
                      <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-gray-400 mb-3" />
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                        No documents available
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 mb-4">
                        Your HOA board hasn't uploaded any documents yet.
                      </p>
                      <Badge
                        variant="outline"
                        className="text-primary border-primary text-xs sm:text-sm"
                      >
                        Check back later or contact your board
                      </Badge>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === "hoa-documents" && (
              <div className="space-y-4 sm:space-y-6">
                <Card>
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="flex items-center text-lg sm:text-xl">
                      <FileText className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-primary flex-shrink-0" />
                      HOA Documents
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      View and download official HOA documents, policies, and
                      community guidelines uploaded by your board member.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {approvedMemberships.length > 0 ? (
                      <>
                        {/* Homeowner Upload Button - only show if user is a member of at least one HOA */}
                        <div className="mb-6">
                          <DocumentUpload
                            hoaId={approvedMemberships[0]?.hoa_id}
                            onDocumentUploaded={(newDocument) => {
                              // Trigger a refresh of the document list
                              setDocRefreshTrigger(prev => prev + 1);
                              // Also trigger a refresh of chat documents
                              setLoadingChatDocuments(true);
                              console.log('Document uploaded:', newDocument);
                              // Show success toast
                              toast({
                                title: "Document Uploaded",
                                description: `${newDocument.file_name} has been uploaded successfully and is being processed.`,
                              });
                            }}
                          />
                        </div>
                        <HOADocumentsList
                          hoaName={approvedMemberships[0]?.hoa_communities?.name}
                          onNavigateToChat={() => setActiveTab("chat")}
                          hoaId={approvedMemberships[0]?.hoa_id}
                          refreshTrigger={docRefreshTrigger}
                        />
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          You haven't joined any community yet
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                          To access HOA documents and community guidelines, you'll need to join a community first.
                        </p>
                        <button
                          onClick={() => setActiveTab("join-hoa")}
                          className="bg-[#254F70] hover:bg-[#1e3a56] text-white font-semibold px-6 py-3 rounded-md shadow transition"
                        >
                          Join a Community
                        </button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "compliance" && (
              <div className="space-y-4 sm:space-y-6">
                <Card>
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="flex items-center text-lg sm:text-xl">
                      <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-primary flex-shrink-0" />
                      Compliance Alerts
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      Stay informed about important compliance rules including
                      pet restrictions, parking guidelines, and noise
                      ordinances.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {approvedMemberships.length > 0 &&
                    approvedMemberships[0]?.hoa_id ? (
                      <ComplianceAlerts hoaId={approvedMemberships[0].hoa_id} />
                    ) : (
                      <div className="text-center py-12">
                        <AlertCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          You haven't joined any community yet
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                          To access compliance alerts and stay informed about community rules, you'll need to join a community first.
                        </p>
                        <button
                          onClick={() => setActiveTab("join-hoa")}
                          className="bg-[#254F70] hover:bg-[#1e3a56] text-white font-semibold px-6 py-3 rounded-md shadow transition"
                        >
                          Join a Community
                        </button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-4 sm:space-y-6">
                <Card>
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="flex items-center text-lg sm:text-xl">
                      <User className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-primary flex-shrink-0" />
                      Account Settings
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      Manage your profile information, notification preferences,
                      and account settings.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <HomeownerSettings />
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "invitations" && (
              <Card>
                <CardHeader>
                  <CardTitle>Invitations</CardTitle>
                  <CardDescription>
                    Invitations from board members to join their communities.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {invitations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                      <Mail className="w-12 h-12 mb-2" />
                      <div>No invitations at this time.</div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {invitations.map((invite) => (
                        <div
                          key={invite.id}
                          className="border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50"
                        >
                          <div>
                            <div className="font-bold text-black text-lg mb-1">
                              Invitation to join HOA
                            </div>
                            <div className="text-sm text-gray-700 mb-1">
                              Community:{" "}
                              {invite.hoa_communities?.name || "Unknown"}
                            </div>
                            <div className="text-sm text-gray-700 mb-1">
                              Unit: {invite.unit_number}
                            </div>
                            {/* <div className="text-sm text-gray-700 mb-1">Email: {invite.email}</div> */}
                            {invite.message && (
                              <div className="text-sm text-gray-600 mt-2">
                                Message: {invite.message}
                              </div>
                            )}
                            <div className="text-xs text-gray-500 mt-1">
                              Sent:{" "}
                              {new Date(invite.created_at).toLocaleString()}
                            </div>
                          </div>
                          <Badge
                            className="bg-blue-100 text-blue-800 ml-0 sm:ml-4 mt-4 sm:mt-0"
                            variant="secondary"
                          >
                            Invited
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </main>
        </SidebarInset>
      </div>
      <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notice</DialogTitle>
            <DialogDescription>{joinDialogMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowJoinDialog(false)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default HomeownerDashboard;
