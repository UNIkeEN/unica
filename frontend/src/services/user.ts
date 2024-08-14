import { request } from "@/services/request";

export async function getUserProfile() {
    try {
        const response = await request.get('/api/user/profile/');
        return response.data;
    } catch (error) {
        console.error('Failed to get user profile:', error);
    }
};