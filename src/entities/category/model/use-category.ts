'use client';

import { Category } from '@/shared/types';
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useStore } from '@/shared/store/store';
import {
  AssignCategoryStaffPayload,
  categoriesDataApi,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from '../api';
import { useEffect } from 'react';

export const useCategories = (topicId?: string | null) => {
  const topicFilter = useStore((state) => state.topicFilter);
  const updateCategories = useStore((state) => state.setCategories);
  const selectedTopicId =
    typeof topicId === 'string'
      ? topicId
      : topicFilter !== 'all'
        ? topicFilter
        : null;

  const query = useQuery<Category[]>({
    queryKey: ['categories', selectedTopicId],
    queryFn: () => {
      if (!selectedTopicId) {
        return Promise.resolve([]);
      }
      return categoriesDataApi.getCategoriesDataByTopicId(selectedTopicId);
    },
    enabled: Boolean(selectedTopicId),
  });

  useEffect(() => {
    if (!topicId && query.data) {
      updateCategories(query.data);
    }
  }, [query.data, updateCategories, topicId]);

  return query;
};

export const useCategoryById = (categoryId: string | null) => {
  return useQuery<Category>({
    queryKey: ['category', categoryId],
    queryFn: () => categoriesDataApi.getCategoryById(categoryId!),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const topicFilter = useStore((state) => state.topicFilter);
  const updateCategories = useStore((state) => state.setCategories);

  return useMutation({
    mutationFn: ({
      topicId,
      payload,
    }: {
      topicId: string;
      payload: CreateCategoryPayload;
    }) => categoriesDataApi.createCategory(topicId, payload),
    onSuccess: (newCategory, variables) => {
      const { topicId } = variables;

      queryClient.setQueryData<Category[]>(
        ['topic-categories', topicId],
        (prev = []) => [...prev, newCategory],
      );

      queryClient.setQueryData<Category[]>(
        ['categories', topicId],
        (prev = []) => [...prev, newCategory],
      );

      if (topicFilter === topicId) {
        updateCategories([
          ...(queryClient.getQueryData<Category[]>(['categories', topicId]) ??
            []),
        ]);
      }
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const topicFilter = useStore((state) => state.topicFilter);
  const updateCategories = useStore((state) => state.setCategories);

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateCategoryPayload;
    }) => categoriesDataApi.updateCategory(id, payload),
    onSuccess: (updatedCategory) => {
      const topicId = updatedCategory.topicId;

      queryClient.setQueryData<Category[]>(
        ['topic-categories', topicId],
        (prev = []) =>
          prev.map((category) =>
            category.id === updatedCategory.id ? updatedCategory : category,
          ),
      );

      queryClient.setQueryData<Category[]>(
        ['categories', topicId],
        (prev = []) =>
          prev.map((category) =>
            category.id === updatedCategory.id ? updatedCategory : category,
          ),
      );

      queryClient.setQueryData<Category>(
        ['category', updatedCategory.id],
        updatedCategory,
      );

      if (topicFilter === topicId) {
        updateCategories([
          ...(queryClient.getQueryData<Category[]>(['categories', topicId]) ??
            []),
        ]);
      }
    },
  });
};

export const useAssignStaffToCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      categoryId,
      payload,
    }: {
      categoryId: string;
      payload: AssignCategoryStaffPayload;
    }) => categoriesDataApi.assignStaffToCategory(categoryId, payload),
    onSuccess: (updatedCategory, variables) => {
      if (updatedCategory?.id && updatedCategory?.topicId) {
        queryClient.setQueryData<Category>(
          ['category', updatedCategory.id],
          updatedCategory,
        );

        queryClient.setQueryData<Category[]>(
          ['categories', updatedCategory.topicId],
          (prev = []) =>
            prev.map((category) =>
              category.id === updatedCategory.id ? updatedCategory : category,
            ),
        );

        queryClient.setQueryData<Category[]>(
          ['topic-categories', updatedCategory.topicId],
          (prev = []) =>
            prev.map((category) =>
              category.id === updatedCategory.id ? updatedCategory : category,
            ),
        );
      }

      queryClient.invalidateQueries({
        queryKey: ['category', variables.categoryId],
      });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['topic-categories'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({
        queryKey: [
          'category-staff-check',
          variables.categoryId,
          variables.payload.staffId,
        ],
      });
    },
  });
};

export const useRemoveStaffFromCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      categoryId,
      staffId,
    }: {
      categoryId: string;
      staffId: string;
    }) => categoriesDataApi.removeStaffFromCategory(categoryId, staffId),
    onSuccess: (updatedCategory, variables) => {
      if (updatedCategory?.id && updatedCategory?.topicId) {
        queryClient.setQueryData<Category>(
          ['category', updatedCategory.id],
          updatedCategory,
        );

        queryClient.setQueryData<Category[]>(
          ['categories', updatedCategory.topicId],
          (prev = []) =>
            prev.map((category) =>
              category.id === updatedCategory.id ? updatedCategory : category,
            ),
        );

        queryClient.setQueryData<Category[]>(
          ['topic-categories', updatedCategory.topicId],
          (prev = []) =>
            prev.map((category) =>
              category.id === updatedCategory.id ? updatedCategory : category,
            ),
        );
      }

      queryClient.invalidateQueries({
        queryKey: ['category', variables.categoryId],
      });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['topic-categories'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({
        queryKey: [
          'category-staff-check',
          variables.categoryId,
          variables.staffId,
        ],
      });
    },
  });
};

export const useCheckStaffAssignments = ({
  staffId,
  categoryIds,
  enabled = true,
}: {
  staffId: string;
  categoryIds: string[];
  enabled?: boolean;
}) => {
  const queries = useQueries({
    queries: categoryIds.map((categoryId) => ({
      queryKey: ['category-staff-check', categoryId, staffId],
      queryFn: () =>
        categoriesDataApi.checkStaffCategoryAssignment(categoryId, staffId),
      enabled: enabled && Boolean(staffId) && Boolean(categoryId),
      staleTime: 60 * 1000,
    })),
  });

  const assignmentByCategoryId: Record<string, boolean | null> = {};

  categoryIds.forEach((categoryId, index) => {
    const query = queries[index];
    assignmentByCategoryId[categoryId] =
      typeof query?.data?.assigned === 'boolean' ? query.data.assigned : null;
  });

  const isCheckingAssignments = queries.some(
    (query) => query.isLoading || query.isFetching,
  );

  return {
    assignmentByCategoryId,
    isCheckingAssignments,
  };
};
