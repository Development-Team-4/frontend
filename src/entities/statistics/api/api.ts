import { api } from '@/shared/api/client';
import { TicketStatus } from '@/shared/types';

export type StatisticsMap = Record<string, number>;
export type StatusStatisticsMap = Record<TicketStatus, number>;

class StatisticsDataApi {
  async getTopicsStatistics(): Promise<StatisticsMap> {
    return api.get<StatisticsMap>('/statistics/topics').then((res) => res.data);
  }

  async getCategoriesStatistics(): Promise<StatisticsMap> {
    return api
      .get<StatisticsMap>('/statistics/categories')
      .then((res) => res.data);
  }

  async getStatusesStatistics(): Promise<StatusStatisticsMap> {
    return api
      .get<StatusStatisticsMap>('/statistics/statuses')
      .then((res) => res.data);
  }
}

export const statisticsDataApi = new StatisticsDataApi();
