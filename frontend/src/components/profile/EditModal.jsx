'use client';

import { useState, useEffect } from 'react';
import { X, Briefcase, BookOpen, Award, Type } from 'lucide-react';

// Section configuration for personalized UI
const SECTION_CONFIG = {
  bio: {
    title: 'Edit About',
    icon: Type,
    color: 'blue',
    description: 'Share your professional background and interests'
  },
  experience: {
    title: 'Edit Experience',
    icon: Briefcase,
    color: 'purple',
    description: 'Highlight your professional experience'
  },
  education: {
    title: 'Edit Education',
    icon: BookOpen,
    color: 'green',
    description: 'Add your educational background'
  },
  skills: {
    title: 'Edit Skills',
    icon: Award,
    color: 'orange',
    description: 'Showcase your professional skills'
  }
};

const colorMap = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', accent: 'bg-blue-100' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600', accent: 'bg-purple-100' },
  green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600', accent: 'bg-green-100' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600', accent: 'bg-orange-100' }
};

export function EditModal({ isOpen, onClose, onSave, section, data }) {
  const [formData, setFormData] = useState(data || {});
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    setFormData(data || {});
    if (section === 'bio' && data?.bio) {
      setCharCount(data.bio.length);
    }
  }, [data, isOpen, section]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (name === 'bio') {
      setCharCount(value.length);
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  if (!isOpen || !section) return null;

  const config = SECTION_CONFIG[section];
  const colors = colorMap[config.color];
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Personalized Header */}
        <div className={`${colors.bg} border-b ${colors.border} p-6 sticky top-0 rounded-t-2xl`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`${colors.accent} p-2.5 rounded-lg`}>
                <Icon className={`w-5 h-5 ${colors.text}`} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{config.title}</h2>
                <p className="text-sm text-gray-600 mt-1">{config.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-white rounded-full p-1 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {section === 'bio' && (
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-gray-900">About You</label>
                  <span className={`text-xs font-medium ${charCount > 2600 ? 'text-red-600' : 'text-gray-500'}`}>
                    {charCount}/2600
                  </span>
                </div>
                <textarea
                  name="bio"
                  value={formData.bio || ''}
                  onChange={handleChange}
                  placeholder="Tell us about your professional background, skills, and interests. Be authentic and concise."
                  maxLength={2600}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none"
                  rows={5}
                />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-700">
                  💡 Tip: Include your professional expertise, industry experience, and what you&apos;re passionate about. This helps others learn more about you quickly.
                </p>
              </div>
            </div>
          )}

          {section === 'experience' && (
            <div className="space-y-5">
              {/* Job Title & Company */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900">Position Details</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title || ''}
                    onChange={handleChange}
                    placeholder="e.g., Senior Software Engineer"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name *</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company || ''}
                    onChange={handleChange}
                    placeholder="e.g., Tech Company"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location || ''}
                    onChange={handleChange}
                    placeholder="e.g., San Francisco, CA"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  />
                </div>
              </div>

              {/* Employment Duration */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900">Employment Duration</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Start Date *</label>
                    <input
                      type="text"
                      name="startDate"
                      value={formData.startDate || ''}
                      onChange={handleChange}
                      placeholder="e.g., Jan 2020"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">End Date</label>
                    <input
                      type="text"
                      name="endDate"
                      value={formData.endDate || ''}
                      onChange={handleChange}
                      placeholder="e.g., Dec 2021"
                      disabled={formData.current}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    name="current"
                    checked={formData.current || false}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 rounded border-gray-300 accent-purple-600"
                  />
                  <span className="text-sm font-medium text-gray-700">I currently work here</span>
                </label>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900">Role Summary</h3>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  placeholder="Describe your key responsibilities and achievements in this role..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 resize-none"
                  rows={3}
                />
              </div>
            </div>
          )}

          {section === 'education' && (
            <div className="space-y-5">
              {/* School Information */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900">School Information</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">School Name *</label>
                  <input
                    type="text"
                    name="school"
                    value={formData.school || ''}
                    onChange={handleChange}
                    placeholder="e.g., University of Technology"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Degree *</label>
                  <input
                    type="text"
                    name="degree"
                    value={formData.degree || ''}
                    onChange={handleChange}
                    placeholder="e.g., Bachelor of Science"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Field of Study *</label>
                  <input
                    type="text"
                    name="fieldOfStudy"
                    value={formData.fieldOfStudy || ''}
                    onChange={handleChange}
                    placeholder="e.g., Computer Science"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                  />
                </div>
              </div>

              {/* Time Period */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900">Graduation Period</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Start Year</label>
                    <input
                      type="text"
                      name="startYear"
                      value={formData.startYear || ''}
                      onChange={handleChange}
                      placeholder="e.g., 2015"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">End Year *</label>
                    <input
                      type="text"
                      name="endYear"
                      value={formData.endYear || ''}
                      onChange={handleChange}
                      placeholder="e.g., 2019"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {section === 'skills' && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Your Skills</label>
                <textarea
                  name="skills"
                  value={formData.skills ? formData.skills.join(', ') : ''}
                  onChange={(e) => {
                    const skills = e.target.value.split(',').map((s) => s.trim()).filter(s => s);
                    setFormData((prev) => ({
                      ...prev,
                      skills
                    }));
                  }}
                  placeholder="Type skills separated by commas. e.g., React, Node.js, TypeScript, AWS"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 resize-none"
                  rows={3}
                />
              </div>

              {/* Live Preview */}
              {formData.skills && formData.skills.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-900">Preview</h3>
                  <div className="flex flex-wrap gap-2 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    {formData.skills.map((skill, index) => (
                      skill && (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 bg-gray-100 text-gray-900 px-3 py-1.5 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      )
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-xs text-orange-700">
                  💡 Tip: Add up to 10-15 skills that best represent your expertise. Employers often search for specific skills, so choose wisely.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`flex justify-end gap-3 p-6 border-t ${colors.border} ${colors.bg} sticky bottom-0 rounded-b-2xl`}>
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-900 font-semibold border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`px-6 py-2 ${colors.text} bg-white border ${colors.border} font-semibold rounded-full hover:${colors.bg} transition-colors`}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
