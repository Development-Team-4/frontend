import { api } from '@/shared/api/client';
import { Topic } from '@/shared/types';

class TopicsDataApi {
  async getTopicsData() {
    return api.get<Topic[]>(`/topics`).then((res) => res.data);
  }
}

export const topicsDataApi = new TopicsDataApi();
