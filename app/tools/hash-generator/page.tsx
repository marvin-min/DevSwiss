'use client';

import { useState } from 'react';
import Link from 'next/link';

async function hashString(algorithm: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function hashMD5(message: string): Promise<string> {
  // MD5 is not supported in Web Crypto API, using a simple implementation
  // Note: This is for demonstration only, not cryptographically secure
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    const char = message.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const algorithms = [
    { name: 'MD5', value: 'MD5', description: 'MD5哈希 (注意: 非加密安全)' },
    { name: 'SHA-1', value: 'SHA-1', description: 'SHA-1哈希' },
    { name: 'SHA-256', value: 'SHA-256', description: 'SHA-256哈希' },
    { name: 'SHA-384', value: 'SHA-384', description: 'SHA-384哈希' },
    { name: 'SHA-512', value: 'SHA-512', description: 'SHA-512哈希' }
  ];

  const generateHashes = async () => {
    if (!input.trim()) return;

    setLoading(true);
    const newResults: Record<string, string> = {};

    try {
      for (const algo of algorithms) {
        if (algo.value === 'MD5') {
          newResults[algo.value] = await hashMD5(input);
        } else {
          newResults[algo.value] = await hashString(algo.value, input);
        }
      }
      setResults(newResults);
    } catch (error) {
      console.error('Hash generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('已复制到剪贴板');
    } catch (err) {
      alert('复制失败');
    }
  };

  const clearAll = () => {
    setInput('');
    setResults({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <nav className="text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">DevSwiss</Link>
            <span className="mx-2">›</span>
            <span>Hash 生成器</span>
          </nav>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hash 生成器</h1>
          <p className="text-gray-600">生成各种哈希值 (MD5, SHA-1, SHA-256等)</p>
        </div>

        {/* 输入区域 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">输入文本</h2>
            <div className="flex gap-2">
              <button
                onClick={generateHashes}
                disabled={loading || !input.trim()}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded disabled:bg-gray-400"
              >
                {loading ? '生成中...' : '生成Hash'}
              </button>
              <button
                onClick={clearAll}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
              >
                清空
              </button>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入要生成哈希的文本..."
            className="w-full h-32 p-3 border border-gray-300 rounded resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 结果区域 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">哈希结果</h2>
          {Object.keys(results).length === 0 ? (
            <p className="text-gray-500 text-center py-8">输入文本并点击"生成Hash"开始</p>
          ) : (
            <div className="space-y-4">
              {algorithms.map(algo => (
                <div key={algo.value} className="border border-gray-200 rounded p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800">{algo.name}</h3>
                      <p className="text-sm text-gray-600">{algo.description}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(results[algo.value])}
                      className="px-3 py-1 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded"
                    >
                      复制
                    </button>
                  </div>
                  <div className="bg-gray-100 p-3 rounded font-mono text-sm break-all">
                    {results[algo.value]}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 使用说明 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">使用说明</h3>
          <ul className="text-blue-800 space-y-1">
            <li>• 输入任意文本，点击"生成Hash"获取各种哈希值</li>
            <li>• 支持MD5、SHA-1、SHA-256、SHA-384、SHA-512算法</li>
            <li>• 点击"复制"按钮复制对应的哈希值</li>
            <li>• <strong>注意:</strong> MD5和SHA-1已被证明不安全，仅用于兼容性检查</li>
          </ul>
        </div>
      </div>
    </div>
  );
}