import { mockStore } from '../mock/store';
import type { Group, GroupPermission } from '../types';

export interface GroupsQuery {
  page: number;
  limit: number;
  search?: string;
}

export const groupsApi = {
  getAll: (params: GroupsQuery) => mockStore.getGroups(params),
  create: (data: Pick<Group, 'name' | 'description'>) => mockStore.createGroup(data),
  update: (id: string, data: Pick<Group, 'name' | 'description'>) => mockStore.updateGroup(id, data),
  remove: (id: string) => mockStore.deleteGroup(id),

  getPermissions: (groupId: string): Promise<GroupPermission[]> => mockStore.getGroupPermissions(groupId),
  updatePermissions: (
    groupId: string,
    updates: { menuKey: string; canRead: boolean; canWrite: boolean }[],
  ) => mockStore.updateGroupPermissions(groupId, updates),
};
