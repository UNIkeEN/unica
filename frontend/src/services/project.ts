import { request } from "@/services/request";
import { QueryOptions } from "@/models/query";

export async function createProject(name: string, description?: string, org_id?: number) {
    try {
        const response = await request.post('/api/project/create/', {
            display_name: name,
            description: description,
            org_id: org_id
        });
        return response.data;
    } catch (error) {
        console.error('Failed to create organization:', error);
        throw error;
    }
}

export async function listProjects(query:Partial<QueryOptions>, org_id?: number) {
  try {
      const response = await request.post(`/api/project/list/`,query);
      return response.data;
  } catch (error) {
      console.error('Failed to get project list:', error);
      throw error;
  }
}

export async function getProjectInfo(proj_id: number) {
  try {
      const response = await request.get(`/api/project/${proj_id}/info/`);
      return response.data;
  } catch (error) {
      console.error('Failed to get project info:', error);
      throw error;
  }
}