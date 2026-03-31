import { z } from 'zod';

export const registerSchema = z
  .object({
    fullname: z
      .string()
      .min(2, 'Имя должно содержать минимум 2 символа')
      .max(15, 'Имя должно быть максимум 15 символов'),
    email: z.string().email('Введите корректный email'),
    password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
