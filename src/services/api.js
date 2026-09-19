import axios from 'axios';
import {
  initialUserProfile,
  careerRecommendations,
  atsAnalysisData,
  salaryPredictionData,
  skillGapData,
  learningRoadmapData,
  interviewPrepData,
  reportsData,
  recentActivities
} from '../utils/mockData';

// Create base Axios instance (ready for real backend API integration later)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.aicareertwin.internal/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor placeholder
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ai_career_twin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper to simulate asynchronous network latency for smooth UI loader demonstration
const mockDelay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const getProfile = async () => {
  await mockDelay();
  return { data: initialUserProfile };
};

export const updateProfile = async (updatedData) => {
  await mockDelay(600);
  return { data: { ...initialUserProfile, ...updatedData } };
};

export const getCareerRecommendations = async () => {
  await mockDelay(500);
  return { data: careerRecommendations };
};

export const getAtsAnalysis = async () => {
  await mockDelay(500);
  return { data: atsAnalysisData };
};

export const getSalaryPrediction = async (params = {}) => {
  await mockDelay(450);
  return { data: salaryPredictionData };
};

export const getSkillGap = async () => {
  await mockDelay(400);
  return { data: skillGapData };
};

export const getLearningRoadmap = async () => {
  await mockDelay(500);
  return { data: learningRoadmapData };
};

export const getInterviewPrep = async () => {
  await mockDelay(400);
  return { data: interviewPrepData };
};

export const getReports = async () => {
  await mockDelay(500);
  return { data: reportsData };
};

export const getRecentActivities = async () => {
  await mockDelay(300);
  return { data: recentActivities };
};

export const uploadResumeFile = async (file) => {
  await mockDelay(1200); // simulate upload & AI processing
  return {
    data: {
      success: true,
      filename: file.name,
      parsedDate: new Date().toISOString(),
      atsScore: 92,
      extractedSkills: ["Python", "PyTorch", "React", "FastAPI", "Docker", "Tailwind CSS"],
      message: "Resume parsed successfully by AI Twin pipeline!"
    }
  };
};

export default api;
