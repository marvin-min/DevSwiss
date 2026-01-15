import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, collection, query, document, update, id, sort, limit } = body;

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'test_db');
    const coll = db.collection(collection);

    switch (action) {
      case 'find':
        let cursor = coll.find(query || {});
        if (sort) cursor = cursor.sort(sort);
        cursor = cursor.limit(limit || 100);
        const documents = await cursor.toArray();
        return NextResponse.json({
          success: true,
          documents: documents.map(doc => ({
            ...doc,
            _id: doc._id.toString()
          }))
        });

      case 'insert':
        const insertResult = await coll.insertOne(document);
        return NextResponse.json({
          success: true,
          insertedId: insertResult.insertedId.toString()
        });

      case 'update':
        const updateResult = await coll.updateMany(query, update);
        return NextResponse.json({
          success: true,
          matchedCount: updateResult.matchedCount,
          modifiedCount: updateResult.modifiedCount
        });

      case 'delete':
        const deleteResult = await coll.deleteOne({ _id: new ObjectId(id) });
        return NextResponse.json({
          success: true,
          deletedCount: deleteResult.deletedCount
        });

      default:
        return NextResponse.json(
          { success: false, error: '未知的操作' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('API错误:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
