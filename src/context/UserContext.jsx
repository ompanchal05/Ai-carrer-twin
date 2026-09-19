import React, { createContext, useState } from 'react';
import { initialUserProfile } from '../utils/mockData';
import toast from 'react-hot-toast';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('ai_career_twin_profile');
    return saved ? JSON.parse(saved) : initialUserProfile;
  });

  const updateProfileData = (updatedFields) => {
    setProfile((prev) => {
      const next = { ...prev, ...updatedFields };
      localStorage.setItem('ai_career_twin_profile', JSON.stringify(next));
      return next;
    });
    toast.success('Profile updated successfully!');
  };

  const addSkill = (skill) => {
    if (!skill || profile.skills.includes(skill)) return;
    updateProfileData({ skills: [...profile.skills, skill] });
  };

  const removeSkill = (skillToRemove) => {
    updateProfileData({ skills: profile.skills.filter(s => s !== skillToRemove) });
  };

  return (
    <UserContext.Provider value={{ profile, setProfile, updateProfileData, addSkill, removeSkill }}>
      {children}
    </UserContext.Provider>
  );
};
