import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { DashboardView } from './components/Dashboard/DashboardView';
import { ContactsView } from './components/Contacts/ContactsView';
import { CompaniesView } from './components/Companies/CompaniesView';
import { PipelineView } from './components/Pipeline/PipelineView';
import { TasksView } from './components/Tasks/TasksView';
import { TeamView } from './components/Team/TeamView';
import { WorkflowsView } from './components/Automations/WorkflowsView';
import { ConversationsView } from './components/Conversations/ConversationsView';
import { CalendarView } from './components/Calendar/CalendarView';
import { NotionDocsView } from './components/Docs/NotionDocsView';
import { OnboardingModal } from './components/Onboarding/OnboardingModal';
import { NotificationDrawer } from './components/Notifications/NotificationDrawer';
import { ContactModal } from './components/Contacts/ContactModal';
import { TaskModal } from './components/Tasks/TaskModal';
import { OpportunityModal } from './components/Pipeline/OpportunityModal';
import { AuthView } from './components/Auth/AuthView';
import { PaidModuleRequestModal } from './components/Modules/PaidModuleRequestModal';
import { ModulesMarketplaceModal } from './components/Modules/ModulesMarketplaceModal';
import { DataTransferModal } from './components/ImportExport/DataTransferModal';
import { WorkspaceIntroTourModal } from './components/Onboarding/WorkspaceIntroTourModal';
import { TryOnMobileModal } from './components/Mobile/TryOnMobileModal';
import { MobilePwaPromptBanner } from './components/Mobile/MobilePwaPromptBanner';
import { Contact, Company } from './types';

const MainAppContent: React.FC = () => {
  const { 
    isAuthenticated, isOnboardingOpen, setIsOnboardingOpen, isModuleEnabled,
    isModuleModalOpen, activeSetupModuleId, openModuleSetupModal, closeModuleSetupModal,
    currentWorkspace
  } = useApp();
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');

  // Global Modals State
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);
  const [quickContactModalOpen, setQuickContactModalOpen] = useState(false);
  const [quickTaskModalOpen, setQuickTaskModalOpen] = useState(false);
  const [quickDealModalOpen, setQuickDealModalOpen] = useState(false);
  const [marketplaceModalOpen, setMarketplaceModalOpen] = useState(false);
  const [dataTransferModalOpen, setDataTransferModalOpen] = useState(false);
  const [mobileModalOpen, setMobileModalOpen] = useState(false);
  const [tourModalOpen, setTourModalOpen] = useState(false);

  // Auto-launch workspace education tour once per workspace
  React.useEffect(() => {
    if (isAuthenticated && currentWorkspace?.id) {
      const tourKey = `autoflow_tour_seen_${currentWorkspace.id}`;
      const seen = localStorage.getItem(tourKey);
      if (!seen) {
        setTourModalOpen(true);
      }
    }
  }, [isAuthenticated, currentWorkspace?.id]);

  // Pre-selected entities for task modal
  const [taskInitialContact, setTaskInitialContact] = useState<Contact | null>(null);
  const [taskInitialCompany, setTaskInitialCompany] = useState<Company | null>(null);

  // Selected contact for detail drawer
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);

  if (!isAuthenticated) {
    return <AuthView />;
  }

  // Cross-component handlers
  const handleOpenNewTaskForContact = (contact: Contact) => {
    setTaskInitialContact(contact);
    setTaskInitialCompany(null);
    setQuickTaskModalOpen(true);
  };

  const handleOpenNewTaskForCompany = (company: Company) => {
    setTaskInitialCompany(company);
    setTaskInitialContact(null);
    setQuickTaskModalOpen(true);
  };

  const handleOpenContactProfile = (contactId: string) => {
    setSelectedContactId(contactId);
    setActiveTab('contacts');
  };

  return (
    <div className="app-layout">
      {/* Notion Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={(tab) => setActiveTab(tab)} 
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onOpenMarketplace={() => setMarketplaceModalOpen(true)}
        onOpenMobile={() => setMobileModalOpen(true)}
        onOpenDataTransfer={() => setDataTransferModalOpen(true)}
        onOpenTour={() => setTourModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="main-content-area">
        <Navbar 
          activeTab={activeTab}
          onOpenNotifications={() => setNotifDrawerOpen(true)}
          onOpenOnboarding={() => setIsOnboardingOpen(true)}
          onOpenMobile={() => setMobileModalOpen(true)}
          onOpenDataTransfer={() => setDataTransferModalOpen(true)}
          onOpenTour={() => setTourModalOpen(true)}
        />

        <main className="content-viewport">
          {activeTab === 'dashboard' && (
            <DashboardView 
              onNavigate={(tab) => setActiveTab(tab as NavTab)}
              onOpenNewContact={() => setQuickContactModalOpen(true)}
              onOpenNewTask={() => {
                setTaskInitialContact(null);
                setTaskInitialCompany(null);
                setQuickTaskModalOpen(true);
              }}
              onOpenNewDeal={() => setQuickDealModalOpen(true)}
              onSelectContact={handleOpenContactProfile}
            />
          )}

          {activeTab === 'contacts' && isModuleEnabled('contacts') && (
            <ContactsView 
              onOpenNewTaskForContact={handleOpenNewTaskForContact}
              selectedContactId={selectedContactId}
              onClearSelectedContact={() => setSelectedContactId(null)}
            />
          )}

          {activeTab === 'companies' && isModuleEnabled('companies') && (
            <CompaniesView 
              onOpenNewTaskForCompany={handleOpenNewTaskForCompany}
              onOpenContactProfile={handleOpenContactProfile}
            />
          )}

          {activeTab === 'pipeline' && isModuleEnabled('pipeline') && (
            <PipelineView />
          )}

          {activeTab === 'workflows' && isModuleEnabled('workflows') && (
            <WorkflowsView />
          )}

          {activeTab === 'conversations' && isModuleEnabled('conversations') && (
            <ConversationsView />
          )}

          {activeTab === 'calendar' && isModuleEnabled('calendar') && (
            <CalendarView />
          )}

          {activeTab === 'docs' && isModuleEnabled('docs') && (
            <NotionDocsView />
          )}

          {activeTab === 'tasks' && isModuleEnabled('tasks') && (
            <TasksView />
          )}

          {activeTab === 'team' && (
            <TeamView />
          )}
        </main>
      </div>

      {/* Interactive Onboarding Wizard Modal */}
      {isOnboardingOpen && (
        <OnboardingModal onClose={() => setIsOnboardingOpen(false)} />
      )}

      {notifDrawerOpen && (
        <NotificationDrawer 
          onClose={() => setNotifDrawerOpen(false)} 
          onOpenTask={() => {
            setNotifDrawerOpen(false);
            setActiveTab('tasks');
          }}
        />
      )}

      {quickContactModalOpen && (
        <ContactModal 
          onClose={() => setQuickContactModalOpen(false)} 
        />
      )}

      {quickTaskModalOpen && (
        <TaskModal 
          initialContact={taskInitialContact}
          initialCompany={taskInitialCompany}
          onClose={() => {
            setQuickTaskModalOpen(false);
            setTaskInitialContact(null);
            setTaskInitialCompany(null);
          }}
        />
      )}

      {quickDealModalOpen && (
        <OpportunityModal 
          onClose={() => setQuickDealModalOpen(false)} 
        />
      )}

      {/* Modules & Add-Ons Ecosystem Marketplace Modal */}
      {marketplaceModalOpen && (
        <ModulesMarketplaceModal 
          isOpen={marketplaceModalOpen}
          onClose={() => setMarketplaceModalOpen(false)}
          onRequestSetup={(modId) => {
            setMarketplaceModalOpen(false);
            openModuleSetupModal(modId);
          }}
        />
      )}

      {/* Paid Enterprise Module Request Flow (Typeform / MultiStep Style) */}
      <PaidModuleRequestModal 
        isOpen={isModuleModalOpen}
        onClose={closeModuleSetupModal}
        initialModuleId={activeSetupModuleId}
      />

      {/* CSV Data Transfer Center (Import & Export with 3D Auth-Style Instructions) */}
      <DataTransferModal 
        isOpen={dataTransferModalOpen}
        onClose={() => setDataTransferModalOpen(false)}
        initialMode="import"
        initialEntity="contacts"
      />

      {/* Workspace Education & Product Tour Popover */}
      <WorkspaceIntroTourModal 
        isOpen={tourModalOpen}
        onClose={() => {
          setTourModalOpen(false);
          if (currentWorkspace?.id) {
            localStorage.setItem(`autoflow_tour_seen_${currentWorkspace.id}`, 'true');
          }
        }}
        onOpenMobileGuide={() => setMobileModalOpen(true)}
      />

      {/* Try on Mobile & PWA Setup Flow */}
      <TryOnMobileModal 
        isOpen={mobileModalOpen}
        onClose={() => setMobileModalOpen(false)}
      />

      {/* Persistent & Dismissible Floating Mobile PWA Pop-Up Prompt */}
      <MobilePwaPromptBanner 
        onOpenMobileModal={() => setMobileModalOpen(true)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
};

export default App;
