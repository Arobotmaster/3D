import React from 'react';
import { UserRole } from '../types';
import { ShoppingBag, Users, LayoutDashboard, BookOpen, ClipboardList, Wrench, PenTool, Box, Palette } from 'lucide-react';

interface SubNavbarProps {
    currentRole: UserRole;
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export const SubNavbar: React.FC<SubNavbarProps> = ({ currentRole, activeTab, onTabChange }) => {
    if (activeTab === 'intro') return null;

    return (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm overflow-x-auto">
            <div className="flex items-center px-4 h-12 gap-6 min-w-max">
                {currentRole === UserRole.CONSUMER && (
                    <>
                        <NavItem icon={<ShoppingBag size={16} />} label="设计与创造" active={activeTab === 'create'} onClick={() => onTabChange('create')} />
                        <NavItem icon={<Users size={16} />} label="社区 & 制造者" active={activeTab === 'community'} onClick={() => onTabChange('community')} />
                    </>
                )}

                {currentRole === UserRole.FARM_OWNER && (
                    <>
                        <NavItem icon={<LayoutDashboard size={16} />} label="仪表盘" active={activeTab === 'dashboard'} onClick={() => onTabChange('dashboard')} />
                        <NavItem icon={<ClipboardList size={16} />} label="接单中心" active={activeTab === 'orders'} onClick={() => onTabChange('orders')} />
                        <NavItem icon={<BookOpen size={16} />} label="技术极客" active={activeTab === 'hub'} onClick={() => onTabChange('hub')} />
                        <NavItem icon={<Wrench size={16} />} label="AI 维修助手" active={activeTab === 'repair'} onClick={() => onTabChange('repair')} />
                    </>
                )}

                {currentRole === UserRole.DESIGNER && (
                    <>
                        <NavItem icon={<PenTool size={16} />} label="AI 工具箱" active={activeTab === 'tools'} onClick={() => onTabChange('tools')} />
                        <NavItem icon={<Box size={16} />} label="我的模型库" active={activeTab === 'library'} onClick={() => onTabChange('library')} />
                        <NavItem icon={<Palette size={16} />} label="创作者收益" active={activeTab === 'earnings'} onClick={() => onTabChange('earnings')} />
                    </>
                )}
            </div>
        </div>
    );
};

const NavItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 text-sm font-medium transition-colors whitespace-nowrap ${active ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}
    >
        {icon}
        {label}
    </button>
);
