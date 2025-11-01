import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { IGroup } from '@/app/lib/types';
import { MongoDBGroupRepository } from '@/app/lib/repositories';
import { GroupService } from './groupService';

const { repositoryMock, MongoDBGroupRepositoryMock } = vi.hoisted(() => {
		const repo = {
		findById: vi.fn(),
		findAll: vi.fn(),
		findByField: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
		addUser: vi.fn(),
		removeUser: vi.fn(),
		findByUserId: vi.fn(),
		upsert: vi.fn(),
		} as Record<string, ReturnType<typeof vi.fn>>;

	const ctor = vi.fn(function mockedRepository(this: unknown) {
		return repo as unknown as MongoDBGroupRepository;
	});

	return {
		repositoryMock: repo,
		MongoDBGroupRepositoryMock: ctor,
	};
});

vi.mock('@/app/lib/repositories', () => ({
	MongoDBGroupRepository: MongoDBGroupRepositoryMock,
}));

const buildGroup = (overrides: Partial<IGroup> = {}): IGroup => ({
	id: '507f1f77bcf86cd799439011',
	name: 'Writers',
	description: 'A writing collective',
	createdBy: '0xabc',
	members: [],
	permissions: [],
	settings: { isPublic: true, requiresApproval: false },
	updatedAt: new Date('2024-01-02T00:00:00.000Z'),
	createdAt: new Date('2024-01-01T00:00:00.000Z'),
	...overrides,
});

describe('GroupService', () => {
	let service: GroupService;

	beforeEach(() => {
		vi.clearAllMocks();
		MongoDBGroupRepositoryMock.mockClear();
		Object.values(repositoryMock).forEach(mockFn => mockFn.mockClear());
		service = new GroupService();
	});

	it('getGroupById delegates to repository.findById', async () => {
		const group = buildGroup();
		repositoryMock.findById.mockResolvedValueOnce(group);

		const result = await service.getGroupById(group.id!);

		expect(repositoryMock.findById).toHaveBeenCalledWith(group.id);
		expect(result).toBe(group);
	});

	it('getGroupsByCreator normalizes wallet address to lowercase', async () => {
		const groups = [buildGroup({ createdBy: '0xabc' })];
		repositoryMock.findAll.mockResolvedValueOnce(groups);

		const result = await service.getGroupsByCreator('0xABC');

		expect(repositoryMock.findAll).toHaveBeenCalledWith({ createdBy: '0xabc' });
		expect(result).toBe(groups);
	});

	it('getGroupByName fetches by name field', async () => {
		const group = buildGroup({ name: 'Editors' });
		repositoryMock.findByField.mockResolvedValueOnce(group);

		const result = await service.getGroupByName('Editors');

		expect(repositoryMock.findByField).toHaveBeenCalledWith('name', 'Editors');
		expect(result).toBe(group);
	});

	it('getAllGroups returns all groups', async () => {
		const groups = [buildGroup(), buildGroup({ id: '507f1f77bcf86cd799439012' })];
		repositoryMock.findAll.mockResolvedValueOnce(groups);

		const result = await service.getAllGroups();

		expect(repositoryMock.findAll).toHaveBeenCalledWith();
		expect(result).toBe(groups);
	});

	it('createGroup forwards to repository.create', async () => {
		const group = buildGroup();
		repositoryMock.create.mockResolvedValueOnce(group);

		const payload: Omit<IGroup, 'id' | 'createdAt'> = {
			name: group.name,
			description: group.description,
			createdBy: group.createdBy,
			members: group.members,
			permissions: group.permissions,
			settings: group.settings,
			updatedAt: group.updatedAt,
		};

		const result = await service.createGroup(payload);

		expect(repositoryMock.create).toHaveBeenCalledWith(payload);
		expect(result).toBe(group);
	});

	it('updateGroup sends patch to repository.update', async () => {
		const group = buildGroup({ name: 'Renamed' });
		repositoryMock.update.mockResolvedValueOnce(group);

		const result = await service.updateGroup(group.id!, { name: 'Renamed' });

		expect(repositoryMock.update).toHaveBeenCalledWith(group.id, { name: 'Renamed' });
		expect(result).toBe(group);
	});

	it('deleteGroup proxies to repository.delete', async () => {
		repositoryMock.delete.mockResolvedValueOnce(true);

		const result = await service.deleteGroup('507f1f77bcf86cd799439011');

		expect(repositoryMock.delete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
		expect(result).toBe(true);
	});

	it('addUserToGroup delegates to repository.addUser', async () => {
		const group = buildGroup();
		repositoryMock.addUser.mockResolvedValueOnce(group);

		const result = await service.addUserToGroup(group.id!, '507f1f77bcf86cd7994390aa');

		expect(repositoryMock.addUser).toHaveBeenCalledWith(group.id, '507f1f77bcf86cd7994390aa');
		expect(result).toBe(group);
	});

	it('removeUserFromGroup delegates to repository.removeUser', async () => {
		const group = buildGroup();
		repositoryMock.removeUser.mockResolvedValueOnce(group);

		const result = await service.removeUserFromGroup(group.id!, '507f1f77bcf86cd7994390aa');

		expect(repositoryMock.removeUser).toHaveBeenCalledWith(group.id, '507f1f77bcf86cd7994390aa');
		expect(result).toBe(group);
	});

	it('getGroupsByUserId delegates to repository.findByUserId', async () => {
		const groups = [buildGroup()];
		repositoryMock.findByUserId.mockResolvedValueOnce(groups);

		const result = await service.getGroupsByUserId('507f1f77bcf86cd7994390aa');

		expect(repositoryMock.findByUserId).toHaveBeenCalledWith('507f1f77bcf86cd7994390aa');
		expect(result).toBe(groups);
	});

	it('getGroupsWithMembers forwards optional creator filter', async () => {
		const groups = [buildGroup({ createdBy: '0xabc' })];
		repositoryMock.findAll.mockResolvedValueOnce(groups);

		const result = await service.getGroupsWithMembers('0xABC');

		expect(repositoryMock.findAll).toHaveBeenCalledWith({ createdBy: '0xabc' });
		expect(result).toBe(groups);
	});

	it('getGroupsWithMembers without filter fetches all groups', async () => {
		const groups = [buildGroup()];
		repositoryMock.findAll.mockResolvedValueOnce(groups);

		const result = await service.getGroupsWithMembers();

		expect(repositoryMock.findAll).toHaveBeenCalledWith({});
		expect(result).toBe(groups);
	});
});
