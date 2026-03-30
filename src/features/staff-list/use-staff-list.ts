'use client';

import { useStore } from '@/shared/store/store';
import { useState } from 'react';

export const useStaffList = () => {
  const users = useStore((state) => state.users);
  const categories = useStore((state) => state.categories);
  const supportStaff = users.filter(
    (u) => u.role === 'SUPPORT' || u.role === 'ADMIN',
  );
  const [selectedUser, setSelectedUser] = useState<(typeof users)[0] | null>(
    null,
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleEditCategories = (user: (typeof users)[0]) => {
    setSelectedUser(user);
    setSelectedCategories(user.categoryIds || []);
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };
  return {
    supportStaff,
    selectedUser,
    selectedCategories,
    handleEditCategories,
    toggleCategory,
    categories,
  };
};
