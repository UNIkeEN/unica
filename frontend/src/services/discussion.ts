import { request } from "@/services/request";

export async function enableDiscussion(id: number) {
  try {
    const response = await request.post(`/api/organization/${id}/discussion/enable/`);
    return response.data;
  } catch (error) {
    console.error('Failed to enable discussions', error);
    throw error;
  }
};