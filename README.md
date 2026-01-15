# MongoDB Web 客户端

一个简单美观的MongoDB Web管理界面，使用Next.js + TypeScript + Tailwind CSS构建。

## 功能特性

✅ **查询文档** - 使用JSON查询语法查询数据  
✅ **插入文档** - 添加新文档到集合  
✅ **更新文档** - 批量更新符合条件的文档  
✅ **删除文档** - 删除单个文档  
✅ **美观界面** - 使用Tailwind CSS设计的现代化UI  
✅ **实时反馈** - 操作成功/失败的即时提示  

## 快速开始

### 1. 安装依赖

```bash
cd mongodb-client
npm install
```

### 2. 配置环境变量

复制 `.env.local.example` 为 `.env.local` 并配置你的MongoDB连接：

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

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 使用说明

### 查询文档
在"查询条件"框中输入MongoDB查询语法：
```json
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
