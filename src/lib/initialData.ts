import { 
  Workspace, TeamMember, Company, Contact, Opportunity, Task, ContactActivity, 
  AppNotification, OnboardingConfig, CRMModuleDefinition, WorkflowAutomation, 
  ConversationThread, CalendarAppointment, NotionDoc 
} from '../types';

export const INITIAL_WORKSPACE: Workspace = {
  id: 'ws-main-1',
  name: 'Acme Growth Labs',
  owner_id: 'user-alex',
  created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
};

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'mem-1',
    workspace_id: 'ws-main-1',
    user_id: 'user-alex',
    name: 'Alex Vance',
    email: 'alex@autoflow.studio',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'Owner',
    joined_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'mem-2',
    workspace_id: 'ws-main-1',
    user_id: 'user-sophia',
    name: 'Sophia Miller',
    email: 'sophia@autoflow.studio',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    role: 'Member',
    joined_at: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    id: 'mem-3',
    workspace_id: 'ws-main-1',
    user_id: 'user-jordan',
    name: 'Jordan Lee',
    email: 'jordan@autoflow.studio',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'Member',
    joined_at: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
];

export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'comp-1',
    workspace_id: 'ws-main-1',
    name: 'Vanguard AI Dynamics',
    website: 'https://vanguard-ai.io',
    industry: 'B2B SaaS & Artificial Intelligence',
    phone: '+1 (555) 234-8901',
    email: 'partnerships@vanguard-ai.io',
    address: '450 Mission St, Suite 1200, San Francisco, CA',
    notes: 'Fast-scaling enterprise customer looking to automate repetitive lead intake and CRM synchronization workflows.',
    created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'comp-2',
    workspace_id: 'ws-main-1',
    name: 'Apex Global Logistics',
    website: 'https://apexlogistics.com',
    industry: 'Supply Chain & Freight',
    phone: '+1 (555) 872-4410',
    email: 'contact@apexlogistics.com',
    address: '1200 Harbor Boulevard, Long Beach, CA',
    notes: 'Operating across 4 continents. Wants automated status dispatch and task handoffs.',
    created_at: new Date(Date.now() - 22 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'comp-3',
    workspace_id: 'ws-main-1',
    name: 'Solaria BioLabs',
    website: 'https://solariabio.org',
    industry: 'Biotechnology & Health',
    phone: '+1 (555) 671-9923',
    email: 'hello@solariabio.org',
    address: '88 Tech Park Drive, Cambridge, MA',
    notes: 'Series B funded bio-tech researching automated clinical trials intake.',
    created_at: new Date(Date.now() - 18 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'comp-4',
    workspace_id: 'ws-main-1',
    name: 'Hyperion Design Studio',
    website: 'https://hyperionstudio.design',
    industry: 'Creative Agencies & Branding',
    phone: '+1 (555) 341-7788',
    email: 'hi@hyperionstudio.design',
    address: '22 King Street, London, UK',
    notes: 'Boutique branding agency seeking client CRM and project milestone tracking.',
    created_at: new Date(Date.now() - 12 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
];

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'cont-1',
    workspace_id: 'ws-main-1',
    first_name: 'Elena',
    last_name: 'Rostova',
    email: 'elena@vanguard-ai.io',
    phone: '+1 (555) 342-9912',
    company_id: 'comp-1',
    company_name: 'Vanguard AI Dynamics',
    job_title: 'Chief Technology Officer',
    notes: 'Direct decision maker for tech infrastructure. Enthusiastic about automated pipeline triggers.',
    tags: ['Enterprise', 'Decision Maker', 'High Priority'],
    custom_fields: {
      'Preferred Channel': 'Email & Slack',
      'Budget Tier': '$50,000 - $100,000',
      'Contract Term': 'Annual Enterprise',
    },
    created_at: new Date(Date.now() - 24 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'cont-2',
    workspace_id: 'ws-main-1',
    first_name: 'Marcus',
    last_name: 'Vance',
    email: 'marcus.vance@apexlogistics.com',
    phone: '+1 (555) 891-3401',
    company_id: 'comp-2',
    company_name: 'Apex Global Logistics',
    job_title: 'VP of Global Operations',
    notes: 'Met at SupplyChain Expo. High intent on streamlining order pipeline.',
    tags: ['Inbound', 'Mid-Market'],
    custom_fields: {
      'Fleet Size': '420 Carriers',
      'ERP System': 'SAP Integration',
    },
    created_at: new Date(Date.now() - 21 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: 'cont-3',
    workspace_id: 'ws-main-1',
    first_name: 'Clara',
    last_name: 'Oswald',
    email: 'clara@solariabio.org',
    phone: '+1 (555) 672-0044',
    company_id: 'comp-3',
    company_name: 'Solaria BioLabs',
    job_title: 'Head of Clinical Partnerships',
    notes: 'Requires HIPAA and SOC2 compliance addendum before signing.',
    tags: ['HealthTech', 'Needs Security Review'],
    custom_fields: {
      'Security Level': 'HIPAA Required',
      'Target Go-Live': 'Q1 2027',
    },
    created_at: new Date(Date.now() - 17 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'cont-4',
    workspace_id: 'ws-main-1',
    first_name: 'Julian',
    last_name: 'Mercer',
    email: 'julian@hyperionstudio.design',
    phone: '+1 (555) 902-1144',
    company_id: 'comp-4',
    company_name: 'Hyperion Design Studio',
    job_title: 'Founding Partner & Creative Lead',
    notes: 'Closed custom design system automation package. Smooth onboarding.',
    tags: ['VIP Client', 'Closed Customer'],
    custom_fields: {
      'Retainer Model': 'Monthly Dedicated',
      'Team Seats': '12 seats',
    },
    created_at: new Date(Date.now() - 11 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'cont-5',
    workspace_id: 'ws-main-1',
    first_name: 'Siddharth',
    last_name: 'Patel',
    email: 'sid.patel@horizonfin.co',
    phone: '+1 (555) 438-7654',
    job_title: 'Managing Director',
    notes: 'Looking for multi-account CRM with automated client appointment reminders.',
    tags: ['FinTech', 'High Value'],
    custom_fields: {
      'AUM Range': '$250M+',
      'Jurisdiction': 'US / UK',
    },
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  }
];

export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    workspace_id: 'ws-main-1',
    name: 'Vanguard AI — Enterprise Automation Pipeline',
    contact_id: 'cont-1',
    contact_name: 'Elena Rostova',
    company_id: 'comp-1',
    company_name: 'Vanguard AI Dynamics',
    deal_value: 75000,
    expected_closing_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    stage: 'Proposal',
    owner_id: 'user-alex',
    owner_name: 'Alex Vance',
    notes: 'Draft proposal presented. Under review by Elena & their legal counsel.',
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'opp-2',
    workspace_id: 'ws-main-1',
    name: 'Apex Global — Operations Dispatch Workflow',
    contact_id: 'cont-2',
    contact_name: 'Marcus Vance',
    company_id: 'comp-2',
    company_name: 'Apex Global Logistics',
    deal_value: 48000,
    expected_closing_date: new Date(Date.now() + 25 * 86400000).toISOString().split('T')[0],
    stage: 'Qualified',
    owner_id: 'user-sophia',
    owner_name: 'Sophia Miller',
    notes: 'Completed technical discovery. Requirements match our automation core.',
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'opp-3',
    workspace_id: 'ws-main-1',
    name: 'Solaria BioLabs — Clinical Intake Engine',
    contact_id: 'cont-3',
    contact_name: 'Clara Oswald',
    company_id: 'comp-3',
    company_name: 'Solaria BioLabs',
    deal_value: 92000,
    expected_closing_date: new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0],
    stage: 'Contacted',
    owner_id: 'user-alex',
    owner_name: 'Alex Vance',
    notes: 'First discovery call scheduled. Clara requested custom security compliance checklist.',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'opp-4',
    workspace_id: 'ws-main-1',
    name: 'Hyperion Client Portal & Task Suite',
    contact_id: 'cont-4',
    contact_name: 'Julian Mercer',
    company_id: 'comp-4',
    company_name: 'Hyperion Design Studio',
    deal_value: 36000,
    expected_closing_date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    stage: 'Won',
    owner_id: 'user-jordan',
    owner_name: 'Jordan Lee',
    notes: 'Signed 1-year annual agreement! First invoice dispatched and settled.',
    created_at: new Date(Date.now() - 12 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'opp-5',
    workspace_id: 'ws-main-1',
    name: 'Horizon FinTech — Wealth Client Hub',
    contact_id: 'cont-5',
    contact_name: 'Siddharth Patel',
    deal_value: 64000,
    expected_closing_date: new Date(Date.now() + 20 * 86400000).toISOString().split('T')[0],
    stage: 'New Lead',
    owner_id: 'user-alex',
    owner_name: 'Alex Vance',
    notes: 'Inbound enquiry from website product demo request.',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

const now = new Date();
const todayStr = now.toISOString().split('T')[0];
const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const threeDaysAgoStr = new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0];
const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
const inThreeDaysStr = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    workspace_id: 'ws-main-1',
    title: 'Review Vanguard custom API security requirements',
    description: 'Ensure SOC2 Type II documentation is bundled into the proposal appendix.',
    status: 'In Progress',
    priority: 'High',
    due_date: todayStr, // DUE TODAY
    assigned_to: 'user-alex',
    assigned_to_name: 'Alex Vance',
    related_contact_id: 'cont-1',
    related_contact_name: 'Elena Rostova',
    related_company_id: 'comp-1',
    related_company_name: 'Vanguard AI Dynamics',
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'task-2',
    workspace_id: 'ws-main-1',
    title: 'Prepare Apex Logistics technical architecture diagram',
    description: 'Diagram automated webhook triggers connecting their fleet DB to AutoFlow Studio.',
    status: 'To Do',
    priority: 'High',
    due_date: tomorrowStr,
    assigned_to: 'user-sophia',
    assigned_to_name: 'Sophia Miller',
    related_contact_id: 'cont-2',
    related_contact_name: 'Marcus Vance',
    related_company_id: 'comp-2',
    related_company_name: 'Apex Global Logistics',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'task-3',
    workspace_id: 'ws-main-1',
    title: 'Follow up on Solaria BioLabs compliance packet',
    description: 'Check in with Clara regarding clinical validation timeline.',
    status: 'To Do',
    priority: 'Medium',
    due_date: threeDaysAgoStr, // OVERDUE
    assigned_to: 'user-alex',
    assigned_to_name: 'Alex Vance',
    related_contact_id: 'cont-3',
    related_contact_name: 'Clara Oswald',
    related_company_id: 'comp-3',
    related_company_name: 'Solaria BioLabs',
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'task-4',
    workspace_id: 'ws-main-1',
    title: 'Complete Hyperion Design onboarding workflow setup',
    description: 'Configure automated workspace channels and invite project directors.',
    status: 'Completed',
    priority: 'Medium',
    due_date: yesterdayStr,
    assigned_to: 'user-jordan',
    assigned_to_name: 'Jordan Lee',
    related_contact_id: 'cont-4',
    related_contact_name: 'Julian Mercer',
    related_company_id: 'comp-4',
    related_company_name: 'Hyperion Design Studio',
    created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'task-5',
    workspace_id: 'ws-main-1',
    title: 'Schedule quarterly pipeline review with executive team',
    description: 'Summarize Q4 projected revenue and automation targets.',
    status: 'To Do',
    priority: 'Low',
    due_date: inThreeDaysStr,
    assigned_to: 'user-alex',
    assigned_to_name: 'Alex Vance',
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

export const INITIAL_ACTIVITIES: ContactActivity[] = [
  {
    id: 'act-1',
    contact_id: 'cont-1',
    workspace_id: 'ws-main-1',
    type: 'contact_created',
    title: 'Contact Created',
    description: 'Elena Rostova was added to contacts from Vanguard AI Dynamics.',
    created_by: 'Alex Vance',
    created_at: new Date(Date.now() - 24 * 86400000).toISOString(),
  },
  {
    id: 'act-2',
    contact_id: 'cont-1',
    workspace_id: 'ws-main-1',
    type: 'note_added',
    title: 'Executive Note Added',
    description: 'Discussed architectural fit. High interest in webhooks and Zapier/n8n bridge.',
    created_by: 'Alex Vance',
    created_at: new Date(Date.now() - 16 * 86400000).toISOString(),
  },
  {
    id: 'act-3',
    contact_id: 'cont-1',
    workspace_id: 'ws-main-1',
    type: 'stage_changed',
    title: 'Sales Stage Advanced to Proposal',
    description: 'Opportunity value confirmed at $75,000.',
    created_by: 'Alex Vance',
    created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
  {
    id: 'act-4',
    contact_id: 'cont-1',
    workspace_id: 'ws-main-1',
    type: 'task_created',
    title: 'Task Created: Security Audit Review',
    description: 'Assigned to Alex Vance due today.',
    created_by: 'Alex Vance',
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: 'act-5',
    contact_id: 'cont-2',
    workspace_id: 'ws-main-1',
    type: 'contact_created',
    title: 'Contact Created',
    description: 'Marcus Vance created from conference lead capture.',
    created_by: 'Sophia Miller',
    created_at: new Date(Date.now() - 21 * 86400000).toISOString(),
  },
  {
    id: 'act-6',
    contact_id: 'cont-4',
    workspace_id: 'ws-main-1',
    type: 'stage_changed',
    title: 'Deal Won! ($36,000)',
    description: 'Hyperion Client Portal & Task Suite closed successfully.',
    created_by: 'Alex Vance',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    workspace_id: 'ws-main-1',
    user_id: 'user-alex',
    type: 'due_soon',
    title: 'Task Due Today',
    message: 'Review Vanguard custom API security requirements is due today.',
    read: false,
    task_id: 'task-1',
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: 'notif-2',
    workspace_id: 'ws-main-1',
    user_id: 'user-alex',
    type: 'overdue',
    title: 'Task Overdue',
    message: 'Follow up on Solaria BioLabs compliance packet is 3 days overdue.',
    read: false,
    task_id: 'task-3',
    created_at: new Date(Date.now() - 8 * 3600000).toISOString(),
  },
  {
    id: 'notif-3',
    workspace_id: 'ws-main-1',
    user_id: 'user-alex',
    type: 'task_assigned',
    title: 'New Task Assigned',
    message: 'Schedule quarterly pipeline review was assigned to you.',
    read: true,
    task_id: 'task-5',
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
];

// ─── Module Catalog for Dynamic CRM Construction ───
export const CRM_MODULES_CATALOG: CRMModuleDefinition[] = [
  {
    id: 'contacts',
    name: 'Contacts & Accounts',
    description: 'Track customer profiles, custom attributes, tags, and complete activity history.',
    icon: 'Users',
    category: 'core',
    defaultEnabled: true,
  },
  {
    id: 'companies',
    name: 'Company Directory',
    description: 'Organize multi-contact client organizations, websites, industries, and addresses.',
    icon: 'Building2',
    category: 'core',
    defaultEnabled: true,
  },
  {
    id: 'pipeline',
    name: 'Sales Pipeline (Kanban)',
    description: 'Visual deal stages, deal velocity, closing date forecasts, and drag-and-drop movement.',
    icon: 'KanbanSquare',
    category: 'core',
    defaultEnabled: true,
  },
  {
    id: 'workflows',
    name: 'Automation Workflows',
    description: 'Event-driven triggers, multi-step drip email/SMS sequences, auto-task assigners, and webhooks.',
    icon: 'Zap',
    category: 'automation',
    defaultEnabled: true,
  },
  {
    id: 'conversations',
    name: 'Unified Omnichannel Inbox',
    description: 'Real-time messaging hub combining SMS, Email, WhatsApp, and Webchat.',
    icon: 'MessageSquare',
    category: 'automation',
    defaultEnabled: true,
  },
  {
    id: 'calendar',
    name: 'Smart Scheduling & Calendar',
    description: 'Appointment booking, meeting link generation, availability slots, and calendar sync.',
    icon: 'Calendar',
    category: 'automation',
    defaultEnabled: true,
  },
  {
    id: 'docs',
    name: 'Documents & SOPs',
    description: 'Rich block-based client wikis, proposals, meeting notes, callout blocks, and checklists.',
    icon: 'FileText',
    category: 'workspace',
    defaultEnabled: true,
  },
  {
    id: 'tasks',
    name: 'Tasks & Team SOPs',
    description: 'Granular to-dos, due date warnings, priority badges, and one-click completion.',
    icon: 'CheckSquare',
    category: 'core',
    defaultEnabled: true,
  },
  {
    id: 'team',
    name: 'Team & RBAC Access',
    description: 'Workspace owner and member role privileges, member invitations, and audit safety.',
    icon: 'ShieldCheck',
    category: 'admin',
    defaultEnabled: true,
  },
];

// ─── Default Onboarding Configuration ───
export const DEFAULT_ONBOARDING_CONFIG: OnboardingConfig = {
  role: 'Founder & CEO',
  companySize: '11 - 50 employees',
  teamSize: '5 - 10 members',
  industry: 'B2B SaaS & Tech',
  enabledModules: ['contacts', 'companies', 'pipeline', 'workflows', 'conversations', 'calendar', 'docs', 'tasks', 'team'],
  completed: true,
  configuredAt: new Date().toISOString(),
};

// ─── GoHighLevel 1-to-1 Seed Workflows ───
export const INITIAL_WORKFLOWS: WorkflowAutomation[] = [
  {
    id: 'wf-1',
    workspace_id: 'ws-main-1',
    name: 'Inbound Lead Speed-to-Lead Auto-Responder',
    description: 'Instantly dispatches welcome SMS, notifies account rep, and schedules follow-up task.',
    trigger_type: 'contact_created',
    trigger_condition: 'Any new lead contact created via web form or CSV import',
    active: true,
    runs_count: 38,
    last_run_at: new Date(Date.now() - 3 * 3600000).toISOString(),
    created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    actions: [
      {
        id: 'act-wf-1',
        type: 'send_sms',
        title: 'Send Instant SMS to Contact',
        config: { template: "Hey {{contact.first_name}}, thanks for reaching out! When is a good time for a 10-min intro call today?" }
      },
      {
        id: 'act-wf-2',
        type: 'assign_user',
        title: 'Round-Robin Assign to Sales Lead',
        config: { assignee: 'Sophia Miller', role: 'Sales Lead' }
      },
      {
        id: 'act-wf-3',
        type: 'create_task',
        title: 'Generate Initial Discovery Call Task',
        config: { title: 'Call new lead within 15 minutes', priority: 'High', due: 'today' }
      }
    ]
  },
  {
    id: 'wf-2',
    workspace_id: 'ws-main-1',
    name: 'Opportunity Stage: Proposal Sent -> Automated Drip',
    description: 'Triggers client contract email, notifies Slack channel, and sets check-in reminder in 48 hours.',
    trigger_type: 'deal_stage_changed',
    trigger_condition: 'Opportunity moved to stage "Proposal"',
    active: true,
    runs_count: 14,
    last_run_at: new Date(Date.now() - 22 * 3600000).toISOString(),
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    actions: [
      {
        id: 'act-wf-4',
        type: 'send_email',
        title: 'Send Executive Proposal Packet',
        config: { subject: "Your Customized AutoFlow Solution Proposal", template: "Executive_Proposal_v2" }
      },
      {
        id: 'act-wf-5',
        type: 'wait_delay',
        title: 'Wait 48 Hours',
        config: { duration: '48h' }
      },
      {
        id: 'act-wf-6',
        type: 'create_task',
        title: 'Proposal Follow-up Call & Feedback Check',
        config: { title: 'Follow-up on proposal review', priority: 'High', due: 'in 2 days' }
      }
    ]
  },
  {
    id: 'wf-3',
    workspace_id: 'ws-main-1',
    name: 'Deal Won -> VIP Customer Onboarding Kickoff',
    description: 'Automatically tags contact as VIP Client, assigns dedicated manager, and creates Notion workspace.',
    trigger_type: 'deal_stage_changed',
    trigger_condition: 'Opportunity moved to stage "Won"',
    active: true,
    runs_count: 9,
    last_run_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 18 * 86400000).toISOString(),
    actions: [
      {
        id: 'act-wf-7',
        type: 'add_tag',
        title: 'Apply Tag "Active Customer VIP"',
        config: { tag: 'Active Customer VIP' }
      },
      {
        id: 'act-wf-8',
        type: 'send_email',
        title: 'Send Onboarding Welcome Kit & Portal Access',
        config: { subject: "Welcome to AutoFlow Studio — Let's get started", template: "Customer_Onboarding_Welcome" }
      },
      {
        id: 'act-wf-9',
        type: 'webhook',
        title: 'Trigger Billing & Provisioning Webhook',
        config: { url: 'https://api.autoflow.studio/v1/provisioning/customer-signed', method: 'POST' }
      }
    ]
  },
  {
    id: 'wf-4',
    workspace_id: 'ws-main-1',
    name: 'Stale Lead 7-Day Re-Engagement sequence',
    description: 'Detects opportunities with no activity for 7 days and pings contact via multi-channel follow-up.',
    trigger_type: 'task_overdue',
    trigger_condition: 'Follow-up task overdue or inactive for > 7 days',
    active: false,
    runs_count: 5,
    last_run_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
    actions: [
      {
        id: 'act-wf-10',
        type: 'send_sms',
        title: 'Send Re-engagement Check-in SMS',
        config: { template: "Hey {{contact.first_name}}, saw things got busy last week. Did you still want to review the CRM roadmap?" }
      }
    ]
  }
];

// ─── GoHighLevel 1-to-1 Unified Conversations / Inbox ───
export const INITIAL_CONVERSATIONS: ConversationThread[] = [
  {
    id: 'conv-1',
    workspace_id: 'ws-main-1',
    contact_id: 'cont-1',
    contact_name: 'Elena Rostova',
    contact_email: 'elena@vanguard-ai.io',
    contact_phone: '+1 (555) 342-9912',
    active_channel: 'email',
    last_message: "Our security team just approved the SOC2 review. Can we finalize the annual enterprise proposal this Thursday?",
    last_message_at: new Date(Date.now() - 25 * 60000).toISOString(),
    unread: true,
    messages: [
      {
        id: 'msg-1',
        sender: 'user',
        channel: 'email',
        text: "Hi Elena, thrilled to share the initial proposal for Vanguard AI. Attached you'll find the architecture plan.",
        timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
        status: 'delivered'
      },
      {
        id: 'msg-2',
        sender: 'contact',
        channel: 'email',
        text: "Thanks Alex! Reviewing with our VP of Infrastructure now.",
        timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
        status: 'read'
      },
      {
        id: 'msg-3',
        sender: 'contact',
        channel: 'email',
        text: "Our security team just approved the SOC2 review. Can we finalize the annual enterprise proposal this Thursday?",
        timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
        status: 'read'
      }
    ]
  },
  {
    id: 'conv-2',
    workspace_id: 'ws-main-1',
    contact_id: 'cont-2',
    contact_name: 'Marcus Vance',
    contact_email: 'marcus.vance@apexlogistics.com',
    contact_phone: '+1 (555) 891-3401',
    active_channel: 'sms',
    last_message: "Sounds great. Just booked the meeting slot via your AutoFlow calendar link.",
    last_message_at: new Date(Date.now() - 3 * 3600000).toISOString(),
    unread: false,
    messages: [
      {
        id: 'msg-4',
        sender: 'user',
        channel: 'sms',
        text: "Marcus, here is our calendar link to review the carrier integration specs: https://autoflow.studio/book/alex",
        timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
        status: 'delivered'
      },
      {
        id: 'msg-5',
        sender: 'contact',
        channel: 'sms',
        text: "Sounds great. Just booked the meeting slot via your AutoFlow calendar link.",
        timestamp: new Date(Date.now() - 3 * 3600000).toISOString(),
        status: 'read'
      }
    ]
  },
  {
    id: 'conv-3',
    workspace_id: 'ws-main-1',
    contact_id: 'cont-4',
    contact_name: 'Julian Mercer',
    contact_email: 'julian@hyperionstudio.design',
    contact_phone: '+1 (555) 902-1144',
    active_channel: 'whatsapp',
    last_message: "Team loves the Notion integration! Quick question on custom brand themes.",
    last_message_at: new Date(Date.now() - 8 * 3600000).toISOString(),
    unread: false,
    messages: [
      {
        id: 'msg-6',
        sender: 'user',
        channel: 'whatsapp',
        text: "Welcome aboard Julian! Your Hyperion workspace is fully configured.",
        timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
        status: 'read'
      },
      {
        id: 'msg-7',
        sender: 'contact',
        channel: 'whatsapp',
        text: "Team loves the Notion integration! Quick question on custom brand themes.",
        timestamp: new Date(Date.now() - 8 * 3600000).toISOString(),
        status: 'read'
      }
    ]
  },
  {
    id: 'conv-4',
    workspace_id: 'ws-main-1',
    contact_id: 'cont-5',
    contact_name: 'Siddharth Patel',
    contact_email: 'sid.patel@horizonfin.co',
    contact_phone: '+1 (555) 438-7654',
    active_channel: 'webchat',
    last_message: "Hi, I submitted the demo form. Are you able to support automated appointment booking for 15 advisors?",
    last_message_at: new Date(Date.now() - 1 * 3600000).toISOString(),
    unread: true,
    messages: [
      {
        id: 'msg-8',
        sender: 'contact',
        channel: 'webchat',
        text: "Hi, I submitted the demo form. Are you able to support automated appointment booking for 15 advisors?",
        timestamp: new Date(Date.now() - 1 * 3600000).toISOString(),
        status: 'delivered'
      }
    ]
  }
];

// ─── GoHighLevel / Notion Smart Appointments ───
export const INITIAL_APPOINTMENTS: CalendarAppointment[] = [
  {
    id: 'appt-1',
    workspace_id: 'ws-main-1',
    title: 'Executive Proposal Finalization Call',
    contact_id: 'cont-1',
    contact_name: 'Elena Rostova (Vanguard AI)',
    assigned_to: 'user-alex',
    assigned_to_name: 'Alex Vance',
    date: todayStr,
    start_time: '14:00',
    end_time: '15:00',
    location_type: 'google_meet',
    meeting_link: 'https://meet.google.com/xyz-aflow-demo',
    notes: 'Walk through agreement line items, SLA specifications, and go-live date.',
    status: 'confirmed'
  },
  {
    id: 'appt-2',
    workspace_id: 'ws-main-1',
    title: 'Technical Integration Architecture Session',
    contact_id: 'cont-2',
    contact_name: 'Marcus Vance (Apex Logistics)',
    assigned_to: 'user-sophia',
    assigned_to_name: 'Sophia Miller',
    date: tomorrowStr,
    start_time: '10:30',
    end_time: '11:30',
    location_type: 'zoom',
    meeting_link: 'https://zoom.us/j/9982341120',
    notes: 'Review webhook latency requirements and dispatch payload structure.',
    status: 'confirmed'
  },
  {
    id: 'appt-3',
    workspace_id: 'ws-main-1',
    title: 'HIPAA & Compliance Scoping Discovery',
    contact_id: 'cont-3',
    contact_name: 'Clara Oswald (Solaria BioLabs)',
    assigned_to: 'user-alex',
    assigned_to_name: 'Alex Vance',
    date: inThreeDaysStr,
    start_time: '16:00',
    end_time: '16:45',
    location_type: 'google_meet',
    meeting_link: 'https://meet.google.com/med-hipaa-audit',
    notes: 'Involve security auditor to confirm HIPAA data separation.',
    status: 'confirmed'
  }
];

// ─── Notion 1-to-1 Documents & SOPs ───
export const INITIAL_NOTION_DOCS: NotionDoc[] = [
  {
    id: 'doc-1',
    workspace_id: 'ws-main-1',
    title: 'Enterprise Sales Playbook & Qualification Criteria',
    icon: '⚡',
    cover_gradient: 'linear-gradient(135deg, #18191d 0%, #202128 50%, #2e263d 100%)',
    category: 'playbook',
    properties: {
      status: 'Published',
      owner: 'Alex Vance',
      department: 'Revenue & Sales',
      last_edited: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
    },
    created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    blocks: [
      {
        id: 'b-1',
        type: 'callout',
        content: 'Executive Guideline: Every deal above $50k deal value must complete a technical architecture review within 72 hours of the Qualified stage.',
        calloutIcon: '💡'
      },
      {
        id: 'b-2',
        type: 'h1',
        content: 'BANT Qualification Protocol'
      },
      {
        id: 'b-3',
        type: 'p',
        content: 'Before advancing an opportunity to Proposal, confirm Budget, Authority, Need, and Timeline through direct discovery dialogue.'
      },
      {
        id: 'b-4',
        type: 'todo',
        content: 'Confirm budget ceiling and decision timeline with executive sponsor',
        checked: true
      },
      {
        id: 'b-5',
        type: 'todo',
        content: 'Map out all stakeholders (CTO, VP RevOps, Legal Counsel, Procurement)',
        checked: true
      },
      {
        id: 'b-6',
        type: 'todo',
        content: 'Log all discovery notes into Contact Activity Timeline before booking demo',
        checked: false
      },
      {
        id: 'b-7',
        type: 'h2',
        content: 'Discounts and Approval Thresholds'
      },
      {
        id: 'b-8',
        type: 'bullet',
        content: 'Standard quarterly contracts: 0% discount allowed.'
      },
      {
        id: 'b-9',
        type: 'bullet',
        content: 'Annual multi-seat contracts: Up to 15% discount with Founder approval.'
      }
    ]
  },
  {
    id: 'doc-2',
    workspace_id: 'ws-main-1',
    title: 'Client Onboarding SOP & 14-Day Handshake Protocol',
    icon: '📋',
    cover_gradient: 'linear-gradient(135deg, #111216 0%, #1c1d24 60%, #1f1b2b 100%)',
    category: 'sop',
    properties: {
      status: 'Published',
      owner: 'Sophia Miller',
      department: 'Client Success & Ops',
      last_edited: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    },
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    blocks: [
      {
        id: 'b-10',
        type: 'callout',
        content: 'Objective: Maximize time-to-first-value (TTFV) to under 48 hours from contract signature.',
        calloutIcon: '🚀'
      },
      {
        id: 'b-11',
        type: 'h1',
        content: 'Phase 1: Day 1 - Day 3 Provisioning'
      },
      {
        id: 'b-12',
        type: 'todo',
        content: 'Provision client workspace environment & set up RBAC roles',
        checked: true
      },
      {
        id: 'b-13',
        type: 'todo',
        content: 'Send welcome credentials via encrypted channel',
        checked: true
      },
      {
        id: 'b-14',
        type: 'todo',
        content: 'Schedule 45-minute live technical walkthrough with their core admins',
        checked: false
      },
      {
        id: 'b-15',
        type: 'h2',
        content: 'Escalation Contacts'
      },
      {
        id: 'b-16',
        type: 'p',
        content: 'If client onboarding triggers any webhook failures, escalate to the Engineering Ops on-call lead immediately.'
      }
    ]
  },
  {
    id: 'doc-3',
    workspace_id: 'ws-main-1',
    title: 'Q4 Enterprise Deal Reviews & Meeting Notes',
    icon: '📝',
    cover_gradient: 'linear-gradient(135deg, #14151a 0%, #191b22 50%, #262136 100%)',
    category: 'meeting_notes',
    properties: {
      status: 'In Review',
      owner: 'Alex Vance',
      department: 'Executive Team',
      last_edited: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
    },
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    blocks: [
      {
        id: 'b-17',
        type: 'callout',
        content: 'Confidential: Internal strategy review regarding Vanguard AI Dynamics and Solaria BioLabs.',
        calloutIcon: '🔒'
      },
      {
        id: 'b-18',
        type: 'h1',
        content: 'Executive Summary'
      },
      {
        id: 'b-19',
        type: 'p',
        content: 'Total weighted pipeline stands at $315,000 across 5 active opportunities. Win rate improved by 14% post-Notion + GHL workflow rollout.'
      },
      {
        id: 'b-20',
        type: 'todo',
        content: 'Finalize Vanguard AI proposal signoff by Thursday 2 PM',
        checked: false
      },
      {
        id: 'b-21',
        type: 'todo',
        content: 'Review Apex Logistics webhook benchmark latency metrics',
        checked: true
      }
    ]
  }
];

// ─── Industry Presets for Dynamic Onboarding Construction ───
export const INDUSTRY_TEMPLATES: Record<string, {
  name: string;
  recommendedModules: string[];
  sampleCompanies: Company[];
  sampleContacts: Contact[];
  sampleOpportunities: Opportunity[];
}> = {
  'B2B SaaS & Tech': {
    name: 'B2B SaaS & Tech Stack',
    recommendedModules: ['contacts', 'companies', 'pipeline', 'workflows', 'conversations', 'calendar', 'docs', 'tasks', 'team'],
    sampleCompanies: INITIAL_COMPANIES,
    sampleContacts: INITIAL_CONTACTS,
    sampleOpportunities: INITIAL_OPPORTUNITIES,
  },
  'Marketing & Creative Agency': {
    name: 'Marketing & Agency Operating Suite',
    recommendedModules: ['contacts', 'companies', 'pipeline', 'workflows', 'conversations', 'calendar', 'docs', 'tasks'],
    sampleCompanies: [
      {
        id: 'comp-agency-1',
        workspace_id: 'ws-main-1',
        name: 'Velox Media Agency',
        website: 'https://veloxmedia.agency',
        industry: 'Growth Marketing & Paid Social',
        phone: '+1 (555) 771-0021',
        email: 'hello@veloxmedia.agency',
        address: '100 SoHo Broadway, New York, NY',
        notes: 'Handling $2M/mo in performance ad spend. Seeking client retainer CRM.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ],
    sampleContacts: [
      {
        id: 'cont-agency-1',
        workspace_id: 'ws-main-1',
        first_name: 'Damon',
        last_name: 'Cross',
        email: 'damon@veloxmedia.agency',
        phone: '+1 (555) 771-0022',
        company_name: 'Velox Media Agency',
        job_title: 'Head of Media Buying',
        tags: ['Agency Lead', 'Retainer Prospect'],
        custom_fields: { 'Monthly Ad Spend': '$250k', 'Primary Channel': 'Meta & TikTok' },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ],
    sampleOpportunities: [
      {
        id: 'opp-agency-1',
        workspace_id: 'ws-main-1',
        name: 'Velox Media — Full Retainer Automation & Reporting Hub',
        deal_value: 60000,
        expected_closing_date: new Date(Date.now() + 18 * 86400000).toISOString().split('T')[0],
        stage: 'Qualified',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ]
  },
  'Real Estate & Property Management': {
    name: 'Real Estate Dealflow & Property Suite',
    recommendedModules: ['contacts', 'companies', 'pipeline', 'conversations', 'calendar', 'tasks'],
    sampleCompanies: [
      {
        id: 'comp-re-1',
        workspace_id: 'ws-main-1',
        name: 'Blackwood Capital Properties',
        website: 'https://blackwoodproperties.com',
        industry: 'Commercial & Luxury Residential',
        phone: '+1 (555) 993-2211',
        email: 'acquisitions@blackwoodproperties.com',
        address: '500 Brickell Ave, Miami, FL',
        notes: 'Commercial portfolio with 18 residential developments across South Florida.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ],
    sampleContacts: [
      {
        id: 'cont-re-1',
        workspace_id: 'ws-main-1',
        first_name: 'Christian',
        last_name: 'Cole',
        email: 'c.cole@blackwoodproperties.com',
        phone: '+1 (555) 993-2212',
        company_name: 'Blackwood Capital Properties',
        job_title: 'Director of Asset Acquisitions',
        tags: ['Commercial Real Estate', 'High Net Worth'],
        custom_fields: { 'Target Cap Rate': '6.8%', 'Property Class': 'Class A Multifamily' },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ],
    sampleOpportunities: [
      {
        id: 'opp-re-1',
        workspace_id: 'ws-main-1',
        name: 'Brickell Bay Luxury Residential Acquisition Phase II',
        deal_value: 185000,
        expected_closing_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        stage: 'Proposal',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ]
  },
  'E-Commerce & DTC Brands': {
    name: 'E-Commerce & DTC Funnel CRM',
    recommendedModules: ['contacts', 'pipeline', 'workflows', 'conversations', 'tasks'],
    sampleCompanies: [],
    sampleContacts: [],
    sampleOpportunities: []
  },
  'Healthcare & Clinics': {
    name: 'Healthcare Practice & Patient Scheduling',
    recommendedModules: ['contacts', 'calendar', 'conversations', 'tasks', 'team'],
    sampleCompanies: [],
    sampleContacts: [],
    sampleOpportunities: []
  },
  'Legal & Financial Services': {
    name: 'Legal & Wealth Advisory CRM',
    recommendedModules: ['contacts', 'companies', 'pipeline', 'calendar', 'docs', 'tasks', 'team'],
    sampleCompanies: [],
    sampleContacts: [],
    sampleOpportunities: []
  },
  'Home Services & Contracting': {
    name: 'Home Services Dispatch & Leads Hub',
    recommendedModules: ['contacts', 'pipeline', 'workflows', 'conversations', 'calendar', 'tasks'],
    sampleCompanies: [],
    sampleContacts: [],
    sampleOpportunities: []
  },
  'Consulting & Professional Services': {
    name: 'Consulting Practice OS',
    recommendedModules: ['contacts', 'companies', 'pipeline', 'calendar', 'docs', 'tasks', 'team'],
    sampleCompanies: [],
    sampleContacts: [],
    sampleOpportunities: []
  }
};
