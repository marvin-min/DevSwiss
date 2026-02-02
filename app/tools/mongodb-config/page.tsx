'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface MongoDBConfig {
  id: string;
  name: string;
  uri: string;
  database: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export default function MongoDBConfigPage() {
  const [connections, setConnections] = useState<MongoDBConfig[]>([]);
  const [activeConnectionId, setActiveConnectionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [configLocation, setConfigLocation] = useState<string | null>(null);
  
  // 表单状态
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    uri: '',
    database: '',
    description: '',
  });

  // 加载配置
  const loadConfigs = async () => {
    setLoading(true);
    setError('');
    try {
      const [connectionsRes, activeRes, locationRes] = await Promise.all([
        fetch('/api/mongodb-configs?action=list'),
        fetch('/api/mongodb-configs?action=active'),
        fetch('/api/mongodb-configs?action=location'),
      ]);

      const connectionsData = await connectionsRes.json();
      const activeData = await activeRes.json();
      const locationData = await locationRes.json();

      if (connectionsData.success) {
        setConnections(connectionsData.connections);
      }
      if (activeData.success && activeData.connection) {
        setActiveConnectionId(activeData.connection.id);
      }
      if (locationData.success) {
        setConfigLocation(locationData.location);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfigs();
  }, []);

  // 重置表单
  const resetForm = () => {
    setFormData({ name: '', uri: '', database: '', description: '' });
    setEditingId(null);
    setShowForm(false);
  };

  // 添加/编辑连接
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const action = editingId ? 'update' : 'add';
      const body = editingId
        ? { action, id: editingId, updates: formData }
        : { action, ...formData };

      const res = await fetch('/api/mongodb-configs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        await loadConfigs();
        resetForm();
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 删除连接
  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个连接配置吗？')) return;

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/mongodb-configs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id }),
      });

      const data = await res.json();
      if (data.success) {
        await loadConfigs();
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 设置活动连接
  const handleSetActive = async (id: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/mongodb-configs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'setActive', id }),
      });

      const data = await res.json();
      if (data.success) {
        await loadConfigs();
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 编辑连接
  const handleEdit = (connection: MongoDBConfig) => {
    setFormData({
      name: connection.name,
      uri: connection.uri,
      database: connection.database,
      description: connection.description || '',
    });
    setEditingId(connection.id);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 头部 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">MongoDB 连接配置</h1>
              <p className="text-gray-400">管理你的 MongoDB 数据库连接</p>
            </div>
            <Link 
              href="/tools/mongodb"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              ← 返回工具
            </Link>
          </div>
          
          {configLocation && (
            <div className="text-sm text-gray-400 bg-gray-800/50 rounded-lg p-3">
              📁 配置文件位置: <span className="text-purple-400 font-mono">{configLocation}</span>
            </div>
          )}
          {!configLocation && (
            <div className="text-sm text-yellow-400 bg-yellow-900/20 rounded-lg p-3">
              ⚠️ 尚未创建配置文件，添加第一个连接后将自动创建
            </div>
          )}
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* 添加按钮 */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mb-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all shadow-lg"
          >
            ✚ 添加新连接
          </button>
        )}

        {/* 表单 */}
        {showForm && (
          <div className="mb-6 bg-gray-800 rounded-lg p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4">
              {editingId ? '编辑连接' : '添加新连接'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">连接名称 *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                  placeholder="例如: 生产环境"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">MongoDB URI *</label>
                <input
                  type="text"
                  value={formData.uri}
                  onChange={(e) => setFormData({ ...formData, uri: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none font-mono text-sm"
                  placeholder="mongodb://localhost:27017"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">数据库名称 *</label>
                <input
                  type="text"
                  value={formData.database}
                  onChange={(e) => setFormData({ ...formData, database: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                  placeholder="例如: test_db"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">描述（可选）</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                  placeholder="连接的描述信息"
                  rows={2}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  {loading ? '保存中...' : (editingId ? '保存修改' : '添加连接')}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 连接列表 */}
        <div className="space-y-4">
          {connections.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <p className="text-gray-400 text-lg">暂无连接配置</p>
              <p className="text-gray-500 text-sm mt-2">点击上方按钮添加第一个连接</p>
            </div>
          ) : (
            connections.map((conn) => (
              <div
                key={conn.id}
                className={`bg-gray-800 rounded-lg p-6 shadow-lg transition-all ${
                  conn.id === activeConnectionId ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{conn.name}</h3>
                      {conn.id === activeConnectionId && (
                        <span className="px-3 py-1 bg-purple-600 text-white text-xs rounded-full font-semibold">
                          当前使用
                        </span>
                      )}
                    </div>
                    {conn.description && (
                      <p className="text-gray-400 mb-3">{conn.description}</p>
                    )}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">URI:</span>
                        <span className="text-gray-300 font-mono">{conn.uri}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">数据库:</span>
                        <span className="text-gray-300 font-mono">{conn.database}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">创建时间:</span>
                        <span className="text-gray-400">
                          {new Date(conn.createdAt).toLocaleString('zh-CN')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    {conn.id !== activeConnectionId && (
                      <button
                        onClick={() => handleSetActive(conn.id)}
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
                      >
                        设为当前
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(conn)}
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(conn.id)}
                      disabled={loading}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 帮助信息 */}
        <div className="mt-8 bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-3">💡 配置优先级</h3>
          <ul className="space-y-2 text-gray-300">
            <li>1️⃣ <strong>当前目录</strong>：{process.cwd()}/.mongodb-configs.json（最高优先级）</li>
            <li>2️⃣ <strong>用户目录</strong>：~/.mongodb-configs.json</li>
            <li>3️⃣ <strong>环境变量</strong>：.env.local 中的 MONGODB_URI（后备方案）</li>
          </ul>
          <p className="text-gray-400 text-sm mt-4">
            配置文件将自动保存到当前目录，如果当前目录无写入权限，则保存到用户目录。
          </p>
        </div>
      </div>
    </div>
  );
}
