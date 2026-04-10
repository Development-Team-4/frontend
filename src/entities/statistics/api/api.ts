import { api } from '@/shared/api/client';
import { TicketStatus } from '@/shared/types';

export type StatisticsMap = Record<string, number>;
export type StatusStatisticsMap = Record<TicketStatus, number>;

type StatisticsRawItem = {
  topicId?: string;
  categoryId?: string;
  status?: string;
  count?: number;
};

const toNumber = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const normalizeStatisticsMap = (
  raw: unknown,
  keyCandidates: Array<keyof StatisticsRawItem>,
): StatisticsMap => {
  const result: StatisticsMap = {};

  if (Array.isArray(raw)) {
    raw.forEach((item) => {
      if (!item || typeof item !== 'object') return;
      const typedItem = item as StatisticsRawItem;
      const key =
        keyCandidates
          .map((candidate) => typedItem[candidate])
          .find((value): value is string => typeof value === 'string') || '';

      if (!key) return;
      result[key] = toNumber(typedItem.count);
    });

    return result;
  }

  if (!raw || typeof raw !== 'object') {
    return result;
  }

  Object.entries(raw as Record<string, unknown>).forEach(([key, value]) => {
    if (typeof value === 'number' || typeof value === 'string') {
      result[key] = toNumber(value);
      return;
    }

    if (value && typeof value === 'object') {
      const typedValue = value as StatisticsRawItem;
      const nestedKey =
        keyCandidates
          .map((candidate) => typedValue[candidate])
          .find(
            (candidateValue): candidateValue is string =>
              typeof candidateValue === 'string',
          ) || key;
      result[nestedKey] = toNumber(typedValue.count);
    }
  });

  return result;
};

class StatisticsDataApi {
  async getTopicsStatistics(): Promise<StatisticsMap> {
    return api
      .get<unknown>('/statistics/topics')
      .then((res) => normalizeStatisticsMap(res.data, ['topicId']));
  }

  async getCategoriesStatistics(): Promise<StatisticsMap> {
    return api
      .get<unknown>('/statistics/categories')
      .then((res) => normalizeStatisticsMap(res.data, ['categoryId']));
  }

  async getStatusesStatistics(): Promise<StatusStatisticsMap> {
    return api
      .get<unknown>('/statistics/statuses')
      .then(
        (res) =>
          normalizeStatisticsMap(res.data, ['status']) as StatusStatisticsMap,
      );
  }
}

export const statisticsDataApi = new StatisticsDataApi();
