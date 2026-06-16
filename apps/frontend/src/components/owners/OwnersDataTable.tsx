'use client';

import React from 'react';
import { Owner, OwnersListResponse } from '@/types/owner';

interface Props {
  data: OwnersListResponse;
}

const TIER_COLORS = {
  FREE: 'bg-blue-100 text-blue-800',
  PRO: 'bg-violet-100 text-violet-800',
  PLUS: 'bg-green-100 text-green-800',
  EXTREME: 'bg-orange-100 text-orange-800',
};

const STATUS_COLORS = {
  active: 'bg-green-100 text-green-800',
  trial: 'bg-amber-100 text-amber-800',
  pending: 'bg-orange-100 text-orange-800',
};

export const OwnersDataTable: React.FC<Props> = ({ data }) => {
  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center">
          <input type="text" placeholder="Search owners..." className="px-4 py-2 border rounded-md" />
          <div className="flex gap-2">
            {Object.keys(TIER_COLORS).map((tier) => (
              <span key={tier} className={`px-3 py-1 rounded-full text-xs font-semibold ${TIER_COLORS[tier as keyof typeof TIER_COLORS]}`}>
                {tier}
              </span>
            ))}
          </div>
        </div>
      </div>

      {data.owners.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No owners found.</div>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">Owner</th>
              <th className="py-2">Tier</th>
              <th className="py-2">Tenants</th>
              <th className="py-2">Admins</th>
              <th className="py-2">Status</th>
              <th className="py-2">Created</th>
              <th className="py-2">MRR</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.owners.map((owner) => (
              <tr key={owner.id} className="hover:bg-[#fbfcff] border-b">
                <td className="py-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 text-white flex items-center justify-center font-bold text-xs">
                    {owner.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{owner.name}</div>
                    <div className="text-xs text-gray-500">{owner.email}</div>
                  </div>
                </td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded text-xs ${TIER_COLORS.FREE}`}>FREE</span>
                </td>
                <td className="py-3">{owner.tenantCount}</td>
                <td className="py-3">{owner.adminUserCount}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded text-xs ${STATUS_COLORS.active}`}>Active</span>
                </td>
                <td className="py-3">-</td>
                <td className="py-3">-</td>
                <td className="py-3">...</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="mt-4 flex justify-between text-sm text-gray-500">
        <div>Showing {data.owners.length} of {data.totalCount}</div>
        <div>Pagination...</div>
      </div>
    </div>
  );
};
