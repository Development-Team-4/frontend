import { api } from '@/shared/api/client';
import { Category } from '@/shared/types';

class CategoryDataApi {
  async getCategoryById(id: string) {
    return api.get<Category>(`categories/${id}`).then((res) => res.data);
  }

  async getCategoriesDataByTopicId(topicId: string) {
    return api
      .get<Category[]>(`topics/${topicId}/categories`)
      .then((res) => res.data);
  }
}

export const categoriesDataApi = new CategoryDataApi();
