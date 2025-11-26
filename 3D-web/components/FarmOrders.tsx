import React, { useState } from 'react';
import { Clock, DollarSign, Package, CheckCircle2, XCircle, MapPin, AlertCircle, Zap } from 'lucide-react';

interface Order {
  id: string;
  title: string;
  thumbnail: string;
  customer: string;
  distance: string;
  material: string;
  color: string;
  weight: number;
  price: string;
  deadline: string;
  matchScore: number;
  matchReason: string;
}

const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-2024-001',
    title: '定制人体工学鼠标外壳',
    thumbnail: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&q=80&w=200&h=200',
    customer: '李大伟',
    distance: '1.2 km',
    material: 'PLA',
    color: '哑光黑',
    weight: 45,
    price: '¥ 35.00',
    deadline: '24小时',
    matchScore: 98,
    matchReason: '完美耗材匹配 (PLA 黑色已加载)'
  },
  {
    id: 'ORD-2024-002',
    title: '建筑模型 - 别墅 V2',
    thumbnail: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=200&h=200',
    customer: '设计工作室 A',
    distance: '3.5 km',
    material: 'PLA',
    color: '白色',
    weight: 320,
    price: '¥ 180.00',
    deadline: '48小时',
    matchScore: 85,
    matchReason: '高利润订单，需要更换耗材卷'
  },
  {
    id: 'ORD-2024-003',
    title: 'TPU 无人机防撞圈 (4个/套)',
    thumbnail: 'https://images.unsplash.com/photo-1577493340887-b7bfff550145?auto=format&fit=crop&q=80&w=200&h=200',
    customer: '穿越机竞速俱乐部',
    distance: '5.0 km',
    material: 'TPU',
    color: '红色',
    weight: 80,
    price: '¥ 65.00',
    deadline: '12小时',
    matchScore: 45,
    matchReason: '警告：未加载 TPU 材料，准备时间较长'
  }
];

export const FarmOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

  const handleAccept = (id: string) => {
    // In a real app, this would make an API call
    setOrders(prev => prev.filter(o => o.id !== id));
    alert(`订单 ${id} 已接受！已加入打印队列。`);
  };

  const handleReject = (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex justify-between items-end mb-8">
        <div>
            <h1 className="text-3xl font-bold text-white mb-2">新订单</h1>
            <p className="text-slate-400">基于你当前库存和设备能力AI自动匹配的订单。</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-lg border border-slate-800">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-300">自动接单: <span className="font-bold text-white">关闭</span></span>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
            <Package size={48} className="mx-auto text-slate-600 mb-4" />
            <h3 className="text-xl font-medium text-white">全部搞定！</h3>
            <p className="text-slate-500">正在等待附近消费者的新订单...</p>
        </div>
      ) : (
        <div className="space-y-6">
            {orders.map((order) => (
                <div key={order.id} className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden hover:border-blue-500/50 transition-all shadow-lg">
                    <div className="flex flex-col md:flex-row">
                        {/* Image Section */}
                        <div className="w-full md:w-48 h-48 md:h-auto relative bg-black">
                            <img src={order.thumbnail} alt={order.title} className="w-full h-full object-cover opacity-80" />
                            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs text-white border border-white/10">
                                {order.id}
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="flex-1 p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">{order.title}</h3>
                                    <div className="flex items-center gap-4 text-sm text-slate-400">
                                        <span className="flex items-center gap-1"><MapPin size={14} /> {order.distance} • {order.customer}</span>
                                        <span className="flex items-center gap-1"><Clock size={14} /> 截止: {order.deadline}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-emerald-400">{order.price}</p>
                                    <p className="text-xs text-slate-500">预估收入</p>
                                </div>
                            </div>

                            {/* Match Insight */}
                            <div className={`flex items-start gap-3 p-3 rounded-lg mb-6 border ${order.matchScore > 80 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
                                <Zap size={18} className={order.matchScore > 80 ? 'text-emerald-400' : 'text-amber-400'} />
                                <div>
                                    <p className={`text-sm font-bold ${order.matchScore > 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                        {order.matchScore}% 匹配度
                                    </p>
                                    <p className="text-xs text-slate-300">{order.matchReason}</p>
                                </div>
                            </div>

                            {/* Specs Grid */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-slate-950 p-2 rounded border border-slate-800">
                                    <p className="text-[10px] text-slate-500 uppercase">材料</p>
                                    <p className="text-sm font-medium text-white">{order.material}</p>
                                </div>
                                <div className="bg-slate-950 p-2 rounded border border-slate-800">
                                    <p className="text-[10px] text-slate-500 uppercase">颜色</p>
                                    <p className="text-sm font-medium text-white">{order.color}</p>
                                </div>
                                <div className="bg-slate-950 p-2 rounded border border-slate-800">
                                    <p className="text-[10px] text-slate-500 uppercase">重量</p>
                                    <p className="text-sm font-medium text-white">{order.weight}g</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => handleAccept(order.id)}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                                >
                                    <CheckCircle2 size={20} />
                                    接单
                                </button>
                                <button 
                                    onClick={() => handleReject(order.id)}
                                    className="px-6 bg-slate-800 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 border border-slate-700 text-slate-300 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <XCircle size={20} />
                                    拒绝
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};