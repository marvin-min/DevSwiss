import fs from 'fs';
import path from 'path';
import os from 'os';

export interface MongoDBConfig {
  id: string;
  name: string;
  uri: string;
  database: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConfigData {
  connections: MongoDBConfig[];
  activeConnectionId?: string;
}

const CONFIG_FILENAME = '.mongodb-configs.json';

/**
 * 获取配置文件路径列表（优先级从高到低）
 */
function getConfigPaths(): string[] {
  const currentDir = process.cwd();
  const userHome = os.homedir();
  
  return [
    path.join(currentDir, CONFIG_FILENAME),  // 当前目录（最高优先级）
    path.join(userHome, CONFIG_FILENAME),    // 用户目录
  ];
}

/**
 * 读取配置文件
 * 优先级：当前目录 > 用户目录
 */
export function readConfig(): ConfigData {
  const paths = getConfigPaths();
  
  for (const configPath of paths) {
    try {
      if (fs.existsSync(configPath)) {
        const content = fs.readFileSync(configPath, 'utf-8');
        const config = JSON.parse(content);
        console.log(`✓ 读取配置文件: ${configPath}`);
        return config;
      }
    } catch (error) {
      console.error(`读取配置文件失败 ${configPath}:`, error);
    }
  }
  
  // 返回默认配置
  return {
    connections: [],
  };
}

/**
 * 保存配置文件
 * 优先保存到当前目录，如果失败则保存到用户目录
 */
export function saveConfig(config: ConfigData): void {
  const paths = getConfigPaths();
  
  for (const configPath of paths) {
    try {
      const content = JSON.stringify(config, null, 2);
      fs.writeFileSync(configPath, content, 'utf-8');
      console.log(`✓ 配置已保存: ${configPath}`);
      return;
    } catch (error) {
      console.error(`保存配置文件失败 ${configPath}:`, error);
      // 继续尝试下一个路径
    }
  }
  
  throw new Error('无法保存配置文件到任何位置');
}

/**
 * 获取所有连接配置
 */
export function getConnections(): MongoDBConfig[] {
  const config = readConfig();
  return config.connections || [];
}

/**
 * 获取活动的连接配置
 */
export function getActiveConnection(): MongoDBConfig | null {
  const config = readConfig();
  
  if (config.activeConnectionId) {
    const connection = config.connections.find(
      c => c.id === config.activeConnectionId
    );
    if (connection) return connection;
  }
  
  // 如果没有设置活动连接或活动连接不存在，返回第一个连接
  if (config.connections.length > 0) {
    return config.connections[0];
  }
  
  return null;
}

/**
 * 添加新的连接配置
 */
export function addConnection(
  connection: Omit<MongoDBConfig, 'id' | 'createdAt' | 'updatedAt'>
): MongoDBConfig {
  const config = readConfig();
  
  const now = new Date().toISOString();
  const newConnection: MongoDBConfig = {
    ...connection,
    id: `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: now,
    updatedAt: now,
  };
  
  config.connections.push(newConnection);
  
  // 如果是第一个连接，设置为活动连接
  if (config.connections.length === 1) {
    config.activeConnectionId = newConnection.id;
  }
  
  saveConfig(config);
  return newConnection;
}

/**
 * 更新连接配置
 */
export function updateConnection(
  id: string,
  updates: Partial<Omit<MongoDBConfig, 'id' | 'createdAt'>>
): MongoDBConfig | null {
  const config = readConfig();
  const index = config.connections.findIndex(c => c.id === id);
  
  if (index === -1) return null;
  
  config.connections[index] = {
    ...config.connections[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  saveConfig(config);
  return config.connections[index];
}

/**
 * 删除连接配置
 */
export function deleteConnection(id: string): boolean {
  const config = readConfig();
  const initialLength = config.connections.length;
  
  config.connections = config.connections.filter(c => c.id !== id);
  
  // 如果删除的是活动连接，清除或设置新的活动连接
  if (config.activeConnectionId === id) {
    config.activeConnectionId = config.connections.length > 0 
      ? config.connections[0].id 
      : undefined;
  }
  
  if (config.connections.length < initialLength) {
    saveConfig(config);
    return true;
  }
  
  return false;
}

/**
 * 设置活动连接
 */
export function setActiveConnection(id: string): boolean {
  const config = readConfig();
  const connection = config.connections.find(c => c.id === id);
  
  if (!connection) return false;
  
  config.activeConnectionId = id;
  saveConfig(config);
  return true;
}

/**
 * 获取配置文件位置（用于调试）
 */
export function getConfigLocation(): string | null {
  const paths = getConfigPaths();
  
  for (const configPath of paths) {
    if (fs.existsSync(configPath)) {
      return configPath;
    }
  }
  
  return null;
}
