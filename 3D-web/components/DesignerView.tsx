import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Image as ImageIcon, Box, Type, Layers, Frame, Lightbulb, Smartphone, Download, Printer, DollarSign, TrendingUp, Eye, Bot, Send, Sparkles } from 'lucide-react';
import { generateAIResponse } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Using standard Lucide icons that are definitely available
// Replacing specific Unsplash IDs with reliable tech/3d printing abstract backgrounds

const DESIGN_TOOLS = [
    {
        id: 'img-to-3d',
        title: '图片生成 3D 模型',
        desc: '使用革命性的 AI 工具从一张图像生成高精度 3D 模型',
        icon: <ImageIcon size={24} className="text-pink-400" />,
        color: 'from-pink-500/20 to-rose-500/5',
        border: 'hover:border-pink-500/50',
        bgImage: '/image_to_3d.png'
    },
    {
        id: 'lightbox',
        title: '灯箱生成器',
        desc: '上传图像或文字，自动创建多层剪影或全彩光固化灯箱',
        icon: <Lightbulb size={24} className="text-amber-400" />, // Lightbulb is standard
        color: 'from-amber-500/20 to-orange-500/5',
        border: 'hover:border-amber-500/50',
        bgImage: '/lightbox.png'
    },
    {
        id: 'articulated',
        title: '铰链玩具生成器',
        desc: '打破平面，将静态图片变身为全身可动的活动铰链玩具',
        icon: <Layers size={24} className="text-cyan-400" />,
        color: 'from-cyan-500/20 to-blue-500/5',
        border: 'hover:border-cyan-500/50',
        bgImage: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=400&h=250'
    },
    {
        id: 'relief',
        title: '浮雕生成器',
        desc: '用图片定制你的 3D 浮雕，支持正/负浮雕切换',
        icon: <Frame size={24} className="text-purple-400" />, // Frame is standard
        color: 'from-purple-500/20 to-violet-500/5',
        border: 'hover:border-purple-500/50',
        bgImage: '/relief.png'
    },
    {
        id: 'bust',
        title: '雕像生成器',
        desc: '把你的照片变成一个栩栩如生的古典风格雕像',
        icon: <Type size={24} className="text-emerald-400" />,
        color: 'from-emerald-500/20 to-green-500/5',
        border: 'hover:border-emerald-500/50',
        bgImage: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&q=80&w=400&h=250'
    },
    {
        id: 'lithophane',
        title: '透光浮雕生成器',
        desc: '光影雕刻回忆之美，制作在背光下显现的精美照片',
        icon: <Lightbulb size={24} className="text-indigo-400" />,
        color: 'from-indigo-500/20 to-blue-500/5',
        border: 'hover:border-indigo-500/50',
        bgImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=400&h=250'
    },
    {
        id: 'organizer',
        title: '桌面收纳盒生成器',
        desc: '设计专属桌面收纳神器，完美适配你的文具和工作空间',
        icon: <Box size={24} className="text-blue-400" />,
        color: 'from-blue-500/20 to-sky-500/5',
        border: 'hover:border-blue-500/50',
        bgImage: 'https://images.unsplash.com/photo-1493934558415-9d19f0b2b4d2?auto=format&fit=crop&q=80&w=400&h=250'
    },
    {
        id: 'phone-stand',
        title: '手机支架生成器',
        desc: '参数化设计，适配任意手机型号与观看角度',
        icon: <Smartphone size={24} className="text-red-400" />,
        color: 'from-red-500/20 to-orange-500/5',
        border: 'hover:border-red-500/50',
        bgImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400&h=250'
    }
];

const MY_MODELS = [
    { id: 1, name: "极简 Voronoi 台灯", downloads: 1240, prints: 85, earned: "¥420", image: "/voronoi_lamp.png" },
    { id: 2, name: "iPhone 15 磁吸支架", downloads: 892, prints: 230, earned: "¥1,150", image: "https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&q=80&w=200&h=200" },
    { id: 3, name: "参数化多肉花盆", downloads: 560, prints: 45, earned: "¥225", image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=200&h=200" },
];

const EARNINGS_DATA = [
    { day: '5/12', amount: 120 }, { day: '5/13', amount: 150 }, { day: '5/14', amount: 280 },
    { day: '5/15', amount: 190 }, { day: '5/16', amount: 350 }, { day: '5/17', amount: 420 }, { day: '5/18', amount: 310 }
];

export const DesignerView: React.FC<{ activeTab?: string }> = ({ activeTab = 'tools' }) => {
    // AI Assistant State
    const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
        { role: 'model', text: "你好！我是你的 AI 设计助手。我可以帮你构思创意、推荐合适的 AI 工具，或者提供设计方案建议。你想做什么？" }
    ]);
    const [input, setInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (activeTab === 'ai-assistant') {
            chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, activeTab]);

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userText = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userText }]);
        setIsGenerating(true);

        const aiMsgId = Date.now().toString();
        setMessages(prev => [...prev, { role: 'model', text: '' }]);

        const history = messages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`).join('\n');
        const fullPrompt = `${history}\nUser: ${userText}\nAssistant:`;

        const systemPrompt = `
        你是一个专业的 3D 设计与创意顾问。你的目标是帮助设计师利用现有的 AI 工具（如图片生成 3D、灯箱生成器、浮雕生成器等）来实现他们的创意。
        
        请根据用户的描述：
        1. 分析他们的设计需求。
        2. 推荐最合适的工具（参考 DESIGN_TOOLS 列表）。
        3. 提供具体的操作建议或设计思路。
        
        保持语气专业、富有创造力且乐于助人。
        `;

        try {
            await generateAIResponse(
                fullPrompt,
                (chunk) => {
                    setMessages(prev => {
                        const newMessages = [...prev];
                        const lastMsg = newMessages[newMessages.length - 1];
                        if (lastMsg.role === 'model') {
                            lastMsg.text = chunk;
                        }
                        return newMessages;
                    });
                },
                systemPrompt,
                "Qwen/Qwen2.5-72B-Instruct"
            );
        } catch (e) {
            console.error(e);
            setMessages(prev => {
                const newMessages = [...prev];
                const lastMsg = newMessages[newMessages.length - 1];
                if (lastMsg.role === 'model' && !lastMsg.text) {
                    lastMsg.text = "抱歉，我遇到了一些问题，请稍后再试。";
                }
                return newMessages;
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const renderTools = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {DESIGN_TOOLS.map((tool) => (
                <div
                    key={tool.id}
                    className={`group relative bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${tool.border} cursor-pointer`}
                >
                    {/* Background Image Area */}
                    <div className="h-40 w-full overflow-hidden relative">
                        <img src={tool.bgImage} alt={tool.title} className="w-full h-full object-cover opacity-50 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500" />
                        <div className={`absolute inset-0 bg-gradient-to-t ${tool.color} via-slate-900/20 to-transparent opacity-90`}></div>
                        <div className="absolute top-4 left-4 bg-slate-950/60 backdrop-blur-md p-2.5 rounded-xl border border-white/10 shadow-lg">
                            {tool.icon}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-5">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">{tool.title}</h3>
                        </div>
                        <p className="text-sm text-slate-400 line-clamp-2 mb-4 h-10 leading-relaxed">{tool.desc}</p>

                        <div className="flex items-center justify-end">
                            <button className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 transition-all">
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderLibrary = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">已发布模型 ({MY_MODELS.length})</h2>
                <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium">上传新模型</button>
            </div>
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-4 font-medium">模型名称</th>
                            <th className="px-6 py-4 font-medium">下载量</th>
                            <th className="px-6 py-4 font-medium">打印次数</th>
                            <th className="px-6 py-4 font-medium">总收益</th>
                            <th className="px-6 py-4 font-medium">状态</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {MY_MODELS.map((model) => (
                            <tr key={model.id} className="hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img src={model.image} alt={model.name} className="w-10 h-10 rounded-lg object-cover" />
                                        <span className="text-white font-medium">{model.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-300 flex items-center gap-2">
                                    <Download size={14} /> {model.downloads}
                                </td>
                                <td className="px-6 py-4 text-slate-300">
                                    <div className="flex items-center gap-2">
                                        <Printer size={14} /> {model.prints}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-emerald-400 font-bold">{model.earned}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs border border-emerald-500/20">已上架</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderEarnings = () => (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                    <p className="text-slate-500 text-sm uppercase mb-1">本月预估收益</p>
                    <h3 className="text-3xl font-bold text-white flex items-center gap-2">
                        ¥ 3,420 <TrendingUp className="text-emerald-400" size={24} />
                    </h3>
                </div>
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                    <p className="text-slate-500 text-sm uppercase mb-1">总打印次数</p>
                    <h3 className="text-3xl font-bold text-white flex items-center gap-2">
                        365 <Printer className="text-blue-400" size={24} />
                    </h3>
                </div>
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                    <p className="text-slate-500 text-sm uppercase mb-1">模型浏览量</p>
                    <h3 className="text-3xl font-bold text-white flex items-center gap-2">
                        12.5k <Eye className="text-purple-400" size={24} />
                    </h3>
                </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                <h3 className="text-lg font-bold text-white mb-6">收益趋势 (最近7天)</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={EARNINGS_DATA}>
                            <defs>
                                <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }}
                            />
                            <Area type="monotone" dataKey="amount" stroke="#9333ea" strokeWidth={3} fillOpacity={1} fill="url(#colorEarnings)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );

    const renderAIAssistant = () => (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden h-[calc(100vh-16rem)] flex flex-col shadow-xl">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center border border-purple-500/30">
                    <Bot className="text-purple-400" size={20} />
                </div>
                <div>
                    <h2 className="text-white font-bold">创意与工具顾问</h2>
                    <p className="text-xs text-purple-400 flex items-center gap-1">
                        <Sparkles size={10} /> 智能匹配最佳工具方案
                    </p>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-900/50">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user'
                            ? 'bg-purple-600 text-white rounded-tr-none'
                            : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                            }`}>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isGenerating && (
                    <div className="flex justify-start">
                        <div className="bg-slate-800 rounded-2xl rounded-tl-none p-4 border border-slate-700">
                            <div className="flex gap-2">
                                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-100"></div>
                                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-200"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-950 border-t border-slate-800">
                <div className="relative flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="描述你的创意，例如：我想做一个赛博朋克风格的耳机架..."
                        className="flex-1 bg-slate-800 text-white rounded-xl px-4 py-3 border border-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                        disabled={isGenerating}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!input.trim() || isGenerating}
                        className="bg-purple-600 text-white p-3 rounded-xl hover:bg-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {/* Dynamic Header based on Active Tab */}
            <div className="mb-8 text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">MakerLab</span>
                    <span className="ml-2 text-white">
                        {activeTab === 'tools' && 'AI 工具箱'}
                        {activeTab === 'library' && '我的模型库'}
                        {activeTab === 'earnings' && '创作者收益'}
                        {activeTab === 'ai-assistant' && 'AI 设计助手'}
                    </span>
                </h1>
                <p className="text-slate-400 max-w-2xl">
                    {activeTab === 'tools' && '专为设计师打造的参数化与生成式 AI 工具集。无需从零建模，快速验证创意。'}
                    {activeTab === 'library' && '管理您的原创模型资产，追踪打印数据与市场反馈。'}
                    {activeTab === 'earnings' && '查看您的设计创造的实际价值，实现创意变现。'}
                    {activeTab === 'ai-assistant' && '您的私人创意顾问，帮您梳理思路，推荐工具，让创意落地更简单。'}
                </p>
            </div>

            {/* Content Switching Logic */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeTab === 'tools' && renderTools()}
                {activeTab === 'library' && renderLibrary()}
                {activeTab === 'earnings' && renderEarnings()}
                {activeTab === 'ai-assistant' && renderAIAssistant()}
            </div>
        </div>
    );
};