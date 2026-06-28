'use client';

import { Edit3, Trash2 } from 'lucide-react';

export function EducationSection({ education, onEdit, onDelete }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Education</h2>
        <button
          onClick={() => onEdit('education', {})}
          className="px-4 py-1.5 border border-gray-300 text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors text-sm"
        >
          + Add
        </button>
      </div>
      <div className="space-y-5">
        {education.map((edu, index) => (
          <div
            key={edu.id}
            className={`pb-5 group ${index !== education.length - 1 ? 'border-b border-gray-200' : ''}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-base font-bold text-gray-900">{edu.school}</h3>
                <p className="text-base text-gray-600 font-medium">
                  {edu.degree} in {edu.fieldOfStudy}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {edu.startYear} - {edu.endYear}
                </p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit('education', edu)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Edit education"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => onDelete(edu.id)}
                  className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors"
                  aria-label="Delete education"
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
