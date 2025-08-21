import React from 'react';
import type { ApiKey } from '../../types';
import { CheckCircle2, XCircle, Key } from 'lucide-react';

const maskToken = (t?: string) => {
  if (!t) return '';
  return t.length <= 8 ? '*'.repeat(t.length) : `${t.slice(0, 4)}…${t.slice(-4)}`;
};

type ApiConnectionStatusProps = {
  apiKeys: ApiKey[];
};

export function ApiConnectionStatus({ apiKeys }: ApiConnectionStatusProps) {
  const total = apiKeys.length;
  const connected = apiKeys.filter((k) => k.isConnected).length;
  const disconnected = total - connected;

  return (
    <div className="glass p-6 rounded-xl border border-border">
      <h3 className="font-medium text-foreground mb-4">API 연결 상태</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-green-50/40 dark:bg-green-900/10 border border-green-200/40">
          <div className="flex items-center space-x-2 text-green-700 dark:text-green-400">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm font-medium">연결됨</span>
          </div>
          <p className="mt-1 text-2xl font-semibold text-green-700 dark:text-green-300">{connected}</p>
        </div>

        <div className="p-4 rounded-lg bg-gray-50/40 dark:bg-gray-900/10 border border-gray-200/40">
          <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
            <Key className="w-4 h-4" />
            <span className="text-sm font-medium">전체</span>
          </div>
          <p className="mt-1 text-2xl font-semibold text-gray-700 dark:text-gray-200">{total}</p>
        </div>

        <div className="p-4 rounded-lg bg-red-50/40 dark:bg-red-900/10 border border-red-200/40">
          <div className="flex items-center space-x-2 text-red-700 dark:text-red-400">
            <XCircle className="w-4 h-4" />
            <span className="text-sm font-medium">연결 안됨</span>
          </div>
          <p className="mt-1 text-2xl font-semibold text-red-700 dark:text-red-300">{disconnected}</p>
        </div>
      </div>

      {/* 간단 목록 요약 */}
      <div className="mt-4 space-y-2">
        {apiKeys.slice(0, 5).map((k) => (
          <div key={k.apiIdx ?? k.apiURL} className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-foreground">{k.apiTitle ?? 'Dooray'}</span>
              <span className="font-mono text-muted-foreground">{maskToken(k.apiURL)}</span>
            </div>
            <span className={`text-xs ${k.isConnected ? 'text-green-600' : 'text-gray-500'}`}>
              {k.isConnected ? '연결됨' : '연결 안됨'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
