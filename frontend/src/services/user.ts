import { request } from "@/services/request";

export async function getUserBasicInfo() {
    try {
        const response = await request.get('/api/user/info/');
        return response.data;
    } catch (error) {
        console.error('Failed to get user basic information:', error);
    }
};