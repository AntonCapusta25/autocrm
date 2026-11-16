-- ============================================================================
-- AutoFlow Studio — Multi-Tenant SaaS CRM
-- PostgreSQL Schema & Tenant-Isolated Row Level Security (RLS)
-- ============================================================================

DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS contact_activities CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS opportunities CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS workspace_members CASCADE;
DROP TABLE IF EXISTS onboarding_configs CASCADE;
DROP TABLE IF EXISTS workflows CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS notion_docs CASCADE;
DROP TABLE IF EXISTS workspaces CASCADE;

-- 1. Workspaces (Tenants / Companies)
CREATE TABLE workspaces (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    owner_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Workspace Team Members
CREATE TABLE workspace_members (
    id TEXT PRIMARY KEY,
    workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    avatar TEXT,
    role TEXT CHECK (role IN ('Owner', 'Member')) DEFAULT 'Member',
    joined_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tenant Onboarding & Modular CRM Configuration
CREATE TABLE onboarding_configs (
    workspace_id TEXT PRIMARY KEY REFERENCES workspaces(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    company_size TEXT NOT NULL,
    team_size TEXT NOT NULL,
    industry TEXT NOT NULL,
    enabled_modules TEXT[] DEFAULT '{}',
    completed BOOLEAN DEFAULT TRUE,
    configured_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Companies Directory (Per Tenant)
CREATE TABLE companies (
    id TEXT PRIMARY KEY,
    workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    website TEXT,
    industry TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Contacts Directory (Per Tenant)
CREATE TABLE contacts (
    id TEXT PRIMARY KEY,
    workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company_id TEXT,
    company_name TEXT,
    job_title TEXT,
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    custom_fields JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Sales Opportunities / Pipeline (Per Tenant)
CREATE TABLE opportunities (
    id TEXT PRIMARY KEY,
    workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    contact_id TEXT,
    contact_name TEXT,
    company_id TEXT,
    company_name TEXT,
    deal_value NUMERIC(12, 2) DEFAULT 0,
    expected_closing_date TEXT,
    stage TEXT CHECK (stage IN ('New Lead', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost')) DEFAULT 'New Lead',
    owner_id TEXT,
    owner_name TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Tasks & Execution (Per Tenant)
CREATE TABLE tasks (
    id TEXT PRIMARY KEY,
    workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK (status IN ('To Do', 'In Progress', 'Completed')) DEFAULT 'To Do',
    priority TEXT CHECK (priority IN ('Low', 'Medium', 'High')) DEFAULT 'Medium',
    due_date TEXT,
    assigned_to TEXT,
    assigned_to_name TEXT,
    related_contact_id TEXT,
    related_contact_name TEXT,
    related_company_id TEXT,
    related_company_name TEXT,
    related_project_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Contact Activity Timeline (Per Tenant)
CREATE TABLE contact_activities (
    id TEXT PRIMARY KEY,
    contact_id TEXT NOT NULL,
    workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    created_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Workspace Notifications (Per Tenant)
CREATE TABLE notifications (
    id TEXT PRIMARY KEY,
    workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    task_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Automation Workflows (Per Tenant)
CREATE TABLE workflows (
    id TEXT PRIMARY KEY,
    workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    trigger_type TEXT NOT NULL,
    trigger_condition TEXT,
    actions JSONB DEFAULT '[]'::jsonb,
    active BOOLEAN DEFAULT TRUE,
    runs_count INTEGER DEFAULT 0,
    last_run_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Omnichannel Conversations (Per Tenant)
CREATE TABLE conversations (
    id TEXT PRIMARY KEY,
    workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    contact_id TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    contact_email TEXT,
    contact_phone TEXT,
    active_channel TEXT DEFAULT 'email',
    last_message TEXT,
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    unread BOOLEAN DEFAULT FALSE,
    messages JSONB DEFAULT '[]'::jsonb
);

-- 12. Smart Appointments & Calendar (Per Tenant)
CREATE TABLE appointments (
    id TEXT PRIMARY KEY,
    workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    contact_id TEXT,
    contact_name TEXT,
    assigned_to TEXT,
    assigned_to_name TEXT,
    date TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    meeting_link TEXT,
    location_type TEXT DEFAULT 'google_meet',
    notes TEXT,
    status TEXT DEFAULT 'confirmed'
);

-- 13. Documents & SOPs (Per Tenant)
CREATE TABLE notion_docs (
    id TEXT PRIMARY KEY,
    workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    icon TEXT DEFAULT '📝',
    cover_gradient TEXT,
    category TEXT DEFAULT 'sop',
    properties JSONB DEFAULT '{}'::jsonb,
    blocks JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Multi-Tenant Row Level Security (RLS) Isolation
-- ============================================================================

-- Helper function: verifies the authenticated user owns or belongs to the target workspace
CREATE OR REPLACE FUNCTION public.user_has_workspace_access(target_ws_id TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM workspaces w
    WHERE w.id = target_ws_id
      AND w.owner_id = auth.uid()::text
  )
  OR EXISTS (
    SELECT 1 FROM workspace_members wm
    WHERE wm.workspace_id = target_ws_id
      AND (wm.user_id = auth.uid()::text OR wm.email = (auth.jwt() ->> 'email'))
  );
$$;

ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notion_docs ENABLE ROW LEVEL SECURITY;

-- Workspaces: Owners can create/manage; members can view their assigned workspaces
CREATE POLICY "Tenant workspace select" ON workspaces
  FOR SELECT TO authenticated
  USING (owner_id = auth.uid()::text OR public.user_has_workspace_access(id));

CREATE POLICY "Tenant workspace insert" ON workspaces
  FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid()::text);

CREATE POLICY "Tenant workspace update" ON workspaces
  FOR UPDATE TO authenticated
  USING (owner_id = auth.uid()::text)
  WITH CHECK (owner_id = auth.uid()::text);

CREATE POLICY "Tenant workspace delete" ON workspaces
  FOR DELETE TO authenticated
  USING (owner_id = auth.uid()::text);

-- Scoped tenant tables: strictly isolated to members of that workspace_id
CREATE POLICY "Tenant members isolation" ON workspace_members
  FOR ALL TO authenticated
  USING (public.user_has_workspace_access(workspace_id))
  WITH CHECK (public.user_has_workspace_access(workspace_id));

CREATE POLICY "Tenant onboarding isolation" ON onboarding_configs
  FOR ALL TO authenticated
  USING (public.user_has_workspace_access(workspace_id))
  WITH CHECK (public.user_has_workspace_access(workspace_id));

CREATE POLICY "Tenant companies isolation" ON companies
  FOR ALL TO authenticated
  USING (public.user_has_workspace_access(workspace_id))
  WITH CHECK (public.user_has_workspace_access(workspace_id));

CREATE POLICY "Tenant contacts isolation" ON contacts
  FOR ALL TO authenticated
  USING (public.user_has_workspace_access(workspace_id))
  WITH CHECK (public.user_has_workspace_access(workspace_id));

CREATE POLICY "Tenant opportunities isolation" ON opportunities
  FOR ALL TO authenticated
  USING (public.user_has_workspace_access(workspace_id))
  WITH CHECK (public.user_has_workspace_access(workspace_id));

CREATE POLICY "Tenant tasks isolation" ON tasks
  FOR ALL TO authenticated
  USING (public.user_has_workspace_access(workspace_id))
  WITH CHECK (public.user_has_workspace_access(workspace_id));

CREATE POLICY "Tenant activities isolation" ON contact_activities
  FOR ALL TO authenticated
  USING (public.user_has_workspace_access(workspace_id))
  WITH CHECK (public.user_has_workspace_access(workspace_id));

CREATE POLICY "Tenant notifications isolation" ON notifications
  FOR ALL TO authenticated
  USING (public.user_has_workspace_access(workspace_id))
  WITH CHECK (public.user_has_workspace_access(workspace_id));

CREATE POLICY "Tenant workflows isolation" ON workflows
  FOR ALL TO authenticated
  USING (public.user_has_workspace_access(workspace_id))
  WITH CHECK (public.user_has_workspace_access(workspace_id));

CREATE POLICY "Tenant conversations isolation" ON conversations
  FOR ALL TO authenticated
  USING (public.user_has_workspace_access(workspace_id))
  WITH CHECK (public.user_has_workspace_access(workspace_id));

CREATE POLICY "Tenant appointments isolation" ON appointments
  FOR ALL TO authenticated
  USING (public.user_has_workspace_access(workspace_id))
  WITH CHECK (public.user_has_workspace_access(workspace_id));

CREATE POLICY "Tenant notion_docs isolation" ON notion_docs
  FOR ALL TO authenticated
  USING (public.user_has_workspace_access(workspace_id))
  WITH CHECK (public.user_has_workspace_access(workspace_id));

-- ─── 14. Enterprise Module Setup Requests & Booking Leads (AutoFlowWebProd Sync) ───
CREATE TABLE IF NOT EXISTS booking_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT,
  size TEXT,
  message TEXT,
  platform TEXT DEFAULT 'AUTOCRM_PAID_MODULE',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE booking_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert to booking_leads" ON booking_leads
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated read booking_leads" ON booking_leads
  FOR SELECT TO authenticated
  USING (true);

