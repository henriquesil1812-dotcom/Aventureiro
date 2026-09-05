import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { MobileNavigation } from './components/MobileNavigation';
import { LoginView } from './components/LoginView';
import { DashboardView } from './components/DashboardView';
import { AdventurersView } from './components/AdventurersView';
import { SpecialtiesView } from './components/SpecialtiesView';
import { TestsView } from './components/TestsView';
import { ScheduleAndRemindersView } from './components/ScheduleAndRemindersView';
import { UnitsManagementView } from './components/UnitsManagementView';
import { AdminUsersView } from './components/AdminUsersView';
import { AdventurerProfileModal } from './components/AdventurerProfileModal';
import { NewAdventurerModal } from './components/NewAdventurerModal';
import { AwardSpecialtyModal } from './components/AwardSpecialtyModal';
import { NewTestModal } from './components/NewTestModal';
import { PrintableReportModal } from './components/PrintableReportModal';
import { Adventurer } from './types';

const MainAppContent: React.FC = () => {
  const { currentUser, currentTab, setCurrentTab, canEdit } = useApp();

  // Modals state
  const [selectedAdventurer, setSelectedAdventurer] = useState<Adventurer | null>(null);
  const [showNewAdventurerModal, setShowNewAdventurerModal] = useState(false);
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [awardPreselectedId, setAwardPreselectedId] = useState<string | undefined>(undefined);
  const [showNewTestModal, setShowNewTestModal] = useState(false);
  const [testPreselectedId, setTestPreselectedId] = useState<string | undefined>(undefined);
  const [showPrintReportModal, setShowPrintReportModal] = useState(false);

  // If not logged in, show Branded Login View
  if (!currentUser) {
    return <LoginView />;
  }

  const handleOpenAwardModal = (adventurerId?: string) => {
    setAwardPreselectedId(adventurerId);
    setShowAwardModal(true);
  };

  const handleOpenTestModal = (adventurerId?: string) => {
    setTestPreselectedId(adventurerId);
    setShowNewTestModal(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans text-slate-900 selection:bg-purple-200 selection:text-purple-950 pb-16 md:pb-6">
      
      {/* Top Application Header with Navigation and Profile Control */}
      <Header currentTab={currentTab} onTabChange={(tab) => setCurrentTab(tab)} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'dashboard' && (
          <DashboardView
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenNewAdventurer={() => setShowNewAdventurerModal(true)}
            onOpenNewSpecialty={() => handleOpenAwardModal()}
            onOpenNewTest={() => handleOpenTestModal()}
            onOpenNewReminder={() => setCurrentTab('schedule')}
          />
        )}

        {currentTab === 'adventurers' && (
          <AdventurersView
            onSelectAdventurer={(adv) => setSelectedAdventurer(adv)}
            onOpenNewAdventurer={() => setShowNewAdventurerModal(true)}
            onOpenPrintReport={() => setShowPrintReportModal(true)}
          />
        )}

        {currentTab === 'units' && (
          <UnitsManagementView />
        )}

        {currentTab === 'specialties' && (
          <SpecialtiesView
            onOpenAwardModal={() => handleOpenAwardModal()}
          />
        )}

        {currentTab === 'tests' && (
          <TestsView
            onOpenNewTest={() => handleOpenTestModal()}
          />
        )}

        {currentTab === 'schedule' && (
          <ScheduleAndRemindersView />
        )}

        {currentTab === 'admin' && (
          <AdminUsersView />
        )}
      </main>

      {/* Mobile Floating Bottom Bar */}
      <MobileNavigation currentTab={currentTab} onTabChange={(tab) => setCurrentTab(tab)} />

      {/* MODALS */}
      {selectedAdventurer && (
        <AdventurerProfileModal
          adventurer={selectedAdventurer}
          onClose={() => setSelectedAdventurer(null)}
          onOpenAwardSpecialty={(advId) => handleOpenAwardModal(advId)}
          onOpenNewTest={(advId) => handleOpenTestModal(advId)}
        />
      )}

      {showNewAdventurerModal && canEdit && (
        <NewAdventurerModal
          onClose={() => setShowNewAdventurerModal(false)}
        />
      )}

      {showAwardModal && canEdit && (
        <AwardSpecialtyModal
          preselectedAdventurerId={awardPreselectedId}
          onClose={() => {
            setShowAwardModal(false);
            setAwardPreselectedId(undefined);
          }}
        />
      )}

      {showNewTestModal && canEdit && (
        <NewTestModal
          preselectedAdventurerId={testPreselectedId}
          onClose={() => {
            setShowNewTestModal(false);
            setTestPreselectedId(undefined);
          }}
        />
      )}

      {showPrintReportModal && (
        <PrintableReportModal
          onClose={() => setShowPrintReportModal(false)}
        />
      )}

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
