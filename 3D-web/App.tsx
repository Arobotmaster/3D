import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ConsumerView } from './components/ConsumerView';
import { FarmDashboard } from './components/FarmDashboard';
import { AIAssistant } from './components/AIAssistant';
import { CommunityView } from './components/CommunityView';
import { FarmTechHub } from './components/FarmTechHub';
import { FarmOrders } from './components/FarmOrders';
import { DesignerView } from './components/DesignerView';
import { UserRole } from './types';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>(UserRole.CONSUMER);
  const [activeTab, setActiveTab] = useState('create');

  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
  };

  const renderContent = () => {
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
      
      <main className="animate-in fade-in duration-500">
        {renderContent()}
      </main>

      {/* Footer watermark for the Demo */}
      <footer className="fixed bottom-4 right-4 opacity-50 hover:opacity-100 transition-opacity">
        <p className="text-[10px] text-slate-600 font-mono">NEURAFAB v0.1.0-alpha | 构建版本: 2025.05.19</p>
      </footer>
    </div>
  );
};

export default App;