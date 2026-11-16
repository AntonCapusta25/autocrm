export type PipelineStage = 
  | 'New Lead' 
  | 'Contacted' 
  | 'Qualified' 
  | 'Proposal' 
  | 'Won' 
  | 'Lost';

export type TaskStatus = 'To Do' | 'In Progress' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High';
export type UserRole = 'Owner' | 'Member';

export type NotionDatabaseView = 'table' | 'board' | 'list' | 'calendar' | 'gallery';

export interface Workspace {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
}

export interface TeamMember {
  id: string;
  workspace_id: string;
  user_id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  joined_at: string;
}

export interface Company {
  id: string;
  workspace_id: string;
  name: string;
  website?: string;
  industry?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  workspace_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company_id?: string;
  company_name?: string;
  job_title?: string;
  notes?: string;
  tags: string[];
  custom_fields: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface Opportunity {
  id: string;
  workspace_id: string;
  name: string;
  contact_id?: string;
  contact_name?: string;
  company_id?: string;
  company_name?: string;
  deal_value: number;
  expected_closing_date: string;
  stage: PipelineStage;
  owner_id?: string;
  owner_name?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  workspace_id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string; // YYYY-MM-DD
  assigned_to?: string;
  assigned_to_name?: string;
  related_contact_id?: string;
  related_contact_name?: string;
  related_company_id?: string;
  related_company_name?: string;
  related_project_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactActivity {
  id: string;
  contact_id: string;
  workspace_id: string;
  type: 'contact_created' | 'note_added' | 'task_created' | 'task_completed' | 'stage_changed' | 'message_sent' | 'workflow_triggered';
  title: string;
  description?: string;
  created_by: string;
  created_at: string;
}

export interface AppNotification {
  id: string;
  workspace_id: string;
  user_id: string;
  type: 'task_assigned' | 'due_soon' | 'overdue' | 'deal_won' | 'workflow_run';
  title: string;
  message: string;
  read: boolean;
  task_id?: string;
  created_at: string;
}

export interface NotificationPreferences {
  notify_on_assignment: boolean;
  notify_due_soon: boolean;
  notify_overdue: boolean;
  due_soon_hours: number;
}

// ─── Interactive Onboarding & Modular CRM Construction ───
export interface OnboardingConfig {
  role: string;
  companySize: string;
  teamSize: string;
  industry: string;
  enabledModules: string[];
  completed: boolean;
  configuredAt?: string;
}

export type CRMModuleId = 
  | 'contacts'
  | 'companies'
  | 'pipeline'
  | 'workflows'
  | 'conversations'
  | 'calendar'
  | 'docs'
  | 'tasks'
  | 'team';

export interface CRMModuleDefinition {
  id: CRMModuleId;
  name: string;
  description: string;
  icon: string;
  category: 'core' | 'automation' | 'workspace' | 'admin';
  defaultEnabled: boolean;
}

// ─── Paid & Managed Setup Modules (AutoFlow Engineering) ───
export type PaidModuleId = 
  | 'ai_voice' 
  | 'whatsapp_cloud' 
  | 'custom_erp' 
  | 'lead_scraping' 
  | 'custom_agents';

export interface PaidModuleDefinition {
  id: PaidModuleId;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  priceNote: string;
  setupTime: string;
  serviceKey: string;
  deliverables: string[];
}

export interface ModuleSetupRequest {
  id: string;
  workspace_id: string;
  module_id: string;
  module_name: string;
  phone: string;
  message: string;
  business_size: string;
  service: string;
  contact_name: string;
  contact_email: string;
  company_name?: string;
  status: 'pending_review' | 'engineer_assigned' | 'in_configuration' | 'live';
  created_at: string;
}

// ─── Automations & Workflows ───
export type WorkflowTriggerType = 
  | 'contact_created'
  | 'deal_stage_changed'
  | 'task_overdue'
  | 'appointment_booked'
  | 'tag_added'
  | 'form_submitted';

export type WorkflowActionType = 
  | 'send_email'
  | 'send_sms'
  | 'wait_delay'
  | 'assign_user'
  | 'add_tag'
  | 'create_task'
  | 'webhook';

export interface WorkflowAction {
  id: string;
  type: WorkflowActionType;
  title: string;
  config: Record<string, string>;
}

export interface WorkflowAutomation {
  id: string;
  workspace_id: string;
  name: string;
  description: string;
  trigger_type: WorkflowTriggerType;
  trigger_condition: string;
  actions: WorkflowAction[];
  active: boolean;
  runs_count: number;
  last_run_at?: string;
  created_at: string;
}

// ─── GoHighLevel 1-to-1 Unified Conversations / Inbox ───
export type MessageChannel = 'sms' | 'email' | 'whatsapp' | 'webchat';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'contact';
  channel: MessageChannel;
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

export interface ConversationThread {
  id: string;
  workspace_id: string;
  contact_id: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  active_channel: MessageChannel;
  last_message: string;
  last_message_at: string;
  unread: boolean;
  messages: ChatMessage[];
}

// ─── GoHighLevel / Notion Smart Appointments & Calendar ───
export interface CalendarAppointment {
  id: string;
  workspace_id: string;
  title: string;
  contact_id?: string;
  contact_name?: string;
  assigned_to?: string;
  assigned_to_name?: string;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  meeting_link?: string;
  location_type: 'google_meet' | 'zoom' | 'phone' | 'in_person';
  notes?: string;
  status: 'confirmed' | 'cancelled' | 'completed';
}

// ─── Notion 1-to-1 Block Documents & SOPs ───
export type NotionBlockType = 'h1' | 'h2' | 'p' | 'callout' | 'todo' | 'bullet' | 'toggle' | 'divider';

export interface NotionBlock {
  id: string;
  type: NotionBlockType;
  content: string;
  checked?: boolean;
  calloutIcon?: string;
}

export interface NotionDoc {
  id: string;
  workspace_id: string;
  title: string;
  icon: string;
  cover_gradient: string;
  category: 'sop' | 'playbook' | 'proposal' | 'meeting_notes';
  properties: {
    status: 'Draft' | 'In Review' | 'Published' | 'Archived';
    owner: string;
    department: string;
    last_edited: string;
  };
  blocks: NotionBlock[];
  created_at: string;
  updated_at: string;
}
