import { NextRequest, NextResponse } from 'next/server';
import getClient from '@/app/lib/config/mongodb';
import { ObjectId } from 'mongodb';

function isMongoError(error: unknown): error is { code: number; message: string } {
  if (typeof error !== 'object' || error === null) return false;
  const obj = error as Record<string, unknown>;
  return 'code' in obj && typeof obj['code'] === 'number' && 'message' in obj && typeof obj['message'] === 'string';
}

// members are user ids (stored as ObjectId in the DB)
type GroupMember = string | import('mongodb').ObjectId;
type GroupDoc = { members?: GroupMember[]; [key: string]: unknown };
type UserDoc = { _id: import('mongodb').ObjectId; walletAddress: string; username?: string; [key: string]: unknown };

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const client = await getClient();
    const db = client.db('andromeda');
    
    const body = await request.json();
    
    const groupData = {
      ...body,
      createdAt: new Date(),
      members: body.members || []
    };
    
    const result = await db.collection('groups').insertOne(groupData);
    
    const group = await db.collection('groups').findOne({ 
      _id: result.insertedId 
    });
    
    return NextResponse.json(group);
  } catch (error: unknown) {
    if (isMongoError(error)) {
      if (error.code === 11000) {
        return NextResponse.json({ error: 'Duplicate group name' }, { status: 400 });
      }
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const client = await getClient();
    const db = client.db('andromeda');
    
    const { searchParams } = new URL(request.url);
    const createdBy = searchParams.get('createdBy');
    
    let query = {};
    if (createdBy) {
      query = { createdBy: createdBy.toLowerCase() };
    }
    
    const groups = (await db.collection('groups').find(query).toArray()) as GroupDoc[];
    
    const groupsWithMembers = await Promise.all(
      groups.map(async (group) => {
          const membersArr = (group.members ?? []) as GroupMember[];
          if (membersArr.length > 0) {
            // Normalize to ObjectId instances for querying users by _id
            const memberObjectIds = membersArr.map((member: GroupMember) => {
              try {
                return typeof member === 'string' ? new ObjectId(member) : member;
              } catch {
                // fallback: keep original value if it cannot be cast
                return member as unknown as import('mongodb').ObjectId;
              }
            });

            const members = (await db.collection('users').find({
              _id: { $in: memberObjectIds }
            }).toArray()) as unknown as UserDoc[];

            return {
              ...group,
              // map user documents to a lightweight member view
              members: members.map(user => ({
                id: String(user._id),
                walletAddress: user.walletAddress,
                username: user.username,
              }))
            };
          }

          return { ...group, members: [] };
      })
    );
    
    return NextResponse.json(groupsWithMembers);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const client = await getClient();
    const db = client.db('andromeda');
    
    const body = await request.json();
    const { id, ...updateData } = body;
    
    const group = await db.collection('groups').findOneAndUpdate(
      { _id: new ObjectId(id) },
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
    
    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }
    
    return NextResponse.json(group);
  } catch (error: unknown) {
    if (isMongoError(error)) {
      if (error.code === 11000) {
        return NextResponse.json({ error: 'Duplicate group name' }, { status: 400 });
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
    
    if (!id) {
      return NextResponse.json({ error: 'Group ID is required' }, { status: 400 });
    }
    
    const result = await db.collection('groups').deleteOne({ 
      _id: new ObjectId(id) 
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}