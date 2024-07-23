import { request } from "@/services/request";

export async function createOrganization(name:string, description?:string) {
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

export async function getUserOrganizations() {
    try {
        const response = await request.get('/api/organization/list/');
        return response.data;
    } catch (error) {
        console.error('Failed to get user organizations:', error);
        throw error;
    }
};

export async function checkUserOrgPermission(id: number) {
    try {
        const response = await request.get(`/api/organization/${id}/permission/`);
        return response.data;
    } catch (error) {
        console.error('Failed to get organization members:', error);
        throw error;
    }
}

export async function getOrganizationMembers(id: number, page: number, pageSize: number) {
    try {
        const response = await request.post(`/api/organization/${id}/members/`, {
            page: page,
            page_size: pageSize
        });
        return response.data;
    } catch (error) {
        console.error('Failed to get organization members:', error);
        throw error;
    }
}

export async function createInvitation(id: number, username: string) {
    try {
        const response = await request.post(`/api/organization/${id}/invite/create/`, {
            username: username
        });
        return response.data;
    } catch (error) {
        console.error('Failed to create invitation:', error);
        throw error;
    }
}

export async function getOrganizationInvitations(id: number, page: number, pageSize: number) {
    try {
        const response = await request.post(`/api/organization/${id}/invite/list/`, {
            page: page,
            page_size: pageSize
        });
        return response.data;
    } catch (error) {
        console.error('Failed to get organization invitations:', error);
        throw error;
    }
}

export async function respondInvitation(id: number,  accept: boolean) {
    try {
        const response = await request.post(`/api/organization/${id}/invite/respond/`, {
            accept: accept
        });
        return response.data;
    } catch (error) {
        console.error('Failed to respond invitation:', error);
        throw error;
    }
}