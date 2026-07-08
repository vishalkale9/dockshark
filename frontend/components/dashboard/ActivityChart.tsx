'use client';

import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useTheme } from 'next-themes';

// Mock data to simulate the last 7 days of activity
const generateMockData = () => {
  const data = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    // Generate some believable random data
    const uploads = Math.floor(Math.random() * 20) + 5;
    const secured = Math.floor(uploads * (Math.random() * 0.4 + 0.5)); // 50-90% secured
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      uploads,
      secured,
    });
  }
  return data;
};

export default function ActivityChart() {
  const { theme } = useTheme();
  const [data, setData] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setData(generateMockData());
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-80 bg-gray-50 dark:bg-gray-800/50 rounded-2xl animate-pulse"></div>
    );
  }

  const isDark = theme === 'dark';

  return (
    <div className="bg-white dark:bg-[#1A1A2E] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-[#141B34] dark:text-white">Activity Overview</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Document processing over the last 7 days.</p>
        </div>
      </div>
      <div className="p-6">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUploads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C724B1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#C724B1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSecured" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00E5FF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke={isDark ? '#2D3748' : '#E2E8F0'} 
              />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: isDark ? '#A0AEC0' : '#718096', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: isDark ? '#A0AEC0' : '#718096', fontSize: 12 }} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? '#151522' : '#ffffff',
                  borderColor: isDark ? '#2D3748' : '#E2E8F0',
                  borderRadius: '0.75rem',
                  color: isDark ? '#ffffff' : '#141B34',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
                itemStyle={{ fontWeight: 'bold' }}
              />
              <Area 
                type="monotone" 
                dataKey="uploads" 
                name="Total Uploads"
                stroke="#C724B1" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorUploads)" 
              />
              <Area 
                type="monotone" 
                dataKey="secured" 
                name="Secured"
                stroke="#00E5FF" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorSecured)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
