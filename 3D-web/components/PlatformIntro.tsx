
import React, { useState, useEffect } from 'react';
import {
    Sparkles,
    Printer,
    MapPin,
    Package,
    Zap,
    Cpu,
    Wallet,
    Wrench,
    ArrowRight,
    User,
    Box,
    CheckCircle2,
    PenTool,
    ShieldCheck,
    Coins,
    UploadCloud
} from 'lucide-react';

import { UserRole } from '../types';

// 定义类型
type Role = 'consumer' | 'designer' | 'farmer';

interface Step {
    id: number;
    title: string;
    desc: string;
    icon: React.ElementType;
    detail: React.ReactNode;
}

interface PlatformIntroProps {
    onNavigate: (role: UserRole, tab: string) => void;
}

export const PlatformIntro: React.FC<PlatformIntroProps> = ({ onNavigate }) => {
    const [activeRole, setActiveRole] = useState<Role>('consumer');
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [isAnimating, setIsAnimating] = useState(false);

    // 切换角色时重置步骤
    const handleRoleChange = (role: Role) => {
        setIsAnimating(true);
        setTimeout(() => {
            setActiveRole(role);
            setCurrentStep(0);
            setIsAnimating(false);
        }, 300);
    };

    // 1. 消费者旅程 (搞怪版)
    const consumerSteps: Step[] = [
        {
            id: 0,
            title: "脑洞一键实体化",
            desc: "打字就能造物，你的想象力现在值钱了",
            icon: Sparkles,
            detail: (
                <div className="space-y-4">
                    <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                        <p className="text-slate-400 text-xs mb-1">你的脑洞</p>
                        <p className="text-white text-sm">"整一个赛博朋克风的手机支架，要那种让人看了就想问链接的！"</p>
                    </div>
                    <div className="flex justify-center items-center h-24 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-lg border border-blue-500/30 relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Box className="w-12 h-12 text-blue-400 animate-pulse" />
                        </div>
                        <p className="absolute bottom-2 text-xs text-blue-300">AI 正在疯狂建模中...</p>
                    </div>
                </div>
            )
        },
        {
            id: 1,
            title: "滴滴一下，打印机就位",
            desc: "全城闲置打印机正在争抢你的订单",
            icon: MapPin,
            detail: (
                <div className="space-y-3">
                    <div className="relative h-32 bg-slate-800 rounded-lg overflow-hidden border border-slate-700 p-4">
                        <div className="absolute top-1/2 left-1/2 w-full h-full bg-blue-500/5 rounded-full -translate-x-1/2 -translate-y-1/2 animate-ping" />
                        <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-blue-500 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_15px_rgba(59,130,246,1)] z-10">
                            <div className="absolute -top-8 -left-8 bg-slate-900/90 text-[10px] text-white px-2 py-1 rounded border border-blue-500/50 whitespace-nowrap">
                                我是甲方爸爸
                            </div>
                        </div>

                        <div className="absolute top-1/4 left-1/4 flex flex-col items-center animate-bounce duration-1000">
                            <Printer className="w-4 h-4 text-green-400" />
                            <span className="text-[9px] text-slate-400">0.8km</span>
                        </div>
                        <div className="absolute bottom-1/3 right-1/4 flex flex-col items-center animate-bounce duration-[1500ms]">
                            <Printer className="w-4 h-4 text-slate-600" />
                            <span className="text-[9px] text-slate-500">忙碌</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-green-400 bg-green-900/20 p-2 rounded">
                        <span>匹配成功: 隔壁老王的 Voron 2.4 已接单</span>
                        <CheckCircle2 className="w-4 h-4" />
                    </div>
                </div>
            )
        },
        {
            id: 2,
            title: "外卖到了？不，是脑洞",
            desc: "比淘宝定制快，比工厂开模省，主打一个‘快’",
            icon: Package,
            detail: (
                <div className="space-y-4 text-center py-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full shadow-lg shadow-blue-500/50 mb-2">
                        <Package className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h4 className="text-white font-bold">你的宝贝已送达</h4>
                        <p className="text-slate-400 text-sm mt-1">立省 60% 成本 <br /> 传统工厂看完都沉默了</p>
                    </div>
                </div>
            )
        }
    ];

    // 2. 设计师旅程 (搞怪版)
    const designerSteps: Step[] = [
        {
            id: 0,
            title: "创意变现第一步",
            desc: "甩出你的神作，我们给它上把‘区块链锁’",
            icon: UploadCloud,
            detail: (
                <div className="space-y-4">
                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="bg-purple-900/50 p-2 rounded">
                                <Box className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-white text-sm font-medium">机甲暴龙_终极帅气版.stl</p>
                                <p className="text-slate-500 text-xs">12.4 MB • 240k 面</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-green-900/20 px-2 py-1 rounded w-fit">
                            <ShieldCheck className="w-3 h-3 text-green-400" />
                            <span className="text-[10px] text-green-400">谁也别想白嫖你的设计</span>
                        </div>
                        {/* Scanline effect */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-purple-500/50 blur-sm animate-[scan_2s_ease-in-out_infinite]" style={{ top: '50%' }} />
                    </div>
                    <p className="text-xs text-center text-slate-500">你的创意受保护，盗版商看了直摇头</p>
                </div>
            )
        },
        {
            id: 1,
            title: "源码？想得美！",
            desc: "只给机器看 G-Code，源文件藏进保险箱",
            icon: ShieldCheck,
            detail: (
                <div className="space-y-2">
                    <div className="flex justify-between items-center px-4">
                        <div className="text-center">
                            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 mx-auto mb-1">
                                <Box className="w-5 h-5 text-purple-400" />
                            </div>
                            <span className="text-[10px] text-slate-400">你的宝贝模型</span>
                        </div>

                        {/* Encrypted Stream Visualization */}
                        <div className="flex-1 mx-2 h-1 bg-slate-800 rounded relative overflow-hidden">
                            <div className="absolute top-0 left-0 h-full w-1/2 bg-purple-600 animate-[slide_1.5s_linear_infinite]" />
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 px-1">
                                <span className="text-[8px] text-purple-400 border border-purple-500/30 px-1 rounded">G-Code 密流</span>
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 mx-auto mb-1">
                                <Printer className="w-5 h-5 text-slate-400" />
                            </div>
                            <span className="text-[10px] text-slate-400">干活的机器</span>
                        </div>
                    </div>
                    <div className="bg-red-900/20 p-2 rounded border border-red-900/50 text-center">
                        <p className="text-[10px] text-red-300">🚫 伸手党退散！源文件已加密</p>
                    </div>
                </div>
            )
        },
        {
            id: 2,
            title: "睡后收入叮叮当",
            desc: "躺着也能把钱赚了，这就是知识付费",
            icon: Coins,
            detail: (
                <div className="bg-slate-800 rounded-lg p-0 overflow-hidden border border-slate-700">
                    <div className="bg-purple-600/20 p-2 border-b border-purple-500/20 flex justify-between items-center">
                        <span className="text-purple-400 text-xs font-bold">支付宝到账提醒</span>
                        <span className="text-purple-400 text-[10px]">刚刚</span>
                    </div>
                    <div className="p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0">
                            <span className="text-yellow-500 font-bold">¥</span>
                        </div>
                        <div>
                            <p className="text-white text-sm font-medium">+ ¥5.00 版税</p>
                            <p className="text-[10px] text-slate-400">来源: 订单 #8829 (有个上海土豪打了)</p>
                            <p className="text-[10px] text-slate-500 mt-1">模型: 机甲暴龙_终极帅气版</p>
                        </div>
                    </div>
                </div>
            )
        }
    ];

    // 3. 农场主旅程 (搞怪版)
    const farmerSteps: Step[] = [
        {
            id: 0,
            title: "打印机别吃灰了",
            desc: "机器开工，电费回血，还能赚个夜宵钱",
            icon: Zap,
            detail: (
                <div className="space-y-3">
                    <div className="flex items-center justify-between bg-slate-800 p-3 rounded-lg border border-slate-700">
                        <div className="flex items-center gap-3">
                            <Printer className="w-8 h-8 text-slate-400" />
                            <div>
                                <p className="text-white text-sm font-medium">Bambu Lab X1C</p>
                                <p className="text-slate-500 text-xs">状态: 饿了，求喂码</p>
                            </div>
                        </div>
                        <div className="h-3 w-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
                    </div>
                    <p className="text-xs text-slate-400 text-center">扫码上岗，你的机器就是印钞机</p>
                </div>
            )
        },
        {
            id: 1,
            title: "人在床上躺，单从天上来",
            desc: "不用去闲鱼扯皮，系统自动把饭喂到嘴边",
            icon: Cpu,
            detail: (
                <div className="bg-slate-800 rounded-lg p-0 overflow-hidden border border-slate-700">
                    <div className="bg-blue-600/20 p-2 border-b border-blue-500/20 flex justify-between items-center">
                        <span className="text-blue-400 text-xs font-bold">老板，来大单了！</span>
                        <span className="text-blue-400 text-[10px]">刚刚</span>
                    </div>
                    <div className="p-3 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-white text-sm">定制镂空手机架</span>
                            <span className="text-green-400 font-mono">¥35.00</span>
                        </div>
                        <div className="flex gap-2">
                            <span className="px-2 py-0.5 bg-slate-700 rounded text-[10px] text-slate-300">PLA</span>
                            <span className="px-2 py-0.5 bg-slate-700 rounded text-[10px] text-slate-300">3h 20m</span>
                        </div>
                        <button className="w-full mt-2 bg-blue-600 hover:bg-blue-500 text-white text-xs py-2 rounded transition-colors">
                            接单！让喷头躁起来
                        </button>
                    </div>
                </div>
            )
        },
        {
            id: 2,
            title: "AI 帮你盯着，你就放心睡",
            desc: "只要不炸机，全是纯利润",
            icon: Wallet,
            detail: (
                <div className="space-y-3">
                    <div className="flex gap-2 items-start bg-yellow-900/20 p-2 rounded border border-yellow-700/50">
                        <Wrench className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-yellow-200 text-xs font-bold">AI 监控助手</p>
                            <p className="text-yellow-200/70 text-[10px]">AI: 刚才差点炒面了，还好我帮你调了下热床，不用谢。</p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 p-4 rounded-lg border border-green-500/30 flex justify-between items-center">
                        <div>
                            <p className="text-slate-400 text-xs">本月摸鱼收益</p>
                            <p className="text-2xl text-white font-mono font-bold">¥1,240</p>
                        </div>
                        <Wallet className="w-8 h-8 text-green-400 opacity-50" />
                    </div>
                </div>
            )
        }
    ];

    const getSteps = () => {
        switch (activeRole) {
            case 'consumer': return consumerSteps;
            case 'designer': return designerSteps;
            case 'farmer': return farmerSteps;
            default: return consumerSteps;
        }
    };

    const currentStepsData = getSteps();

    // 计算背景 Pill 的位置
    const getPillPosition = () => {
        switch (activeRole) {
            case 'consumer': return 'left-1';
            case 'designer': return 'left-[108px]'; // Approximate middle position
            case 'farmer': return 'left-[215px]'; // Approximate right position
            default: return 'left-1';
        }
    };

    // 按钮颜色主题
    const getThemeColor = () => {
        switch (activeRole) {
            case 'consumer': return 'bg-blue-600';
            case 'designer': return 'bg-purple-600';
            case 'farmer': return 'bg-green-600';
            default: return 'bg-blue-600';
        }
    };

    const themeColor = getThemeColor();



    const handleActionClick = () => {
        switch (activeRole) {
            case 'consumer':
                onNavigate(UserRole.CONSUMER, 'create');
                break;
            case 'designer':
                onNavigate(UserRole.DESIGNER, 'tools');
                break;
            case 'farmer':
                onNavigate(UserRole.FARM_OWNER, 'dashboard');
                break;
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 animate-in fade-in duration-500">

            {/* Header / Role Switcher */}
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent mb-6">
                    Neurafab.ai：搞点好玩的
                </h2>

                <div className="inline-flex bg-slate-900 p-1 rounded-full border border-slate-800 shadow-inner relative w-[325px]">
                    {/* Animated Background Pill */}
                    <div
                        className={`absolute top-1 bottom-1 w-[105px] rounded-full transition-all duration-300 ease-in-out ${themeColor} ${getPillPosition()}`}
                    />

                    <button
                        onClick={() => handleRoleChange('consumer')}
                        className={`relative z-10 w-[105px] py-2 rounded-full flex items-center justify-center gap-1.5 text-xs font-medium transition-colors duration-300 ${activeRole === 'consumer' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        <User className="w-3.5 h-3.5" />
                        我是消费者
                    </button>
                    <button
                        onClick={() => handleRoleChange('designer')}
                        className={`relative z-10 w-[105px] py-2 rounded-full flex items-center justify-center gap-1.5 text-xs font-medium transition-colors duration-300 ${activeRole === 'designer' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        <PenTool className="w-3.5 h-3.5" />
                        我是设计师
                    </button>
                    <button
                        onClick={() => handleRoleChange('farmer')}
                        className={`relative z-10 w-[105px] py-2 rounded-full flex items-center justify-center gap-1.5 text-xs font-medium transition-colors duration-300 ${activeRole === 'farmer' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        <Printer className="w-3.5 h-3.5" />
                        我是农场主
                    </button>
                </div>
            </div>

            {/* Interactive Flow Area */}
            <div className={`grid md:grid-cols-2 gap-12 transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>

                {/* Left: Steps Navigation */}
                <div className="space-y-4">
                    {currentStepsData.map((step, index) => {
                        const isActive = currentStep === index;
                        const Icon = step.icon;

                        // 动态颜色类名
                        let activeBorderClass = 'border-blue-500';
                        let activeBgClass = 'bg-blue-600';
                        let activeTextClass = 'text-blue-400';

                        if (activeRole === 'designer') {
                            activeBorderClass = 'border-purple-500';
                            activeBgClass = 'bg-purple-600';
                            activeTextClass = 'text-purple-400';
                        } else if (activeRole === 'farmer') {
                            activeBorderClass = 'border-green-500';
                            activeBgClass = 'bg-green-600';
                            activeTextClass = 'text-green-400';
                        }

                        return (
                            <div
                                key={step.id}
                                onClick={() => setCurrentStep(index)}
                                className={`relative group cursor-pointer p-6 rounded-2xl border transition-all duration-300 ${isActive
                                    ? `bg-slate-800/80 ${activeBorderClass} shadow-lg`
                                    : 'bg-slate-900 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-xl transition-colors duration-300 ${isActive ? `${activeBgClass} text-white` : 'bg-slate-800 text-slate-400'
                                        }`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className={`font-bold text-lg mb-1 transition-colors ${isActive ? activeTextClass : 'text-slate-300'
                                            }`}>
                                            {index + 1}. {step.title}
                                        </h3>
                                        <p className="text-sm text-slate-500 leading-relaxed">
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>

                                {/* Arrow Connector */}
                                {index !== currentStepsData.length - 1 && (
                                    <div className={`absolute left-[42px] -bottom-8 w-0.5 h-8 bg-slate-800 group-hover:bg-slate-700 transition-colors ${isActive ? 'bg-slate-700' : ''}`} />
                                )}

                                {/* Active Indicator Arrow */}
                                {isActive && (
                                    <ArrowRight className={`absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 animate-pulse hidden md:block ${activeTextClass}`} />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Right: Dynamic Detail View */}
                <div className="relative flex items-center justify-center">
                    {/* Phone Frame */}
                    <div className="bg-slate-900 border-4 border-slate-800 rounded-[2.5rem] p-2 h-[500px] shadow-2xl w-full max-w-[340px] overflow-hidden ring-1 ring-white/5 relative">
                        {/* Dynamic Content Container */}
                        <div className="bg-slate-950 h-full w-full rounded-[2rem] overflow-hidden relative flex flex-col">

                            {/* Top Bar */}
                            <div className="h-14 w-full bg-slate-900/50 backdrop-blur flex items-center justify-center border-b border-white/5 z-10 shrink-0">
                                <span className="text-xs font-bold tracking-widest text-slate-500">NEURAFAB</span>
                            </div>

                            {/* Main Content Area */}
                            <div className="flex-1 p-6 flex items-center justify-center relative">
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-800/10 to-transparent pointer-events-none" />

                                <div className="w-full relative z-10 transition-all duration-500 transform animate-in fade-in slide-in-from-bottom-4">
                                    {currentStepsData[currentStep].detail}
                                </div>
                            </div>

                            {/* Bottom Nav */}
                            <div className="h-12 w-full bg-slate-900 border-t border-white/5 flex justify-around items-center px-6 shrink-0">
                                <div className={`w-12 h-1 rounded-full ${themeColor}`} />
                            </div>
                        </div>

                        {/* Connecting Lines (Decorative) */}
                        <div className={`absolute -z-10 -right-20 top-1/2 w-40 h-40 blur-[80px] rounded-full transition-colors duration-500 ${activeRole === 'consumer' ? 'bg-blue-500/20' :
                            activeRole === 'designer' ? 'bg-purple-500/20' : 'bg-green-500/20'
                            }`} />
                    </div>
                </div>

            </div>

            {/* Footer / CTA */}
            <div className="mt-16 text-center border-t border-slate-800 pt-8">
                <p className="text-slate-400 text-base mb-6">
                    Neurafab: <span className="text-blue-400 font-bold">消费者</span> 开脑洞 + <span className="text-purple-400 font-bold">设计师</span> 卖才华 + <span className="text-green-400 font-bold">农场主</span> 出苦力 = 完美闭环
                </p>
                <button
                    onClick={handleActionClick}
                    className={`px-10 py-4 rounded-full font-bold text-lg transition-all text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 ${themeColor}`}
                >
                    {activeRole === 'consumer' ? '我要造物' :
                        activeRole === 'designer' ? '我要卖艺' : '我要接单'}
                </button>
            </div>

        </div>
    );
};
