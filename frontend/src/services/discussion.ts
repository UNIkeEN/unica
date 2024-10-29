import { request } from "@/services/request";
import { DiscussionTopicCategory } from "@/models/discussion";

export async function enableDiscussion(org_id: number) {
  try {
    const response = await request.post(`/api/organization/${org_id}/discussion/enable/`);
    return response.data;
  } catch (error) {
    console.error('Failed to enable discussions', error);
    throw error;
  }
};

export async function getTopicInfo(org_id: number, local_id: number) {
  try {
    const response = await request.post(`/api/organization/${org_id}/discussion/topic/info/`, {
      topic_local_id: local_id,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get topic info', error);
    throw error;
  }
}

export async function listTopics(org_id: number, page: number, page_size: number, category_id?: number) {
  try {
    const response = await request.post(`/api/organization/${org_id}/discussion/topic/list/`, {
      page: page,
      page_size: page_size,
      category_id: category_id
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get topic list', error);
    throw error;
  }
}

export async function createTopic(org_id: number, title: string, category_id: number, init_comment: string) {
  try {
    const response = await request.post(`/api/organization/${org_id}/discussion/topic/create/`, {
      title: title,
      category_id: category_id,
      comment: {
        content: init_comment
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to create topic', error);
    throw error;
  }
}

export async function deleteTopic(org_id: number, topic_local_id: number) {
  try {
    const response = await request.post(`/api/organization/${org_id}/discussion/topic/delete/`, {
      topic_local_id: topic_local_id
    });
    return response.data;
  } catch (error) {
    console.error('Failed to delete topic', error);
    throw error;
  }
}

export async function listComments(org_id: number, page: number, page_size: number, local_id: number) {
  try {
    const response = await request.post(`/api/organization/${org_id}/discussion/comment/list/` ,{
      topic_local_id: local_id,
      page: page,
      page_size: page_size
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get comment list', error);
    throw error;
  }
}

export async function createComment(org_id: number, topic_local_id: number, content: string) {
  try {
    const response = await request.post(`/api/organization/${org_id}/discussion/comment/create/`, {
      topic_local_id: topic_local_id,
      content: content
    });
    return response.data;
  } catch (error) {
    console.error('Failed to create comment', error);
    throw error;
  }
}

export async function editComment(org_id: number, topic_local_id: number, comment_local_id: number, content: string) {
  try {
    const response = await request.patch(`/api/organization/${org_id}/discussion/comment/update/`, {
      comment_local_id: comment_local_id,
      topic_local_id: topic_local_id,
      content: content
    });
    return response.data;
  } catch (error) {
    console.error('Failed to edit comment', error);
    throw error;
  }
}

export async function deleteComment(org_id: number, topic_local_id: number, comment_local_id: number) {
  try {
    const response = await request.post(`/api/organization/${org_id}/discussion/comment/delete/`, {
      comment_local_id: comment_local_id,
      topic_local_id: topic_local_id
    });
    return response.data;
  } catch (error) {
    console.error('Failed to delete comment', error);
    throw error;
  }
}

export async function createCategory(org_id: number, category: DiscussionTopicCategory) {
  try {
    const response = await request.post(`/api/organization/${org_id}/discussion/category/create/`, category);
    return response.data;
  } catch (error) {
    console.error('Failed to create category', error);
    throw error;
  }
}

export async function getCategoryInfo(org_id: number, category_id: number) {
  try {
    const response = await request.post(`/api/organization/${org_id}/discussion/category/info/`, {
      category_id: category_id
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get category', error);
    throw error;
  }
}

export async function listCategories(org_id: number, page: number, page_size: number) {
  try {
    const response = await request.post(`/api/organization/${org_id}/discussion/category/list/`, {
      page: page,
      page_size: page_size
    });
    return response.data;
  } catch (error) {
    console.error('Failed to list categories', error);
    throw error;
  }
}

export async function updateCategory(org_id: number, category_id: number, category_value: DiscussionTopicCategory) {
  try {
    const response = await request.patch(`/api/organization/${org_id}/discussion/category/update/`, {
      category_id: category_id,
      category_value: category_value
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update category', error);
    throw error;
  }
}

export async function deleteCategory(org_id: number, category_id: number) {
  try {
    const response = await request.post(`/api/organization/${org_id}/discussion/category/delete/`, {
      category_id: category_id
    });
    return response.data;
  } catch (error) {
    console.error('Failed to delete category', error);
    throw error;
  }
}