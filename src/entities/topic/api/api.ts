import { api } from '@/shared/api/client';
import { Topic } from '@/shared/types';

export interface CreateTopicPayload {
  name: string;
  description?: string;
}

export interface UpdateTopicPayload {
  name: string;
  description?: string;
}

class TopicsDataApi {
  async getTopicsData() {
    return api.get<Topic[]>(`/topics`).then((res) => res.data);
  }

  async createTopic(payload: CreateTopicPayload) {
    return api.post<Topic>(`/topics`, payload).then((res) => res.data);
  }

  async updateTopic(id: string, payload: UpdateTopicPayload) {
    return api.put<Topic>(`/topics/${id}`, payload).then((res) => res.data);
  }
}

export const topicsDataApi = new TopicsDataApi();
