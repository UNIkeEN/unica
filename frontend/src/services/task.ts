import { EditableTask } from "@/models/task";
import { request } from "@/services/request";

export async function createTask(pro_id: number, task: Partial<EditableTask>) {
    try {
        const response = await request.post(`/api/project/${pro_id}/task/create/`, task);
        return response.data;
    } catch (error) {
        console.error('Failed to create task', error);
        throw error;
    }
}

export async function listTasks(pro_id: number, page: number, pageSize: number) {
    try {
        const response = await request.post(`/api/project/${pro_id}/task/list/`, {
            page: page,
            page_size: pageSize
        });
        return response.data;
    } catch (error) {
        console.error('Failed to list tasks', error);
        throw error;
    }
}

export async function deleteTasks(pro_id: number, local_ids: number[]) {
    try {
        const response = await request.post(`/api/project/${pro_id}/task/delete/`, {
            local_ids: local_ids
        });
        return response.data;
    } catch (error) {
        console.error('Failed to delete tasks', error);
        throw error;
    }
}

export async function updateTask(pro_id: number, local_id: number, updated_value: Partial<EditableTask>) {
    try {
        const response = await request.patch(`/api/project/${pro_id}/task/update/`, {
            local_id: local_id,
            updated_value: updated_value
        });
        return response.data;
    } catch (error) {
        console.error('Failed to update task', error);
        throw error;
    }
}