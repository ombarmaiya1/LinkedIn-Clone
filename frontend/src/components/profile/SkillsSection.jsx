'use client';

import { Edit3 } from 'lucide-react';

export function SkillsSection({ skills, onEdit }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Skills</h2>
        <button
          onClick={() => onEdit('skills', { skills })}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Edit skills"
        >
          <Edit3 size={18} />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        { skills && skills.map((skill, index) => (
          <div
            key={index}
            className="bg-gray-100 text-gray-900 px-3.5 py-1.5 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            {skill}
          </div>
        ))}
      </div>
    </div>
  );
}
