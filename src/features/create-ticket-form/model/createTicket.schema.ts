import { z } from 'zod';

export const createTicketSchema = z.object({
  subject: z
    .string()
    .min(2, 'Заголовок должен содержать минимум 2 символа')
    .max(30, 'Заголовок должен быть максимум 15 символов'),

  description: z
    .string()
    .min(10, 'Описание должно содержать минимум 10 символов')
    .max(5000, 'Описание должно быть максимум 5000 символов'),

  topicId: z.string().min(1, 'Выберите тему'),
  categoryId: z.string().min(1, 'Выберите категорию'),
});

export type CreateTicketFormData = z.infer<typeof createTicketSchema>;
