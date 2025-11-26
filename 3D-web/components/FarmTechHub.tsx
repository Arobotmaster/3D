import React from 'react';
import { Trophy, TrendingUp, BookOpen, MessageSquare, ThumbsUp, Award, ArrowUpRight, Zap } from 'lucide-react';

const LEADERBOARD = [
  { rank: 1, name: "CyberPrint 实验室", revenue: "¥12,450", orders: 145, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100&h=100", badge: "泰坦级" },
  { rank: 2, name: "霓虹光固化工厂", revenue: "¥9,820", orders: 89, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100", badge: "大师" },
  { rank: 3, name: "Steve的极客车库", revenue: "¥5,600", orders: 210, avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100&h=100", badge: "量产王" },
  { rank: 4, name: "PrintSmith", revenue: "¥4,200", orders: 56, avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=100&h=100", badge: "新星" },
  { rank: 5, name: "佛山3D枢纽", revenue: "¥3,900", orders: 42, avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=100&h=100", badge: "专业" },
];

const TECH_POSTS = [
  { 
    id: 1, 
    title: "Voron 2.4 打印 ABS 的终极配置优化", 
    author: "CyberPrint 实验室", 
    tags: ["Klipper", "Voron", "ABS"], 
    votes: 128, 
    comments: 45,
    preview: "经过50小时的测试，这是针对eSun ABS+最完美的压力提前(pressure advance)设置..."
  },
  { 
    id: 2, 
    title: "已解决：Bambu AMS 打印 TPU 时的回抽错误", 
    author: "张金鹏", 
    tags: ["Bambu Lab", "故障排查", "TPU"], 
    votes: 96, 
    comments: 23,
    preview: "别让TPU直接过AMS！但如果你必须这么做，这里有个改装方案你需要了解..."
  },
  { 
    id: 3, 
    title: "50元以内的DIY耗材干燥箱", 
    author: "Steve的极客车库", 
    tags: ["硬件改装", "DIY", "维护"], 
    votes: 215, 
    comments: 89,
    preview: "用一个食物脱水机的加热元件和一个宜家储物盒。效果见内文。"
  }
];

export const FarmTechHub: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">极客技术中心</h1>
        <p className="text-slate-400">争夺营收榜单，交流先进制造技术。</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Leaderboard */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-yellow-500/10 to-amber-600/5 rounded-2xl border border-yellow-500/20 p-6 relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Trophy className="text-yellow-500" size={24} />
                <h2 className="text-xl font-bold text-white">每周营收榜</h2>
              </div>
              <span className="text-xs font-mono text-yellow-500/80 bg-yellow-500/10 px-2 py-1 rounded">实时更新</span>
            </div>

            <div className="space-y-4">
              {LEADERBOARD.map((farm, index) => (
                <div key={index} className={`flex items-center p-3 rounded-xl transition-all ${index < 3 ? 'bg-slate-900/80 border border-slate-700' : 'bg-transparent border border-transparent hover:bg-slate-800/50'}`}>
                   <div className={`w-8 h-8 flex items-center justify-center font-bold text-lg mr-3 ${
                       index === 0 ? 'text-yellow-400' : 
                       index === 1 ? 'text-slate-300' : 
                       index === 2 ? 'text-amber-600' : 'text-slate-600'
                   }`}>
                     {farm.rank}
                   </div>
                   <img src={farm.avatar} alt={farm.name} className="w-10 h-10 rounded-full border border-slate-600 mr-3" />
                   <div className="flex-1">
                     <div className="flex items-center gap-2">
                        <h3 className="text-white font-medium text-sm">{farm.name}</h3>
                        {index === 0 && <Zap size={12} className="text-yellow-400 fill-yellow-400" />}
                     </div>
                     <p className="text-xs text-slate-400">{farm.orders} 单</p>
                   </div>
                   <div className="text-right">
                     <p className="text-white font-bold font-mono">{farm.revenue}</p>
                     <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 rounded text-blue-400 border border-blue-500/20">{farm.badge}</span>
                   </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-700/50">
               <div className="bg-blue-600/20 border border-blue-500/30 rounded-xl p-4 flex items-center justify-between">
                  <div>
                      <p className="text-xs text-blue-300 mb-1">你的排名</p>
                      <p className="text-white font-bold">#12 <span className="text-slate-400 font-normal text-sm">(-2)</span></p>
                  </div>
                  <div className="text-right">
                      <p className="text-xs text-blue-300 mb-1">本周营收</p>
                      <p className="text-white font-bold">¥845.00</p>
                  </div>
               </div>
               <p className="text-center text-xs text-slate-500 mt-3">排名每周一 00:00 重置</p>
            </div>
          </div>
        </div>

        {/* Right Column: Knowledge Exchange */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <BookOpen className="text-blue-500" /> 
                  技术交流
              </h2>
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                  分享知识
              </button>
           </div>

           {/* Featured Article */}
           <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:border-blue-500/50 transition-colors cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                 <div className="flex gap-2">
                    <span className="px-2 py-1 rounded-md bg-pink-500/10 text-pink-400 text-xs border border-pink-500/20">热门话题</span>
                    <span className="px-2 py-1 rounded-md bg-slate-800 text-slate-400 text-xs border border-slate-700">市场趋势</span>
                 </div>
                 <p className="text-xs text-slate-500">2小时前</p>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">分析：为何“活动关节龙”在抖音爆火及如何定价</h3>
              <p className="text-slate-400 text-sm mb-4">
                  基于过去30天的数据，精细的活动结构模型需求增长了200%。这里有一份打印时间与市场价格的详细对比分析...
              </p>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1"><ThumbsUp size={16} /> 342</div>
                  <div className="flex items-center gap-1"><MessageSquare size={16} /> 89</div>
                  <div className="flex-1 text-right flex items-center justify-end gap-1 text-blue-500">阅读完整报告 <ArrowUpRight size={16} /></div>
              </div>
           </div>

           {/* Post Feed */}
           <div className="space-y-4">
              {TECH_POSTS.map(post => (
                  <div key={post.id} className="bg-slate-900 rounded-xl border border-slate-800 p-5 hover:bg-slate-800/50 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between">
                          <div>
                              <h4 className="text-white font-semibold text-lg mb-1">{post.title}</h4>
                              <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                                  <span>作者 {post.author}</span>
                                  <span>•</span>
                                  <div className="flex gap-1">
                                      {post.tags.map(tag => (
                                          <span key={tag} className="bg-slate-950 px-1.5 py-0.5 rounded text-slate-500">{tag}</span>
                                      ))}
                                  </div>
                              </div>
                          </div>
                          <div className="flex flex-col items-center gap-1 bg-slate-950 p-2 rounded-lg border border-slate-800 min-w-[60px]">
                              <ArrowUpRight size={16} className="text-emerald-500" />
                              <span className="text-white font-bold">{post.votes}</span>
                          </div>
                      </div>
                      <p className="text-sm text-slate-400 line-clamp-2">{post.preview}</p>
                  </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};