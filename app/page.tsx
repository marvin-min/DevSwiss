'use client';

import { useState, useEffect } from 'react';

interface Document {
  _id: string;
  [key: string]: any;
}

export default function Home() {
  const [collection, setCollection] = useState('activity_summary');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newDoc, setNewDoc] = useState('{\n  "name": "张三",\n  "age": 25,\n  "email": "zhangsan@example.com"\n}');
  const [query, setQuery] = useState('{}');
  const [sort, setSort] = useState('{"startTimeInSeconds": -1}');
  const [limit, setLimit] = useState('10');
  const [updateQuery, setUpdateQuery] = useState('{}');
  const [updateData, setUpdateData] = useState('{\n  "$set": {\n    "age": 26\n  }\n}');

  const fetchDocuments = async () => {
    setLoading(true);
    setError('');
    try {
      const queryObj = JSON.parse(query);
      const sortObj = sort ? JSON.parse(sort) : null;
      const limitNum = parseInt(limit) || 100;
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'find',
          collection,
          query: queryObj,
          sort: sortObj,
          limit: limitNum
        })
      });
      const data = await res.json();
      if (data.success) {
        setDocuments(data.documents);
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const insertDocument = async () => {
    setLoading(true);
    setError('');
    try {
      const doc = JSON.parse(newDoc);
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'insert',
          collection,
          document: doc
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchDocuments();
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateDocument = async () => {
    setLoading(true);
    setError('');
    try {
      const queryObj = JSON.parse(updateQuery);
      const updateObj = JSON.parse(updateData);
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          collection,
          query: queryObj,
          update: updateObj
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchDocuments();
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (id: string) => {
    if (!confirm('确定要删除这个文档吗？')) return;

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          collection,
          id
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchDocuments();
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-3">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">MongoDB 客户端</h1>

        {/* 集合选择 */}
        <div className="bg-white rounded shadow-sm p-3 mb-3">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            集合名称 {documents.length > 0 && <span className="text-blue-600">({documents.length} 条记录)</span>}
          </label>
          <input
            type="text"
            value={collection}
            onChange={(e) => setCollection(e.target.value)}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
            placeholder="例如: users"
          />
        </div>

        {/* 消息提示 */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          {/* 查询文档 - 固定左侧 */}
          <div className="w-1/3 bg-white rounded shadow-sm p-3 sticky top-0 h-screen overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">查询文档</h2>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              查询条件 (JSON)
            </label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-300 rounded font-mono text-xs mb-2 h-16"
              placeholder='例如: {"age": {"$gt": 20}}'
            />
            <label className="block text-xs font-medium text-gray-700 mb-1">
              排序 (JSON) 1:升序(从小到大), -1:降序(从大到小)
            </label>
            <textarea
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-300 rounded font-mono text-xs mb-2 h-14"
              placeholder='{"startTimeInSeconds": -1}'
            />
            <label className="block text-xs font-medium text-gray-700 mb-1">
              限制数量
            </label>
            <input
              type="number"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded mb-2"
              placeholder="10"
            />
            <button
              onClick={fetchDocuments}
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-1.5 px-3 text-sm rounded disabled:bg-gray-400"
            >
              {loading ? '查询中...' : '查询'}
            </button>
          </div>

          {/* 文档列表 */}
          <div className="w-2/3 bg-white rounded shadow-sm p-3">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              文档列表 ({documents.length})
            </h2>
            <div className="overflow-x-auto">
              {documents.length === 0 ? (
                <p className="text-gray-500 text-center py-4 text-sm">暂无数据</p>
              ) : (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div
                      key={doc._id}
                      className="border border-gray-200 rounded p-2 hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs text-gray-500 font-mono">
                          ID: {doc._id}
                        </span>
                        <button
                          onClick={() => deleteDocument(doc._id)}
                          className="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-2 rounded"
                        >
                          删除
                        </button>
                      </div>
                      <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                        {JSON.stringify(doc, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}