import { request } from "@/services/request";
import { QueryOptions } from "@/models/query";

export async function createOrganization(name: string, description?: string) {
    try {
        const response = await request.post('/api/organization/create/', {
            display_name: name,
            description: description
        });
        return response.data;
    } catch (error) {
        console.error('Failed to create organization:', error);
        throw error;
    }
}

export async function listUserOrganizations(query: Partial<QueryOptions> = {}) {
    try {
        const response = await request.post('/api/organization/list/', query);
        return response.data;
    } catch (error) {
        console.error('Failed to get user organizations:', error);
        throw error;
    }
};

export async function checkUserOrgPermission(org_id: number) {
    try {
        const response = await request.get(`/api/organization/${org_id}/permission/`);
        return response.data;
    } catch (error) {
        console.error('Failed to check permission and get organization basic info:', error);
        throw error;
    }
}

export async function leaveOrganization(org_id: number) {
  try {
      const response = await request.delete(`/api/organization/${org_id}/leave/`);
      return response.data;
  } catch (error) {
      console.error('Failed to leave organization:', error);
      throw error;
  }
}

export async function listOrganizationMembers(org_id: number, page: number, page_size: number) {
    try {
        const response = await request.post(`/api/organization/${org_id}/members/list/`, {
            page: page,
            page_size: page_size
        });
        return response.data;
    } catch (error) {
        console.error('Failed to get organization members:', error);
        throw error;
    }
}

export async function removeMember(org_id: number, username: string) {
    try {
        const response = await request.post(`/api/organization/${org_id}/members/remove/`, {
            username: username
        });
        return response.data;
    } catch (error) {
        console.error('Failed to remove member:', error);
        throw error;
    }
}

export async function modifyMemberRole(org_id: number, username: string, new_role: string) {
    try {
        const response = await request.post(`/api/organization/${org_id}/members/role/`, {
            username: username,
            new_role: new_role
        });
        return response.data;
    } catch (error) {
        console.error('Failed to modify member\'s role:', error);
        throw error;
    }
}

export async function createInvitation(org_id: number, username: string) {
    try {
        const response = await request.post(`/api/organization/${org_id}/invite/create/`, {
            username: username
        });
        return response.data;
    } catch (error) {
        console.error('Failed to create invitation:', error);
        throw error;
    }
}

export async function listOrganizationInvitations(org_id: number, page: number, page_size: number) {
    try {
        const response = await request.post(`/api/organization/${org_id}/invite/list/`, {
            page: page,
            page_size: page_size
        });
        return response.data;
    } catch (error) {
        console.error('Failed to get organization invitations:', error);
        throw error;
    }
}

export async function respondInvitation(org_id: number,  accept: boolean) {
    try {
        const response = await request.post(`/api/organization/${org_id}/invite/respond/`, {
            accept: accept
        });
        return response.data;
    } catch (error) {
        console.error('Failed to respond invitation:', error);
        throw error;
    }
}

export async function cancelInvitation(org_id: number, username: string) {
    try {
        const response = await request.post(`/api/organization/${org_id}/invite/cancel/`, {
            username: username
        });
        return response.data;
    } catch (error) {
        console.error('Failed to cancel invitation:', error);
        throw error;
    }
}