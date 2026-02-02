import { MongoClient, Db } from 'mongodb';
import { getActiveConnection } from './config-manager';

// 全局变量类型定义，支持多个连接
type GlobalWithMongo = typeof globalThis & {
  _mongoClientPromises?: Map<string, Promise<MongoClient>>;
};

const globalWithMongo = global as GlobalWithMongo;

/**
 * 获取MongoDB连接
 * 优先使用配置文件中的连接，其次使用环境变量
 */
function getMongoClient(): Promise<MongoClient> {
  let uri: string;
  
  // 尝试从配置文件获取连接信息
  try {
    const activeConnection = getActiveConnection();
    if (activeConnection) {
      uri = activeConnection.uri;
      console.log(`使用配置连接: ${activeConnection.name}`);
    } else if (process.env.MONGODB_URI) {
      uri = process.env.MONGODB_URI;
      console.log('使用环境变量连接');
    } else {
      throw new Error('未找到MongoDB连接配置。请在配置管理中添加连接，或在 .env.local 文件中设置 MONGODB_URI');
    }
  } catch (error) {
    if (process.env.MONGODB_URI) {
      uri = process.env.MONGODB_URI;
      console.log('使用环境变量连接（配置读取失败）');
    } else {
      throw new Error('未找到MongoDB连接配置。请在配置管理中添加连接，或在 .env.local 文件中设置 MONGODB_URI');
    }
  }

  const options = {};

  if (process.env.NODE_ENV === 'development') {
    // 在开发模式下使用全局变量缓存，避免热重载时创建多个连接
    if (!globalWithMongo._mongoClientPromises) {
      globalWithMongo._mongoClientPromises = new Map();
    }

    if (!globalWithMongo._mongoClientPromises.has(uri)) {
      const client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromises.set(uri, client.connect());
    }

    return globalWithMongo._mongoClientPromises.get(uri)!;
  } else {
    // 在生产环境中，每次创建新连接
    const client = new MongoClient(uri, options);
    return client.connect();
  }
}

const clientPromise = getMongoClient();

export default clientPromise;

/**
 * 获取数据库实例
 */
export async function getDatabase(dbName?: string): Promise<Db> {
  const client = await getMongoClient();
  
  // 尝试从配置文件获取数据库名
  let database = dbName;
  if (!database) {
    try {
      const activeConnection = getActiveConnection();
      if (activeConnection) {
        database = activeConnection.database;
      }
    } catch (error) {
      // 忽略配置读取错误
    }
  }
  
  // 使用环境变量作为后备
  if (!database) {
    database = process.env.MONGODB_DB || 'test_db';
  }
  
  return client.db(database);
}

/**
 * 强制刷新连接（用于切换配置后）
 */
export function refreshConnection(): void {
  if (globalWithMongo._mongoClientPromises) {
    globalWithMongo._mongoClientPromises.clear();
  }
}
