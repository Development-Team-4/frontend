import { api } from '@/shared/api/client';
import { Category } from '@/shared/types';

export interface CreateCategoryPayload {
  topicId: string;
  name: string;
  description: string;
}

export interface UpdateCategoryPayload {
  topicId?: string;
  name?: string;
  description?: string;
}

export interface AssignCategoryStaffPayload {
  staffId: string;
  categoryId?: string;
}

class CategoryDataApi {
  async getCategoryById(id: string) {
    return api.get<Category>(`categories/${id}`).then((res) => res.data);
  }

  async getCategoriesDataByTopicId(topicId: string) {
    return api
      .get<Category[]>(`topics/${topicId}/categories`)
      .then((res) => res.data);
  }

  async createCategory(topicId: string, payload: CreateCategoryPayload) {
    return api
      .post<Category>(`topics/${topicId}/categories`, payload)
      .then((res) => res.data);
  }

  async updateCategory(id: string, payload: UpdateCategoryPayload) {
    return api
      .patch<Category>(`/categories/${id}`, payload)
      .then((res) => res.data);
  }

  async assignStaffToCategory(
    categoryId: string,
    payload: AssignCategoryStaffPayload,
  ) {
    return api
      .put<Category | null>(`/categories/${categoryId}/staff`, {
        ...payload,
        categoryId,
      })
      .then((res) => res.data);
  }

  async removeStaffFromCategory(categoryId: string, staffId: string) {
    return api
      .delete<Category | null>(`/categories/${categoryId}/staff/${staffId}`)
      .then((res) => res.data);
  }
}

export const categoriesDataApi = new CategoryDataApi();
