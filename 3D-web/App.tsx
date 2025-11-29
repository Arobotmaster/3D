import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { SubNavbar } from './components/SubNavbar';
import { ConsumerView } from './components/ConsumerView';
import { FarmDashboard } from './components/FarmDashboard';
import { AIAssistant } from './components/AIAssistant';
import { CommunityView } from './components/CommunityView';
import { FarmTechHub } from './components/FarmTechHub';
import { FarmOrders } from './components/FarmOrders';
import { DesignerView } from './components/DesignerView';
import { PlatformIntro } from './components/PlatformIntro';
import { UserRole } from './types';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>(UserRole.CONSUMER);
  const [activeTab, setActiveTab] = useState('create');

  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
  };

  const handleIntroNavigate = (role: UserRole, tab: string) => {
    setUserRole(role);
    setActiveTab(tab);
  };

  const renderContent = () => {
    if (activeTab === 'intro') return <PlatformIntro onNavigate={handleIntroNavigate} />;

    if (userRole === UserRole.CONSUMER) {
      if (activeTab === 'create' || activeTab === 'track') return <ConsumerView />; // Handle internal toggle in ConsumerView, but if set from nav, default to ConsumerView
      if (activeTab === 'community') return <CommunityView />;
    } else if (userRole === UserRole.FARM_OWNER) {
      if (activeTab === 'dashboard') return <FarmDashboard />;
      if (activeTab === 'orders') return <FarmOrders />;
      if (activeTab === 'repair') return <AIAssistant />;
      if (activeTab === 'hub') return <FarmTechHub />;
    } else if (userRole === UserRole.DESIGNER) {
      // Pass the activeTab to DesignerView to handle sub-navigation (tools, library, earnings)
      return <DesignerView activeTab={activeTab} />;
    }
    return <ConsumerView />;
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
      <Navbar
        currentRole={userRole}
        onRoleChange={handleRoleChange}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <SubNavbar
        currentRole={userRole}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="animate-in fade-in duration-500">
        {renderContent()}
      </main>

      {/* Footer watermark for the Demo */}
      <footer className="fixed bottom-4 right-4 text-right hover:opacity-100 transition-opacity">
        <p className="text-[10px] text-slate-600 font-mono">NEURAFAB v0.1.0-alpha | 构建版本: 2025.05.19</p>
        <p className="text-sm text-blue-400 font-bold font-mono mt-1 bg-slate-900/80 px-2 py-1 rounded border border-blue-500/30 shadow-lg shadow-blue-500/10">
          联系我们: 13209169744 (微信同号)
        </p>
      </footer>
    </div>
  );
};

export default App;