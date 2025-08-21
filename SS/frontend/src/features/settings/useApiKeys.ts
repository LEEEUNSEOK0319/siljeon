import { useState, useCallback, useMemo, useEffect } from 'react';

export function useApiKeys(): ApiKeysHookReturn {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);

  // 최초 로딩
  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        const res = await fetch('http://localhost:8090/api/auth/myApis', {
          method: 'GET',
          credentials: 'include'
        });
        if (res.ok) {
          const data = await res.json();
          setApiKeys(data);
        }
      } catch (err) {
        console.error('API 키 로딩 실패', err);
      }
    };
    fetchApiKeys();
  }, []);

  const hasConnectedApiKeys = useMemo(() =>
    apiKeys.some(key => key.isConnected), [apiKeys]);

  const connectedKeys = useMemo(() =>
    apiKeys.filter(key => key.isConnected), [apiKeys]);

  const handleUpdateApiKeys = useCallback((newApiKeys: ApiKey[]) => {
    setApiKeys(newApiKeys);
  }, []);

  // 모든 API 연결 해제
  const handleDisconnectAllApiKeys = useCallback(async () => {
    try {
      // 서버에 일괄 해제 API를 만들었다면 여기서 호출
      // await fetch('/api/dooray/driveDisconnectAll', { credentials: 'include' });
      setApiKeys(prev => prev.map(key => ({ ...key, isConnected: false })));
    } catch (err) {
      console.error('모든 API 해제 실패', err);
    }
  }, []);

  // 특정 API 연결 해제
  const handleDisconnectApiKey = useCallback(async (apiURL: string) => {
    try {
      await fetch(`http://localhost:8090/api/dooray/driveDisconnect?apiURL=${encodeURIComponent(apiURL)}`, {
        method: 'GET',
        credentials: 'include'
      });
      setApiKeys(prev =>
        prev.map(key =>
          key.apiURL === apiURL ? { ...key, isConnected: false } : key
        )
      );
    } catch (err) {
      console.error('API 키 해제 실패', err);
    }
  }, []);

  // 특정 API 연결
  const handleConnectApiKey = useCallback(async (apiURL: string, apiTitle: string) => {
    try {
      const res = await fetch('http://localhost:8090/api/dooray/driveConnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ apiToken: apiURL, apiTitle })
      });
      if (!res.ok) throw new Error('연결 실패');
      // 드라이브 목록을 가져오지만 상태 업데이트는 하위 훅에서 처리
      await res.json();
      setApiKeys(prev =>
        prev.map(key =>
          key.apiURL === apiURL ? { ...key, isConnected: true } : key
        )
      );
    } catch (err) {
      console.error('API 연결 실패', err);
    }
  }, []);

  return {
    apiKeys,
    hasConnectedApiKeys,
    connectedKeys,
    onUpdateApiKeys: handleUpdateApiKeys,
    onDisconnectAllApiKeys: handleDisconnectAllApiKeys,
    onDisconnectApiKey: handleDisconnectApiKey,
    onConnectApiKey: (apiURL) => handleConnectApiKey(apiURL, '')
  };
}
