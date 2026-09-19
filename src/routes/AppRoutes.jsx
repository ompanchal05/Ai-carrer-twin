import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

import LandingPage from '../pages/Landing/LandingPage';
import LoginPage from '../pages/Login/LoginPage';
import RegisterPage from '../pages/Register/RegisterPage';

import DashboardPage from '../pages/Dashboard/DashboardPage';
import ProfilePage from '../pages/Profile/ProfilePage';
import ResumeUploadPage from '../pages/ResumeUpload/ResumeUploadPage';
import CareerRecommendationPage from '../pages/CareerRecommendation/CareerRecommendationPage';
import ATSAnalysisPage from '../pages/ATSAnalysis/ATSAnalysisPage';
import SalaryPredictionPage from '../pages/SalaryPrediction/SalaryPredictionPage';
import SkillGapPage from '../pages/SkillGap/SkillGapPage';
import LearningRoadmapPage from '../pages/LearningRoadmap/LearningRoadmapPage';
import InterviewPrepPage from '../pages/InterviewPrep/InterviewPrepPage';
import ReportsPage from '../pages/Reports/ReportsPage';
import SettingsPage from '../pages/Settings/SettingsPage';
import NotFoundPage from '../pages/NotFound/NotFoundPage';

import { useAuth } from '../hooks/useAuth';

// Protected Route Guard Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Public Pages */}
        <Route index element={<LandingPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* Protected Dashboard & Feature Pages */}
        <Route path="dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="resume-upload" element={<ProtectedRoute><ResumeUploadPage /></ProtectedRoute>} />
        <Route path="career-recommendation" element={<ProtectedRoute><CareerRecommendationPage /></ProtectedRoute>} />
        <Route path="ats-analysis" element={<ProtectedRoute><ATSAnalysisPage /></ProtectedRoute>} />
        <Route path="salary-prediction" element={<ProtectedRoute><SalaryPredictionPage /></ProtectedRoute>} />
        <Route path="skill-gap" element={<ProtectedRoute><SkillGapPage /></ProtectedRoute>} />
        <Route path="learning-roadmap" element={<ProtectedRoute><LearningRoadmapPage /></ProtectedRoute>} />
        <Route path="interview-prep" element={<ProtectedRoute><InterviewPrepPage /></ProtectedRoute>} />
        <Route path="reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
        <Route path="settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

        {/* 404 Catch All */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
