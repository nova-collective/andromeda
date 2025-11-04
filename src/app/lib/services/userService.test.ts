import { Types } from 'mongoose';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { UserService } from './userService';

import type { MongoDBGroupRepository, MongoDBUserRepository } from '../repositories';
import type { IGroup, IUser, Permission } from '../types';


const comparePasswordMock = vi.hoisted(() => vi.fn());

const { MongoDBUserRepositoryMock, MongoDBGroupRepositoryMock } = vi.hoisted(() => ({
	MongoDBUserRepositoryMock: vi.fn(),
	MongoDBGroupRepositoryMock: vi.fn(),
}));

vi.mock('@/app/lib/utils', () => ({
	__esModule: true,
	comparePassword: comparePasswordMock,
}));

vi.mock('@/app/lib/repositories', () => ({
	MongoDBUserRepository: MongoDBUserRepositoryMock,
	MongoDBGroupRepository: MongoDBGroupRepositoryMock,
}));

const USER_ID = '507f1f77bcf86cd7994390aa';
const GROUP_ID = '507f1f77bcf86cd799439011';
const GROUP_ID_ALT = '507f1f77bcf86cd799439012';

const buildPermission = (
	name: Permission['name'],
	crud: Partial<Permission['crud']> = {},
): Permission => ({
	name,
	crud: {
		read: false,
		create: false,
		update: false,
		delete: false,
		...crud,
	},
});

const buildGroup = (overrides: Partial<IGroup> = {}): IGroup => ({
	id: GROUP_ID,
	name: 'Guild',
	description: 'Writers guild',
	createdBy: '0xabc',
	members: [],
	permissions: [],
	settings: { isPublic: true, requiresApproval: false },
	createdAt: new Date('2024-01-01T00:00:00.000Z'),
	updatedAt: new Date('2024-01-02T00:00:00.000Z'),
	...overrides,
});

const buildUser = (overrides: Partial<IUser> = {}): IUser => ({
	_id: new Types.ObjectId(USER_ID),
	walletAddress: '0xabc',
	username: 'jdoe',
	email: 'jdoe@example.com',
	password: 'hashed',
	settings: { theme: 'default', notifications: true },
	permissions: [],
	groups: [] as unknown as IUser['groups'],
	createdAt: new Date('2024-01-01T00:00:00.000Z'),
	lastLogin: new Date('2024-01-02T00:00:00.000Z'),
	...overrides,
}) as unknown as IUser;

describe('UserService', () => {
	const userRepositoryMock = {
		findById: vi.fn(),
		findByField: vi.fn(),
		findByEmail: vi.fn(),
		findByUsername: vi.fn(),
		findAll: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
		upsert: vi.fn(),
	} as Record<string, ReturnType<typeof vi.fn>>;

	const groupRepositoryMock = {
		findById: vi.fn(),
	} as Record<string, ReturnType<typeof vi.fn>>;

	let service: UserService;

	beforeEach(() => {
		vi.clearAllMocks();
		MongoDBUserRepositoryMock.mockClear();
		MongoDBGroupRepositoryMock.mockClear();
		Object.values(userRepositoryMock).forEach(mock => mock.mockReset());
		Object.values(groupRepositoryMock).forEach(mock => mock.mockReset());
		comparePasswordMock.mockReset();
		service = new UserService(
			userRepositoryMock as unknown as MongoDBUserRepository,
			groupRepositoryMock as unknown as MongoDBGroupRepository,
		);
	});

	it('getUserById delegates to repository.findById', async () => {
		const user = buildUser();
		userRepositoryMock.findById.mockResolvedValueOnce(user);

		const result = await service.getUserById(USER_ID);

		expect(userRepositoryMock.findById).toHaveBeenCalledWith(USER_ID);
		expect(result).toBe(user);
	});

	it('getUserByWalletAddress delegates to findByField', async () => {
		const user = buildUser();
		userRepositoryMock.findByField.mockResolvedValueOnce(user);

		const result = await service.getUserByWalletAddress('0xabc');

		expect(userRepositoryMock.findByField).toHaveBeenCalledWith('walletAddress', '0xabc');
		expect(result).toBe(user);
	});

	it('getUserByEmail uses repository.findByEmail', async () => {
		const user = buildUser();
		userRepositoryMock.findByEmail.mockResolvedValueOnce(user);

		const result = await service.getUserByEmail('jdoe@example.com');

		expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith('jdoe@example.com');
		expect(result).toBe(user);
	});

	it('getUserByUsername uses repository.findByUsername', async () => {
		const user = buildUser();
		userRepositoryMock.findByUsername.mockResolvedValueOnce(user);

		const result = await service.getUserByUsername('jdoe');

		expect(userRepositoryMock.findByUsername).toHaveBeenCalledWith('jdoe');
		expect(result).toBe(user);
	});

	it('getAllUsers returns repository.findAll result', async () => {
		const users = [buildUser(), buildUser({ username: 'other' })];
		userRepositoryMock.findAll.mockResolvedValueOnce(users);

		const result = await service.getAllUsers();

		expect(userRepositoryMock.findAll).toHaveBeenCalledWith();
		expect(result).toBe(users);
	});

	it('createUser forwards payload to repository.create', async () => {
		const user = buildUser();
		userRepositoryMock.create.mockResolvedValueOnce(user);
		const payload = {
			walletAddress: '0xabc',
			username: 'jdoe',
			email: 'jdoe@example.com',
			password: 'hashed',
			settings: { theme: 'default', notifications: true },
			permissions: [],
			groups: [GROUP_ID] as unknown as IUser['groups'],
			lastLogin: new Date('2024-01-02T00:00:00.000Z'),
		} as unknown as Omit<IUser, 'id' | 'createdAt'>;

		const result = await service.createUser(payload);

		expect(userRepositoryMock.create).toHaveBeenCalledWith(payload);
		expect(result).toBe(user);
	});

	it('updateUser delegates to repository.update', async () => {
		const user = buildUser({ username: 'updated' });
		userRepositoryMock.update.mockResolvedValueOnce(user);

		const result = await service.updateUser(USER_ID, { username: 'updated' });

		expect(userRepositoryMock.update).toHaveBeenCalledWith(USER_ID, { username: 'updated' });
		expect(result).toBe(user);
	});

	it('deleteUser delegates to repository.delete', async () => {
		userRepositoryMock.delete.mockResolvedValueOnce(true);

		const result = await service.deleteUser(USER_ID);

		expect(userRepositoryMock.delete).toHaveBeenCalledWith(USER_ID);
		expect(result).toBe(true);
	});

	it('upsertUser delegates to repository.upsert with wallet filter', async () => {
		const user = buildUser();
		userRepositoryMock.upsert.mockResolvedValueOnce(user);

		const result = await service.upsertUser('0xabc', { username: 'jdoe' } as Partial<IUser>);

		expect(userRepositoryMock.upsert).toHaveBeenCalledWith({ walletAddress: '0xabc' }, { username: 'jdoe' });
		expect(result).toBe(user);
	});

	it('validatePassword compares using comparePassword helper', async () => {
		comparePasswordMock.mockResolvedValueOnce(true);
		const user = buildUser();

		const result = await service.validatePassword(user, 'plain');

		expect(comparePasswordMock).toHaveBeenCalledWith('plain', 'hashed');
		expect(result).toBe(true);
	});

	it('validatePassword returns false when user has no password', async () => {
		const user = buildUser({ password: '' });

		const result = await service.validatePassword(user, 'plain');

		expect(comparePasswordMock).not.toHaveBeenCalled();
		expect(result).toBe(false);
	});

	it('addUserToGroup appends new group when absent', async () => {
		const user = buildUser({ groups: [GROUP_ID_ALT] as unknown as IUser['groups'] });
		const updatedUser = buildUser({ groups: [GROUP_ID_ALT, GROUP_ID] as unknown as IUser['groups'] });
		userRepositoryMock.findById.mockResolvedValueOnce(user);
		userRepositoryMock.update.mockResolvedValueOnce(updatedUser);

		const result = await service.addUserToGroup(USER_ID, GROUP_ID);

		expect(userRepositoryMock.findById).toHaveBeenCalledWith(USER_ID);
		expect(userRepositoryMock.update).toHaveBeenCalledTimes(1);
		const updatePayload = userRepositoryMock.update.mock.calls[0]?.[1] as Partial<IUser>;
		const groups = ((updatePayload.groups ?? []) as unknown[]).map(g => String(g));
		expect(groups).toHaveLength(2);
		expect(groups).toContain(GROUP_ID);
		expect(result).toBe(updatedUser);
	});

	it('addUserToGroup skips update when user already in group', async () => {
		const user = buildUser({ groups: [new Types.ObjectId(GROUP_ID)] as unknown as IUser['groups'] });
		userRepositoryMock.findById.mockResolvedValueOnce(user);

		const result = await service.addUserToGroup(USER_ID, GROUP_ID);

		expect(userRepositoryMock.update).not.toHaveBeenCalled();
		expect(result).toBe(user);
	});

	it('addUserToGroup returns null when user not found', async () => {
		userRepositoryMock.findById.mockResolvedValueOnce(null);

		const result = await service.addUserToGroup(USER_ID, GROUP_ID);

		expect(userRepositoryMock.update).not.toHaveBeenCalled();
		expect(result).toBeNull();
	});

	it('addUserToGroup swallows errors and logs', async () => {
		const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
		userRepositoryMock.findById.mockRejectedValueOnce(new Error('boom'));

		const result = await service.addUserToGroup(USER_ID, GROUP_ID);

		expect(result).toBeNull();
		expect(userRepositoryMock.update).not.toHaveBeenCalled();
		expect(consoleError).toHaveBeenCalled();
		consoleError.mockRestore();
	});

	it('removeUserFromGroup filters the supplied group id', async () => {
		const user = buildUser({ groups: [GROUP_ID, GROUP_ID_ALT] as unknown as IUser['groups'] });
		const updatedUser = buildUser({ groups: [GROUP_ID_ALT] as unknown as IUser['groups'] });
		userRepositoryMock.findById.mockResolvedValueOnce(user);
		userRepositoryMock.update.mockResolvedValueOnce(updatedUser);

		const result = await service.removeUserFromGroup(USER_ID, GROUP_ID);

		expect(userRepositoryMock.update).toHaveBeenCalledTimes(1);
		const updatePayload = userRepositoryMock.update.mock.calls[0]?.[1] as Partial<IUser>;
		const groups = ((updatePayload.groups ?? []) as unknown[]).map(g => String(g));
		expect(groups).not.toContain(GROUP_ID);
		expect(result).toBe(updatedUser);
	});

	it('removeUserFromGroup returns null when user missing', async () => {
		userRepositoryMock.findById.mockResolvedValueOnce(null);

		const result = await service.removeUserFromGroup(USER_ID, GROUP_ID);

		expect(userRepositoryMock.update).not.toHaveBeenCalled();
		expect(result).toBeNull();
	});

	it('isUserInGroup checks membership by string equality', () => {
		const user = buildUser({ groups: [new Types.ObjectId(GROUP_ID)] as unknown as IUser['groups'] });

		const result = service.isUserInGroup(user, GROUP_ID);

		expect(result).toBe(true);
		expect(service.isUserInGroup(user, GROUP_ID_ALT)).toBe(false);
	});

	it('isUserAdmin checks against admin group', () => {
		const user = buildUser({ groups: ['admin'] as unknown as IUser['groups'] });

		expect(service.isUserAdmin(user)).toBe(true);
		expect(service.isUserAdmin(buildUser())).toBe(false);
	});

	it('getUserPermissions returns empty array when user not found', async () => {
		userRepositoryMock.findById.mockResolvedValueOnce(null);

		const permissions = await service.getUserPermissions(USER_ID);

		expect(permissions).toEqual([]);
		expect(groupRepositoryMock.findById).not.toHaveBeenCalled();
	});

	it('getUserPermissions merges user and group permissions without duplicates', async () => {
		const userPermissions = [buildPermission('User', { read: true, update: true })];
		const user = buildUser({ permissions: userPermissions, groups: [GROUP_ID, GROUP_ID_ALT] as unknown as IUser['groups'] });
		userRepositoryMock.findById.mockResolvedValueOnce(user);
		groupRepositoryMock.findById
			.mockResolvedValueOnce(buildGroup({ permissions: [buildPermission('Group', { read: true, create: true })] }))
			.mockResolvedValueOnce(buildGroup({ permissions: [buildPermission('User', { read: false, delete: true }), buildPermission('Group', { update: true })] }));

		const permissions = await service.getUserPermissions(USER_ID);

		expect(groupRepositoryMock.findById).toHaveBeenCalledTimes(2);
		expect(permissions).toHaveLength(2);
		const userPerm = permissions.find(p => p.name === 'User');
		expect(userPerm?.crud.read).toBe(true); // preserved user permission
		expect(userPerm?.crud.delete).toBe(false); // duplicate ignored from group
		const groupPerm = permissions.find(p => p.name === 'Group');
		expect(groupPerm?.crud.create).toBe(true);
		expect(groupPerm?.crud.update).toBe(false);
	});

	it('getUserPermissions continues when group lookup fails', async () => {
		const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
		const user = buildUser({ permissions: [buildPermission('User', { read: true })], groups: [GROUP_ID] as unknown as IUser['groups'] });
		userRepositoryMock.findById.mockResolvedValueOnce(user);
		groupRepositoryMock.findById.mockRejectedValueOnce(new Error('boom'));

		const permissions = await service.getUserPermissions(USER_ID);

		expect(permissions).toHaveLength(1);
		expect(permissions[0]?.name).toBe('User');
		expect(consoleError).toHaveBeenCalled();
		consoleError.mockRestore();
	});

	it('verifyUserPermission resolves using getUserPermissions', async () => {
		const permissionsList = [buildPermission('User', { read: true })];
		const getUserPermissionsSpy = vi.spyOn(service, 'getUserPermissions').mockResolvedValueOnce(permissionsList);

		const result = await service.verifyUserPermission(USER_ID, 'User', 'read');

		expect(getUserPermissionsSpy).toHaveBeenCalledWith(USER_ID);
		expect(result).toBe(true);
		getUserPermissionsSpy.mockRestore();
	});

	it('verifyUserPermission returns false when permission missing or crud false', async () => {
		const spy = vi.spyOn(service, 'getUserPermissions');
		spy.mockResolvedValueOnce([buildPermission('User', { read: false })]);

		await expect(service.verifyUserPermission(USER_ID, 'User', 'read')).resolves.toBe(false);

		spy.mockResolvedValueOnce([]);
		await expect(service.verifyUserPermission(USER_ID, 'Group', 'create')).resolves.toBe(false);
		spy.mockRestore();
	});
});
