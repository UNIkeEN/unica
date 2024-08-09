import { request } from "@/services/request";

export async function createProject(name:string, description?:string, organizationId?:number) {
    try {
        const response = await request.post('/api/project/create/', {
            display_name: name,
            description: description,
            org_id: organizationId
        });
        return response.data;
    } catch (error) {
        console.error('Failed to create organization:', error);
        throw error;
    }
}

export async function getProjects(page: number, pageSize: number, organizationId?: number) {
  try {
      const response = await request.post(`/api/project/list/`, {
          page: page,
          page_size: pageSize,
          org_id: organizationId
      });
      return response.data;
  } catch (error) {
      console.error('Failed to get project list:', error);
      throw error;
  }
}

export async function getProjectInfo(id: number) {
  try {
      const response = await request.get(`/api/project/${id}/info/`);
      return response.data;
  } catch (error) {
      console.error('Failed to get project info:', error);
      throw error;
  }
}