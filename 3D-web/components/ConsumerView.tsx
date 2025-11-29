import React, { useState, useRef, useEffect } from 'react';
import { Wand2, Upload, Clock, Zap, Box, CheckCircle2, Sparkles, Package, Truck, Printer, Search, Video, Send, PenTool, X, Eraser, Check, Trash2, Image as ImageIcon } from 'lucide-react';
import { generateAIResponse, generateImage } from '../services/geminiService';

const EXAMPLES = [
    {
        title: "泰森多边形台灯",
        prompt: "有机形态的Voronoi泰森多边形台灯罩，圆柱形，复杂几何结构用于光线漫射，现代设计风格",
        // Updated image to a reliable one
        image: "/voronoi_lamp.png"
    },
    {
        title: "活动关节龙",
        prompt: "可动的灵活龙形玩具，东方风格，精细的鳞片，一体化打印结构(print-in-place)，奇幻美学",
        image: "https://images.unsplash.com/photo-1577493340887-b7bfff550145?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
        title: "赛博朋克耳机架",
        prompt: "未来主义耳机支架，低多边形(low poly)美学，稳固底座，机能风，几何锐利边缘",
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
        title: "参数化花盆",
        prompt: "扭曲多边形多肉花盆，现代极简设计，波浪纹理，带自吸水底座",
        image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=200&h=200"
    }
];

const MY_ORDERS = [
    {
        id: "ORD-8829",
        item: "定制Voronoi台灯",
        status: "打印中",
        progress: 65,
        farm: "CyberPrint 实验室",
        eta: "2小时 15分",
        // Updated image to a reliable one
        image: "/voronoi_lamp.png",
        timeline: [
            { status: '已下单', time: '10:30 AM', done: true },
            { status: '分派至农场', time: '10:35 AM', done: true },
            { status: '打印中', time: '进行中', done: false, current: true },
            { status: '配送中', time: '预计 2:00 PM', done: false }
        ]
    },
    {
        id: "ORD-8825",
        item: "替换齿轮组",
        status: "配送中",
        progress: 100,
        farm: "Steve的极客车库",
        eta: "15分钟",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=100&h=100",
        timeline: [
            { status: '已下单', time: '昨天', done: true },
            { status: '打印完成', time: '已完成', done: true },
            { status: '质检通过', time: '通过', done: true },
            { status: '骑手已取货', time: '10分钟前', done: true, current: true }
        ]
    }
];

interface ConsumerViewProps {
    activeTab?: string;
    onTabChange?: (tab: string) => void;
}

export const ConsumerView: React.FC<ConsumerViewProps> = ({ activeTab = 'create', onTabChange }) => {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedModel, setGeneratedModel] = useState<any>(null);



    // Drawing State
    const [showDrawingBoard, setShowDrawingBoard] = useState(false);
    const [drawingData, setDrawingData] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

    // ISSUE Methodology State
    const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string, image?: string }[]>([
        { role: 'model', text: "您好！我是您的智能定制顾问。\n\n很多人想做点什么，但不知道具体做什么。没关系，我们可以一起探索。\n您最近在生活、工作或兴趣爱好中，有没有遇到什么需要 3D 打印解决的痛点？或者有什么一直想拥有的东西？" }
    ]);
    const [currentStep, setCurrentStep] = useState('Initiate');
    const chatEndRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!prompt.trim() && !drawingData) return;

        const userText = prompt;
        const userImage = drawingData;

        setPrompt('');
        setDrawingData(null); // Clear drawing after sending

        setMessages(prev => [...prev, { role: 'user', text: userText, image: userImage }]);
        setIsGenerating(true);

        // Create placeholder for AI response
        const aiMsgId = Date.now().toString();
        setMessages(prev => [...prev, { role: 'model', text: '' }]); // Start with empty text

        // Construct conversation history for context
        const history = messages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text} ${m.image ? '[User attached a sketch]' : ''}`).join('\n');
        const fullPrompt = `${history}\nUser: ${userText} ${userImage ? '[User attached a sketch]' : ''}\nAssistant:`;

        const systemPrompt = `
        你是一个基于 ISSUE 方法论的智能 3D 打印定制顾问。你的目标是通过对话引导用户，从模糊的想法挖掘出具体的 3D 打印需求，并最终生成方案。

        ISSUE 方法论步骤：
        1. Initiate (发起): 询问痛点、兴趣或需求。
        2. Structure (结构化): 提供分类方向（如工具、礼物、收纳、IP周边等）供选择。
        3. Socratic (苏格拉底式): 追问细节（场景、功能、风格、尺寸等）。
        4. Unify (统一): 总结方案，给出参数（尺寸、材料）、报价和预估时间。
        5. Execute (执行): 用户确认后，启动制造。

        当前对话历史如下。请根据用户的回答，判断当前应该处于哪个步骤，并给出相应的回复。

        重要规则：
        - 回复的开头必须包含当前步骤的标签，格式为：[StepName]，例如 [Initiate], [Structure], [Socratic], [Unify], [Execute]。
        - 在 [Unify] 阶段，请明确列出：**方案整合**、**精确报价**、**时间预估**。
        - 在 [Execute] 阶段，如果用户确认了方案，请在回复中包含特殊标记 [GENERATE_IMAGE] 和一段用于生成图片的英文 Prompt（格式：Prompt: ...）。
        - 保持语气专业、亲切、具有启发性。
        `;

        let fullResponse = "";

        try {
            await generateAIResponse(
                fullPrompt,
                (chunk) => {
                    // Update UI with streaming text
                    // We need to strip the step tag from the visual display if possible, 
                    // but for streaming simplicity, we might show it initially or try to filter it on the fly.
                    // For now, let's just stream the raw text and clean it up at the end or let the user see the tag (it's not terrible).
                    // Better UX: Try to remove the tag from the streamed text if it's at the start.

                    fullResponse = chunk; // The service returns the full accumulated text in the callback for this implementation? 
                    // Checking geminiService.ts: yes, onStreamUpdate passes the *accumulated* text.

                    const displayText = chunk.replace(/\[(Initiate|Structure|Socratic|Unify|Execute)\]/i, '').trim();

                    setMessages(prev => {
                        const newMessages = [...prev];
                        const lastMsg = newMessages[newMessages.length - 1];
                        if (lastMsg.role === 'model') {
                            lastMsg.text = displayText;
                        }
                        return newMessages;
                    });
                },
                systemPrompt,
                "Qwen/Qwen2.5-72B-Instruct"
            );

            // After stream completes, use fullResponse for logic
            // Parse Step
            const stepMatch = fullResponse.match(/\[(Initiate|Structure|Socratic|Unify|Execute)\]/i);
            if (stepMatch) {
                setCurrentStep(stepMatch[1]);
            }

            // Check for Generation Trigger
            if (fullResponse.includes('[GENERATE_IMAGE]')) {
                const promptMatch = fullResponse.match(/Prompt:\s*(.+)/i);
                const imagePrompt = promptMatch ? promptMatch[1] : userText;

                // Trigger Image Generation
                const imageUrl = await generateImage(imagePrompt);

                setGeneratedModel({
                    name: "定制方案",
                    description: "基于您的需求定制的专属模型",
                    estTime: "4小时 30分",
                    estCost: "¥45.00",
                    material: "PLA 哑光",
                    preview: imageUrl
                });
            }

        } catch (e) {
            console.error(e);
            setMessages(prev => {
                const newMessages = [...prev];
                const lastMsg = newMessages[newMessages.length - 1];
                if (lastMsg.role === 'model' && !lastMsg.text) {
                    lastMsg.text = "抱歉，我稍微走神了，请您再说一遍？";
                }
                return newMessages;
            });
        } finally {
            setIsGenerating(false);
        }
    };

    // Drawing Functions
    useEffect(() => {
        // Sync drawing board visibility with activeTab
        if (activeTab === 'draw') {
            setShowDrawingBoard(true);
        } else {
            // Only hide if we are not in 'create' mode (where it can be a modal)
            // But actually, if we switch away from 'draw', we should probably hide it unless we want to persist it.
            // For now, let's just rely on the modal logic.
            // If activeTab is 'draw', force show.
        }

        if (showDrawingBoard && canvasRef.current) {
            const canvas = canvasRef.current;
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.lineCap = 'round';
                context.lineJoin = 'round';
                context.strokeStyle = '#ffffff';
                context.lineWidth = 3;
                setCtx(context);
            }
        }
    }, [showDrawingBoard, activeTab]);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        if (!ctx) return;
        setIsDrawing(true);
        const { offsetX, offsetY } = getCoordinates(e);
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing || !ctx) return;
        const { offsetX, offsetY } = getCoordinates(e);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
    };

    const stopDrawing = () => {
        if (ctx) ctx.closePath();
        setIsDrawing(false);
    };

    const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
        if (!canvasRef.current) return { offsetX: 0, offsetY: 0 };
        const canvas = canvasRef.current;

        if ('touches' in e) {
            const rect = canvas.getBoundingClientRect();
            return {
                offsetX: e.touches[0].clientX - rect.left,
                offsetY: e.touches[0].clientY - rect.top
            };
        } else {
            return {
                offsetX: (e as React.MouseEvent).nativeEvent.offsetX,
                offsetY: (e as React.MouseEvent).nativeEvent.offsetY
            };
        }
    };

    const clearCanvas = () => {
        if (ctx && canvasRef.current) {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    };

    const confirmDrawing = () => {
        if (canvasRef.current) {
            setDrawingData(canvasRef.current.toDataURL());
            setShowDrawingBoard(false);
            if (activeTab === 'draw' && onTabChange) {
                onTabChange('create');
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {/* Drawing Modal - Show if showDrawingBoard is true OR activeTab is 'draw' */}
            {(showDrawingBoard || activeTab === 'draw') && (
                <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200 ${activeTab === 'draw' ? 'bg-slate-950/100' : ''}`}>
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 w-full max-w-2xl flex flex-col shadow-2xl h-[80vh]">
                        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                            <h3 className="text-white font-bold flex items-center gap-2">
                                <PenTool size={18} className="text-blue-400" />
                                自由绘图板
                            </h3>
                            <button onClick={() => {
                                setShowDrawingBoard(false);
                                if (activeTab === 'draw' && onTabChange) onTabChange('create');
                            }} className="text-slate-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="relative flex-1 bg-slate-950 m-4 rounded-xl border border-slate-800 overflow-hidden cursor-crosshair touch-none">
                            <canvas
                                ref={canvasRef}
                                className="w-full h-full"
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={stopDrawing}
                                onMouseLeave={stopDrawing}
                                onTouchStart={startDrawing}
                                onTouchMove={draw}
                                onTouchEnd={stopDrawing}
                            />
                            <div className="absolute top-4 left-4 text-xs text-slate-500 pointer-events-none select-none">
                                请在此处绘制您的创意草图...
                            </div>
                        </div>
                        <div className="p-4 border-t border-slate-800 flex justify-between items-center">
                            <button onClick={clearCanvas} className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                                <Trash2 size={16} />
                                清空
                            </button>
                            <div className="flex gap-3">
                                <button onClick={() => {
                                    setShowDrawingBoard(false);
                                    if (activeTab === 'draw' && onTabChange) onTabChange('create');
                                }} className="px-4 py-2 text-slate-300 hover:text-white transition-colors">
                                    取消
                                </button>
                                <button onClick={confirmDrawing} className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors">
                                    <Check size={16} />
                                    确认使用
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Sub-Navigation Toggle Removed - Moved to Top Navbar */}

            {(activeTab === 'create' || activeTab === 'draw') ? (
                // CREATE VIEW - ISSUE Methodology Implementation
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-12rem)]">
                    {/* Left: Chat Interface (ISSUE Process) */}
                    <div className="lg:col-span-2 flex flex-col bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                        <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
                            <div>
                                <h2 className="text-white font-bold flex items-center gap-2">
                                    <Sparkles className="text-blue-400" size={18} />
                                    智能定制助手
                                </h2>
                                <p className="text-xs text-slate-400 mt-1">基于 ISSUE 方法论的深度需求挖掘</p>
                            </div>
                            <div className="flex gap-2">
                                {['Initiate', 'Structure', 'Socratic', 'Unify', 'Execute'].map((step, idx) => (
                                    <div key={step} className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors ${currentStep === step ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50' : 'bg-slate-800 text-slate-600'
                                        }`}>
                                        {step[0]}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth" id="issue-chat-container">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-4 rounded-2xl ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-tr-none'
                                        : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                                        }`}>
                                        {msg.image && (
                                            <div className="mb-3 rounded-lg overflow-hidden border border-white/10">
                                                <img src={msg.image} alt="User sketch" className="w-full h-auto bg-slate-950" />
                                            </div>
                                        )}
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

                        <div className="p-4 bg-slate-950 border-t border-slate-800">
                            {drawingData && (
                                <div className="mb-3 flex items-start gap-2 animate-in slide-in-from-bottom-2">
                                    <div className="relative group">
                                        <div className="w-20 h-20 rounded-lg border border-slate-700 overflow-hidden bg-slate-900">
                                            <img src={drawingData} alt="Sketch" className="w-full h-full object-contain" />
                                        </div>
                                        <button
                                            onClick={() => setDrawingData(null)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                    <div className="text-xs text-slate-500 mt-1">
                                        <p>已附加草图</p>
                                        <p>将结合文字描述生成</p>
                                    </div>
                                </div>
                            )}
                            <div className="relative flex items-center gap-2">
                                <button
                                    onClick={() => setShowDrawingBoard(true)}
                                    className="p-3 bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl border border-slate-700 transition-all"
                                    title="绘制草图"
                                >
                                    <PenTool size={20} />
                                </button>
                                <input
                                    type="text"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="回复以继续对话..."
                                    className="flex-1 bg-slate-800 text-white rounded-xl px-4 py-3 border border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    disabled={isGenerating}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={isGenerating || !prompt}
                                    className={`p-3 rounded-xl transition-all ${isGenerating ? 'bg-slate-700 text-slate-400' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Real-time Visualization & Status */}
                    <div className="flex flex-col gap-6">
                        {/* Preview Card */}
                        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex-1 flex flex-col">
                            <div className="p-4 border-b border-slate-800">
                                <h3 className="text-white font-bold text-sm">实时方案预览</h3>
                            </div>
                            <div className="flex-1 relative bg-black flex items-center justify-center group">
                                {generatedModel ? (
                                    <>
                                        <img src={generatedModel.preview} alt="Preview" className="w-full h-full object-cover opacity-80" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <h4 className="text-white font-bold text-lg">{generatedModel.name}</h4>
                                            <p className="text-xs text-slate-300 line-clamp-2 mt-1">{generatedModel.description}</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-6 opacity-50">
                                        <Box size={48} className="mx-auto mb-4 text-slate-600" />
                                        <p className="text-sm text-slate-500">
                                            {currentStep === 'Execute' ? '正在生成最终方案...' : '待方案确认后生成预览'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Specs Card */}
                        {generatedModel && (
                            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4 animate-in slide-in-from-bottom-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase">预计时长</p>
                                        <p className="text-white font-semibold">{generatedModel.estTime}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase">预估费用</p>
                                        <p className="text-emerald-400 font-semibold">{generatedModel.estCost}</p>
                                    </div>
                                </div>
                                <button className="w-full py-3 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                                    <CheckCircle2 size={18} />
                                    确认并制造
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                // TRACK ORDERS VIEW
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-6">进行中的订单</h2>
                    <div className="space-y-6">
                        {MY_ORDERS.map((order) => (
                            <div key={order.id} className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                                <div className="p-6 flex flex-col md:flex-row gap-6">
                                    {/* Visual Status */}
                                    <div className="w-full md:w-1/3 relative">
                                        <div className="aspect-square rounded-xl overflow-hidden bg-black relative">
                                            <img src={order.image} alt={order.item} className="w-full h-full object-cover opacity-70" />
                                            {/* Progress Overlay */}
                                            {order.status === '打印中' && (
                                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
                                                    <div className="h-full bg-blue-500" style={{ width: `${order.progress}%` }}></div>
                                                </div>
                                            )}
                                            {/* Live Badge */}
                                            <div className="absolute top-2 right-2 flex items-center gap-1 bg-red-600/80 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold uppercase text-white">
                                                <Video size={10} /> 直播中
                                            </div>
                                        </div>
                                        <div className="mt-3 flex justify-between items-center">
                                            <p className="text-sm text-slate-400">承接农场</p>
                                            <p className="text-sm font-semibold text-blue-400">{order.farm}</p>
                                        </div>
                                    </div>

                                    {/* Details & Timeline */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="text-xl font-bold text-white">{order.item}</h3>
                                                <p className="text-xs text-slate-500 mt-1">订单号: {order.id}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${order.status === '打印中' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                    order.status === '配送中' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                    }`}>
                                                    {order.status === '打印中' ? <Printer size={12} /> : <Truck size={12} />}
                                                    {order.status}
                                                </span>
                                                <p className="text-sm font-medium text-white mt-2">预计送达: {order.eta}</p>
                                            </div>
                                        </div>

                                        {/* Timeline */}
                                        <div className="relative pl-4 border-l border-slate-800 space-y-6">
                                            {order.timeline.map((step, idx) => (
                                                <div key={idx} className="relative">
                                                    <div className={`absolute -left-[21px] w-3 h-3 rounded-full border-2 ${step.current ? 'bg-blue-500 border-blue-500 animate-pulse' :
                                                        step.done ? 'bg-slate-900 border-blue-500' :
                                                            'bg-slate-900 border-slate-700'
                                                        }`}></div>
                                                    <div className="flex justify-between items-center">
                                                        <p className={`text-sm font-medium ${step.done || step.current ? 'text-white' : 'text-slate-600'}`}>
                                                            {step.status}
                                                        </p>
                                                        <p className="text-xs text-slate-500">{step.time}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {order.status === '配送中' && (
                                            <div className="mt-6 bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
                                                    <Truck size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-white font-medium">骑手已在附近</p>
                                                    <p className="text-xs text-slate-500">预计15分钟后送达</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div >
    );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/50 text-center hover:bg-slate-800 transition-colors cursor-default">
        <div className="flex justify-center mb-2">{icon}</div>
        <h4 className="text-white font-medium text-sm">{title}</h4>
        <p className="text-slate-500 text-xs mt-1">{desc}</p>
    </div>
)