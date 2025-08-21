import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { X, Key, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  // 저장 후 상위 상태 갱신용 콜백 (필요 시 리스트 재로딩으로 대체 가능)
  onSave?: (apiURL: string, apiTitle: string) => void;
  editingKey?: { apiIdx?: number; apiTitle?: string; apiURL?: string } | null;
}

export function ApiKeyModal({ isOpen, onClose, onSave, editingKey }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState(editingKey?.apiURL ?? '');
  const [keyName, setKeyName] = useState(editingKey?.apiTitle ?? '');
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');

  useEffect(() => {
    if (isOpen) {
      setApiKey(editingKey?.apiURL ?? '');
      setKeyName(editingKey?.apiTitle ?? '');
      setShowKey(false);
      setIsLoading(false);
      setValidationStatus('idle');
    }
  }, [isOpen, editingKey]);

  if (!isOpen) return null;

  const handleClose = () => {
    setApiKey('');
    setKeyName('');
    setShowKey(false);
    setValidationStatus('idle');
    setIsLoading(false);
    onClose();
  };

  const handleSave = async () => {
    if (!apiKey.trim() || !keyName.trim()) return;
    setIsLoading(true);
    setValidationStatus('validating');

    try {
      // 1) 서버에 저장
      const res = await fetch('http://localhost:8090/api/auth/addApi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ apiTitle: keyName, apiURL: apiKey }),
      });
      if (!res.ok) throw new Error('addApi failed');

      // (선택) 2) 저장 직후 연결 시도
      const connect = await fetch('http://localhost:8090/api/dooray/driveConnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ apiToken: apiKey, apiTitle: keyName }),
      });

      // Dooray 연결 성공/실패 여부와 무관하게 최소 성공 UX 제공
      if (connect.ok) {
        setValidationStatus('valid');
      } else {
        // 연결 실패시에도 저장은 성공했을 수 있음
        setValidationStatus('invalid');
      }

      // 상위에 변경 알림(필요 시)
      onSave?.(apiKey, keyName);

      // 약간의 지연 후 닫기
      setTimeout(() => {
        setIsLoading(false);
        handleClose();
      }, 500);
    } catch (e) {
      console.error(e);
      setValidationStatus('invalid');
      setIsLoading(false);
    }
  };

  const handleKeyChange = (value: string) => {
    setApiKey(value);
    setValidationStatus('idle');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      {/* 모달 콘텐츠 */}
      <div className="relative w-full max-w-md mx-4 glass-strong border border-white/20 rounded-2xl shadow-2xl animate-fade-in">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Key className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingKey ? 'API 키 수정' : 'Dooray API 키 설정'}
              </h2>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose} className="w-8 h-8 p-0 text-gray-500 hover:bg-white/10 rounded-lg">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* 콘텐츠 */}
        <div className="p-6 space-y-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Dooray 드라이브에서 파일을 검색하려면 API 키가 필요합니다.
              키는 안전하게 암호화되어 저장됩니다.
            </p>
          </div>

          {/* API 키 이름 */}
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300">API 키 이름</Label>
            <Input
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              placeholder="예: 개발팀 Dooray 키"
              className="glass border-white/20 bg-white/50 dark:bg-gray-800/50 h-12"
            />
          </div>

          {/* API 키 입력 */}
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300">Dooray API 키</Label>
            <div className="relative">
              <Input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => handleKeyChange(e.target.value)}
                placeholder="Dooray API 키를 입력하세요"
                className={`glass border-white/20 bg-white/50 dark:bg-gray-800/50 h-12 pr-20 ${
                  validationStatus === 'valid' ? 'border-green-300 dark:border-green-600'
                  : validationStatus === 'invalid' ? 'border-red-300 dark:border-red-600' : ''
                }`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                {validationStatus === 'validating' && <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>}
                {validationStatus === 'valid' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                {validationStatus === 'invalid' && <AlertCircle className="w-4 h-4 text-red-500" />}
                <button type="button" onClick={() => setShowKey(!showKey)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {validationStatus === 'invalid' && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" />
                <span>연결에 실패했어요. 키가 올바른지 확인해 주세요.</span>
              </p>
            )}
            {validationStatus === 'valid' && (
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>API 키가 저장/연결되었습니다.</span>
              </p>
            )}
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex space-x-3 p-6 border-t border-white/20">
          <Button variant="ghost" onClick={handleClose} disabled={isLoading} className="flex-1 text-gray-600 dark:text-gray-400 hover:bg-white/10 font-medium rounded-xl h-12">
            취소
          </Button>
          <Button onClick={handleSave} disabled={!apiKey.trim() || !keyName.trim() || isLoading} className="flex-1 bg-gradient-primary btn-glow text-white font-medium rounded-xl h-12 border-0 disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? (
              <span className="inline-flex items-center space-x-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>설정 중…</span>
              </span>
            ) : '설정 완료'}
          </Button>
        </div>
      </div>
    </div>
  );
}
