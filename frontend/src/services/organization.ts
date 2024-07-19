import { request } from "@/services/request";

export async function checkName(name:string) {
    try {
        const response = await request.post('/api/organization/check-name-slug/', {
            name: name,
        });
        return response.data;
    } catch (error) {
        console.error('Failed to check name and slug:', error);
        throw error;
    }
}

export async function createOrganization(name:string) {
    try {
        const response = await request.post('/api/organization/create/', {
            name: name,
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

export async function getOrganizationMembersBySlug(slug: string) {
    try {
        const response = await request.get(`/api/organization/${slug}/members/`);
        return response.data;
    } catch (error) {
        console.error('Failed to get organization members:', error);
        throw error;
    }
}