'use client';

import { useState } from 'react';

import Link from 'next/link';

export default function JSONFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indentSize, setIndentSize] = useState(2);

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indentSize);
      setOutput(formatted);
      setError('');
    } catch (err: any) {
      setError(err.message);
      setOutput('');
    }
  };

  const compressJSON = () => {
    try {
      const parsed = JSON.parse(input);
      const compressed = JSON.stringify(parsed);
      setOutput(compressed);
      setError('');
    } catch (err: any) {
      setError(err.message);
      setOutput('');
    }
  };

  const validateJSON = () => {
    try {
      JSON.parse(input);
      setError('');
      setOutput('✅ JSON 格式正确');
    } catch (err: any) {
      setError(err.message);
      setOutput('');
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <nav className="text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">DevSwiss</Link>
            <span className="mx-2">›</span>
            <span>JSON 格式化工具</span>
          </nav>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">JSON 格式化工具</h1>
          <p className="text-gray-600">格式化、压缩和验证JSON数据</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 输入区域 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">输入</h2>
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
              placeholder="在此输入JSON字符串..."
              className="w-full h-96 p-3 border border-gray-300 rounded font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 输出区域 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">输出</h2>
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
            <button
              onClick={formatJSON}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
            >
              格式化
            </button>
            <button
              onClick={compressJSON}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded"
            >
              压缩
            </button>
            <button
              onClick={validateJSON}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
            >
              验证
            </button>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">缩进:</label>
              <select
                value={indentSize}
                onChange={(e) => setIndentSize(Number(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded"
              >
                <option value={2}>2 空格</option>
                <option value={4}>4 空格</option>
                <option value={1}>1 空格</option>
              </select>
            </div>
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
            <li>• <strong>格式化:</strong> 将压缩的JSON转换为易读的格式</li>
            <li>• <strong>压缩:</strong> 移除所有空格和换行符</li>
            <li>• <strong>验证:</strong> 检查JSON语法是否正确</li>
            <li>• <strong>缩进:</strong> 设置格式化时的缩进空格数</li>
          </ul>
        </div>
      </div>
    </div>
  );
}