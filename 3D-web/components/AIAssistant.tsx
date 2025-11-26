import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Wrench, X } from 'lucide-react';
import { ChatMessage } from '../types';
import { generateAIResponse } from '../services/geminiService';

export const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: '你好！我是 Neurafab 智能助手。我可以帮你维修打印机、优化切片设置或分析打印失败原因。有什么可以帮你的吗？', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Create placeholder for AI message
    const aiMsgId = (Date.now() + 1).toString();
    const aiMsg: ChatMessage = {
      id: aiMsgId,
      role: 'model',
      text: '',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, aiMsg]);

    try {
      await generateAIResponse(input, (text) => {
        setMessages(prev => prev.map(msg =>
          msg.id === aiMsgId ? { ...msg, text: text } : msg
        ));
      });
    } catch (e) {
      console.error(e);
      setMessages(prev => prev.map(msg =>
        msg.id === aiMsgId ? { ...msg, text: "抱歉，发生了错误。" } : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 h-[calc(100vh-6rem)] flex flex-col">
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
            <Bot className="text-blue-400" size={20} />
          </div>
          <div>
            <h2 className="text-white font-bold">维修与优化智能体</h2>
            <p className="text-xs text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> 在线
            </p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-900/50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                <span className="text-[10px] opacity-50 block mt-2 text-right">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
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
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <div className="flex gap-2 mb-2 overflow-x-auto pb-2 no-scrollbar">
            <QuickAction label="喷头堵塞" icon={<Wrench size={12} />} onClick={() => setInput("我的打印机喷头堵了，我用的是PLA材料。")} />
            <QuickAction label="层纹错位" icon={<Wrench size={12} />} onClick={() => setInput("Y轴出现了层纹错位现象，怎么解决？")} />
            <QuickAction label="TPU 设置优化" icon={<Bot size={12} />} onClick={() => setInput("通用 TPU 材料的最佳回抽设置是多少？")} />
          </div>
          <div className="relative flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="描述你的打印问题或询问切片建议..."
              className="flex-1 bg-slate-800 text-white rounded-xl px-4 py-3 border border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuickAction = ({ label, icon, onClick }: { label: string, icon: React.ReactNode, onClick: () => void }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-xs text-slate-300 transition-colors whitespace-nowrap"
  >
    {icon} {label}
  </button>
);