import Link from 'next/link';

const tools = [
  {
    name: 'MongoDB 客户端',
    description: '连接和管理MongoDB数据库，进行CRUD操作',
    href: '/tools/mongodb',
    icon: '🗄️',
    category: '数据库'
  },
  {
    name: 'JSON 格式化',
    description: '格式化、验证和美化JSON数据',
    href: '/tools/json-formatter',
    icon: '📄',
    category: '开发工具'
  },
  {
    name: 'Base64 编码/解码',
    description: 'Base64字符串的编码和解码工具',
    href: '/tools/base64',
    icon: '🔐',
    category: '编码工具'
  },
  {
    name: 'URL 编码/解码',
    description: 'URL字符串的编码和解码工具',
    href: '/tools/url-encoder',
    icon: '🔗',
    category: '编码工具'
  },
  {
    name: 'Hash 生成器',
    description: '生成MD5、SHA-1、SHA-256等哈希值',
    href: '/tools/hash-generator',
    icon: '🔒',
    category: '加密工具'
  },
  {
    name: '密码生成器',
    description: '生成强密码和随机字符串',
    href: '/tools/password-generator',
    icon: '🔑',
    category: '安全工具'
  },
  {
    name: '文本处理',
    description: '文本格式转换、大小写转换等',
    href: '/tools/text-processor',
    icon: '📝',
    category: '文本工具'
  },
  {
    name: '颜色选择器',
    description: '颜色选择和转换工具',
    href: '/tools/color-picker',
    icon: '🎨',
    category: '设计工具'
  }
];

const categories = Array.from(new Set(tools.map(tool => tool.category)));

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">个人工具包</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            一个精心设计的工具集合，帮助你更高效地完成日常任务
          </p>
        </div>

        {categories.map(category => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools
                .filter(tool => tool.category === category)
                .map(tool => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 block"
                  >
                    <div className="flex items-center mb-3">
                      <span className="text-3xl mr-3">{tool.icon}</span>
                      <h3 className="text-xl font-semibold text-gray-900">{tool.name}</h3>
                    </div>
                    <p className="text-gray-600">{tool.description}</p>
                  </Link>
                ))}
            </div>
          </div>
        ))}

        <div className="text-center mt-12">
          <p className="text-gray-500">
            更多工具正在开发中...
          </p>
        </div>
      </div>
    </div>
  );
}