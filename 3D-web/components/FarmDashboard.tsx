import React from 'react';
import { PrinterStatus, FilamentStock } from '../types';
import { Printer, AlertTriangle, CheckCircle, Wifi, Battery, Layers, MapPin, Settings } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const MOCK_PRINTERS: PrinterStatus[] = [
  { id: 'p1', name: 'Bambu Lab X1C-01', status: 'PRINTING', progress: 78, filamentRemaining: 45, temperature: 220, currentJob: '龙鳞甲胄_v2' },
  { id: 'p2', name: 'Voron 2.4', status: 'IDLE', progress: 0, filamentRemaining: 12, temperature: 24, currentJob: undefined },
  { id: 'p3', name: 'Prusa MK4', status: 'ERROR', progress: 34, filamentRemaining: 89, temperature: 180, currentJob: '螺旋花瓶' },
  { id: 'p4', name: 'Bambu Lab A1', status: 'PRINTING', progress: 12, filamentRemaining: 92, temperature: 215, currentJob: '手机支架_批量' },
];

const FILAMENT_DATA = [
  { name: 'PLA 白色', value: 400, color: '#ffffff' },
  { name: 'PLA 黑色', value: 300, color: '#333333' },
  { name: 'PETG 蓝色', value: 300, color: '#3b82f6' },
  { name: 'TPU 红色', value: 200, color: '#ef4444' },
];

export const FarmDashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <StatCard label="活跃设备" value="3/4" icon={<Printer className="text-blue-400"/>} />
         <StatCard label="今日产出" value="1,240g" icon={<Layers className="text-purple-400"/>} />
         <StatCard label="今日营收" value="¥ 845.00" icon={<span className="text-emerald-400 font-bold text-xl">¥</span>} />
         <StatCard label="系统健康度" value="98%" icon={<Wifi className="text-green-400"/>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Printer List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-white">设备状态</h2>
            <button className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-md text-slate-300 transition-colors">管理机群</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_PRINTERS.map(printer => (
              <PrinterCard key={printer.id} printer={printer} />
            ))}
          </div>

          {/* Analytics Section */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 mt-6">
             <h3 className="text-lg font-semibold text-white mb-4">周产能效率</h3>
             <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    {day: '周一', uptime: 80}, {day: '周二', uptime: 92}, {day: '周三', uptime: 65},
                    {day: '周四', uptime: 88}, {day: '周五', uptime: 95}, {day: '周六', uptime: 70}, {day: '周日', uptime: 40}
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }}
                        cursor={{fill: '#1e293b'}}
                    />
                    <Bar dataKey="uptime" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>

        {/* Sidebar: Filament Bank & Map */}
        <div className="space-y-6">
          {/* Filament Bank - IoT Tracking */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
             <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-white">耗材银行</h3>
                    <p className="text-xs text-slate-400">RFID 追踪激活</p>
                </div>
                <div className="bg-emerald-500/20 p-2 rounded-full">
                    <Battery size={20} className="text-emerald-400" />
                </div>
             </div>
             
             <div className="h-48 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={FILAMENT_DATA} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                            {FILAMENT_DATA.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0)" />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                    <span className="text-2xl font-bold text-white">1.2kg</span>
                    <span className="text-xs text-slate-500">总库存</span>
                </div>
             </div>
             
             <div className="space-y-2 mt-4">
                {FILAMENT_DATA.map((f, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{backgroundColor: f.color}}></div>
                            <span className="text-slate-300">{f.name}</span>
                        </div>
                        <span className="text-slate-500">{f.value}g</span>
                    </div>
                ))}
             </div>
             <button className="w-full mt-4 py-2 border border-slate-700 rounded-lg text-slate-300 text-sm hover:bg-slate-800 hover:text-white transition-colors">
                补货申请 (自动)
             </button>
          </div>

          {/* Mini Map */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 relative overflow-hidden group">
              <div className="absolute inset-0 opacity-30 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Mercator_projection_Square.JPG/640px-Mercator_projection_Square.JPG')] bg-cover grayscale bg-center group-hover:scale-105 transition-transform duration-700"></div>
              <div className="relative z-10">
                  <h3 className="text-lg font-semibold text-white mb-1">附近需求</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <span className="text-xs text-slate-300">3公里内有 5 个新订单</span>
                  </div>
                  <button className="w-full bg-blue-600/90 backdrop-blur-sm py-2 rounded-lg text-white text-sm font-medium hover:bg-blue-500 transition-colors flex items-center justify-center gap-2">
                    <MapPin size={16} />
                    查看分布图
                  </button>
              </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) => (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">{label}</p>
                <p className="text-2xl font-bold text-white mt-1">{value}</p>
            </div>
            <div className="bg-slate-800 p-2 rounded-lg">{icon}</div>
        </div>
    </div>
);

const PrinterCard: React.FC<{ printer: PrinterStatus }> = ({ printer }) => {
    const isError = printer.status === 'ERROR';
    const isIdle = printer.status === 'IDLE';
    const statusText = isError ? '故障' : isIdle ? '空闲' : '打印中';
    
    return (
        <div className={`p-5 rounded-xl border ${isError ? 'bg-red-900/10 border-red-900/50' : 'bg-slate-900 border-slate-800'} relative overflow-hidden transition-all hover:border-slate-600`}>
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isError ? 'bg-red-500/20 text-red-400' : isIdle ? 'bg-slate-700 text-slate-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {isError ? <AlertTriangle size={20} /> : <Printer size={20} />}
                    </div>
                    <div>
                        <h4 className="text-white font-medium">{printer.name}</h4>
                        <p className={`text-xs ${isError ? 'text-red-400' : 'text-slate-400'}`}>{statusText}</p>
                    </div>
                </div>
                <button className="text-slate-500 hover:text-white"><Settings size={16} /></button>
            </div>

            {printer.status === 'PRINTING' && (
                <div className="space-y-3">
                    <div className="flex justify-between text-xs text-slate-400">
                        <span>{printer.currentJob}</span>
                        <span className="text-white">{printer.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5">
                        <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${printer.progress}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 pt-1">
                        <span className="flex items-center gap-1"><Battery size={10} /> 耗材: {printer.filamentRemaining}%</span>
                        <span>{printer.temperature}°C</span>
                    </div>
                </div>
            )}
            
             {printer.status === 'ERROR' && (
                <div className="mt-2 bg-red-500/10 border border-red-500/20 rounded-md p-2">
                    <p className="text-xs text-red-400 font-medium">检测到喷头堵塞。AI建议：冷拉法或使用通针清理。</p>
                    <button className="mt-2 w-full bg-red-600 text-white text-xs py-1 rounded hover:bg-red-500">启动维修向导</button>
                </div>
            )}

            {isIdle && (
                <div className="flex items-center justify-center h-16 border-2 border-dashed border-slate-800 rounded-lg">
                    <span className="text-slate-600 text-xs font-medium">等待分配任务</span>
                </div>
            )}
        </div>
    );
};