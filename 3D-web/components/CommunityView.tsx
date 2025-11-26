import React, { useState } from 'react';
import { Star, MapPin, MessageSquare, ThumbsUp, Printer, BadgeCheck, Search, Filter } from 'lucide-react';

interface FarmerProfile {
  id: string;
  name: string;
  avatar: string;
  role: string;
  distance: string;
  rating: number;
  jobsCompleted: number;
  machines: string[];
  bio: string;
  reviews: { user: string; comment: string; rating: number }[];
}

interface ShowcasePost {
  id: string;
  author: string;
  authorAvatar: string;
  image: string;
  title: string;
  description: string;
  likes: number;
  comments: number;
  printerUsed?: string;
}

const MOCK_FARMERS: FarmerProfile[] = [
  {
    id: 'f1',
    name: 'CyberPrint 实验室',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100&h=100',
    role: '专业农场',
    distance: '1.2 km',
    rating: 4.9,
    jobsCompleted: 1240,
    machines: ['Bambu X1C x4', 'Voron 2.4'],
    bio: '专注于高速工程材料打印 (ABS/ASA)。保证24小时内发货。',
    reviews: [
      { user: 'Alex', comment: '齿轮零件的尺寸精度非常惊人。', rating: 5 },
      { user: 'Sarah', comment: '发货很快，但包装还可以改进。', rating: 4 }
    ]
  },
  {
    id: 'f2',
    name: 'Steve的极客车库',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100&h=100',
    role: '爱好者',
    distance: '0.8 km',
    rating: 4.7,
    jobsCompleted: 89,
    machines: ['Ender 3 V2', 'Prusa MK3S+'],
    bio: '周末创客，热爱PLA打印。擅长Cosplay道具和装饰品。',
    reviews: [
      { user: 'Mike', comment: 'Steve非常友善，还帮我优化了切片模型。', rating: 5 }
    ]
  },
  {
    id: 'f3',
    name: '霓虹光固化工厂',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100',
    role: '专家级',
    distance: '3.5 km',
    rating: 5.0,
    jobsCompleted: 450,
    machines: ['Elegoo Saturn 3', 'Formlabs 3+'],
    bio: '高精度树脂打印，适合微缩模型和珠宝。包含UV固化服务。',
    reviews: [
      { user: 'Jinpeng', comment: '这条龙的细节简直疯了，完全没有层纹。', rating: 5 }
    ]
  }
];

const MOCK_SHOWCASE: ShowcasePost[] = [
  {
    id: 's1',
    author: '张金鹏',
    authorAvatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=100&h=100',
    image: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&q=80&w=600&h=400',
    title: '定制Voronoi台灯',
    description: '由 CyberPrint 实验室打印。光线漫射效果在我的桌面上太完美了！',
    likes: 45,
    comments: 12,
    printerUsed: 'Bambu X1C'
  },
  {
    id: 's2',
    author: 'CyberPrint 实验室',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100&h=100',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600&h=400',
    title: '批量生产运行',
    description: '刚刚为本地大学团队完成了50个支架，使用的是再生PETG材料。',
    likes: 128,
    comments: 34,
    printerUsed: 'Voron 2.4'
  },
  {
    id: 's3',
    author: 'Alice Chen',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100&h=100',
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=600&h=400',
    title: '活动水晶龙',
    description: '我的第一个多色打印作品！感谢Steve的耗材建议。',
    likes: 89,
    comments: 8,
    printerUsed: 'Bambu A1'
  }
];

export const CommunityView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'makers' | 'showcase'>('makers');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Neurafab 社区</h1>
          <p className="text-slate-400">连接本地制造者，查看信誉评价，并分享你的创意作品。</p>
        </div>
        
        {/* Tab Switcher */}
        <div className="bg-slate-900 p-1 rounded-lg border border-slate-800 inline-flex">
          <button
            onClick={() => setActiveTab('makers')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'makers' 
                ? 'bg-slate-800 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            寻找制造者
          </button>
          <button
            onClick={() => setActiveTab('showcase')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'showcase' 
                ? 'bg-slate-800 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            作品展示
          </button>
        </div>
      </div>

      {activeTab === 'makers' ? (
        /* Makers List View */
        <div className="space-y-6">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
               <input type="text" placeholder="搜索设备型号 (如 Bambu, Resin)..." className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-blue-600 outline-none" />
            </div>
            <button className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 flex items-center gap-2 hover:bg-slate-800">
               <Filter size={18} /> 筛选
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_FARMERS.map(farmer => (
              <div key={farmer.id} className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden hover:border-blue-500/50 transition-colors group">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img src={farmer.avatar} alt={farmer.name} className="w-12 h-12 rounded-full border-2 border-slate-800" />
                      <div>
                        <div className="flex items-center gap-1">
                           <h3 className="text-white font-bold">{farmer.name}</h3>
                           {farmer.rating > 4.8 && <BadgeCheck className="text-blue-500" size={16} />}
                        </div>
                        <p className="text-xs text-slate-400">{farmer.role} • {farmer.distance}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded text-yellow-400 text-xs font-bold">
                      <Star size={12} fill="currentColor" />
                      {farmer.rating}
                    </div>
                  </div>
                  
                  <p className="text-slate-300 text-sm mb-4 line-clamp-2">{farmer.bio}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {farmer.machines.map((machine, idx) => (
                      <span key={idx} className="px-2 py-1 bg-slate-800 rounded text-[10px] text-slate-400 border border-slate-700 flex items-center gap-1">
                        <Printer size={10} /> {machine}
                      </span>
                    ))}
                  </div>

                  <div className="bg-slate-950 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-slate-500">{farmer.reviews[0].user} 说:</span>
                        <div className="flex">{[...Array(farmer.reviews[0].rating)].map((_,i) => <Star key={i} size={8} className="text-yellow-500" fill="currentColor"/>)}</div>
                    </div>
                    <p className="text-xs text-slate-400 italic">"{farmer.reviews[0].comment}"</p>
                  </div>

                  <button className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors">
                    查看资料 & 下单
                  </button>
                </div>
                <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
                   <span>已完成 {farmer.jobsCompleted} 单</span>
                   <span className="text-emerald-500">已认证</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Showcase Gallery View */
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {MOCK_SHOWCASE.map(post => (
             <div key={post.id} className="break-inside-avoid bg-slate-900 rounded-xl border border-slate-800 overflow-hidden hover:shadow-xl transition-shadow">
                <img src={post.image} alt={post.title} className="w-full h-auto object-cover" />
                <div className="p-4">
                   <div className="flex items-center gap-2 mb-3">
                      <img src={post.authorAvatar} alt={post.author} className="w-6 h-6 rounded-full" />
                      <span className="text-sm font-medium text-white">{post.author}</span>
                      {post.printerUsed && (
                        <span className="text-[10px] px-2 py-0.5 bg-slate-800 rounded-full text-slate-400 border border-slate-700">
                            {post.printerUsed}
                        </span>
                      )}
                   </div>
                   <h3 className="text-lg font-bold text-white mb-1">{post.title}</h3>
                   <p className="text-sm text-slate-400 mb-4">{post.description}</p>
                   
                   <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                      <div className="flex gap-4">
                         <button className="flex items-center gap-1 text-slate-500 hover:text-pink-500 transition-colors">
                            <ThumbsUp size={16} />
                            <span className="text-xs">{post.likes}</span>
                         </button>
                         <button className="flex items-center gap-1 text-slate-500 hover:text-blue-400 transition-colors">
                            <MessageSquare size={16} />
                            <span className="text-xs">{post.comments}</span>
                         </button>
                      </div>
                      <button className="text-xs text-blue-500 hover:underline">下单同款</button>
                   </div>
                </div>
             </div>
          ))}
        </div>
      )}
    </div>
  );
};