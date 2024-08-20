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

export async function listTopics(id: number, page: number, pageSize: number) {
  try {
    const response = await request.post(`/api/organization/${id}/discussion/topic/list/`, {
      page: page,
      page_size: pageSize
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get topic list', error);
    throw error;
  }
}