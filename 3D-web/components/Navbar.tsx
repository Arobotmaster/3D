import React from 'react';
import { UserRole } from '../types';
import { Hexagon, ShoppingBag, Users, LayoutDashboard, BookOpen, ClipboardList, Wrench, PenTool, Box, Palette } from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRole, onRoleChange, activeTab, onTabChange }) => {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onTabChange(currentRole === UserRole.CONSUMER ? 'create' : 'dashboard')}>
          <Hexagon className="h-8 w-8 text-blue-500 fill-blue-500/20" />
          <span className="text-xl font-bold tracking-tight text-white">
            Neurafab<span className="text-blue-500">.ai</span>
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          {currentRole === UserRole.CONSUMER && (
            <>
              <NavItem icon={<ShoppingBag size={18}/>} label="设计与创造" active={activeTab === 'create'} onClick={() => onTabChange('create')} />
              <NavItem icon={<Users size={18}/>} label="社区 & 制造者" active={activeTab === 'community'} onClick={() => onTabChange('community')} />
            </>
          )}
          
          {currentRole === UserRole.FARM_OWNER && (
             <>
              <NavItem icon={<LayoutDashboard size={18}/>} label="仪表盘" active={activeTab === 'dashboard'} onClick={() => onTabChange('dashboard')} />
              <NavItem icon={<ClipboardList size={18}/>} label="接单中心" active={activeTab === 'orders'} onClick={() => onTabChange('orders')} />
              <NavItem icon={<BookOpen size={18}/>} label="技术极客" active={activeTab === 'hub'} onClick={() => onTabChange('hub')} />
              <NavItem icon={<Wrench size={18}/>} label="AI 维修助手" active={activeTab === 'repair'} onClick={() => onTabChange('repair')} />
            </>
          )}

          {currentRole === UserRole.DESIGNER && (
            <>
              <NavItem icon={<PenTool size={18}/>} label="AI 工具箱" active={activeTab === 'tools'} onClick={() => onTabChange('tools')} />
              <NavItem icon={<Box size={18}/>} label="我的模型库" active={activeTab === 'library'} onClick={() => onTabChange('library')} />
              <NavItem icon={<Palette size={18}/>} label="创作者收益" active={activeTab === 'earnings'} onClick={() => onTabChange('earnings')} />
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
           <div className="flex bg-slate-900 rounded-full p-1 border border-slate-800">
              <button 
                onClick={() => { onRoleChange(UserRole.CONSUMER); onTabChange('create'); }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${currentRole === UserRole.CONSUMER ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'text-slate-400 hover:text-white'}`}
              >
                消费者
              </button>
              <button 
                onClick={() => { onRoleChange(UserRole.DESIGNER); onTabChange('tools'); }}
                 className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${currentRole === UserRole.DESIGNER ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25' : 'text-slate-400 hover:text-white'}`}
              >
                设计师
              </button>
              <button 
                onClick={() => { onRoleChange(UserRole.FARM_OWNER); onTabChange('dashboard'); }}
                 className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${currentRole === UserRole.FARM_OWNER ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25' : 'text-slate-400 hover:text-white'}`}
              >
                农场主
              </button>
           </div>
        </div>
      </div>
    </nav>
  );
};

const NavItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 text-sm font-medium transition-colors ${active ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}
  >
    {icon}
    {label}
  </button>
);