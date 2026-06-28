"use client";

import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { ProfileBio } from "../components/profile/ProfileBio";
import { ExperienceSection } from "../components/profile/ExperienceSection";
import { EducationSection } from "../components/profile/EducationSection";
import { SkillsSection } from "../components/profile/SkillsSection";
import { EditModal } from "../components/profile/EditModal";
import api from "../utils/api";
import { UserDataContext } from "../context/UserContext";

const normalizeProfile = (user) => {
  if (!user)
    return {
      experiences: [],
      education: [],
      skills: [],
    };

  const experiences = Array.isArray(user.experience)
    ? user.experience.map((item) => ({
        id: item._id?.toString() || item.id || Date.now().toString(),
        title: item.title || "",
        company: item.company || "",
        description: item.description || "",
        location: item.location || "",
        startDate: item.startDate || "",
        endDate: item.endDate || "",
        current: Boolean(item.current),
      }))
    : [];

  const education = Array.isArray(user.education)
    ? user.education.map((item) => ({
        id: item._id?.toString() || item.id || Date.now().toString(),
        school: item.college || item.school || "",
        degree: item.degree || "",
        fieldOfStudy: item.fieldOfStudy || "",
        startYear: item.courseDuration?.startDate || item.startYear || "",
        endYear: item.courseDuration?.endDate || item.endYear || "",
      }))
    : [];

  return {
    ...user,
    experiences,
    education,
    skills: Array.isArray(user.skills)
      ? user.skills
      : typeof user.skills === "string"
        ? user.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean)
        : [],
  };
};

const stripSubdocIds = (items) =>
  items.map(({ id, _id, ...rest }) => ({ ...rest }));

export function ProfilePage({ initialProfile }) {
  const navigate = useNavigate();
  const { setUserData } = useContext(UserDataContext);
  const [profile, setProfile] = useState(normalizeProfile(initialProfile));
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editSection, setEditSection] = useState(null);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    setProfile(normalizeProfile(initialProfile));
  }, [initialProfile]);

  const handleEdit = (section, data) => {
    setEditSection(section);
    setEditData(data || null);
    setEditModalOpen(true);
  };

  const handleImageUpload = async (imageType, file) => {
    try {
      const formData = new FormData();
      formData.append(imageType, file);

      const response = await api.put("/updateimages", formData);

      const normalized = normalizeProfile(response.data.user);
      setProfile(normalized);
      setUserData?.(response.data.user);
    } catch (error) {
      console.error("Failed to upload image", error);
    }
  };

  const handleSave = async (data) => {
    try {
      let updatedUser;
      let updatedProfile = profile;

      switch (editSection) {
        case "bio": {
          const response = await api.put("/updatebio", { about: data.bio });
          updatedUser = response.data.user;
          break;
        }

        case "experience": {
          const updatedExperiences = data.id
            ? profile.experiences.map((exp) =>
                exp.id === data.id ? data : exp,
              )
            : [...profile.experiences, { id: Date.now().toString(), ...data }];

          const response = await api.put("/updateexperience", {
            experience: stripSubdocIds(updatedExperiences),
          });
          updatedUser = response.data.user;
          break;
        }

        case "education": {
          const updatedEducation = data.id
            ? profile.education.map((edu) => (edu.id === data.id ? data : edu))
            : [...profile.education, { id: Date.now().toString(), ...data }];

          const response = await api.put("/updateeducation", {
            education: updatedEducation.map(({ id, ...rest }) => ({
              college: rest.school,
              degree: rest.degree,
              fieldOfStudy: rest.fieldOfStudy,
              courseDuration: {
                startDate: rest.startYear,
                endDate: rest.endYear,
              },
            })),
          });
          updatedUser = response.data.user;
          break;
        }

        case "skills": {
          const response = await api.put("/updateskills", {
            skills: Array.isArray(data.skills)
              ? data.skills
              : data.skills
                  .split(",")
                  .map((skill) => skill.trim())
                  .filter(Boolean),
          });
          updatedUser = response.data.user;
          break;
        }

        default:
          return;
      }

      if (updatedUser) {
        const normalized = normalizeProfile(updatedUser);
        setProfile(normalized);
        setUserData?.(updatedUser);
      }
    } catch (error) {
      console.error("Failed to save profile", error);
    }
  };

  const handleDelete = async (section, id) => {
    try {
      if (section === "experience") {
        const updatedExperiences = profile.experiences.filter(
          (exp) => exp.id !== id,
        );
        const response = await api.put("/updateexperience", {
          experience: stripSubdocIds(updatedExperiences),
        });
        const normalized = normalizeProfile(response.data.user);
        setProfile(normalized);
        setUserData?.(response.data.user);
      } else if (section === "education") {
        const updatedEducation = profile.education.filter(
          (edu) => edu.id !== id,
        );
        const response = await api.put("/updateeducation", {
          education: updatedEducation.map(({ id, ...rest }) => ({
            college: rest.school,
            degree: rest.degree,
            fieldOfStudy: rest.fieldOfStudy,
            courseDuration: {
              startDate: rest.startYear,
              endDate: rest.endYear,
            },
          })),
        });
        const normalized = normalizeProfile(response.data.user);
        setProfile(normalized);
        setUserData?.(response.data.user);
      }
    } catch (error) {
      console.error("Failed to delete item", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <button
          type="button"
          onClick={() => navigate("/feed")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <span className="text-xl">←</span>
          Back to feed
        </button>

        <ProfileHeader
          profile={profile}
          onEdit={handleEdit}
          onImageUpload={handleImageUpload}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <ProfileBio bio={profile.bio} onEdit={handleEdit} />

            <ExperienceSection
              experiences={profile.experiences}
              onEdit={(section, data) => handleEdit(section, data)}
              onDelete={(id) => handleDelete("experience", id)}
            />

            <EducationSection
              education={profile.education}
              onEdit={(section, data) => handleEdit(section, data)}
              onDelete={(id) => handleDelete("education", id)}
            />

            <SkillsSection skills={profile.skills} onEdit={handleEdit} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sticky top-8">
              <h3 className="text-sm font-bold text-gray-900 mb-4">
                Profile Strength
              </h3>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: "85%" }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-gray-900">85%</span>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                You are 3 steps away from 100%
              </p>
            </div>
          </div>
        </div>
      </div>

      <EditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSave}
        section={editSection}
        data={editData}
      />
    </div>
  );
}
