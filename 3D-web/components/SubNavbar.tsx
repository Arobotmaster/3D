import React from 'react';
import { UserRole } from '../types';
import { ShoppingBag, Users, LayoutDashboard, BookOpen, ClipboardList, Wrench, PenTool, Box, Palette, Info, Package, Bot } from 'lucide-react';

interface SubNavbarProps {
    currentRole: UserRole;
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export const SubNavbar: React.FC<SubNavbarProps> = ({ currentRole, activeTab, onTabChange }) => {
    return (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm overflow-x-auto">
            <div className="flex items-center px-4 h-12 gap-6 min-w-max">
                {currentRole === UserRole.CONSUMER && (
                    <>
                        <NavItem icon={<ShoppingBag size={16} />} label="设计与创造" active={activeTab === 'create'} onClick={() => onTabChange('create')} />
                        <NavItem icon={<Package size={16} />} label="订单追踪" active={activeTab === 'track'} onClick={() => onTabChange('track')} />
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
                        <NavItem icon={<Bot size={16} />} label="AI 设计助手" active={activeTab === 'ai-assistant'} onClick={() => onTabChange('ai-assistant')} />
                    </>
                )}

                <div className="w-px h-4 bg-slate-800 mx-2" />
                <NavItem icon={<Info size={16} />} label="平台介绍" active={activeTab === 'intro'} onClick={() => onTabChange('intro')} />
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
