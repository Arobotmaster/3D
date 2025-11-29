import React from 'react';
import { UserRole } from '../types';
import { Hexagon, ShoppingBag, Users, LayoutDashboard, BookOpen, ClipboardList, Wrench, PenTool, Box, Palette, Info, Package } from 'lucide-react';

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
          {activeTab !== 'intro' && (
            <>
              {currentRole === UserRole.CONSUMER && (
                <>
                  <NavItem icon={<ShoppingBag size={18} />} label="设计与创造" active={activeTab === 'create'} onClick={() => onTabChange('create')} />
                  <NavItem icon={<Package size={18} />} label="订单追踪" active={activeTab === 'track'} onClick={() => onTabChange('track')} />
                  <NavItem icon={<Users size={18} />} label="社区 & 制造者" active={activeTab === 'community'} onClick={() => onTabChange('community')} />
                </>
              )}

              {currentRole === UserRole.FARM_OWNER && (
                <>
                  <NavItem icon={<LayoutDashboard size={18} />} label="仪表盘" active={activeTab === 'dashboard'} onClick={() => onTabChange('dashboard')} />
                  <NavItem icon={<ClipboardList size={18} />} label="接单中心" active={activeTab === 'orders'} onClick={() => onTabChange('orders')} />
                  <NavItem icon={<BookOpen size={18} />} label="技术极客" active={activeTab === 'hub'} onClick={() => onTabChange('hub')} />
                  <NavItem icon={<Wrench size={18} />} label="AI 维修助手" active={activeTab === 'repair'} onClick={() => onTabChange('repair')} />
                </>
              )}

              {currentRole === UserRole.DESIGNER && (
                <>
                  <NavItem icon={<PenTool size={18} />} label="AI 工具箱" active={activeTab === 'tools'} onClick={() => onTabChange('tools')} />
                  <NavItem icon={<Box size={18} />} label="我的模型库" active={activeTab === 'library'} onClick={() => onTabChange('library')} />
                  <NavItem icon={<Palette size={18} />} label="创作者收益" active={activeTab === 'earnings'} onClick={() => onTabChange('earnings')} />
                </>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => onTabChange('intro')}
            className={`hidden md:flex items-center gap-2 text-sm font-medium transition-colors mr-2 ${activeTab === 'intro' ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}
          >
            <Info size={18} />
            <span>平台介绍</span>
          </button>
          <div className="flex bg-slate-900 rounded-full p-1 border border-slate-800 relative">
            {/* Sliding Pill */}
            <div
              className={`absolute top-1 bottom-1 rounded-full transition-all duration-300 ease-in-out ${currentRole === UserRole.CONSUMER ? 'left-1 w-[72px] bg-blue-600 shadow-lg shadow-blue-500/25' :
                currentRole === UserRole.DESIGNER ? 'left-[80px] w-[72px] bg-purple-600 shadow-lg shadow-purple-500/25' :
                  'left-[159px] w-[72px] bg-emerald-600 shadow-lg shadow-emerald-500/25'
                } ${activeTab === 'intro' ? 'opacity-0' : 'opacity-100'}`}
            />

            <button
              onClick={() => { onRoleChange(UserRole.CONSUMER); onTabChange('create'); }}
              className={`relative z-10 px-3 py-1.5 rounded-full text-xs font-medium transition-all w-[72px] ${currentRole === UserRole.CONSUMER && activeTab !== 'intro' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
            >
              消费者
            </button>
            <button
              onClick={() => { onRoleChange(UserRole.DESIGNER); onTabChange('tools'); }}
              className={`relative z-10 px-3 py-1.5 rounded-full text-xs font-medium transition-all w-[72px] ${currentRole === UserRole.DESIGNER && activeTab !== 'intro' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
            >
              设计师
            </button>
            <button
              onClick={() => { onRoleChange(UserRole.FARM_OWNER); onTabChange('dashboard'); }}
              className={`relative z-10 px-3 py-1.5 rounded-full text-xs font-medium transition-all w-[72px] ${currentRole === UserRole.FARM_OWNER && activeTab !== 'intro' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
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