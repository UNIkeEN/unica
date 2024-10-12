import { request } from "@/services/request";
import { UserProfile } from "@/models/user";

export async function getUserProfile() {
    try {
        const response = await request.get('/api/user/profile/');
        return response.data;
    } catch (error) {
        console.error('Failed to get user profile:', error);
    }
};

export async function updateUserProfile(data: Partial<UserProfile>) {
    try {
        const response = await request.patch('/api/user/profile/', data);
        return response.data;
    } catch (error) {
        console.error('Failed to update user profile:', error);
        throw error;
    }
}

export async function uploadUserAvatar(Formdata: FormData) {
    try {
        const response = await request.post('/api/user/avatar/upload/', Formdata);
        return response.data;
    } catch (error) {
        console.log('Failed to upload user avatar:', error);
        throw error;
    }
}