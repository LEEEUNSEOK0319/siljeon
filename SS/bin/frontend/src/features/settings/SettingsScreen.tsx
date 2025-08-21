import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { ApiKeyModal } from '../settings/ApiKeyModal';
import { ApiConnectionStatus } from '../settings/ApiConnectionStatus';
import { HelpModal } from '../../components/common/HelpModal';
import type { ApiKey } from '../../types';
import {
  ArrowLeft,
  User,
  Shield,
  Palette,
  HelpCircle,
  LogOut,
  Settings as SettingsIcon,
  Moon,
  Sun,
  Download,
  Trash2,
  Key,
  Mail,
  Phone,
  Camera,
  Save,
  Edit,
  Plus,
  MoreVertical,
  Eye,
  Copy,
  Unplug,
  Plug,
  CheckCircle,
  XCircle
} from 'lucide-react';

// --- 소셜 로그인 아이콘 컴포넌트 (그대로 유지) ---
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" /><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" /><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.519-3.355-11.113-7.918l-6.522,5.023C9.505,39.556,16.227,44,24,44z" /><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.986,36.681,44,30.986,44,24C44,22.659,43.862,21.35,43.611,20.083z" /></svg>
);
const KakaoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px" {...props}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.52 0 10-4.48 10-10S17.52 2 12 2zm1.06 13.44c-.4.23-1.02.5-1.72.58-.02 0-.03 0-.05.01-.13.01-.26.01-.39.01-.68 0-1.33-.12-1.9-.34-.95-.37-1.5-1.12-1.5-2.07 0-1.29 1.12-2.34 2.5-2.34.82 0 1.51.37 1.9.7l-.61.99c-.27-.26-.74-.53-1.29-.53-.69 0-1.25.45-1.25 1.15s.56 1.15 1.25 1.15c.19 0 .38-.02.56-.06l.75 1.22zM17.5 12c0 .96-.54 1.7-1.5 2.07-.57.22-1.23.34-1.9.34-.13 0-.26 0-.39-.01-.02 0-.03 0-.05-.01-.7-.08-1.32-.35-1.72-.58l.75-1.22c.18.04.37.06.56.06.69 0 1.25-.45 1.25-1.15s-.56-1.15-1.25-1.15c-.55 0-1.02.27-1.29.53l-.61-.99c.39-.33 1.08-.7 1.9-.7 1.38 0 2.5 1.05 2.5 2.34z" fill="#3C1E1E"/></svg>
);

interface SettingsScreenProps {
  onBack: () => void;
  onLogout: () => void;
  apiKeys: ApiKey[];
  onUpdateApiKeys: (newApiKeys: ApiKey[]) => void;
  onDisconnectApiKey: (apiKeyId: string) => void;
  onConnectApiKey: (apiKeyId: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: (value: boolean) => void;
}

export function SettingsScreen({
  onBack,
  onLogout,
  apiKeys,
  onUpdateApiKeys,
  onDisconnectApiKey,
  onConnectApiKey,
  isDarkMode,
  onToggleDarkMode
}: SettingsScreenProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'security' | 'about'>('profile');
  const [profileData, setProfileData] = useState({
    name: '김사용자',
    email: 'user@company.com',
    phone: '+82 10-1234-5678',
    department: '마케팅팀',
    position: '과장'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [editingApiKey, setEditingApiKey] = useState<{ id: string; name: string; key: string } | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const tabs = [
    { id: 'profile', label: '프로필', icon: <User className="w-4 h-4" /> },
    { id: 'preferences', label: '환경설정', icon: <Palette className="w-4 h-4" /> },
    { id: 'security', label: '보안', icon: <Shield className="w-4 h-4" /> },
    { id: 'about', label: '정보', icon: <HelpCircle className="w-4 h-4" /> }
  ];

  const handleSaveProfile = () => {
    setIsEditing(false);
    // 프로필 저장 로직
  };

  const handleAddApiKey = () => {
    setEditingApiKey(null);
    setShowApiKeyModal(true);
  };

  const handleEditApiKey = (apiKey: typeof apiKeys[0]) => {
    setEditingApiKey(apiKey);
    setShowApiKeyModal(true);
  };

  const handleSaveApiKey = (key: string, name: string) => {
    if (editingApiKey) {
      // 기존 키 수정
      const updatedApiKeys = apiKeys.map(item =>
        item.id === editingApiKey.id
          ? { ...item, name, key, maskedKey: key.substring(0, 3) + '***************' + key.slice(-4) }
          : item
      );
      onUpdateApiKeys(updatedApiKeys);
    } else {
      // 새 키 추가
      const newKey = {
        id: Date.now().toString(),
        name,
        key,
        maskedKey: key.substring(0, 3) + '***************' + key.slice(-4),
        created: new Date().toISOString().split('T')[0],
        lastUsed: '방금 전',
        isConnected: true
      };
      onUpdateApiKeys([...apiKeys, newKey]);
    }
    setShowApiKeyModal(false);
    setEditingApiKey(null);
  };

  const handleDeleteApiKey = (id: string) => {
    onUpdateApiKeys(apiKeys.filter(key => key.id !== id));
  };

  const handleCopyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    // 토스트 알림을 추가할 수 있음
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-8 -right-8 w-96 h-96 bg-gradient-accent opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 -left-12 w-80 h-80 bg-gradient-secondary opacity-15 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto p-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-foreground hover:bg-accent rounded-xl w-12 h-12 p-0"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                <SettingsIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">설정</h1>
                <p className="text-muted-foreground">계정 및 앱 설정을 관리하세요</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* 사이드바 탭 */}
          <div className="lg:w-80">
            <Card className="glass-strong border border-border p-2">
              <div className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all ${activeTab === tab.id
                        ? 'bg-gradient-primary text-white shadow-lg'
                        : 'text-foreground hover:bg-accent'
                      }`}
                  >
                    {tab.icon}
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="flex-1">
            <Card className="glass-strong border border-border p-8 min-h-[600px]">
              {/* 프로필 탭 */}
              {activeTab === 'profile' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground">프로필 정보</h2>
                    <Button
                      onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                      className={`${isEditing
                          ? 'bg-gradient-primary btn-glow text-white'
                          : 'glass hover:bg-accent text-foreground'
                        } font-medium rounded-xl h-10 px-4 border-0`}
                    >
                      {isEditing ? (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          저장
                        </>
                      ) : (
                        <>
                          <Edit className="w-4 h-4 mr-2" />
                          편집
                        </>
                      )}
                    </Button>
                  </div>

                  {/* 프로필 이미지 */}
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-secondary rounded-full flex items-center justify-center">
                        <User className="w-12 h-12 text-white" />
                      </div>
                      {isEditing && (
                        <Button
                          size="sm"
                          className="absolute -bottom-2 -right-2 w-8 h-8 p-0 bg-gradient-primary text-white rounded-full shadow-lg"
                        >
                          <Camera className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{profileData.name}</h3>
                      <p className="text-muted-foreground">{profileData.department} • {profileData.position}</p>
                    </div>
                  </div>

                  {/* 프로필 폼 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-foreground">이름</Label>
                      <Input
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        disabled={!isEditing}
                        className="glass border-border bg-input h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-foreground">부서</Label>
                      <Input
                        value={profileData.department}
                        onChange={(e) => setProfileData(prev => ({ ...prev, department: e.target.value }))}
                        disabled={!isEditing}
                        className="glass border-border bg-input h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-foreground">이메일</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          value={profileData.email}
                          onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                          disabled={!isEditing}
                          className="glass border-border bg-input h-12 pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-foreground">전화번호</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          value={profileData.phone}
                          onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                          disabled={!isEditing}
                          className="glass border-border bg-input h-12 pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-foreground">직급</Label>
                      <Input
                        value={profileData.position}
                        onChange={(e) => setProfileData(prev => ({ ...prev, position: e.target.value }))}
                        disabled={!isEditing}
                        className="glass border-border bg-input h-12"
                      />
                    </div>
                  </div>

                  {/* API 연결 상태 간단 표시 */}
                  <div className="glass p-6 rounded-xl border border-border">
                    <h3 className="font-medium text-foreground mb-4">서비스 연결</h3>
                    <div className="space-y-3">
                      {apiKeys.length > 0 ? (
                        apiKeys.slice(0, 2).map(key => (
                          <div key={key.id} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                                <Key className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">{key.name}</p>
                                <div className="flex items-center space-x-2 text-xs">
                                  <div className={`w-2 h-2 rounded-full ${key.isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                  <span className={`font-medium ${key.isConnected ? 'text-green-600' : 'text-gray-500'}`}>
                                    {key.isConnected ? 'API 연결됨' : 'API 연결 안됨'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-muted-foreground">양진성</span>
                              <div className="w-6 h-6 bg-gradient-secondary rounded-full flex items-center justify-center">
                                <User className="w-3 h-3 text-white" />
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4">
                          <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mx-auto mb-3">
                            <Key className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">연결된 서비스가 없습니다</p>
                          <Button
                            onClick={() => setActiveTab('security')}
                            className="text-xs bg-gradient-primary btn-glow text-white font-medium rounded-lg px-3 h-7 border-0"
                          >
                            API 키 설정
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 환경설정 탭 - 언어 설정 제거하고 테마만 유지 */}
              {activeTab === 'preferences' && (
                <div className="space-y-8 animate-fade-in">
                  <h2 className="text-xl font-semibold text-foreground">환경설정</h2>

                  {/* 테마 설정만 유지 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-foreground">테마</h3>
                    <div className="glass p-6 rounded-xl border border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {isDarkMode ? <Moon className="w-5 h-5 text-muted-foreground" /> : <Sun className="w-5 h-5 text-muted-foreground" />}
                          <div>
                            <p className="font-medium text-foreground">다크 모드</p>
                            <p className="text-sm text-muted-foreground">
                              {isDarkMode ? '어두운 테마가 활성화되어 있습니다' : '밝은 테마가 활성화되어 있습니다'}
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={isDarkMode}
                          onCheckedChange={onToggleDarkMode}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 보안 탭 */}
              {activeTab === 'security' && (
                <div className="space-y-8 animate-fade-in">
                  <h2 className="text-xl font-semibold text-foreground">보안</h2>

                  <div className="space-y-6">
                    {/* 비밀번호 변경 */}
                    <div className="glass p-6 rounded-xl border border-border card-hover">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Key className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-foreground">비밀번호 변경</p>
                            <p className="text-sm text-muted-foreground">마지막 변경: 3개월 전</p>
                          </div>
                        </div>
                        <Button className="glass hover:bg-accent text-foreground font-medium rounded-xl border-0">
                          변경
                        </Button>
                      </div>
                    </div>

                    {/* API 키 관리 */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Key className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-foreground">API 키 관리</p>
                            <p className="text-sm text-muted-foreground">외부 서비스 연동을 위한 API 키</p>
                          </div>
                        </div>
                        <Button
                          onClick={handleAddApiKey}
                          className="bg-gradient-primary btn-glow text-white font-medium rounded-xl px-4 h-10 border-0"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          추가
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {apiKeys.map((apiKey) => (
                          <div key={apiKey.id} className="glass p-4 rounded-xl border border-border card-hover">
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-3 mb-2">
                                  <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center">
                                    <Key className="w-4 h-4 text-white" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-foreground">{apiKey.name}</p>
                                    <p className="text-sm text-muted-foreground font-mono">{apiKey.maskedKey}</p>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <div className={`w-2 h-2 rounded-full ${apiKey.isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                    <span className={`text-xs font-medium ${apiKey.isConnected ? 'text-green-600' : 'text-gray-500'}`}>
                                      {apiKey.isConnected ? '연결됨' : '연결 안됨'}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                  <span>생성: {apiKey.created}</span>
                                  <span>마지막 사용: {apiKey.lastUsed}</span>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2 ml-4">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => apiKey.isConnected ? onDisconnectApiKey(apiKey.id) : onConnectApiKey(apiKey.id)}
                                  className={`w-8 h-8 p-0 rounded-lg ${apiKey.isConnected
                                      ? 'text-red-500 hover:text-red-700 hover:bg-red-100/20'
                                      : 'text-green-500 hover:text-green-700 hover:bg-green-100/20'
                                    }`}
                                >
                                  {apiKey.isConnected ? <Unplug className="w-4 h-4" /> : <Plug className="w-4 h-4" />}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleCopyApiKey(apiKey.key)}
                                  className="w-8 h-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg"
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEditApiKey(apiKey)}
                                  className="w-8 h-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteApiKey(apiKey.id)}
                                  className="w-8 h-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-100/20 rounded-lg"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}

                        {apiKeys.length === 0 && (
                          <div className="glass p-8 rounded-xl border border-border text-center">
                            <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mx-auto mb-4">
                              <Key className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground mb-4">등록된 API 키가 없습니다</p>
                            <Button
                              onClick={handleAddApiKey}
                              className="bg-gradient-primary btn-glow text-white font-medium rounded-xl px-6 h-10 border-0"
                            >
                              첫 번째 API 키 추가
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* API 연결 상태 */}
                    <ApiConnectionStatus apiKeys={apiKeys} />

                    {/* 활성 세션 */}
                    <div className="glass p-6 rounded-xl border border-border">
                      <h3 className="font-medium text-foreground mb-4">활성 세션</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-foreground">Chrome - Windows</p>
                            <p className="text-xs text-muted-foreground">현재 세션 • 서울, 대한민국</p>
                          </div>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            활성
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 정보 탭 */}
              {activeTab === 'about' && (
                <div className="space-y-8 animate-fade-in">
                  <h2 className="text-xl font-semibold text-foreground">앱 정보</h2>

                  <div className="space-y-6">
                    {/* 앱 버전 */}
                    <div className="glass p-6 rounded-xl border border-border">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center">
                          <SettingsIcon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">Smart Search</h3>
                          <p className="text-muted-foreground">버전 1.0.0</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-2 border-b border-border">
                          <span className="text-sm text-muted-foreground">빌드</span>
                          <span className="text-sm font-medium text-foreground">2024.03.15</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-border">
                          <span className="text-sm text-muted-foreground">플랫폼</span>
                          <span className="text-sm font-medium text-foreground">Web</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm text-muted-foreground">개발자</span>
                          <span className="text-sm font-medium text-foreground">Dooray Team</span>
                        </div>
                      </div>
                    </div>

                    {/* 도움말 */}
                    <div className="glass p-6 rounded-xl border border-border card-hover">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <HelpCircle className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-foreground">도움말 센터</p>
                            <p className="text-sm text-muted-foreground">사용법과 문제 해결 방법을 확인하세요</p>
                          </div>
                        </div>
                        <Button
                          onClick={() => setShowHelpModal(true)}
                          className="glass hover:bg-accent text-foreground font-medium rounded-xl border-0"
                        >
                          열기
                        </Button>
                      </div>
                    </div>

                    {/* 개인정보 처리방침 */}
                    <div className="glass p-6 rounded-xl border border-border card-hover">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Shield className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-foreground">개인정보 처리방침</p>
                            <p className="text-sm text-muted-foreground">데이터 보호 정책을 확인하세요</p>
                          </div>
                        </div>
                        <Button className="glass hover:bg-accent text-foreground font-medium rounded-xl border-0">
                          보기
                        </Button>
                      </div>
                    </div>

                    {/* 로그아웃 */}
                    <div className="glass p-6 rounded-xl border border-red-200/20 bg-red-50/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <LogOut className="w-5 h-5 text-red-500" />
                          <div>
                            <p className="font-medium text-red-700">로그아웃</p>
                            <p className="text-sm text-red-600">계정에서 로그아웃합니다</p>
                          </div>
                        </div>
                        <Button
                          onClick={onLogout}
                          variant="destructive"
                          className="font-medium rounded-xl px-4 h-10 border-0"
                        >
                          로그아웃
                        </Button>
                      </div>
                      {/* --- 👇 회원탈퇴 버튼 추가 --- */}
                      <div className="text-center mt-4">
                        <button
                          // onClick 핸들러는 추후 실제 탈퇴 로직으로 연결
                          onClick={() => alert('정말루 진짜루 회원 탈퇴 할거에요?')}
                          className="text-sm text-muted-foreground hover:text-destructive hover:underline transition-colors"
                        >
                          회원 탈퇴
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* 모달들 */}
      {showApiKeyModal && (
        <ApiKeyModal
          isOpen={showApiKeyModal}
          onClose={() => setShowApiKeyModal(false)}
          onSave={handleSaveApiKey}
          editingKey={editingApiKey}
        />
      )}

      {showHelpModal && (
        <HelpModal
          isOpen={showHelpModal}
          onClose={() => setShowHelpModal(false)}
        />
      )}
    </div>
  );
}