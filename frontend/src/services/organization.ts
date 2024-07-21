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

export async function getOrganizationMembers(id: number) {
    try {
        const response = await request.get(`/api/organization/${id}/members/`);
        return response.data;
    } catch (error) {
        console.error('Failed to get organization members:', error);
        throw error;
    }
}