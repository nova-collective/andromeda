import { NextRequest, NextResponse } from 'next/server';
import getClient from '@/app/lib/config/mongodb';
import { ObjectId } from 'mongodb';

function isMongoError(error: unknown): error is { code: number; message: string } {
  if (typeof error !== 'object' || error === null) return false;
  const obj = error as Record<string, unknown>;
  return 'code' in obj && typeof obj['code'] === 'number' && 'message' in obj && typeof obj['message'] === 'string';
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const client = await getClient();
    const db = client.db('andromeda');
    
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');
    const id = searchParams.get('id');
    
    if (id) {
      const user = await db.collection('users').findOne({ 
        _id: new ObjectId(id) 
      });
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json(user);
    }
    
    if (walletAddress) {
      const user = await db.collection('users').findOne({ 
        walletAddress: walletAddress
      });
      return NextResponse.json(user);
    }
    
    const users = await db.collection('users').find({}).toArray();
    return NextResponse.json(users);
  } catch (error: unknown) {
    if (isMongoError(error)) {
      if (error.code === 11000) {
        return NextResponse.json({ error: 'Duplicate wallet address' }, { status: 400 });
      }
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const client = await getClient();
    const db = client.db('andromeda');
    
    const body = await request.json();
    const walletAddress = body.walletAddress.toLowerCase();
    
    const user = await db.collection('users').findOneAndUpdate(
      { walletAddress },
      { 
        $set: {
          ...body,
          walletAddress,
          lastLogin: new Date(),
          createdAt: body.createdAt || new Date(),
        }
      },
      { 
        upsert: true, 
        returnDocument: 'after',
      }
    );
    
    return NextResponse.json(user);
  } catch (error: unknown) {
    if (isMongoError(error)) {
      if (error.code === 11000) {
        return NextResponse.json({ error: 'Duplicate wallet address' }, { status: 400 });
      }
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const client = await getClient();
    const db = client.db('andromeda');
    
    const body = await request.json();
    const { id, walletAddress, ...updateData } = body;
    
    if (!id && !walletAddress) {
      return NextResponse.json({ error: 'ID or walletAddress is required' }, { status: 400 });
    }
    
    let query = {};
    if (id) {
      query = { _id: new ObjectId(id) };
    } else if (walletAddress) {
      query = { walletAddress: walletAddress.toLowerCase() };
    }
    
    const user = await db.collection('users').findOneAndUpdate(
      query,
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      },
      { 
        returnDocument: 'after'
      }
    );
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json(user);
  } catch (error: unknown) {
    if (isMongoError(error)) {
      if (error.code === 11000) {
        return NextResponse.json({ error: 'Duplicate wallet address' }, { status: 400 });
      }
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const client = await getClient();
    const db = client.db('andromeda');
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const walletAddress = searchParams.get('walletAddress');
    
    if (!id && !walletAddress) {
      return NextResponse.json({ error: 'ID or walletAddress is required' }, { status: 400 });
    }
    
    let query = {};
    if (id) {
      query = { _id: new ObjectId(id) };
    } else if (walletAddress) {
      query = { walletAddress: walletAddress.toLowerCase() };
    }
    
    const result = await db.collection('users').deleteOne(query);
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const client = await getClient();
    const db = client.db('andromeda');
    
    const body = await request.json();
    const { id, walletAddress, ...updateData } = body;
    
    if (!id && !walletAddress) {
      return NextResponse.json({ error: 'ID or walletAddress is required' }, { status: 400 });
    }
    
    let query = {};
    if (id) {
      query = { _id: new ObjectId(id) };
    } else if (walletAddress) {
      query = { walletAddress: walletAddress.toLowerCase() };
    }
    
    const user = await db.collection('users').findOneAndUpdate(
      query,
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      },
      { 
        returnDocument: 'after'
      }
    );
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json(user);
  } catch (error: unknown) {
    if (isMongoError(error)) {
      if (error.code === 11000) {
        return NextResponse.json({ error: 'Duplicate wallet address' }, { status: 400 });
      }
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}