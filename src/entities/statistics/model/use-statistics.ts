'use client';

import { useQuery } from '@tanstack/react-query';
import { statisticsDataApi, StatusStatisticsMap, StatisticsMap } from '../api';

const EMPTY_STATUSES: StatusStatisticsMap = {
  OPEN: 0,
  ASSIGNED: 0,
  IN_PROGRESS: 0,
  RESOLVED: 0,
  CLOSED: 0,
};

export const useTicketTopicsStatistics = () => {
  return useQuery<StatisticsMap>({
    queryKey: ['statistics', 'topics'],
    queryFn: () => statisticsDataApi.getTopicsStatistics(),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useTicketCategoriesStatistics = () => {
  return useQuery<StatisticsMap>({
    queryKey: ['statistics', 'categories'],
    queryFn: () => statisticsDataApi.getCategoriesStatistics(),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useTicketStatusesStatistics = () => {
  return useQuery<StatusStatisticsMap>({
    queryKey: ['statistics', 'statuses'],
    queryFn: () => statisticsDataApi.getStatusesStatistics(),
    select: (data) => ({
      ...EMPTY_STATUSES,
      ...data,
    }),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};
