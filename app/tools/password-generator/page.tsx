'use client';

import { useState } from 'react';
import Link from 'next/link';

const lowercase = 'abcdefghijklmnopqrstuvwxyz';
const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numbers = '0123456789';
const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

export default function PasswordGenerator() {
  const [length, setLength] = useState(12);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState('');

  const generatePassword = () => {
    let charset = '';
    if (includeLowercase) charset += lowercase;
    if (includeUppercase) charset += uppercase;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;

    if (charset === '') {
      setPassword('');
      setStrength('');
      return;
    }

    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    setPassword(result);
    calculateStrength(result);
  };

  const calculateStrength = (pwd: string) => {
    let score = 0;
    const checks = [
      pwd.length >= 8,
      /[a-z]/.test(pwd),
      /[A-Z]/.test(pwd),
      /\d/.test(pwd),
      /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(pwd)
    ];

    score = checks.filter(Boolean).length;

    if (score <= 2) setStrength('弱');
    else if (score <= 3) setStrength('中等');
    else if (score <= 4) setStrength('强');
    else setStrength('非常强');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      alert('密码已复制到剪贴板');
    } catch (err) {
      alert('复制失败');
    }
  };

  const getStrengthColor = () => {
    switch (strength) {
      case '弱': return 'text-red-600 bg-red-100';
      case '中等': return 'text-yellow-600 bg-yellow-100';
      case '强': return 'text-blue-600 bg-blue-100';
      case '非常强': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <nav className="text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">个人工具包</Link>
            <span className="mx-2">›</span>
            <span>密码生成器</span>
          </nav>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">密码生成器</h1>
          <p className="text-gray-600">生成强密码和随机字符串</p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* 生成的密码显示 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">生成的密码</h2>
              {password && (
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStrengthColor()}`}>
                    强度: {strength}
                  </span>
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded"
                  >
                    复制
                  </button>
                </div>
              )}
            </div>
            <div className="bg-gray-100 p-4 rounded font-mono text-lg break-all min-h-[60px] flex items-center">
              {password || '点击"生成密码"开始'}
            </div>
          </div>

          {/* 设置选项 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">设置选项</h2>

            {/* 密码长度 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                密码长度: {length}
              </label>
              <input
                type="range"
                min="4"
                max="64"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>4</span>
                <span>64</span>
              </div>
            </div>

            {/* 字符类型选择 */}
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="lowercase"
                  checked={includeLowercase}
                  onChange={(e) => setIncludeLowercase(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="lowercase" className="ml-2 text-sm text-gray-700">
                  小写字母 (a-z)
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="uppercase"
                  checked={includeUppercase}
                  onChange={(e) => setIncludeUppercase(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="uppercase" className="ml-2 text-sm text-gray-700">
                  大写字母 (A-Z)
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="numbers"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="numbers" className="ml-2 text-sm text-gray-700">
                  数字 (0-9)
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="symbols"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="symbols" className="ml-2 text-sm text-gray-700">
                  特殊字符 (!@#$%^&*)
                </label>
              </div>
            </div>
          </div>

          {/* 生成按钮 */}
          <div className="text-center">
            <button
              onClick={generatePassword}
              className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg text-lg"
            >
              生成密码
            </button>
          </div>

          {/* 使用说明 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">使用说明</h3>
            <ul className="text-blue-800 space-y-1">
              <li>• 选择密码长度 (4-64字符)</li>
              <li>• 选择要包含的字符类型 (至少选择一种)</li>
              <li>• 点击"生成密码"创建随机密码</li>
              <li>• 密码强度会自动评估并显示</li>
              <li>• 点击"复制"将密码复制到剪贴板</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}