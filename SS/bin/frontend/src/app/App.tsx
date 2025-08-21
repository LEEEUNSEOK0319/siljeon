import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import { LoginScreen } from '../features/auth/LoginScreen';
import { SignupScreen } from '../features/auth/SignupScreen';
import { OnboardingScreen } from '../features/home/OnboardingScreen';
import { HomeScreen } from '../features/home/HomeScreen';
import { MainChatInterface } from '../features/chat/MainChatInterface';
import { SettingsScreen } from '../features/settings/SettingsScreen';
import { FilePreviewDrawer } from '../features/files/FilePreviewDrawer';
import { useFiles } from '../features/files/useFiles';
import { useApiKeys } from '../features/settings/useApiKeys';
import { useMobile } from '../hooks/useMobile';
import type { FileItem } from '../types';

// 모바일 컴포넌트 import (기존과 동일)
import MobileHomeScreen from '../components/mobile/MobileHomeScreen';
import MobileChatInterface from '../components/mobile/MobileChatInterface';
import MobileSettingsScreen from '../components/mobile/MobileSettingsScreen';
import MobileBottomNav from '../components/mobile/MobileBottomNav';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const {
    files,
    showPreviewDrawer,
    selectedFile,
    onFileSelect,
    onToggleFavorite,
    handleClosePreview,
  } = useFiles();

  const {
    apiKeys,
    hasConnectedApiKeys,
    onUpdateApiKeys,
    onDisconnectAllApiKeys,
    onDisconnectApiKey,
    onConnectApiKey,
  } = useApiKeys();

  const { isMobile } = useMobile();

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    navigate('/login');
  };
  
  // isMobile 상태에 따라 데스크톱 또는 모바일 라우트를 렌더링
  if (isMobile) {
    return (
        <div className={isDarkMode ? 'dark' : ''}>
            {/* 모바일 UI는 기존의 state 기반으로 잠시 되돌립니다. 라우팅은 데스크탑부터 안정화 후 적용하는 것이 안전합니다. */}
            {/* 이 부분은 추후 모바일 전용 라우팅으로 개선할 수 있습니다. */}
            <Routes>
                 <Route path="/" element={<Navigate to="/login" replace />} />
                 <Route path="/login" element={<LoginScreen onLogin={() => navigate('/onboarding')} onSignupClick={() => navigate('/signup')} />} />
                 <Route path="/signup" element={<SignupScreen onSignup={() => navigate('/onboarding')} onBackToLogin={() => navigate('/login')} />} />
                 <Route path="/onboarding" element={<OnboardingScreen onComplete={() => navigate('/home')} />} />
                 
                 <Route path="/home" element={<MobileHomeScreen onNavigateToChat={() => navigate('/chat')} onOpenSettings={() => navigate('/settings')} hasConnectedApiKeys={hasConnectedApiKeys} files={files} onToggleFavorite={onToggleFavorite} onFileSelect={onFileSelect} apiKeys={apiKeys} />} />
                 <Route path="/chat" element={<MobileChatInterface onFileSelect={onFileSelect} onBack={() => navigate('/home')} files={files} onToggleFavorite={onToggleFavorite} onOpenSettings={() => navigate('/settings')} apiKeys={apiKeys} />} />
                 <Route path="/settings" element={<MobileSettingsScreen onBack={() => navigate('/home')} onLogout={handleLogout} apiKeys={apiKeys} isDarkMode={isDarkMode} onToggleDarkMode={setIsDarkMode} />} />
            </Routes>
            
            {/* 모바일 하단 네비게이션은 모든 페이지에 공통으로 필요할 수 있으므로 Routes 밖에 둘 수 있습니다. */}
            {/* <MobileBottomNav ... /> */}
        </div>
    );
  }

  // --- 데스크톱 라우팅 ---
  return (
    <>
      {selectedFile && (
        <FilePreviewDrawer
          isOpen={showPreviewDrawer}
          file={selectedFile}
          onClose={handleClosePreview}
          onToggleFavorite={onToggleFavorite}
        />
      )}

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginScreen onLogin={() => navigate('/onboarding')} onSignupClick={() => navigate('/signup')} />} />
        <Route path="/signup" element={<SignupScreen onSignup={() => navigate('/onboarding')} onBackToLogin={() => navigate('/login')} />} />
        <Route path="/onboarding" element={<OnboardingScreen onComplete={() => navigate('/home')} />} />
        <Route
          path="/home"
          element={ <HomeScreen onNavigateToChat={() => navigate('/chat')} onOpenSettings={() => navigate('/settings')} hasConnectedApiKeys={hasConnectedApiKeys} files={files} onToggleFavorite={onToggleFavorite} onFileSelect={onFileSelect} onDisconnectAllApiKeys={onDisconnectAllApiKeys} apiKeys={apiKeys} /> }
        />
        <Route
          path="/chat"
          element={ <MainChatInterface onOpenSettings={() => navigate('/settings')} onFileSelect={onFileSelect} onBack={() => navigate('/home')} files={files} onToggleFavorite={onToggleFavorite} apiKeys={apiKeys} /> }
        />
        <Route
          path="/settings"
          element={ <SettingsScreen onBack={() => navigate('/home')} onLogout={handleLogout} apiKeys={apiKeys} onUpdateApiKeys={onUpdateApiKeys} onDisconnectApiKey={onDisconnectApiKey} onConnectApiKey={onConnectApiKey} isDarkMode={isDarkMode} onToggleDarkMode={setIsDarkMode} /> }
        />
        <Route path="*" element={<div><h1>404 - Page Not Found</h1></div>} />
      </Routes>
    </>
  );
}