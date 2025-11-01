import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import type { NextRequest } from 'next/server';
import type { ObjectId } from 'mongoose';
import type { IGroup, IUser } from '@/app/lib/types';

const mocks = vi.hoisted(() => {
	const createJsonResponse = (body: unknown, init?: { status?: number }) => ({
		body,
		status: init?.status ?? 200,
		headers: new Headers(),
	});
	return {
		authorizeRequestMock: vi.fn(),
		createGroupMock: vi.fn(),
		getGroupsByCreatorMock: vi.fn(),
		getAllGroupsMock: vi.fn(),
		updateGroupMock: vi.fn(),
		deleteGroupMock: vi.fn(),
		getUserByIdMock: vi.fn(),
		validateRequestBodyMock: vi.fn(),
		validateCreateGroupMock: vi.fn(),
		validateUpdateGroupMock: vi.fn(),
		ensureGroupNameUniqueMock: vi.fn(),
		jsonMock: vi.fn(createJsonResponse),
		createJsonResponse,
	};
});

const {
	authorizeRequestMock,
	createGroupMock,
	getGroupsByCreatorMock,
	getAllGroupsMock,
	updateGroupMock,
	deleteGroupMock,
	getUserByIdMock,
	validateRequestBodyMock,
	validateCreateGroupMock,
	validateUpdateGroupMock,
	ensureGroupNameUniqueMock,
	jsonMock,
	createJsonResponse,
} = mocks;

vi.mock('@/app/api/auth/guard', () => ({
	__esModule: true,
	authorizeRequest: authorizeRequestMock,
}));

vi.mock('@/app/lib/services', () => ({
	__esModule: true,
	GroupService: class {
		createGroup = createGroupMock;
		getGroupsByCreator = getGroupsByCreatorMock;
		getAllGroups = getAllGroupsMock;
		updateGroup = updateGroupMock;
		deleteGroup = deleteGroupMock;
		getGroupByName = vi.fn();
	},
	UserService: class {
		getUserById = getUserByIdMock;
	},
}));

vi.mock('@/app/lib/validators', async (importOriginal) => {
	const original = await importOriginal<typeof import('@/app/lib/validators')>();
	return {
		__esModule: true,
		...original,
		validateCreateGroup: validateCreateGroupMock,
		validateUpdateGroup: validateUpdateGroupMock,
		validateRequestBody: validateRequestBodyMock,
		ensureGroupNameUnique: ensureGroupNameUniqueMock,
	};
});

vi.mock('next/server', () => ({
	__esModule: true,
	NextRequest: class {},
	NextResponse: { json: jsonMock },
}));

const groupsRoute = await import('./route');
const { POST, GET, PUT, DELETE } = groupsRoute;

type MockedRequest = NextRequest & { json: () => Promise<unknown>; headers: Headers; url: string };

const createRequest = (options: {
	url?: string;
	body?: unknown;
	headers?: Record<string, string>;
} = {}): MockedRequest => {
	const { url = 'https://example.com/api/groups', body, headers = {} } = options;
	return {
		url,
		headers: new Headers(headers),
		json: async () => body,
	} as unknown as MockedRequest;
};

const buildGroup = (overrides: Partial<IGroup> = {}) => ({
	_id: '507f191e810c19729de860ea',
	name: 'Nova Squad',
	description: 'Explorers',
	createdBy: '0xcreator',
	members: [
		{ toString: () => 'user-1' } as unknown as ObjectId,
	],
	permissions: [],
	settings: { isPublic: true, requiresApproval: false },
	createdAt: new Date('2023-01-01T00:00:00.000Z'),
	updatedAt: new Date('2023-02-02T00:00:00.000Z'),
	...overrides,
}) as unknown as IGroup;

const buildUser = (overrides: Partial<IUser> = {}) => ({
	_id: 'user-1',
	id: 'user-1',
	walletAddress: '0xabc',
	username: 'stellar',
	email: 'stellar@example.com',
	password: '$2b$hash',
	settings: { theme: 'default', notifications: true },
	permissions: [],
	groups: [],
	createdAt: new Date('2023-01-01T00:00:00.000Z'),
	lastLogin: new Date('2023-02-02T00:00:00.000Z'),
	...overrides,
}) as unknown as IUser;

const authDenied = (status: number, message: string) => ({
	ok: false,
	response: jsonMock({ error: message }, { status }),
});

const authGranted = () => ({ ok: true, payload: { userId: '1' } });

describe('POST /api/groups', () => {
	const authorizeMock = authorizeRequestMock as unknown as Mock;
	const validateMock = validateRequestBodyMock as unknown as Mock;

	beforeEach(() => {
		authorizeMock.mockReset();
		validateMock.mockReset();
		validateCreateGroupMock.mockReset();
		ensureGroupNameUniqueMock.mockReset();
		createGroupMock.mockReset();
		jsonMock.mockReset();
		jsonMock.mockImplementation(createJsonResponse);
	});

	it('returns auth error when unauthorized', async () => {
		authorizeMock.mockReturnValueOnce(authDenied(403, 'Forbidden'));

		const response = await POST(createRequest({ body: {} }));

		expect(response.status).toBe(403);
	});

	it('returns validation error when schema fails', async () => {
		authorizeMock.mockReturnValueOnce(authGranted());
		validateMock.mockReturnValueOnce({ errorResponse: jsonMock({ error: 'Invalid' }, { status: 400 }) });

		const response = await POST(createRequest({ body: {} }));

		expect(response.status).toBe(400);
	});

	it('returns 400 when group name already exists', async () => {
		authorizeMock.mockReturnValueOnce(authGranted());
		validateMock.mockReturnValueOnce({ value: { name: 'Nova', createdBy: '0x123' } });
		ensureGroupNameUniqueMock.mockResolvedValueOnce('Group name must be unique');

		const response = await POST(createRequest({ body: {} }));

		expect(response.status).toBe(400);
	});

	it('creates group successfully when validation passes', async () => {
		authorizeMock.mockReturnValueOnce(authGranted());
		const validated = { name: 'Nova Squad', createdBy: '0x123', description: 'Explorers' };
		validateMock.mockReturnValueOnce({ value: validated });
		ensureGroupNameUniqueMock.mockResolvedValueOnce(null);
		const group = buildGroup();
		createGroupMock.mockResolvedValueOnce(group);

		const response = await POST(createRequest({ body: validated }));

		expect(createGroupMock).toHaveBeenCalledWith(validated);
		expect(response.body).toEqual({
			success: true,
			message: 'Group created successfully',
			group,
		});
	});

	it('returns 500 on unexpected errors', async () => {
		authorizeMock.mockReturnValueOnce(authGranted());
		validateMock.mockReturnValueOnce({ value: { name: 'Nova', createdBy: '0x123' } });
		ensureGroupNameUniqueMock.mockResolvedValueOnce(null);
		createGroupMock.mockRejectedValueOnce(new Error('db down'));

		const response = await POST(createRequest({ body: {} }));

		expect(response.status).toBe(500);
	});
});

describe('GET /api/groups', () => {
	const authorizeMock = authorizeRequestMock as unknown as Mock;

	beforeEach(() => {
		authorizeMock.mockReset();
		getGroupsByCreatorMock.mockReset();
		getAllGroupsMock.mockReset();
		getUserByIdMock.mockReset();
		jsonMock.mockReset();
		jsonMock.mockImplementation(createJsonResponse);
	});

	it('returns auth error when unauthorized', async () => {
		authorizeMock.mockReturnValueOnce(authDenied(401, 'Unauthorized'));

		const response = await GET(createRequest());

		expect(response.status).toBe(401);
	});

	it('fetches groups by creator when query provided', async () => {
		authorizeMock.mockReturnValueOnce(authGranted());
		const groups = [buildGroup()];
		getGroupsByCreatorMock.mockResolvedValueOnce(groups);
		getUserByIdMock.mockResolvedValueOnce(buildUser());

		const response = await GET(createRequest({ url: 'https://example.com/api/groups?createdBy=0x123' }));

		expect(getGroupsByCreatorMock).toHaveBeenCalledWith('0x123');
		expect(response.body).toEqual({
			success: true,
			message: 'Group retrieved successfully',
			group: [
				{
					...groups[0],
					members: [
						{
							id: 'user-1',
							walletAddress: '0xabc',
							username: 'stellar',
						},
					],
				},
			],
		});
	});

	it('fetches all groups when no query provided', async () => {
		authorizeMock.mockReturnValueOnce(authGranted());
		const groups = [buildGroup({ members: [] })];
		getAllGroupsMock.mockResolvedValueOnce(groups);

		const response = await GET(createRequest());

		expect(getAllGroupsMock).toHaveBeenCalledTimes(1);
		expect(response.body).toEqual({
			success: true,
			message: 'Group retrieved successfully',
			group: groups,
		});
	});

	it('filters out members that fail to resolve', async () => {
		authorizeMock.mockReturnValueOnce(authGranted());
		const group = buildGroup({ members: [{ toString: () => 'user-1' } as unknown as ObjectId, { toString: () => 'user-2' } as unknown as ObjectId] });
		getAllGroupsMock.mockResolvedValueOnce([group]);
		getUserByIdMock.mockResolvedValueOnce(buildUser());
		getUserByIdMock.mockResolvedValueOnce(null);

		const response = await GET(createRequest());

		expect(response.body).toEqual({
			success: true,
			message: 'Group retrieved successfully',
			group: [
				{
					...group,
					members: [
						{
							id: 'user-1',
							walletAddress: '0xabc',
							username: 'stellar',
						},
					],
				},
			],
		});
	});

	it('continues when member lookup throws', async () => {
		authorizeMock.mockReturnValueOnce(authGranted());
		const group = buildGroup();
		getAllGroupsMock.mockResolvedValueOnce([group]);
		getUserByIdMock.mockImplementationOnce(() => {
			throw new Error('lookup failed');
		});
		const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

		const response = await GET(createRequest());

		expect(consoleSpy).toHaveBeenCalledWith('Failed to resolve member:', group.members[0], expect.any(Error));
		const lastCall = jsonMock.mock.calls.at(-1);
		const payload = lastCall?.[0] as { group: Array<{ members: unknown[] }> } | undefined;
		expect(payload?.group[0].members).toEqual([]);
		consoleSpy.mockRestore();
	});

	it('returns 500 when fetch throws', async () => {
		authorizeMock.mockReturnValueOnce(authGranted());
		getAllGroupsMock.mockRejectedValueOnce(new Error('db down'));

		const response = await GET(createRequest());

		expect(response.status).toBe(500);
	});
});

describe('PUT /api/groups', () => {
	const authorizeMock = authorizeRequestMock as unknown as Mock;
	const validateMock = validateRequestBodyMock as unknown as Mock;

	beforeEach(() => {
		authorizeMock.mockReset();
		validateMock.mockReset();
		validateUpdateGroupMock.mockReset();
		ensureGroupNameUniqueMock.mockReset();
		updateGroupMock.mockReset();
		jsonMock.mockReset();
		jsonMock.mockImplementation(createJsonResponse);
	});

	it('returns auth error when unauthorized', async () => {
		authorizeMock.mockReturnValueOnce(authDenied(403, 'Forbidden'));

		const response = await PUT(createRequest({ body: {} }));

		expect(response.status).toBe(403);
	});

	it('returns validation error when schema fails', async () => {
		authorizeMock.mockReturnValueOnce(authGranted());
		validateMock.mockReturnValueOnce({ errorResponse: jsonMock({ error: 'Invalid' }, { status: 400 }) });

		const response = await PUT(createRequest({ body: {} }));

		expect(response.status).toBe(400);
	});

	it('returns 400 when new name conflicts', async () => {
		authorizeMock.mockReturnValueOnce(authGranted());
		validateMock.mockReturnValueOnce({ value: { id: '1', name: 'Nova' } });
		ensureGroupNameUniqueMock.mockResolvedValueOnce('Group name must be unique');

		const response = await PUT(createRequest({ body: {} }));

		expect(response.status).toBe(400);
	});

	it('updates group successfully', async () => {
		authorizeMock.mockReturnValueOnce(authGranted());
		validateMock.mockReturnValueOnce({ value: { id: '1', name: 'Nova Squad' } });
		ensureGroupNameUniqueMock.mockResolvedValueOnce(null);
		const group = buildGroup();
		updateGroupMock.mockResolvedValueOnce(group);

		const response = await PUT(createRequest({ body: {} }));

		expect(updateGroupMock).toHaveBeenCalledWith('1', expect.objectContaining({ name: 'Nova Squad' }));
		expect(response.body).toEqual({
			success: true,
			message: 'Group updated successfully',
			group,
		});
	});

	it('returns 404 when group not found', async () => {
		authorizeMock.mockReturnValueOnce(authGranted());
		validateMock.mockReturnValueOnce({ value: { id: '1' } });
		ensureGroupNameUniqueMock.mockResolvedValueOnce(null);
		updateGroupMock.mockResolvedValueOnce(null);

		const response = await PUT(createRequest({ body: {} }));

		expect(response.status).toBe(404);
	});

	it('returns 500 on unexpected errors', async () => {
		authorizeMock.mockReturnValueOnce(authGranted());
		validateMock.mockReturnValueOnce({ value: { id: '1' } });
		ensureGroupNameUniqueMock.mockResolvedValueOnce(null);
		updateGroupMock.mockRejectedValueOnce(new Error('db down'));

		const response = await PUT(createRequest({ body: {} }));

		expect(response.status).toBe(500);
	});
});

describe('DELETE /api/groups', () => {
	const authorizeMock = authorizeRequestMock as unknown as Mock;

	beforeEach(() => {
		authorizeMock.mockReset();
		deleteGroupMock.mockReset();
		jsonMock.mockReset();
		jsonMock.mockImplementation(createJsonResponse);
	});

	it('returns auth error when unauthorized', async () => {
		authorizeMock.mockReturnValueOnce(authDenied(403, 'Forbidden'));

		const response = await DELETE(createRequest({ url: 'https://example.com/api/groups?id=1' }));

		expect(response.status).toBe(403);
	});

	it('returns 400 when id missing', async () => {
		authorizeMock.mockReturnValueOnce(authGranted());

		const response = await DELETE(createRequest());

		expect(response.status).toBe(400);
	});

	it('returns 404 when delete returns false', async () => {
		authorizeMock.mockReturnValueOnce(authGranted());
		deleteGroupMock.mockResolvedValueOnce(false);

		const response = await DELETE(createRequest({ url: 'https://example.com/api/groups?id=missing' }));

		expect(response.status).toBe(404);
	});

	it('deletes group successfully', async () => {
		authorizeMock.mockReturnValueOnce(authGranted());
		deleteGroupMock.mockResolvedValueOnce(true);

		const response = await DELETE(createRequest({ url: 'https://example.com/api/groups?id=1' }));

		expect(response.body).toEqual({ success: true, message: 'Group deleted successfully', groupId: '1' });
	});

	it('returns 500 when delete throws', async () => {
		authorizeMock.mockReturnValueOnce(authGranted());
		deleteGroupMock.mockRejectedValueOnce(new Error('db down'));

		const response = await DELETE(createRequest({ url: 'https://example.com/api/groups?id=1' }));

		expect(response.status).toBe(500);
	});
});
