import { NextRequest, NextResponse } from 'next/server';
import { GroupService, UserService } from '@/app/lib/services';
import { IGroup } from '@/app/lib/types';
import {
  validateCreateGroup,
  validateUpdateGroup,
  validateRequestBody,
  ensureGroupNameUnique,
} from '@/app/lib/validators';

const groupService = new GroupService();
const userService = new UserService();

/**
 * Convert an unknown error into a JSON NextResponse with a 500 status.
 * Centralized so handlers can call it in catch blocks.
 * @param error - The thrown value
 */
function handleError(error: unknown): NextResponse {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
  return NextResponse.json({ error: errorMessage }, { status: 500 });
}

/**
 * POST handler to create a new group. Applies `validateCreateGroup` via `validateRequestBody`,
 * rejects duplicate names using `ensureGroupNameUnique`, and returns the persisted document.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const rawBody = await request.json();
    const { value, errorResponse } = validateRequestBody(validateCreateGroup, rawBody);

    if (errorResponse) {
      return errorResponse;
    }

    const body = value as {
      name: string;
      createdBy: string;
    } & Record<string, unknown>;

    const conflict = await ensureGroupNameUnique(groupService, body.name);
    if (conflict) {
      return NextResponse.json({ error: conflict }, { status: 400 });
    }

    const group = await groupService.createGroup(body as unknown as Omit<IGroup, 'id' | 'createdAt'>);
    return NextResponse.json({
        success: true,
        message: 'Group created successfully',
        group,
      });
  } catch (error: unknown) {
    return handleError(error);
  }
}

/**
 * GET handler for `/api/groups`.
 * Query params:
 * - `createdBy`: filter groups by creator wallet address
 * Returns groups with populated member information.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const createdBy = searchParams.get('createdBy');
    
    // Get groups using service
    let groups: IGroup[];
    if (createdBy) {
      groups = await groupService.getGroupsByCreator(createdBy);
    } else {
      groups = await groupService.getAllGroups();
    }
    
    // Populate member information for each group
    const groupsWithMembers = await Promise.all(
      groups.map(async (group) => {
        if (group.members && group.members.length > 0) {
          // Get member details using user service
          const memberDetails = await Promise.all(
            group.members.map(async (memberId) => {
              try {
                const user = await userService.getUserById(String(memberId));
                if (user) {
                  return {
                    id: user.id || String(user._id),
                    walletAddress: user.walletAddress,
                    username: user.username,
                  };
                }
                return null;
              } catch (err) {
                console.warn('Failed to resolve member:', memberId, err);
                return null;
              }
            })
          );
          
          // Filter out null values (failed member lookups)
          const validMembers = memberDetails.filter(member => member !== null);
          
          return {
            ...group,
            members: validMembers
          };
        }
        
        return {
          ...group,
          members: []
        };
      })
    );
    
    return NextResponse.json({
        success: true,
        message: 'Group retrieved successfully',
        group: groupsWithMembers,
      });
  } catch (error: unknown) {
    return handleError(error);
  }
}

/**
 * PUT handler to update a group by id. Validates the payload with `validateUpdateGroup`,
 * enforces name uniqueness when renaming, and returns 404 if the group is missing.
 */
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const rawBody = await request.json();
    const { value, errorResponse } = validateRequestBody(validateUpdateGroup, rawBody);

    if (errorResponse) {
      return errorResponse;
    }

    const { id, ...updateData } = value as {
      id: string;
      name?: string;
    } & Record<string, unknown>;

    if (typeof updateData.name === 'string') {
      const conflict = await ensureGroupNameUnique(groupService, updateData.name, id);
      if (conflict) {
        return NextResponse.json({ error: conflict }, { status: 400 });
      }
    }

    const group = await groupService.updateGroup(id, updateData as Partial<IGroup>);
    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    return NextResponse.json({
        success: true,
        message: 'Group updated successfully',
        group,
      });
  } catch (error: unknown) {
    return handleError(error);
  }
}

/**
 * DELETE handler to remove a group by id via query parameter `id`.
 * Returns 200 with success flag or 404 if not found.
 */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Group ID is required' }, { status: 400 });
    }

    // Delete group using service
    const success = await groupService.deleteGroup(id);
    if (!success) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Group deleted successfully',
      groupId: id,
    });
  } catch (error: unknown) {
    return handleError(error);
  }
}