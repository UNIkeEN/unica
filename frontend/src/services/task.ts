import { EditableTaskField } from "@/models/task";
import { request } from "@/services/request";

export async function createTask(proj_id: number, task: Partial<EditableTaskField>) {
    try {
        const response = await request.post(`/api/project/${proj_id}/task/create/`, task);
        return response.data;
    } catch (error) {
        console.error('Failed to create task', error);
        throw error;
    }
}

export async function listTasks(proj_id: number) {
    try {
        const response = await request.post(`/api/project/${proj_id}/task/list/`);
        return response.data;
    } catch (error) {
        console.error('Failed to list tasks', error);
        throw error;
    }
}

export async function deleteTasks(proj_id: number, local_ids: number[]) {
    try {
        const response = await request.post(`/api/project/${proj_id}/task/delete/`, {
            local_ids: local_ids
        });
        return response.data;
    } catch (error) {
        console.error('Failed to delete tasks', error);
        throw error;
    }
}

export async function updateTask(proj_id: number, local_id: number, updated_value: Partial<EditableTaskField>) {
    try {
        const response = await request.patch(`/api/project/${proj_id}/task/update/`, {
            local_id: local_id,
            updated_value: updated_value
        });
        return response.data;
    } catch (error) {
        console.error('Failed to update task', error);
        throw error;
    }
}