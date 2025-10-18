import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/config/db';
import Group from '@/app/lib/models/Group';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await dbConnect();
    
    const body = await request.json();
    const group = await Group.create(body);
    
    return NextResponse.json(group);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse> {
  try {
    await dbConnect();
    const groups = await Group.find({}).populate('members');
    return NextResponse.json(groups);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}