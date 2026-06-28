"use client";

import { Edit3, MapPin, Camera, Image } from "lucide-react";

export function ProfileHeader({ profile, onEdit, onImageUpload }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-6">
      {/* Cover Photo */}
      <div
        className="h-52 bg-cover bg-center relative"
        style={{
          backgroundImage: profile.coverImage
            ? `url(${profile.coverImage})`
            : "linear-gradient(90deg, #0a66c2 0%, #0073b1 50%, #004182 100%)",
        }}
      >
        <div className="absolute right-4 top-4">
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 text-sm font-semibold text-gray-800 rounded-full shadow-sm cursor-pointer hover:bg-white">
            <Image size={16} />
            Cover
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  onImageUpload("coverImage", e.target.files[0]);
                }
              }}
            />
          </label>
        </div>
      </div>

      {/* Profile Content */}
      <div className="px-8 pb-6">
        {/* Profile Picture and Edit Button Row */}
        <div className="flex items-end justify-between -mt-28 mb-4 relative">
          <div className="flex items-end gap-6">
            <div className="relative">
              <img
                src={profile.profileImage}
                alt={`${profile.firstName} ${profile.lastName}`}
                className="w-48 h-48 rounded-full border-4 border-white object-cover shadow-lg"
              />
              <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-100">
                <Camera size={18} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      onImageUpload("profileImage", e.target.files[0]);
                    }
                  }}
                />
              </label>
            </div>
            <div className="pb-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {profile.firstName + " " + profile.lastName}
              </h1>
              <p className="text-lg text-gray-700 font-medium mt-1">
                {profile.headline}
              </p>
              <div className="flex items-center gap-1 text-gray-600 mt-2">
                <MapPin size={16} />
                <span className="text-sm">{profile.location}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onEdit("bio", { bio: profile.bio })}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors mb-4"
          >
            <Edit3 size={16} />
            Edit profile
          </button>
        </div>
      </div>
    </div>
  );
}
