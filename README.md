# 个人工具包

一个精心设计的工具集合，帮助你更高效地完成日常任务。基于Next.js + TypeScript + Tailwind CSS构建。

## 功能特性

### 🗄️ 数据库工具
- **MongoDB 客户端** - 连接和管理MongoDB数据库，进行CRUD操作

### 📄 开发工具
- **JSON 格式化** - 格式化、验证和美化JSON数据

### 🔐 编码工具
- **Base64 编码/解码** - Base64字符串的编码和解码
- **URL 编码/解码** - URL字符串的编码和解码

### 🔒 加密工具
- **Hash 生成器** - 生成MD5、SHA-1、SHA-256等哈希值

### 🔑 安全工具
- **密码生成器** - 生成强密码和随机字符串

### 📝 文本工具
- **文本处理** - 文本格式转换、大小写转换等

### 🎨 设计工具
- **颜色选择器** - 颜色选择和转换工具

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量 (可选)

如果要使用MongoDB客户端，需要配置环境变量：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local`：

```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=test_db
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:4001](http://localhost:4001) 查看应用。

## 项目结构

```
app/
├── page.tsx              # 工具导航主页
├── layout.tsx            # 应用布局
├── globals.css           # 全局样式
└── tools/                # 工具页面
    ├── mongodb/          # MongoDB客户端
    ├── json-formatter/   # JSON格式化工具
    ├── base64/           # Base64编码/解码
    ├── hash-generator/   # Hash生成器
    ├── password-generator/ # 密码生成器
    └── ...               # 更多工具
api/
└── documents/            # MongoDB API路由
lib/
└── mongodb.ts            # MongoDB连接配置
```

## 开发指南

### 添加新工具

1. 在 `app/tools/` 下创建新目录
2. 创建 `page.tsx` 文件
3. 在主页 `app/page.tsx` 的 `tools` 数组中添加工具信息

### 工具规范

- 使用TypeScript编写
- 遵循现有的UI设计风格
- 包含使用说明
- 支持响应式设计

## 技术栈

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB (可选)
- **Deployment**: Vercel/Netlify

## 许可证

MIT License
{}                          // 查询所有
{"age": {"$gt": 20}}       // 年龄大于20
{"name": "张三"}            // 精确匹配
```

### 插入文档
输入要插入的JSON文档：
```json
{
  "name": "李四",
  "age": 30,
  "email": "lisi@example.com"
}
```

### 更新文档
指定查询条件和更新操作：
```json
// 查询条件
{"name": "张三"}

// 更新内容
{"$set": {"age": 26}}
```

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **数据库**: MongoDB
- **驱动**: mongodb npm package

## 项目结构

```
mongodb-client/
├── app/
│   ├── api/
│   │   └── documents/
│   │       └── route.ts      # API路由
│   ├── globals.css           # 全局样式
│   ├── layout.tsx            # 根布局
│   └── page.tsx              # 主页面
├── lib/
│   └── mongodb.ts            # MongoDB连接
├── .env.local                # 环境变量
└── package.json
```

## 生产部署

```bash
npm run build
npm start
```

## 注意事项

- 默认限制查询结果为100条
- 删除操作需要确认
- 所有JSON输入需要符合标准格式
- 在生产环境中请配置适当的访问控制

## License

MIT
