import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/config/db';
import User from '@/app/lib/models/User';

interface MongoError extends Error {
  code?: number;
  keyPattern?: Record<string, unknown>;
}

function isMongoError(error: unknown): error is MongoError {
  return error instanceof Error && 'code' in error;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('address');
    
    if (walletAddress) {
      const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
      return NextResponse.json(user);
    }
    
    const users = await User.find({});
    return NextResponse.json(users);
  } catch (error) {
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
    await dbConnect();
    
    const body = await request.json();
    const user = await User.findOneAndUpdate(
      { walletAddress: body.walletAddress.toLowerCase() },
      { 
        ...body,
        lastLogin: new Date(),
      },
      { 
        upsert: true, 
        new: true,
      },
    );
    
    return NextResponse.json(user);
  } catch (error) {
    if (isMongoError(error)) {
      if (error.code === 11000) {
        return NextResponse.json({ error: 'Duplicate wallet address' }, { status: 400 });
      }
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}