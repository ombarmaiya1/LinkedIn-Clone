'use client';

import { Edit3 } from 'lucide-react';

export function ProfileBio({ bio, onEdit }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">About</h2>
        <button
          onClick={() => onEdit('bio', { bio })}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Edit about"
        >
          <Edit3 size={18} />
        </button>
      </div>
      <p className="text-gray-700 leading-relaxed text-base">{bio}</p>
    </div>
  );
}
