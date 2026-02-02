import { NextRequest, NextResponse } from 'next/server';
import {
  getConnections,
  getActiveConnection,
  addConnection,
  updateConnection,
  deleteConnection,
  setActiveConnection,
  getConfigLocation,
  MongoDBConfig,
} from '@/lib/config-manager';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'list':
        const connections = getConnections();
        return NextResponse.json({ success: true, connections });

      case 'active':
        const activeConnection = getActiveConnection();
        return NextResponse.json({ success: true, connection: activeConnection });

      case 'location':
        const location = getConfigLocation();
        return NextResponse.json({ success: true, location });

      default:
        return NextResponse.json(
          { success: false, error: '未知的操作' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('配置API错误:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'add':
        const { name, uri, database, description } = body;
        if (!name || !uri || !database) {
          return NextResponse.json(
            { success: false, error: '缺少必需字段' },
            { status: 400 }
          );
        }
        const newConnection = addConnection({ name, uri, database, description });
        return NextResponse.json({ success: true, connection: newConnection });

      case 'update':
        const { id, updates } = body;
        if (!id) {
          return NextResponse.json(
            { success: false, error: '缺少连接ID' },
            { status: 400 }
          );
        }
        const updatedConnection = updateConnection(id, updates);
        if (!updatedConnection) {
          return NextResponse.json(
            { success: false, error: '连接不存在' },
            { status: 404 }
          );
        }
        return NextResponse.json({ success: true, connection: updatedConnection });

      case 'delete':
        const deleteId = body.id;
        if (!deleteId) {
          return NextResponse.json(
            { success: false, error: '缺少连接ID' },
            { status: 400 }
          );
        }
        const deleted = deleteConnection(deleteId);
        if (!deleted) {
          return NextResponse.json(
            { success: false, error: '连接不存在' },
            { status: 404 }
          );
        }
        return NextResponse.json({ success: true });

      case 'setActive':
        const activeId = body.id;
        if (!activeId) {
          return NextResponse.json(
            { success: false, error: '缺少连接ID' },
            { status: 400 }
          );
        }
        const activated = setActiveConnection(activeId);
        if (!activated) {
          return NextResponse.json(
            { success: false, error: '连接不存在' },
            { status: 404 }
          );
        }
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json(
          { success: false, error: '未知的操作' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('配置API错误:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
