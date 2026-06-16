'use client';

import React from 'react';
import { OwnersListResponse } from '@/types/owner';

interface Props {
  data: OwnersListResponse;
}

export const OwnersInsights: React.FC<Props> = ({ data }) => {
  // Simple aggregation for demo
  const tierCounts = data.owners.reduce((acc, curr) => {
    // Dummy logic
    const tier = 'FREE'; 
    acc[tier] = (acc[tier] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="w-[350px] border-l p-6 flex flex-col gap-6">
      <div className="bg-white p-4 rounded-xl border">
        <h3 className="font-bold mb-4">Tier Distribution</h3>
        <div 
          className="w-32 h-32 rounded-full mx-auto"
          style={{
            background: 'conic-gradient(#3b82f6 0% 50%, #8b5cf6 50% 100%)'
          }}
        />
      </div>

      <div className="bg-white p-4 rounded-xl border">
        <h3 className="font-bold mb-4">Owner Growth</h3>
        <svg viewBox="0 0 100 50" className="w-full h-auto">
          <path d="M0 50 L0 30 Q 50 10 100 20 L 100 50 Z" fill="#e0e7ff" />
          <path d="M0 30 Q 50 10 100 20" stroke="#4f46e5" strokeWidth="2" fill="none" />
        </svg>
      </div>

      <a href="#" className="text-blue-600 text-sm font-medium mt-auto">
        Lihat laporan lengkap →
      </a>
    </div>
  );
};
