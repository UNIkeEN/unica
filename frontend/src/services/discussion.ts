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

export async function getTopicInfo(id: number, local_id: number) {
  try {
    const response = await request.post(`/api/organization/${id}/discussion/topic/info/`, {
      topic_local_id: local_id,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get topic info', error);
    throw error;
  }
}

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

export async function listComments(id: number, page: number, pageSize: number, local_id: number) {
  try {
    const response = await request.post(`/api/organization/${id}/discussion/comment/list` ,{
      topic_local_id: local_id,
      page: page,
      page_size: pageSize
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get comment list', error);
    throw error;
  }
}

export async function createComment(id: number, local_id: number, content: string) {
  try {
    const response = await request.post(`/api/organization/${id}/discussion/comment/create/`, {
      topic_local_id: local_id,
      content: content
    });
    return response.data;
  } catch (error) {
    console.error('Failed to create comment', error);
    throw error;
  }
}