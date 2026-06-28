'use client';

import { Edit3, Trash2 } from 'lucide-react';

export function ExperienceSection({ experiences, onEdit, onDelete }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Experience</h2>
        <button
          onClick={() => onEdit('experience', {})}
          className="px-4 py-1.5 border border-gray-300 text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors text-sm"
        >
          + Add
        </button>
      </div>
      <div className="space-y-5">
        {experiences && experiences.map((exp, index) => (
          <div
            key={exp.id}
            className={`pb-5 group ${index !== experiences.length - 1 ? 'border-b border-gray-200' : ''}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-base font-bold text-gray-900">{exp.title}</h3>
                <p className="text-base text-gray-600 font-medium">{exp.company}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </p>
                <p className="text-sm text-gray-500">{exp.location}</p>
                <p className="text-gray-700 text-sm mt-3 leading-relaxed">{exp.description}</p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit('experience', exp)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Edit experience"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => onDelete(exp.id)}
                  className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors"
                  aria-label="Delete experience"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
