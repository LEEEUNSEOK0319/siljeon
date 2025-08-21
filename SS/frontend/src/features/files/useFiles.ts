import { useState, useCallback, useEffect } from 'react';
import type { FileItem } from '../../types';

type DriveType = {
  id: string;
  name: string;
  folders: FolderType[];
};
type FolderType = {
  id: string;
  name: string;
  subFolders?: FolderType[];
  files?: FileItem[];
};
type ApiDrive = {
  apiTitle: string;
  apiURL: string;
  drives: DriveType[];
};

// 폴더 트리 평탄화
const flattenFiles = (apis: ApiDrive[]): FileItem[] => {
  const result: FileItem[] = [];
  const walk = (f: FolderType) => {
    if (f.files) result.push(...f.files);
    f.subFolders?.forEach(walk);
  };
  apis.forEach(api => {
    api.drives.forEach(d => d.folders.forEach(walk));
  });
  return result;
};

export function useFiles() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [showPreviewDrawer, setShowPreviewDrawer] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('http://localhost:8090/api/dooray/driveLoading', {
          method: 'POST',
          credentials: 'include'
        });
        if (!res.ok) throw new Error('드라이브 로딩 실패');
        const data = await res.json(); // ApiDrive[]
        setFiles(flattenFiles(data));
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const onFileSelect = useCallback((f: FileItem) => {
    setSelectedFile(f);
    setShowPreviewDrawer(true);
  }, []);

  const handleClosePreview = useCallback(() => {
    setShowPreviewDrawer(false);
    setSelectedFile(null);
  }, []);

  const onToggleFavorite = useCallback((fileId: string) => {
    setFiles(prev => prev.map(x => x.id === fileId ? { ...x, isFavorite: !x.isFavorite } : x));
  }, []);

  return {
    files,
    showPreviewDrawer,
    selectedFile,
    onFileSelect,
    onToggleFavorite,
    handleClosePreview,
  };
}
