import { api } from '@/shared/api/client';
import { Category } from '@/shared/types';

class CategoryDataApi {
  async getCategoriesDataByTopicId(topicId: string) {
    return api
      .get<Category[]>(`topics/${topicId}/categories`)
      .then((res) => res.data);
  }
}

export const categoriesDataApi = new CategoryDataApi();
