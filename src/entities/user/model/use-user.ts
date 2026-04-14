'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersDataApi } from '../api';
import { useStore } from '@/shared/store/store';
import type { User } from '@/shared/types';
import { useEffect } from 'react';

export const useUser = ({ enabled = true }: { enabled?: boolean } = {}) => {
  const updateUserData = useStore((state) => state.updateUserData);

  const query = useQuery<User>({
    queryKey: ['userData'],
    queryFn: () => usersDataApi.getUserData(),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 0,
  });

  useEffect(() => {
    if (!query.data) return;
    updateUserData(query.data);
  }, [query.data, updateUserData]);

  return query;
};

export const useUserById = (userId: string | null) => {
  return useQuery<User>({
    queryKey: ['user', userId],
    queryFn: () => usersDataApi.getUserById(userId!),
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 0,
  });
};

export const useUsers = () => {
  const setUsers = useStore((state) => state.setUsers);

  const query = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => usersDataApi.getAllUsers(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 0,
  });

  useEffect(() => {
    if (!query.data) return;
    setUsers(query.data);
  }, [query.data, setUsers]);

  return query;
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  const setUsers = useStore((state) => state.setUsers);

  return useMutation({
    mutationFn: ({
      userId,
      userRole,
    }: {
      userId: string;
      userRole: User['userRole'];
    }) => usersDataApi.updateUserRole(userId, userRole),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData<User[]>(['users'], (prev = []) => {
        const nextUsers = prev.map((user) =>
          user.userId === updatedUser.userId ? updatedUser : user,
        );
        setUsers(nextUsers);
        return nextUsers;
      });

      queryClient.setQueryData<User>(['user', updatedUser.userId], updatedUser);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useCreateUserByAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userName,
      userEmail,
      userPassword,
      userRole,
    }: {
      userName: string;
      userEmail: string;
      userPassword: string;
      userRole: User['userRole'];
    }) => {
      await usersDataApi.createUser({
        userName,
        userEmail,
        userPassword,
      });

      if (userRole === 'SUPPORT') {
        const users = await usersDataApi.getAllUsers();
        const createdUser = users.find(
          (user) => user.userEmail.toLowerCase() === userEmail.toLowerCase(),
        );

        if (createdUser) {
          await usersDataApi.updateUserRole(createdUser.userId, 'SUPPORT');
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  const updateUserData = useStore((state) => state.updateUserData);
  const setUsers = useStore((state) => state.setUsers);

  return useMutation({
    mutationFn: ({ userId, userName }: { userId: string; userName: string }) =>
      usersDataApi.updateUserProfile(userId, { userName }),
    onSuccess: (updatedUser) => {
      updateUserData(updatedUser);

      queryClient.setQueryData<User>(['userData'], updatedUser);
      queryClient.setQueryData<User>(['user', updatedUser.userId], updatedUser);
      queryClient.setQueryData<User[]>(['users'], (prev = []) => {
        const exists = prev.some((user) => user.userId === updatedUser.userId);
        const nextUsers = exists
          ? prev.map((user) =>
              user.userId === updatedUser.userId ? updatedUser : user,
            )
          : prev;
        setUsers(nextUsers);
        return nextUsers;
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['userData'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
