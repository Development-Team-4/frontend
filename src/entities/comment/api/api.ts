'use client';

import { api } from '@/shared/api/client';
import type { Comment, User } from '@/shared/types';
import { usersDataApi } from '@/entities/user/api';

interface CommentBackend {
  id: string;
  ticketId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

interface CreateCommentDto {
  content: string;
}

const fallbackUser = (userId: string): User => ({
  userId,
  userName: 'Unknown',
  userEmail: '',
  userRole: 'USER',
});

const mapBackendComment = async (
  backendComment: CommentBackend,
): Promise<Comment> => {
  let author: User;

  try {
    author = await usersDataApi.getUserById(backendComment.authorId);
  } catch {
    author = fallbackUser(backendComment.authorId);
  }

  return {
    id: backendComment.id,
    ticketId: backendComment.ticketId,
    author,
    content: backendComment.content,
    createdAt: backendComment.createdAt,
  };
};

class CommentsDataApi {
  async getTicketComments(ticketId: string): Promise<Comment[]> {
    const backendComments = await api
      .get<CommentBackend[]>(`/tickets/${ticketId}/comments`)
      .then((res) => res.data);

    return Promise.all(backendComments.map(mapBackendComment));
  }

  async createTicketComment(
    ticketId: string,
    payload: CreateCommentDto,
  ): Promise<Comment> {
    const backendComment = await api
      .post<CommentBackend>(`/tickets/${ticketId}/comments`, payload)
      .then((res) => res.data);

    return mapBackendComment(backendComment);
  }
}

export const commentsDataApi = new CommentsDataApi();
