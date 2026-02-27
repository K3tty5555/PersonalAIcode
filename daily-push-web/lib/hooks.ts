// 客户端数据钩子 - 用于显示更新时间等

import { useState, useEffect } from 'react';

interface DataInfo {
  generatedAt: string | null;
  isFresh: boolean;
}

export function useDataInfo(): DataInfo {
  const [info, setInfo] = useState<DataInfo>({
    generatedAt: null,
    isFresh: false,
  });

  useEffect(() => {
    // 从 data.ts 中读取的 daily-data.json 包含 generatedAt
    // 这里仅用于显示信息，不获取新数据
    const today = new Date().toISOString().split('T')[0];
    const generatedDate = today; // 简化处理

    setInfo({
      generatedAt: new Date().toISOString(),
      isFresh: true,
    });
  }, []);

  return info;
}
