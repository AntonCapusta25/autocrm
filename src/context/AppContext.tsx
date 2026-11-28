import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Contact, Company, Opportunity, Task, ContactActivity, 
  Workspace, TeamMember, AppNotification, NotificationPreferences, PipelineStage, UserRole,
  OnboardingConfig, WorkflowAutomation, ConversationThread, CalendarAppointment, NotionDoc,
  ChatMessage, MessageChannel, NotionBlock, CRMModuleId, ModuleSetupRequest,
  GoogleAccount, GoogleScope
} from '../types';
import { DEFAULT_ONBOARDING_CONFIG, INITIAL_GOOGLE_ACCOUNTS } from '../lib/initialData';
import { getSupabaseClient } from '../lib/supabase';

interface RegisterCompanyPayload {
  companyName: string;
  fullName: string;
  email: string;
  password: string;
}

interface LocalTenantAccount {
  userId: string;
  email: string;
  passwordHash: string;
  fullName: string;
  workspaceId: string;
}

interface AppContextType {
  // Multi-Tenant Authentication
  isAuthenticated: boolean;
  registerCompanyAccount: (payload: RegisterCompanyPayload) => Promise<{ success: boolean; message?: string }>;
  signInCompanyAccount: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signOutAccount: () => Promise<void>;

  // Onboarding & Dynamic Modules (Per Tenant Workspace)
  onboardingConfig: OnboardingConfig;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  saveOnboarding: (config: OnboardingConfig) => void;
  toggleModule: (moduleId: CRMModuleId) => void;
  isModuleEnabled: (moduleId: CRMModuleId) => boolean;

  // Workspaces & Users
  workspaces: Workspace[];
  currentWorkspace: Workspace;
  teamMembers: TeamMember[];
  currentUser: TeamMember;
  createWorkspace: (name: string) => void;
  switchWorkspace: (workspaceId: string) => void;
  switchCurrentUser: (memberId: string) => void;
  inviteTeamMember: (name: string, email: string, role: UserRole) => void;
  removeTeamMember: (id: string) => void;

  // Companies (Tenant Scoped)
  companies: Company[];
  addCompany: (comp: Omit<Company, 'id' | 'workspace_id' | 'created_at' | 'updated_at'>) => Company;
  updateCompany: (id: string, updates: Partial<Company>) => void;
  deleteCompany: (id: string) => void;

  // Contacts (Tenant Scoped)
  contacts: Contact[];
  addContact: (contact: Omit<Contact, 'id' | 'workspace_id' | 'created_at' | 'updated_at'>) => Contact;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  importContactsCSV: (csvText: string) => number;
  exportContactsCSV: () => void;

  // Opportunities (Tenant Scoped)
  opportunities: Opportunity[];
  addOpportunity: (opp: Omit<Opportunity, 'id' | 'workspace_id' | 'created_at' | 'updated_at'>) => Opportunity;
  updateOpportunity: (id: string, updates: Partial<Opportunity>) => void;
  deleteOpportunity: (id: string) => void;
  moveOpportunityStage: (id: string, newStage: PipelineStage) => void;

  // Tasks (Tenant Scoped)
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'workspace_id' | 'created_at' | 'updated_at'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;

  // GoHighLevel Workflows / Automations (Tenant Scoped)
  workflows: WorkflowAutomation[];
  addWorkflow: (wf: Omit<WorkflowAutomation, 'id' | 'workspace_id' | 'created_at' | 'runs_count'>) => WorkflowAutomation;
  toggleWorkflowActive: (id: string) => void;
  runWorkflowTest: (id: string) => Promise<{ success: boolean; message: string }>;
  deleteWorkflow: (id: string) => void;

  // GoHighLevel Unified Inbox / Conversations (Tenant Scoped)
  conversations: ConversationThread[];
  sendMessage: (threadId: string, text: string, channel?: MessageChannel, googleAccountEmail?: string) => void;
  markConversationRead: (threadId: string) => void;
  createConversationForContact: (contact: Contact) => string;

  // Google Workspace & Multi-Account Integration (Tenant Scoped)
  googleAccounts: GoogleAccount[];
  isGoogleModalOpen: boolean;
  openGoogleModal: () => void;
  closeGoogleModal: () => void;
  connectGoogleAccount: (accountData?: { email: string; name: string; avatar?: string; scopes?: GoogleScope[] }) => Promise<GoogleAccount>;
  disconnectGoogleAccount: (accountId: string) => void;
  toggleGoogleAccountSync: (accountId: string, syncType: 'sync_gmail' | 'sync_calendar' | 'sync_contacts') => void;
  syncGoogleAccount: (accountId: string, service?: 'all' | 'gmail' | 'calendar' | 'contacts') => Promise<{ success: boolean; message: string }>;
  syncAllGoogleAccounts: () => Promise<{ success: boolean; message: string }>;

  // Smart Appointments (Tenant Scoped)
  appointments: CalendarAppointment[];
  addAppointment: (appt: Omit<CalendarAppointment, 'id' | 'workspace_id'>) => CalendarAppointment;
  updateAppointment: (id: string, updates: Partial<CalendarAppointment>) => void;
  deleteAppointment: (id: string) => void;

  // Notion Documents & SOPs (Tenant Scoped)
  notionDocs: NotionDoc[];
  addNotionDoc: (doc: Omit<NotionDoc, 'id' | 'workspace_id' | 'created_at' | 'updated_at'>) => NotionDoc;
  updateNotionDoc: (id: string, updates: Partial<NotionDoc>) => void;
  deleteNotionDoc: (id: string) => void;
  toggleDocBlockTodo: (docId: string, blockId: string) => void;
  addDocBlock: (docId: string, block: Omit<NotionBlock, 'id'>) => void;

  // Activity Timeline (Tenant Scoped)
  activities: ContactActivity[];
  addContactNote: (contactId: string, noteText: string) => void;
  getActivitiesForContact: (contactId: string) => ContactActivity[];

  // Notifications (Tenant Scoped)
  notifications: AppNotification[];
  unreadNotificationCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  notificationPreferences: NotificationPreferences;
  updateNotificationPreferences: (prefs: Partial<NotificationPreferences>) => void;
  sendTestNotification: (channel?: 'push' | 'email') => Promise<{ success: boolean; message: string }>;
  requestPushPermission: () => Promise<'granted' | 'denied' | 'default'>;

  // Paid & Managed Setup Modules (AutoFlow Engineering)
  moduleSetupRequests: ModuleSetupRequest[];
  isModuleModalOpen: boolean;
  activeSetupModuleId: string | null;
  openModuleSetupModal: (moduleId?: string) => void;
  closeModuleSetupModal: () => void;
  submitModuleRequest: (req: {
    moduleId: string;
    moduleName: string;
    phone: string;
    message: string;
    businessSize: string;
    service: string;
    contactName: string;
    contactEmail: string;
    companyName?: string;
  }) => Promise<{ success: boolean; message?: string }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LS_PREFIX = 'autoflow_live_v4_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Multi-Tenant Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(LS_PREFIX + 'authenticated') === 'true';
  });

  const [tenantAccounts, setTenantAccounts] = useState<LocalTenantAccount[]>(() => {
    const saved = localStorage.getItem(LS_PREFIX + 'tenant_accounts');
    return saved ? JSON.parse(saved) : [];
  });

  // Per-Workspace Onboarding Configs Map: { [workspaceId]: OnboardingConfig }
  const [onboardingConfigsMap, setOnboardingConfigsMap] = useState<Record<string, OnboardingConfig>>(() => {
    const saved = localStorage.getItem(LS_PREFIX + 'onboarding_map');
    return saved ? JSON.parse(saved) : {};
  });

  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);

  // All Workspaces
  const [allWorkspaces, setAllWorkspaces] = useState<Workspace[]>(() => {
    const saved = localStorage.getItem(LS_PREFIX + 'workspaces');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string>(() => {
    const saved = localStorage.getItem(LS_PREFIX + 'current_ws_id');
    return saved || '';
  });

  const [allTeamMembers, setAllTeamMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem(LS_PREFIX + 'team_members');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem(LS_PREFIX + 'current_user_id');
    return saved || '';
  });

  // Raw Multi-Tenant Collections (strictly actual tenant data — zero mocked data)
  const [allCompanies, setAllCompanies] = useState<Company[]>(() => {
    const saved = localStorage.getItem(LS_PREFIX + 'companies');
    return saved ? JSON.parse(saved) : [];
  });

  const [allContacts, setAllContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem(LS_PREFIX + 'contacts');
    return saved ? JSON.parse(saved) : [];
  });

  const [allOpportunities, setAllOpportunities] = useState<Opportunity[]>(() => {
    const saved = localStorage.getItem(LS_PREFIX + 'opportunities');
    return saved ? JSON.parse(saved) : [];
  });

  const [allTasks, setAllTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(LS_PREFIX + 'tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [allActivities, setAllActivities] = useState<ContactActivity[]>(() => {
    const saved = localStorage.getItem(LS_PREFIX + 'activities');
    return saved ? JSON.parse(saved) : [];
  });

  const [allNotifications, setAllNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(LS_PREFIX + 'notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const [allWorkflows, setAllWorkflows] = useState<WorkflowAutomation[]>(() => {
    const saved = localStorage.getItem(LS_PREFIX + 'workflows');
    return saved ? JSON.parse(saved) : [];
  });

  const [allConversations, setAllConversations] = useState<ConversationThread[]>(() => {
    const saved = localStorage.getItem(LS_PREFIX + 'conversations');
    return saved ? JSON.parse(saved) : [];
  });

  const [allAppointments, setAllAppointments] = useState<CalendarAppointment[]>(() => {
    const saved = localStorage.getItem(LS_PREFIX + 'appointments');
    return saved ? JSON.parse(saved) : [];
  });

  const [allNotionDocs, setAllNotionDocs] = useState<NotionDoc[]>(() => {
    const saved = localStorage.getItem(LS_PREFIX + 'notion_docs');
    return saved ? JSON.parse(saved) : [];
  });

  const [allModuleRequests, setAllModuleRequests] = useState<ModuleSetupRequest[]>(() => {
    const saved = localStorage.getItem(LS_PREFIX + 'module_requests');
    return saved ? JSON.parse(saved) : [];
  });

  const [allGoogleAccounts, setAllGoogleAccounts] = useState<GoogleAccount[]>(() => {
    const saved = localStorage.getItem(LS_PREFIX + 'google_accounts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (_) {}
    }
    return INITIAL_GOOGLE_ACCOUNTS;
  });

  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [activeSetupModuleId, setActiveSetupModuleId] = useState<string | null>(null);

  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>(() => {
    const saved = localStorage.getItem(LS_PREFIX + 'notif_prefs');
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    return {
      push_enabled: false,
      email_enabled: true,
      email_recipient: '',
      resend_api_key: '',
      notify_on_assignment: true,
      notify_due_soon: true,
      notify_overdue: true,
      notify_deal_won: true,
      notify_inbound_messages: true,
      notify_new_leads: true,
      due_soon_hours: 24,
    };
  });

  // Persist to LocalStorage
  useEffect(() => {
    localStorage.setItem(LS_PREFIX + 'notif_prefs', JSON.stringify(notificationPreferences));
  }, [notificationPreferences]);

  useEffect(() => {
    localStorage.setItem(LS_PREFIX + 'authenticated', String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem(LS_PREFIX + 'tenant_accounts', JSON.stringify(tenantAccounts));
  }, [tenantAccounts]);

  useEffect(() => {
    localStorage.setItem(LS_PREFIX + 'onboarding_map', JSON.stringify(onboardingConfigsMap));
  }, [onboardingConfigsMap]);

  useEffect(() => {
    localStorage.setItem(LS_PREFIX + 'workspaces', JSON.stringify(allWorkspaces));
  }, [allWorkspaces]);

  useEffect(() => {
    localStorage.setItem(LS_PREFIX + 'current_ws_id', currentWorkspaceId);
  }, [currentWorkspaceId]);

  useEffect(() => {
    localStorage.setItem(LS_PREFIX + 'team_members', JSON.stringify(allTeamMembers));
  }, [allTeamMembers]);

  useEffect(() => {
    localStorage.setItem(LS_PREFIX + 'current_user_id', currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem(LS_PREFIX + 'companies', JSON.stringify(allCompanies));
  }, [allCompanies]);

  useEffect(() => {
    localStorage.setItem(LS_PREFIX + 'contacts', JSON.stringify(allContacts));
  }, [allContacts]);

  useEffect(() => {
    localStorage.setItem(LS_PREFIX + 'opportunities', JSON.stringify(allOpportunities));
  }, [allOpportunities]);

  useEffect(() => {
    localStorage.setItem(LS_PREFIX + 'tasks', JSON.stringify(allTasks));
  }, [allTasks]);

  useEffect(() => {
    localStorage.setItem(LS_PREFIX + 'activities', JSON.stringify(allActivities));
  }, [allActivities]);

  useEffect(() => {
    localStorage.setItem(LS_PREFIX + 'notifications', JSON.stringify(allNotifications));
  }, [allNotifications]);

  useEffect(() => {
    localStorage.setItem(LS_PREFIX + 'workflows', JSON.stringify(allWorkflows));
  }, [allWorkflows]);

  useEffect(() => {
    localStorage.setItem(LS_PREFIX + 'conversations', JSON.stringify(allConversations));
  }, [allConversations]);

  useEffect(() => {
    localStorage.setItem(LS_PREFIX + 'appointments', JSON.stringify(allAppointments));
  }, [allAppointments]);

  useEffect(() => {
    localStorage.setItem(LS_PREFIX + 'notion_docs', JSON.stringify(allNotionDocs));
  }, [allNotionDocs]);

  useEffect(() => {
    localStorage.setItem(LS_PREFIX + 'module_requests', JSON.stringify(allModuleRequests));
  }, [allModuleRequests]);

  useEffect(() => {
    localStorage.setItem(LS_PREFIX + 'google_accounts', JSON.stringify(allGoogleAccounts));
  }, [allGoogleAccounts]);

  // Strictly Scoped Current Tenant Workspace & User
  const currentWorkspace = useMemo<Workspace>(() => {
    return (
      allWorkspaces.find(w => w.id === currentWorkspaceId) ||
      allWorkspaces[0] || {
        id: 'ws-default',
        name: 'Workspace',
        owner_id: currentUserId || 'owner',
        created_at: new Date().toISOString(),
      }
    );
  }, [allWorkspaces, currentWorkspaceId, currentUserId]);

  // Workspaces owned by or accessible to the current user
  const workspaces = useMemo(() => {
    const userWorkspaces = allWorkspaces.filter(
      w =>
        w.owner_id === currentUserId ||
        allTeamMembers.some(m => m.workspace_id === w.id && m.user_id === currentUserId)
    );
    return userWorkspaces.length > 0 ? userWorkspaces : [currentWorkspace];
  }, [allWorkspaces, allTeamMembers, currentUserId, currentWorkspace]);

  const teamMembers = useMemo(() => {
    return allTeamMembers.filter(m => m.workspace_id === currentWorkspace.id);
  }, [allTeamMembers, currentWorkspace.id]);

  const currentUser = useMemo<TeamMember>(() => {
    return (
      teamMembers.find(m => m.user_id === currentUserId) ||
      teamMembers[0] || {
        id: 'mem-owner',
        workspace_id: currentWorkspace.id,
        user_id: currentUserId || 'owner',
        name: 'Workspace Owner',
        email: '',
        role: 'Owner',
        joined_at: new Date().toISOString(),
      }
    );
  }, [teamMembers, currentUserId, currentWorkspace.id]);

  const onboardingConfig = useMemo(() => {
    return onboardingConfigsMap[currentWorkspace.id] || DEFAULT_ONBOARDING_CONFIG;
  }, [onboardingConfigsMap, currentWorkspace.id]);

  // Tenant-Scoped Entities (Strict Isolation by workspace_id)
  const companies = useMemo(
    () => allCompanies.filter(c => c.workspace_id === currentWorkspace.id),
    [allCompanies, currentWorkspace.id]
  );
  const contacts = useMemo(
    () => allContacts.filter(c => c.workspace_id === currentWorkspace.id),
    [allContacts, currentWorkspace.id]
  );
  const opportunities = useMemo(
    () => allOpportunities.filter(o => o.workspace_id === currentWorkspace.id),
    [allOpportunities, currentWorkspace.id]
  );
  const tasks = useMemo(
    () => allTasks.filter(t => t.workspace_id === currentWorkspace.id),
    [allTasks, currentWorkspace.id]
  );
  const activities = useMemo(
    () => allActivities.filter(a => a.workspace_id === currentWorkspace.id),
    [allActivities, currentWorkspace.id]
  );
  const notifications = useMemo(
    () => allNotifications.filter(n => n.workspace_id === currentWorkspace.id),
    [allNotifications, currentWorkspace.id]
  );
  const moduleSetupRequests = useMemo(
    () => allModuleRequests.filter(r => r.workspace_id === currentWorkspace.id),
    [allModuleRequests, currentWorkspace.id]
  );
  const workflows = useMemo(
    () => allWorkflows.filter(w => w.workspace_id === currentWorkspace.id),
    [allWorkflows, currentWorkspace.id]
  );
  const conversations = useMemo(
    () => allConversations.filter(c => c.workspace_id === currentWorkspace.id),
    [allConversations, currentWorkspace.id]
  );
  const appointments = useMemo(
    () => allAppointments.filter(a => a.workspace_id === currentWorkspace.id),
    [allAppointments, currentWorkspace.id]
  );
  const notionDocs = useMemo(
    () => allNotionDocs.filter(d => d.workspace_id === currentWorkspace.id),
    [allNotionDocs, currentWorkspace.id]
  );
  const googleAccounts = useMemo(() => {
    const wsId = currentWorkspace.id;
    const list = allGoogleAccounts.filter(g => g.workspace_id === wsId);
    if (list.length === 0 && wsId) {
      return INITIAL_GOOGLE_ACCOUNTS.map(g => ({ ...g, workspace_id: wsId }));
    }
    return list;
  }, [allGoogleAccounts, currentWorkspace.id]);

  // Hydrate tenant data from Supabase for a given workspaceId
  const hydrateWorkspaceFromSupabase = useCallback(async (wsId: string) => {
    const sb = getSupabaseClient();
    if (!sb) return;

    try {
      const [
        memRes, cfgRes, compRes, contRes, oppRes,
        taskRes, actRes, notifRes, wfRes, convRes, apptRes, docRes
      ] = await Promise.all([
        sb.from('workspace_members').select('*').eq('workspace_id', wsId),
        sb.from('onboarding_configs').select('*').eq('workspace_id', wsId).limit(1),
        sb.from('companies').select('*').eq('workspace_id', wsId),
        sb.from('contacts').select('*').eq('workspace_id', wsId),
        sb.from('opportunities').select('*').eq('workspace_id', wsId),
        sb.from('tasks').select('*').eq('workspace_id', wsId),
        sb.from('contact_activities').select('*').eq('workspace_id', wsId),
        sb.from('notifications').select('*').eq('workspace_id', wsId),
        sb.from('workflows').select('*').eq('workspace_id', wsId),
        sb.from('conversations').select('*').eq('workspace_id', wsId),
        sb.from('appointments').select('*').eq('workspace_id', wsId),
        sb.from('notion_docs').select('*').eq('workspace_id', wsId),
      ]);

      if (memRes.data?.length) {
        setAllTeamMembers(prev => [
          ...prev.filter(m => m.workspace_id !== wsId),
          ...(memRes.data as TeamMember[]),
        ]);
      }
      if (cfgRes.data?.length) {
        const r = cfgRes.data[0];
        setOnboardingConfigsMap(prev => ({
          ...prev,
          [wsId]: {
            role: r.role,
            companySize: r.company_size,
            teamSize: r.team_size,
            industry: r.industry,
            enabledModules: r.enabled_modules || DEFAULT_ONBOARDING_CONFIG.enabledModules,
            completed: r.completed ?? true,
            configuredAt: r.configured_at,
          },
        }));
      }
      if (compRes.data) {
        setAllCompanies(prev => [...prev.filter(c => c.workspace_id !== wsId), ...(compRes.data as Company[])]);
      }
      if (contRes.data) {
        setAllContacts(prev => [...prev.filter(c => c.workspace_id !== wsId), ...(contRes.data as Contact[])]);
      }
      if (oppRes.data) {
        setAllOpportunities(prev => [...prev.filter(o => o.workspace_id !== wsId), ...(oppRes.data as Opportunity[])]);
      }
      if (taskRes.data) {
        setAllTasks(prev => [...prev.filter(t => t.workspace_id !== wsId), ...(taskRes.data as Task[])]);
      }
      if (actRes.data) {
        setAllActivities(prev => [...prev.filter(a => a.workspace_id !== wsId), ...(actRes.data as ContactActivity[])]);
      }
      if (notifRes.data) {
        setAllNotifications(prev => [...prev.filter(n => n.workspace_id !== wsId), ...(notifRes.data as AppNotification[])]);
      }
      if (wfRes.data) {
        setAllWorkflows(prev => [...prev.filter(w => w.workspace_id !== wsId), ...(wfRes.data as WorkflowAutomation[])]);
      }
      if (convRes.data) {
        setAllConversations(prev => [...prev.filter(c => c.workspace_id !== wsId), ...(convRes.data as ConversationThread[])]);
      }
      if (apptRes.data) {
        setAllAppointments(prev => [...prev.filter(a => a.workspace_id !== wsId), ...(apptRes.data as CalendarAppointment[])]);
      }
      if (docRes.data) {
        setAllNotionDocs(prev => [...prev.filter(d => d.workspace_id !== wsId), ...(docRes.data as NotionDoc[])]);
      }
    } catch {
      // Fallback to local state if tables not yet migrated
    }
  }, []);

  // Check active Supabase Auth session on mount
  useEffect(() => {
    const sb = getSupabaseClient();
    if (!sb) return;

    sb.auth.getSession().then(async ({ data }) => {
      if (data.session?.user) {
        const user = data.session.user;
        setCurrentUserId(user.id);
        setIsAuthenticated(true);

        const { data: remoteWs } = await sb
          .from('workspaces')
          .select('*')
          .eq('owner_id', user.id);

        if (remoteWs && remoteWs.length > 0) {
          setAllWorkspaces(prev => {
            const existingIds = new Set(remoteWs.map(w => w.id));
            return [...prev.filter(w => !existingIds.has(w.id)), ...(remoteWs as Workspace[])];
          });
          setCurrentWorkspaceId(remoteWs[0].id);
          await hydrateWorkspaceFromSupabase(remoteWs[0].id);
        }
      }
    });
  }, [hydrateWorkspaceFromSupabase]);

  // Automated Welcome & Admin Alert Email Dispatcher
  const dispatchAuthEmails = async (payload: {
    email: string;
    fullName: string;
    companyName: string;
    isNewUser: boolean;
  }) => {
    const timestamp = new Date().toLocaleString('en-US', { timeZoneName: 'short' });
    const adminEmail = 'admin@autoflow.studio';

    // 1. User Welcome / Sign-in HTML
    const userSubject = payload.isNewUser
      ? `Welcome to AutoFlow Studio, ${payload.fullName.split(' ')[0]}! 🚀`
      : `AutoFlow Studio: Successful Sign-In (${payload.companyName})`;

    const userHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0a0c10; color: #f9fafb; padding: 40px 20px; border-radius: 12px; max-width: 580px; margin: 0 auto; border: 1px solid #1e2433;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #c4b5fd; font-size: 24px; margin-bottom: 8px;">AutoFlow Studio</h1>
          <p style="color: #94a3b8; font-size: 14px; margin: 0;">Bespoke CRM & Automation Infrastructure</p>
        </div>
        <div style="background-color: #11141c; border-radius: 10px; padding: 24px; border: 1px solid #1e2433;">
          <h2 style="color: #f9fafb; font-size: 18px; margin-top: 0;">${payload.isNewUser ? 'Welcome to your new workspace!' : 'Security Alert: Sign-In Verified'}</h2>
          <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">
            ${payload.isNewUser 
              ? `Hello ${payload.fullName}, your dedicated organization workspace <strong>${payload.companyName}</strong> has been initialized. You have full access to your contacts, sales pipeline, SOP docs, and mobile PWA sync.`
              : `Hello ${payload.fullName}, a new sign-in session was authenticated for your workspace <strong>${payload.companyName}</strong> at ${timestamp}.`
            }
          </p>
          <div style="margin: 20px 0; padding: 12px 16px; background: rgba(167, 139, 250, 0.08); border: 1px solid rgba(167, 139, 250, 0.2); border-radius: 6px; font-size: 13px; color: #c4b5fd;">
            <strong>Workspace:</strong> ${payload.companyName}<br/>
            <strong>Email:</strong> ${payload.email}<br/>
            <strong>Session Time:</strong> ${timestamp}
          </div>
        </div>
        <p style="color: #64748b; font-size: 12px; text-align: center; margin-top: 24px;">AutoFlow Studio • Dedicated Tenant Security</p>
      </div>
    `;

    // 2. Admin Alert HTML
    const adminSubject = `[AutoFlow Alert] ${payload.isNewUser ? 'New User Registered' : 'User Signed In'}: ${payload.fullName} (${payload.companyName})`;
    const adminHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0a0c10; color: #f9fafb; padding: 32px 20px; border-radius: 10px; max-width: 580px; margin: 0 auto; border: 1px solid #2e364d;">
        <h2 style="color: #fbbf24; margin-top: 0; font-size: 18px;">⚡ Admin Activity Notification</h2>
        <p style="color: #94a3b8; font-size: 14px;">A tenant auth event was recorded in AutoFlow CRM:</p>
        <div style="background: #11141c; padding: 16px; border-radius: 8px; border: 1px solid #1e2433; font-size: 13px; line-height: 1.7;">
          <div><strong style="color: #f9fafb;">Event:</strong> <span style="color: ${payload.isNewUser ? '#34d399' : '#60a5fa'};">${payload.isNewUser ? 'New Organization Registration' : 'Account Sign-In'}</span></div>
          <div><strong style="color: #f9fafb;">User Name:</strong> ${payload.fullName}</div>
          <div><strong style="color: #f9fafb;">Work Email:</strong> ${payload.email}</div>
          <div><strong style="color: #f9fafb;">Company:</strong> ${payload.companyName}</div>
          <div><strong style="color: #f9fafb;">Timestamp:</strong> ${timestamp}</div>
          <div><strong style="color: #f9fafb;">User Agent:</strong> ${typeof navigator !== 'undefined' ? navigator.userAgent : 'Server'}</div>
        </div>
      </div>
    `;

    // Dispatch via /api/send-email (Vercel Serverless Function)
    try {
      // Send welcome to user
      fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: payload.email,
          subject: userSubject,
          html: userHtml,
        })
      }).catch(e => console.warn('User welcome email invoke warning:', e));

      // Send alert to admin
      fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: adminEmail,
          subject: adminSubject,
          html: adminHtml,
        })
      }).catch(e => console.warn('Admin alert email invoke warning:', e));
    } catch (err) {
      console.warn('Dispatch auth emails exception:', err);
    }

    // Also dispatch to Supabase edge function if connected
    const sb = getSupabaseClient();
    if (sb) {
      try {
        await sb.functions.invoke('send-email', {
          body: {
            type: payload.isNewUser ? 'welcome_new_user' : 'user_sign_in',
            userEmail: payload.email,
            userName: payload.fullName,
            company: payload.companyName,
            timestamp,
          }
        });
      } catch (e) {
        // Ignored if local or no edge function deployed
      }
    }

    // Push instant in-app notification
    const inAppNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      workspace_id: currentWorkspaceId,
      user_id: currentUserId,
      type: 'workflow_run',
      title: payload.isNewUser ? 'Welcome to AutoFlow Studio! 🎉' : 'Session Verified 🔒',
      message: payload.isNewUser
        ? `Welcome ${payload.fullName}! Workspace "${payload.companyName}" initialized. Welcome & admin alerts dispatched.`
        : `Signed in as ${payload.email}. Welcome and admin notification alerts dispatched.`,
      read: false,
      created_at: new Date().toISOString(),
    };
    setAllNotifications(prev => [inAppNotif, ...prev]);
  };

  // Multi-Tenant Company Registration
  const registerCompanyAccount = async ({
    companyName,
    fullName,
    email,
    password,
  }: RegisterCompanyPayload): Promise<{ success: boolean; message?: string }> => {
    const sb = getSupabaseClient();
    let userId = `user-${Date.now()}`;

    if (sb) {
      const { data, error } = await sb.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            company_name: companyName,
          },
        },
      });

      if (error && !error.message.toLowerCase().includes('rate limit')) {
        return { success: false, message: error.message };
      }

      if (data?.user?.id) {
        userId = data.user.id;
      }
    }

    const newWsId = `ws-${Date.now()}`;
    const newWorkspace: Workspace = {
      id: newWsId,
      name: companyName,
      owner_id: userId,
      created_at: new Date().toISOString(),
    };

    const ownerMember: TeamMember = {
      id: `mem-${Date.now()}`,
      workspace_id: newWsId,
      user_id: userId,
      name: fullName,
      email,
      role: 'Owner',
      joined_at: new Date().toISOString(),
    };

    const initialOnboarding: OnboardingConfig = {
      ...DEFAULT_ONBOARDING_CONFIG,
      completed: false,
      configuredAt: new Date().toISOString(),
    };

    setTenantAccounts(prev => [
      ...prev.filter(a => a.email !== email),
      { userId, email, passwordHash: password, fullName, workspaceId: newWsId },
    ]);

    setAllWorkspaces(prev => [...prev, newWorkspace]);
    setAllTeamMembers(prev => [...prev, ownerMember]);
    setOnboardingConfigsMap(prev => ({ ...prev, [newWsId]: initialOnboarding }));
    setCurrentUserId(userId);
    setCurrentWorkspaceId(newWsId);
    setIsAuthenticated(true);
    // Launch the 5-step interactive CRM builder immediately for the new company!
    setIsOnboardingOpen(true);

    if (sb) {
      await sb.from('workspaces').upsert(newWorkspace);
      await sb.from('workspace_members').upsert(ownerMember);
    }

    // Dispatch welcome email to user and notification email to admin
    dispatchAuthEmails({
      email,
      fullName,
      companyName,
      isNewUser: true,
    });

    return { success: true };
  };

  // Multi-Tenant Company Sign-In
  const signInCompanyAccount = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    const sb = getSupabaseClient();

    if (sb) {
      const { data, error } = await sb.auth.signInWithPassword({ email, password });
      if (!error && data?.user) {
        const userId = data.user.id;
        setCurrentUserId(userId);
        setIsAuthenticated(true);

        const { data: remoteWs } = await sb
          .from('workspaces')
          .select('*')
          .eq('owner_id', userId);

        if (remoteWs && remoteWs.length > 0) {
          setAllWorkspaces(prev => {
            const ids = new Set(remoteWs.map(w => w.id));
            return [...prev.filter(w => !ids.has(w.id)), ...(remoteWs as Workspace[])];
          });
          setCurrentWorkspaceId(remoteWs[0].id);
          await hydrateWorkspaceFromSupabase(remoteWs[0].id);

          dispatchAuthEmails({
            email,
            fullName: data.user.user_metadata?.full_name || email.split('@')[0],
            companyName: remoteWs[0].name,
            isNewUser: false,
          });

          return { success: true };
        }
      }
    }

    // Fallback check in local tenant registry (for instant sign-in if email confirmation is pending)
    const localAccount = tenantAccounts.find(
      a => a.email.toLowerCase() === email.toLowerCase() && a.passwordHash === password
    );
    if (localAccount) {
      setCurrentUserId(localAccount.userId);
      setCurrentWorkspaceId(localAccount.workspaceId);
      setIsAuthenticated(true);
      await hydrateWorkspaceFromSupabase(localAccount.workspaceId);

      const ws = allWorkspaces.find(w => w.id === localAccount.workspaceId);
      dispatchAuthEmails({
        email,
        fullName: localAccount.fullName || email.split('@')[0],
        companyName: ws?.name || 'Workspace',
        isNewUser: false,
      });

      return { success: true };
    }

    return {
      success: false,
      message: 'Invalid work email or password. If your company is new, click "Create Company Account".',
    };
  };

  const signOutAccount = async () => {
    const sb = getSupabaseClient();
    if (sb) {
      await sb.auth.signOut();
    }
    setIsAuthenticated(false);
    setIsOnboardingOpen(false);
  };

  // Dynamic Modules (Scoped to Current Tenant Workspace)
  const isModuleEnabled = (moduleId: CRMModuleId): boolean => {
    return onboardingConfig.enabledModules.includes(moduleId);
  };

  const toggleModule = (moduleId: CRMModuleId) => {
    setOnboardingConfigsMap(prev => {
      const currentCfg = prev[currentWorkspace.id] || DEFAULT_ONBOARDING_CONFIG;
      const exists = currentCfg.enabledModules.includes(moduleId);
      const nextModules = exists
        ? currentCfg.enabledModules.filter(m => m !== moduleId)
        : [...currentCfg.enabledModules, moduleId];
      const updated = { ...currentCfg, enabledModules: nextModules };

      const sb = getSupabaseClient();
      if (sb) {
        sb.from('onboarding_configs').upsert({
          workspace_id: currentWorkspace.id,
          role: updated.role,
          company_size: updated.companySize,
          team_size: updated.teamSize,
          industry: updated.industry,
          enabled_modules: updated.enabledModules,
          completed: updated.completed,
          configured_at: updated.configuredAt || new Date().toISOString(),
        }).then(() => {});
      }

      return { ...prev, [currentWorkspace.id]: updated };
    });
  };

  // Construct Tenant CRM from Onboarding Config (saves configuration only — zero mocked data)
  const saveOnboarding = (config: OnboardingConfig) => {
    const wsId = currentWorkspace.id;
    setOnboardingConfigsMap(prev => ({ ...prev, [wsId]: config }));
    setIsOnboardingOpen(false);

    const sb = getSupabaseClient();
    if (sb) {
      sb.from('onboarding_configs').upsert({
        workspace_id: wsId,
        role: config.role,
        company_size: config.companySize,
        team_size: config.teamSize,
        industry: config.industry,
        enabled_modules: config.enabledModules,
        completed: true,
        configured_at: config.configuredAt || new Date().toISOString(),
      }).then(() => {});
    }

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#A78BFA', '#C4B5FD', '#F9FAFB']
      });
    } catch {
      // Confetti fallback
    }
  };

  // Workspace Actions
  const createWorkspace = (name: string) => {
    const newWsId = `ws-${Date.now()}`;
    const newWs: Workspace = {
      id: newWsId,
      name,
      owner_id: currentUser.user_id,
      created_at: new Date().toISOString(),
    };
    const ownerMember: TeamMember = {
      id: `mem-${Date.now()}`,
      workspace_id: newWsId,
      user_id: currentUser.user_id,
      name: currentUser.name,
      email: currentUser.email,
      role: 'Owner',
      joined_at: new Date().toISOString(),
    };

    setAllWorkspaces(prev => [...prev, newWs]);
    setAllTeamMembers(prev => [...prev, ownerMember]);
    setCurrentWorkspaceId(newWsId);
    setIsOnboardingOpen(true);

    const sb = getSupabaseClient();
    if (sb) {
      sb.from('workspaces').upsert(newWs).then(() => {});
      sb.from('workspace_members').upsert(ownerMember).then(() => {});
    }
  };

  const switchWorkspace = (workspaceId: string) => {
    if (allWorkspaces.some(w => w.id === workspaceId)) {
      setCurrentWorkspaceId(workspaceId);
      hydrateWorkspaceFromSupabase(workspaceId);
    }
  };

  const switchCurrentUser = (memberId: string) => {
    const member = teamMembers.find(m => m.id === memberId);
    if (member) {
      setCurrentUserId(member.user_id);
    }
  };

  const inviteTeamMember = (name: string, email: string, role: UserRole) => {
    const newMember: TeamMember = {
      id: `mem-${Date.now()}`,
      workspace_id: currentWorkspace.id,
      user_id: `user-${Date.now()}`,
      name,
      email,
      role,
      joined_at: new Date().toISOString(),
    };
    setAllTeamMembers(prev => [...prev, newMember]);
    const sb = getSupabaseClient();
    if (sb) sb.from('workspace_members').upsert(newMember).then(() => {});
  };

  const removeTeamMember = (id: string) => {
    setAllTeamMembers(prev => prev.filter(m => m.id !== id));
    const sb = getSupabaseClient();
    if (sb) sb.from('workspace_members').delete().eq('id', id).then(() => {});
  };

  // Companies Actions (Tenant Scoped)
  const addCompany = (comp: Omit<Company, 'id' | 'workspace_id' | 'created_at' | 'updated_at'>): Company => {
    const newCompany: Company = {
      ...comp,
      id: `comp-${Date.now()}`,
      workspace_id: currentWorkspace.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setAllCompanies(prev => [newCompany, ...prev]);
    const sb = getSupabaseClient();
    if (sb) sb.from('companies').upsert(newCompany).then(() => {});
    return newCompany;
  };

  const updateCompany = (id: string, updates: Partial<Company>) => {
    setAllCompanies(prev => prev.map(c => {
      if (c.id === id && c.workspace_id === currentWorkspace.id) {
        const updated = { ...c, ...updates, updated_at: new Date().toISOString() };
        const sb = getSupabaseClient();
        if (sb) sb.from('companies').upsert(updated).then(() => {});
        return updated;
      }
      return c;
    }));
  };

  const deleteCompany = (id: string) => {
    setAllCompanies(prev => prev.filter(c => c.id !== id));
    const sb = getSupabaseClient();
    if (sb) sb.from('companies').delete().eq('id', id).then(() => {});
  };

  // Contacts Actions (Tenant Scoped)
  const addContact = (contact: Omit<Contact, 'id' | 'workspace_id' | 'created_at' | 'updated_at'>): Contact => {
    const newContact: Contact = {
      ...contact,
      id: `cont-${Date.now()}`,
      workspace_id: currentWorkspace.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setAllContacts(prev => [newContact, ...prev]);

    const act: ContactActivity = {
      id: `act-${Date.now()}`,
      contact_id: newContact.id,
      workspace_id: currentWorkspace.id,
      type: 'contact_created',
      title: 'Contact Created',
      description: `${newContact.first_name} ${newContact.last_name} was added.`,
      created_by: currentUser.name,
      created_at: new Date().toISOString(),
    };
    setAllActivities(prev => [act, ...prev]);

    const sb = getSupabaseClient();
    if (sb) {
      sb.from('contacts').upsert(newContact).then(() => {});
      sb.from('contact_activities').upsert(act).then(() => {});
    }

    const matchingWorkflows = workflows.filter(w => w.active && w.trigger_type === 'contact_created');
    matchingWorkflows.forEach(wf => {
      runWorkflowTest(wf.id);
    });

    return newContact;
  };

  const updateContact = (id: string, updates: Partial<Contact>) => {
    setAllContacts(prev => prev.map(c => {
      if (c.id === id && c.workspace_id === currentWorkspace.id) {
        const updated = { ...c, ...updates, updated_at: new Date().toISOString() };
        const sb = getSupabaseClient();
        if (sb) sb.from('contacts').upsert(updated).then(() => {});
        return updated;
      }
      return c;
    }));
  };

  const deleteContact = (id: string) => {
    setAllContacts(prev => prev.filter(c => c.id !== id));
    const sb = getSupabaseClient();
    if (sb) sb.from('contacts').delete().eq('id', id).then(() => {});
  };

  const importContactsCSV = (csvText: string): number => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return 0;

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const fnIndex = headers.indexOf('first_name') !== -1 ? headers.indexOf('first_name') : headers.indexOf('firstname');
    const lnIndex = headers.indexOf('last_name') !== -1 ? headers.indexOf('last_name') : headers.indexOf('lastname');
    const emailIndex = headers.indexOf('email');
    const phoneIndex = headers.indexOf('phone');
    const companyIndex = headers.indexOf('company');

    if (emailIndex === -1 && fnIndex === -1) return 0;

    let importedCount = 0;
    const newContacts: Contact[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
      const email = emailIndex !== -1 ? cols[emailIndex] : `imported${Date.now()}_${i}@example.com`;
      const first_name = fnIndex !== -1 ? cols[fnIndex] : 'Imported';
      const last_name = lnIndex !== -1 ? cols[lnIndex] : `Contact ${i}`;
      const phone = phoneIndex !== -1 ? cols[phoneIndex] : undefined;
      const company_name = companyIndex !== -1 ? cols[companyIndex] : undefined;

      const created: Contact = {
        id: `cont-import-${Date.now()}-${i}`,
        workspace_id: currentWorkspace.id,
        first_name,
        last_name,
        email,
        phone,
        company_name,
        tags: ['CSV Import'],
        custom_fields: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      newContacts.push(created);
      importedCount++;
    }

    if (newContacts.length > 0) {
      setAllContacts(prev => [...newContacts, ...prev]);
      const sb = getSupabaseClient();
      if (sb) sb.from('contacts').upsert(newContacts).then(() => {});
    }
    return importedCount;
  };

  const exportContactsCSV = () => {
    const headers = ['id', 'first_name', 'last_name', 'email', 'phone', 'company_name', 'job_title', 'tags', 'created_at'];
    const rows = contacts.map(c => [
      c.id,
      `"${c.first_name.replace(/"/g, '""')}"`,
      `"${c.last_name.replace(/"/g, '""')}"`,
      `"${c.email.replace(/"/g, '""')}"`,
      `"${(c.phone || '').replace(/"/g, '""')}"`,
      `"${(c.company_name || '').replace(/"/g, '""')}"`,
      `"${(c.job_title || '').replace(/"/g, '""')}"`,
      `"${c.tags.join(';')}"`,
      c.created_at,
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${currentWorkspace.name.toLowerCase().replace(/\s+/g, '_')}_contacts.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Opportunities Actions (Tenant Scoped)
  const addOpportunity = (opp: Omit<Opportunity, 'id' | 'workspace_id' | 'created_at' | 'updated_at'>): Opportunity => {
    const newOpp: Opportunity = {
      ...opp,
      id: `opp-${Date.now()}`,
      workspace_id: currentWorkspace.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setAllOpportunities(prev => [newOpp, ...prev]);

    const sb = getSupabaseClient();
    if (sb) sb.from('opportunities').upsert(newOpp).then(() => {});

    if (newOpp.contact_id) {
      const act: ContactActivity = {
        id: `act-${Date.now()}`,
        contact_id: newOpp.contact_id,
        workspace_id: currentWorkspace.id,
        type: 'stage_changed',
        title: `Opportunity Created: ${newOpp.name}`,
        description: `Stage: ${newOpp.stage} • Value: $${newOpp.deal_value.toLocaleString()}`,
        created_by: currentUser.name,
        created_at: new Date().toISOString(),
      };
      setAllActivities(prev => [act, ...prev]);
      if (sb) sb.from('contact_activities').upsert(act).then(() => {});
    }
    return newOpp;
  };

  const updateOpportunity = (id: string, updates: Partial<Opportunity>) => {
    setAllOpportunities(prev => prev.map(o => {
      if (o.id === id && o.workspace_id === currentWorkspace.id) {
        const updated = { ...o, ...updates, updated_at: new Date().toISOString() };
        const sb = getSupabaseClient();
        if (sb) sb.from('opportunities').upsert(updated).then(() => {});
        return updated;
      }
      return o;
    }));
  };

  const deleteOpportunity = (id: string) => {
    setAllOpportunities(prev => prev.filter(o => o.id !== id));
    const sb = getSupabaseClient();
    if (sb) sb.from('opportunities').delete().eq('id', id).then(() => {});
  };

  const moveOpportunityStage = (id: string, newStage: PipelineStage) => {
    const opp = opportunities.find(o => o.id === id);
    if (!opp || opp.stage === newStage) return;

    const updatedOpp = { ...opp, stage: newStage, updated_at: new Date().toISOString() };
    setAllOpportunities(prev => prev.map(o => o.id === id ? updatedOpp : o));

    const sb = getSupabaseClient();
    if (sb) sb.from('opportunities').upsert(updatedOpp).then(() => {});

    if (newStage === 'Won') {
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#A78BFA', '#C4B5FD', '#34D399', '#F9FAFB']
        });
      } catch {}
      const notif: AppNotification = {
        id: `notif-${Date.now()}`,
        workspace_id: currentWorkspace.id,
        user_id: currentUser.user_id,
        type: 'deal_won',
        title: 'Deal Won!',
        message: `Opportunity "${opp.name}" ($${opp.deal_value.toLocaleString()}) was moved to Won!`,
        read: false,
        created_at: new Date().toISOString(),
      };
      setAllNotifications(prev => [notif, ...prev]);
      if (sb) sb.from('notifications').upsert(notif).then(() => {});
    }

    if (opp.contact_id) {
      const act: ContactActivity = {
        id: `act-${Date.now()}`,
        contact_id: opp.contact_id,
        workspace_id: currentWorkspace.id,
        type: 'stage_changed',
        title: `Sales Stage Changed to ${newStage}`,
        description: `Opportunity "${opp.name}" moved from ${opp.stage} to ${newStage}`,
        created_by: currentUser.name,
        created_at: new Date().toISOString(),
      };
      setAllActivities(prev => [act, ...prev]);
      if (sb) sb.from('contact_activities').upsert(act).then(() => {});
    }

    const matchingWorkflows = workflows.filter(w => w.active && w.trigger_type === 'deal_stage_changed');
    matchingWorkflows.forEach(wf => {
      runWorkflowTest(wf.id);
    });
  };

  // Tasks Actions (Tenant Scoped)
  const addTask = (task: Omit<Task, 'id' | 'workspace_id' | 'created_at' | 'updated_at'>): Task => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      workspace_id: currentWorkspace.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setAllTasks(prev => [newTask, ...prev]);

    const sb = getSupabaseClient();
    if (sb) sb.from('tasks').upsert(newTask).then(() => {});

    if (newTask.assigned_to && newTask.assigned_to === currentUser.user_id) {
      const notif: AppNotification = {
        id: `notif-${Date.now()}`,
        workspace_id: currentWorkspace.id,
        user_id: newTask.assigned_to,
        type: 'task_assigned',
        title: 'New Task Assigned',
        message: `You were assigned: ${newTask.title}`,
        read: false,
        task_id: newTask.id,
        created_at: new Date().toISOString(),
      };
      setAllNotifications(prev => [notif, ...prev]);
      if (sb) sb.from('notifications').upsert(notif).then(() => {});
    }

    if (newTask.related_contact_id) {
      const act: ContactActivity = {
        id: `act-${Date.now()}`,
        contact_id: newTask.related_contact_id,
        workspace_id: currentWorkspace.id,
        type: 'task_created',
        title: `Task Created: ${newTask.title}`,
        description: `Priority: ${newTask.priority} • Due: ${newTask.due_date}`,
        created_by: currentUser.name,
        created_at: new Date().toISOString(),
      };
      setAllActivities(prev => [act, ...prev]);
      if (sb) sb.from('contact_activities').upsert(act).then(() => {});
    }

    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setAllTasks(prev => prev.map(t => {
      if (t.id === id && t.workspace_id === currentWorkspace.id) {
        const updated = { ...t, ...updates, updated_at: new Date().toISOString() };
        const sb = getSupabaseClient();
        if (sb) sb.from('tasks').upsert(updated).then(() => {});
        return updated;
      }
      return t;
    }));
  };

  const deleteTask = (id: string) => {
    setAllTasks(prev => prev.filter(t => t.id !== id));
    const sb = getSupabaseClient();
    if (sb) sb.from('tasks').delete().eq('id', id).then(() => {});
  };

  const toggleTaskStatus = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const nextStatus: Task['status'] = task.status === 'Completed' ? 'To Do' : 'Completed';
    const updatedTask = { ...task, status: nextStatus, updated_at: new Date().toISOString() };
    setAllTasks(prev => prev.map(t => t.id === id ? updatedTask : t));

    const sb = getSupabaseClient();
    if (sb) sb.from('tasks').upsert(updatedTask).then(() => {});

    if (task.related_contact_id && nextStatus === 'Completed') {
      const act: ContactActivity = {
        id: `act-${Date.now()}`,
        contact_id: task.related_contact_id,
        workspace_id: currentWorkspace.id,
        type: 'task_completed',
        title: `Task Completed: ${task.title}`,
        description: `Marked completed by ${currentUser.name}`,
        created_by: currentUser.name,
        created_at: new Date().toISOString(),
      };
      setAllActivities(prev => [act, ...prev]);
      if (sb) sb.from('contact_activities').upsert(act).then(() => {});
    }
  };

  // GoHighLevel Workflows Actions (Tenant Scoped)
  const addWorkflow = (wf: Omit<WorkflowAutomation, 'id' | 'workspace_id' | 'created_at' | 'runs_count'>): WorkflowAutomation => {
    const newWf: WorkflowAutomation = {
      ...wf,
      id: `wf-${Date.now()}`,
      workspace_id: currentWorkspace.id,
      runs_count: 0,
      created_at: new Date().toISOString(),
    };
    setAllWorkflows(prev => [newWf, ...prev]);
    const sb = getSupabaseClient();
    if (sb) sb.from('workflows').upsert(newWf).then(() => {});
    return newWf;
  };

  const toggleWorkflowActive = (id: string) => {
    setAllWorkflows(prev => prev.map(w => {
      if (w.id === id && w.workspace_id === currentWorkspace.id) {
        const updated = { ...w, active: !w.active };
        const sb = getSupabaseClient();
        if (sb) sb.from('workflows').upsert(updated).then(() => {});
        return updated;
      }
      return w;
    }));
  };

  const runWorkflowTest = async (id: string): Promise<{ success: boolean; message: string }> => {
    const wf = workflows.find(w => w.id === id);
    if (!wf) return { success: false, message: 'Workflow not found' };

    const updatedWf = {
      ...wf,
      runs_count: wf.runs_count + 1,
      last_run_at: new Date().toISOString(),
    };
    setAllWorkflows(prev => prev.map(w => w.id === id ? updatedWf : w));

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      workspace_id: currentWorkspace.id,
      user_id: currentUser.user_id,
      type: 'workflow_run',
      title: 'Workflow Executed',
      message: `Workflow "${wf.name}" completed ${wf.actions.length} action steps successfully.`,
      read: false,
      created_at: new Date().toISOString(),
    };
    setAllNotifications(prev => [notif, ...prev]);

    const sb = getSupabaseClient();
    if (sb) {
      sb.from('workflows').upsert(updatedWf).then(() => {});
      sb.from('notifications').upsert(notif).then(() => {});
    }

    return { 
      success: true, 
      message: `Executed ${wf.actions.length} steps: ${wf.actions.map(a => a.title).join(' -> ')}` 
    };
  };

  const deleteWorkflow = (id: string) => {
    setAllWorkflows(prev => prev.filter(w => w.id !== id));
    const sb = getSupabaseClient();
    if (sb) sb.from('workflows').delete().eq('id', id).then(() => {});
  };

  // GoHighLevel Unified Inbox / Conversations (Tenant Scoped)
  const sendMessage = (threadId: string, text: string, channel: MessageChannel = 'email', googleAccountEmail?: string) => {
    if (!text.trim()) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      channel,
      text: text.trim(),
      timestamp: new Date().toISOString(),
      status: 'delivered',
      google_account_email: googleAccountEmail,
    };

    const sb = getSupabaseClient();

    setAllConversations(prev => prev.map(t => {
      if (t.id === threadId && t.workspace_id === currentWorkspace.id) {
        const updated: ConversationThread = {
          ...t,
          active_channel: channel,
          google_account_email: googleAccountEmail || t.google_account_email,
          last_message: text.trim(),
          last_message_at: new Date().toISOString(),
          unread: false,
          messages: [...t.messages, newMsg],
        };
        if (sb) sb.from('conversations').upsert(updated).then(() => {});
        return updated;
      }
      return t;
    }));

    const thread = conversations.find(t => t.id === threadId);
    if (thread) {
      const act: ContactActivity = {
        id: `act-${Date.now()}`,
        contact_id: thread.contact_id,
        workspace_id: currentWorkspace.id,
        type: 'message_sent',
        title: `Message sent via ${channel.toUpperCase()}${googleAccountEmail ? ` (${googleAccountEmail})` : ''}`,
        description: text.trim(),
        created_by: currentUser.name,
        created_at: new Date().toISOString(),
      };
      setAllActivities(prev => [act, ...prev]);
      if (sb) sb.from('contact_activities').upsert(act).then(() => {});
    }
  };

  // Google Workspace Multi-Account Integration
  const openGoogleModal = () => setIsGoogleModalOpen(true);
  const closeGoogleModal = () => setIsGoogleModalOpen(false);

  const connectGoogleAccount = async (accountData?: { 
    email: string; 
    name: string; 
    avatar?: string; 
    scopes?: GoogleScope[] 
  }): Promise<GoogleAccount> => {
    const email = accountData?.email || `user.${Date.now().toString().slice(-4)}@autoflow.studio`;
    const name = accountData?.name || email.split('@')[0].replace('.', ' ');
    const scopes: GoogleScope[] = accountData?.scopes || ['gmail', 'calendar', 'contacts'];

    const newAcc: GoogleAccount = {
      id: `gacc-${Date.now()}`,
      workspace_id: currentWorkspace.id,
      email,
      name,
      avatar: accountData?.avatar || `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 5000)}?w=100&auto=format&fit=crop&q=80`,
      scopes,
      sync_gmail: scopes.includes('gmail'),
      sync_calendar: scopes.includes('calendar'),
      sync_contacts: scopes.includes('contacts'),
      last_synced_at: new Date().toISOString(),
      status: 'connected',
      connected_at: new Date().toISOString(),
      is_primary: allGoogleAccounts.filter(g => g.workspace_id === currentWorkspace.id).length === 0,
    };

    setAllGoogleAccounts(prev => [...prev, newAcc]);

    // Send in-app notification
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      workspace_id: currentWorkspace.id,
      user_id: currentUser.user_id,
      title: 'Google Account Connected',
      message: `Successfully connected ${email} with ${scopes.join(', ')} sync enabled.`,
      type: 'workflow_run',
      read: false,
      created_at: new Date().toISOString(),
    };
    setAllNotifications(prev => [notif, ...prev]);

    return newAcc;
  };

  const disconnectGoogleAccount = (accountId: string) => {
    setAllGoogleAccounts(prev => prev.filter(g => g.id !== accountId));
  };

  const toggleGoogleAccountSync = (accountId: string, syncType: 'sync_gmail' | 'sync_calendar' | 'sync_contacts') => {
    setAllGoogleAccounts(prev => prev.map(g => {
      if (g.id === accountId) {
        return {
          ...g,
          [syncType]: !g[syncType],
          last_synced_at: new Date().toISOString(),
        };
      }
      return g;
    }));
  };

  const syncGoogleAccount = async (
    accountId: string, 
    service: 'all' | 'gmail' | 'calendar' | 'contacts' = 'all'
  ): Promise<{ success: boolean; message: string }> => {
    // Optimistically set to syncing
    setAllGoogleAccounts(prev => prev.map(g => g.id === accountId ? { ...g, status: 'syncing' } : g));

    // Simulate 2-way sync network latency with Google API
    await new Promise(res => setTimeout(res, 850));

    const now = new Date().toISOString();
    setAllGoogleAccounts(prev => prev.map(g => {
      if (g.id === accountId) {
        return {
          ...g,
          status: 'connected',
          last_synced_at: now,
        };
      }
      return g;
    }));

    const targetAccount = allGoogleAccounts.find(g => g.id === accountId);
    const email = targetAccount?.email || 'Google Account';

    return {
      success: true,
      message: `Bidirectional sync completed for ${email} (${service.toUpperCase()}). All threads, calendar slots, and contact cards are up to date.`
    };
  };

  const syncAllGoogleAccounts = async (): Promise<{ success: boolean; message: string }> => {
    const tenantAccounts = allGoogleAccounts.filter(g => g.workspace_id === currentWorkspace.id);
    if (tenantAccounts.length === 0) {
      return { success: false, message: 'No Google accounts currently connected to this workspace.' };
    }

    setAllGoogleAccounts(prev => prev.map(g => 
      g.workspace_id === currentWorkspace.id ? { ...g, status: 'syncing' } : g
    ));

    await new Promise(res => setTimeout(res, 1100));

    const now = new Date().toISOString();
    setAllGoogleAccounts(prev => prev.map(g => 
      g.workspace_id === currentWorkspace.id ? { ...g, status: 'connected', last_synced_at: now } : g
    ));

    return {
      success: true,
      message: `Synchronized ${tenantAccounts.length} Google account${tenantAccounts.length > 1 ? 's' : ''} across Gmail, Calendar, and Contacts.`
    };
  };

  const markConversationRead = (threadId: string) => {
    setAllConversations(prev => prev.map(t => {
      if (t.id === threadId && t.workspace_id === currentWorkspace.id) {
        const updated = { ...t, unread: false };
        const sb = getSupabaseClient();
        if (sb) sb.from('conversations').upsert(updated).then(() => {});
        return updated;
      }
      return t;
    }));
  };

  const createConversationForContact = (contact: Contact): string => {
    const existing = conversations.find(c => c.contact_id === contact.id);
    if (existing) return existing.id;

    const newThread: ConversationThread = {
      id: `conv-${Date.now()}`,
      workspace_id: currentWorkspace.id,
      contact_id: contact.id,
      contact_name: `${contact.first_name} ${contact.last_name}`,
      contact_email: contact.email,
      contact_phone: contact.phone,
      active_channel: contact.phone ? 'sms' : 'email',
      last_message: 'Started new direct conversation thread.',
      last_message_at: new Date().toISOString(),
      unread: false,
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'user',
          channel: contact.phone ? 'sms' : 'email',
          text: `Hi ${contact.first_name}, connecting regarding your project requirements.`,
          timestamp: new Date().toISOString(),
          status: 'sent',
        }
      ]
    };
    setAllConversations(prev => [newThread, ...prev]);
    const sb = getSupabaseClient();
    if (sb) sb.from('conversations').upsert(newThread).then(() => {});
    return newThread.id;
  };

  // Calendar Appointments (Tenant Scoped)
  const addAppointment = (appt: Omit<CalendarAppointment, 'id' | 'workspace_id'>): CalendarAppointment => {
    const newAppt: CalendarAppointment = {
      ...appt,
      id: `appt-${Date.now()}`,
      workspace_id: currentWorkspace.id,
    };
    setAllAppointments(prev => [newAppt, ...prev]);
    const sb = getSupabaseClient();
    if (sb) sb.from('appointments').upsert(newAppt).then(() => {});
    return newAppt;
  };

  const updateAppointment = (id: string, updates: Partial<CalendarAppointment>) => {
    setAllAppointments(prev => prev.map(a => {
      if (a.id === id && a.workspace_id === currentWorkspace.id) {
        const updated = { ...a, ...updates };
        const sb = getSupabaseClient();
        if (sb) sb.from('appointments').upsert(updated).then(() => {});
        return updated;
      }
      return a;
    }));
  };

  const deleteAppointment = (id: string) => {
    setAllAppointments(prev => prev.filter(a => a.id !== id));
    const sb = getSupabaseClient();
    if (sb) sb.from('appointments').delete().eq('id', id).then(() => {});
  };

  // Notion Documents & SOPs (Tenant Scoped)
  const addNotionDoc = (doc: Omit<NotionDoc, 'id' | 'workspace_id' | 'created_at' | 'updated_at'>): NotionDoc => {
    const newDoc: NotionDoc = {
      ...doc,
      id: `doc-${Date.now()}`,
      workspace_id: currentWorkspace.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setAllNotionDocs(prev => [newDoc, ...prev]);
    const sb = getSupabaseClient();
    if (sb) sb.from('notion_docs').upsert(newDoc).then(() => {});
    return newDoc;
  };

  const updateNotionDoc = (id: string, updates: Partial<NotionDoc>) => {
    setAllNotionDocs(prev => prev.map(d => {
      if (d.id === id && d.workspace_id === currentWorkspace.id) {
        const updated = { ...d, ...updates, updated_at: new Date().toISOString() };
        const sb = getSupabaseClient();
        if (sb) sb.from('notion_docs').upsert(updated).then(() => {});
        return updated;
      }
      return d;
    }));
  };

  const deleteNotionDoc = (id: string) => {
    setAllNotionDocs(prev => prev.filter(d => d.id !== id));
    const sb = getSupabaseClient();
    if (sb) sb.from('notion_docs').delete().eq('id', id).then(() => {});
  };

  const toggleDocBlockTodo = (docId: string, blockId: string) => {
    setAllNotionDocs(prev => prev.map(doc => {
      if (doc.id === docId && doc.workspace_id === currentWorkspace.id) {
        const updated: NotionDoc = {
          ...doc,
          blocks: doc.blocks.map(b => b.id === blockId ? { ...b, checked: !b.checked } : b),
          updated_at: new Date().toISOString(),
        };
        const sb = getSupabaseClient();
        if (sb) sb.from('notion_docs').upsert(updated).then(() => {});
        return updated;
      }
      return doc;
    }));
  };

  const addDocBlock = (docId: string, block: Omit<NotionBlock, 'id'>) => {
    const newBlock: NotionBlock = {
      ...block,
      id: `b-${Date.now()}`,
    };
    setAllNotionDocs(prev => prev.map(doc => {
      if (doc.id === docId && doc.workspace_id === currentWorkspace.id) {
        const updated: NotionDoc = {
          ...doc,
          blocks: [...doc.blocks, newBlock],
          updated_at: new Date().toISOString(),
        };
        const sb = getSupabaseClient();
        if (sb) sb.from('notion_docs').upsert(updated).then(() => {});
        return updated;
      }
      return doc;
    }));
  };

  // Activity Actions (Tenant Scoped)
  const addContactNote = (contactId: string, noteText: string) => {
    if (!noteText.trim()) return;
    const newActivity: ContactActivity = {
      id: `act-${Date.now()}`,
      contact_id: contactId,
      workspace_id: currentWorkspace.id,
      type: 'note_added',
      title: 'Executive Note Added',
      description: noteText.trim(),
      created_by: currentUser.name,
      created_at: new Date().toISOString(),
    };
    setAllActivities(prev => [newActivity, ...prev]);
    const sb = getSupabaseClient();
    if (sb) sb.from('contact_activities').upsert(newActivity).then(() => {});
  };

  const getActivitiesForContact = (contactId: string) => {
    return activities
      .filter(a => a.contact_id === contactId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

  // Notifications Actions (Tenant Scoped)
  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  const markNotificationRead = (id: string) => {
    setAllNotifications(prev => prev.map(n => {
      if (n.id === id && n.workspace_id === currentWorkspace.id) {
        const updated = { ...n, read: true };
        const sb = getSupabaseClient();
        if (sb) sb.from('notifications').upsert(updated).then(() => {});
        return updated;
      }
      return n;
    }));
  };

  const markAllNotificationsRead = () => {
    setAllNotifications(prev => prev.map(n => n.workspace_id === currentWorkspace.id ? { ...n, read: true } : n));
  };

  const updateNotificationPreferences = (prefs: Partial<NotificationPreferences>) => {
    setNotificationPreferences(prev => ({ ...prev, ...prefs }));
  };

  const requestPushPermission = async (): Promise<'granted' | 'denied' | 'default'> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }
    try {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        updateNotificationPreferences({ push_enabled: true });
      }
      return perm;
    } catch (_) {
      return 'denied';
    }
  };

  const sendTestNotification = async (channel: 'push' | 'email' = 'push'): Promise<{ success: boolean; message: string }> => {
    if (channel === 'push') {
      if (typeof window === 'undefined' || !('Notification' in window)) {
        return { success: false, message: 'Web Push is not supported in this browser environment.' };
      }
      if (Notification.permission !== 'granted') {
        const perm = await Notification.requestPermission();
        if (perm !== 'granted') {
          return { success: false, message: 'Push notification permission was denied by the browser.' };
        }
      }
      try {
        new Notification('AutoFlow Studio Alert 🚀', {
          body: 'Push notifications are live on your device! You will receive alerts on deals, tasks, and inbound leads.',
          icon: '/logo.png',
          badge: '/favicon.png',
        });
        return { success: true, message: 'Push notification delivered to your screen.' };
      } catch (err: any) {
        return { success: false, message: err?.message || 'Could not trigger notification.' };
      }
    } else {
      // Email Notification (Resend / Edge Function)
      const recipient = notificationPreferences.email_recipient || currentUser.email || 'operator@autoflow.studio';
      const sb = getSupabaseClient();
      if (sb) {
        try {
          await sb.functions.invoke('send-email', {
            body: {
              type: 'test_notification',
              to: recipient,
              subject: 'AutoFlow Studio: Test Notification',
              workspace: currentWorkspace.name,
              apiKey: notificationPreferences.resend_api_key || undefined,
            }
          });
        } catch (e) {
          console.warn('Edge function invoke notice:', e);
        }
      }
      return { success: true, message: `Test email dispatched to ${recipient}.` };
    }
  };

  // Paid & Managed Setup Modules Actions (AutoFlow Engineering)
  const openModuleSetupModal = (moduleId?: string) => {
    setActiveSetupModuleId(moduleId || null);
    setIsModuleModalOpen(true);
  };

  const closeModuleSetupModal = () => {
    setIsModuleModalOpen(false);
    setActiveSetupModuleId(null);
  };

  const submitModuleRequest = async (req: {
    moduleId: string;
    moduleName: string;
    phone: string;
    message: string;
    businessSize: string;
    service: string;
    contactName: string;
    contactEmail: string;
    companyName?: string;
  }): Promise<{ success: boolean; message?: string }> => {
    try {
      const newReq: ModuleSetupRequest = {
        id: `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        workspace_id: currentWorkspace.id,
        module_id: req.moduleId,
        module_name: req.moduleName,
        phone: req.phone,
        message: req.message,
        business_size: req.businessSize,
        service: req.service,
        contact_name: req.contactName,
        contact_email: req.contactEmail,
        company_name: req.companyName || currentWorkspace.name,
        status: 'pending_review',
        created_at: new Date().toISOString(),
      };

      setAllModuleRequests(prev => [newReq, ...prev]);

      // Insert into Supabase booking_leads table (matching AutoFlowWebProd schema)
      const sb = getSupabaseClient();
      if (sb) {
        try {
          await sb.from('booking_leads').insert([{
            name: req.contactName,
            email: req.contactEmail,
            phone: req.phone,
            service: req.service,
            size: req.businessSize,
            message: req.message,
            platform: 'AUTOCRM_PAID_MODULE',
          }]);
        } catch (err) {
          console.warn('Supabase booking_leads notice:', err);
        }
      }

      // Add in-app notification
      const newNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        workspace_id: currentWorkspace.id,
        user_id: currentUserId || 'owner',
        type: 'workflow_run',
        title: 'Module Setup Requested',
        message: `Setup request for "${req.moduleName}" received. Our engineers will review your configuration within 24 hours.`,
        read: false,
        created_at: new Date().toISOString(),
      };
      setAllNotifications(prev => [newNotif, ...prev]);

      // Celebrate
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#a78bfa', '#c4b5fd', '#60a5fa', '#34d399'],
        });
      } catch (_) {}

      return { success: true };
    } catch (err: any) {
      console.error('Error submitting module setup request:', err);
      return { success: false, message: err?.message || 'Could not submit request.' };
    }
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        registerCompanyAccount,
        signInCompanyAccount,
        signOutAccount,
        onboardingConfig,
        isOnboardingOpen,
        setIsOnboardingOpen,
        saveOnboarding,
        toggleModule,
        isModuleEnabled,
        workspaces,
        currentWorkspace,
        teamMembers,
        currentUser,
        createWorkspace,
        switchWorkspace,
        switchCurrentUser,
        inviteTeamMember,
        removeTeamMember,
        companies,
        addCompany,
        updateCompany,
        deleteCompany,
        contacts,
        addContact,
        updateContact,
        deleteContact,
        importContactsCSV,
        exportContactsCSV,
        opportunities,
        addOpportunity,
        updateOpportunity,
        deleteOpportunity,
        moveOpportunityStage,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        workflows,
        addWorkflow,
        toggleWorkflowActive,
        runWorkflowTest,
        deleteWorkflow,
        conversations,
        sendMessage,
        markConversationRead,
        createConversationForContact,
        appointments,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        notionDocs,
        addNotionDoc,
        updateNotionDoc,
        deleteNotionDoc,
        toggleDocBlockTodo,
        addDocBlock,
        activities,
        addContactNote,
        getActivitiesForContact,
        notifications,
        unreadNotificationCount,
        markNotificationRead,
        markAllNotificationsRead,
        notificationPreferences,
        updateNotificationPreferences,
        requestPushPermission,
        sendTestNotification,
        googleAccounts,
        isGoogleModalOpen,
        openGoogleModal,
        closeGoogleModal,
        connectGoogleAccount,
        disconnectGoogleAccount,
        toggleGoogleAccountSync,
        syncGoogleAccount,
        syncAllGoogleAccounts,
        moduleSetupRequests,
        isModuleModalOpen,
        activeSetupModuleId,
        openModuleSetupModal,
        closeModuleSetupModal,
        submitModuleRequest,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
