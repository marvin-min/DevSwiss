'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const encodeBase64 = () => {
    try {
      const encoded = btoa(input);
      setOutput(encoded);
      setError('');
    } catch (err: any) {
      setError('编码失败: ' + err.message);
      setOutput('');
    }
  };

  const decodeBase64 = () => {
    try {
      const decoded = atob(input);
      setOutput(decoded);
      setError('');
    } catch (err: any) {
      setError('解码失败: ' + err.message);
      setOutput('');
    }
  };

  const handleProcess = () => {
    if (mode === 'encode') {
      encodeBase64();
    } else {
      decodeBase64();
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      alert('已复制到剪贴板');
    } catch (err) {
      alert('复制失败');
    }
  };

  const swapMode = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode');
    setInput(output);
    setOutput(input);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <nav className="text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">个人工具包</Link>
            <span className="mx-2">›</span>
            <span>Base64 编码/解码工具</span>
          </nav>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Base64 编码/解码工具</h1>
          <p className="text-gray-600">Base64字符串的编码和解码</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 输入区域 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {mode === 'encode' ? '原始文本' : 'Base64字符串'}
              </h2>
              <button
                onClick={clearAll}
                className="px-3 py-1 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded"
              >
                清空
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'encode' ? '输入要编码的文本...' : '输入Base64字符串...'}
              className="w-full h-96 p-3 border border-gray-300 rounded font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 输出区域 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {mode === 'encode' ? 'Base64编码' : '解码结果'}
              </h2>
              {output && (
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded"
                >
                  复制
                </button>
              )}
            </div>
            <textarea
              value={output}
              readOnly
              className="w-full h-96 p-3 border border-gray-300 rounded font-mono text-sm resize-none bg-gray-50"
              placeholder="输出结果将显示在这里..."
            />
          </div>
        </div>

        {/* 控制面板 */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">操作</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex gap-2">
              <button
                onClick={() => setMode('encode')}
                className={`px-4 py-2 rounded ${
                  mode === 'encode'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                编码
              </button>
              <button
                onClick={() => setMode('decode')}
                className={`px-4 py-2 rounded ${
                  mode === 'decode'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                解码
              </button>
            </div>
            <button
              onClick={handleProcess}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
            >
              {mode === 'encode' ? '编码' : '解码'}
            </button>
            <button
              onClick={swapMode}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded"
            >
              交换输入输出
            </button>
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-6">
            <strong>错误:</strong> {error}
          </div>
        )}

        {/* 使用说明 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">使用说明</h3>
          <ul className="text-blue-800 space-y-1">
            <li>• <strong>编码:</strong> 将文本转换为Base64格式</li>
            <li>• <strong>解码:</strong> 将Base64字符串转换为原始文本</li>
            <li>• <strong>交换:</strong> 快速交换输入和输出内容</li>
            <li>• 支持UTF-8编码的文本</li>
          </ul>
        </div>
      </div>
    </div>
  );
}