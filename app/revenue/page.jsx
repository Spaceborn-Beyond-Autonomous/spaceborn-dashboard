'use client';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { DollarSign, TrendingUp, Clock } from 'lucide-react';

export default function Revenue() {
  const { user } = useAuth();
  const { revenue } = useData();

  if (!user || user.role !== 'admin') {
    return <div className="text-white p-6">Access denied</div>;
  }

  const completionRate = ((revenue.completed / revenue.total) * 100).toFixed(1);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 md:ml-64">
        <Header title="Revenue" />
        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#111] border border-[#222] rounded p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-[#aaa]">Total Revenue</span>
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div className="text-4xl font-semibold text-white mb-2">
                ${revenue.total.toLocaleString()}
              </div>
              <div className="text-xs text-[#aaa]">All time revenue</div>
            </div>
            
            <div className="bg-[#111] border border-[#222] rounded p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-[#aaa]">Completed Revenue</span>
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div className="text-4xl font-semibold text-white mb-2">
                ${revenue.completed.toLocaleString()}
              </div>
              <div className="text-xs text-[#aaa]">{completionRate}% of total</div>
            </div>
            
            <div className="bg-[#111] border border-[#222] rounded p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-[#aaa]">Pending Revenue</span>
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div className="text-4xl font-semibold text-white mb-2">
                ${revenue.pending.toLocaleString()}
              </div>
              <div className="text-xs text-[#aaa]">Awaiting completion</div>
            </div>
          </div>

          <div className="bg-[#111] border border-[#222] rounded p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Revenue Breakdown</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-white">Completed Projects</span>
                  <span className="text-sm text-white font-semibold">
                    ${revenue.completed.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-[#222] rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-200" 
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-white">Pending Projects</span>
                  <span className="text-sm text-white font-semibold">
                    ${revenue.pending.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-[#222] rounded-full h-2">
                  <div 
                    className="bg-[#aaa] h-2 rounded-full transition-all duration-200" 
                    style={{ width: `${((revenue.pending / revenue.total) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}