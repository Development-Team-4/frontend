import axios, { AxiosError } from 'axios';

export class ApiError extends Error {
  status: number | null;
  code?: string;
  details?: unknown;
  isUserError: boolean;

  constructor(params: {
    message: string;
    status?: number | null;
    code?: string;
    details?: unknown;
    isUserError?: boolean;
  }) {
    super(params.message);
    this.name = 'ApiError';
    this.status = params.status ?? null;
    this.code = params.code;
    this.details = params.details;
    this.isUserError = params.isUserError ?? false;
  }
}

type BackendErrorPayload = {
  message?: string;
  detail?: string;
  error?: string;
  errors?: Record<string, string[] | string>;
  code?: string;
};

const DEFAULT_ERROR_MESSAGE = 'Произошла ошибка';
const KNOWN_ERROR_TRANSLATIONS: Record<string, string> = {
  'invalid credentials': 'Неверный email или пароль',
};

function localizeErrorMessage(message: string): string {
  const normalizedMessage = message.trim();
  if (!normalizedMessage) return message;

  const translatedMessage =
    KNOWN_ERROR_TRANSLATIONS[normalizedMessage.toLowerCase()];

  return translatedMessage ?? message;
}

function extractBackendMessage(
  data: BackendErrorPayload | unknown,
): string | null {
  if (!data || typeof data !== 'object') return null;

  const payload = data as BackendErrorPayload;

  if (typeof payload.message === 'string' && payload.message.trim()) {
    return localizeErrorMessage(payload.message);
  }

  if (typeof payload.detail === 'string' && payload.detail.trim()) {
    return localizeErrorMessage(payload.detail);
  }

  if (typeof payload.error === 'string' && payload.error.trim()) {
    return localizeErrorMessage(payload.error);
  }

  if (payload.errors && typeof payload.errors === 'object') {
    const firstEntry = Object.entries(payload.errors)[0];
    if (!firstEntry) return null;

    const [, value] = firstEntry;

    if (Array.isArray(value) && value.length > 0) {
      return localizeErrorMessage(String(value[0]));
    }

    if (typeof value === 'string' && value.trim()) {
      return localizeErrorMessage(value);
    }
  }

  return null;
}

function extractFieldErrorsMap(
  data: BackendErrorPayload | unknown,
): Record<string, string> {
  if (!data || typeof data !== 'object') return {};

  const payload = data as BackendErrorPayload;
  const rawErrors = payload.errors;
  if (!rawErrors || typeof rawErrors !== 'object') return {};

  return Object.entries(rawErrors).reduce<Record<string, string>>(
    (acc, [key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        acc[key] = localizeErrorMessage(String(value[0]));
      } else if (typeof value === 'string' && value.trim()) {
        acc[key] = localizeErrorMessage(value);
      }
      return acc;
    },
    {},
  );
}

function getErrorPayload(error: unknown): BackendErrorPayload | unknown {
  if (error instanceof ApiError) {
    return error.details;
  }

  if (axios.isAxiosError(error)) {
    return error.response?.data;
  }

  return null;
}

export function getApiFieldErrors(
  error: unknown,
  fieldMap: Record<string, string> = {},
): Record<string, string> {
  const payload = getErrorPayload(error);
  const backendFieldErrors = extractFieldErrorsMap(payload);

  return Object.entries(backendFieldErrors).reduce<Record<string, string>>(
    (acc, [field, message]) => {
      const normalizedField = fieldMap[field] ?? field;
      acc[normalizedField] = message;
      return acc;
    },
    {},
  );
}

export function normalizeApiError(
  error: unknown,
  fallbackMessage = DEFAULT_ERROR_MESSAGE,
): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<BackendErrorPayload>;
    const status = axiosError.response?.status ?? null;
    const responseData = axiosError.response?.data;
    const backendMessage = extractBackendMessage(responseData);

    if (status && status >= 400 && status < 500) {
      return new ApiError({
        message: backendMessage || fallbackMessage,
        status,
        code: responseData?.code,
        details: responseData,
        isUserError: true,
      });
    }

    if (status && status >= 500) {
      return new ApiError({
        message: 'Ошибка сервера. Попробуйте позже.',
        status,
        code: responseData?.code,
        details: responseData,
        isUserError: false,
      });
    }

    if (axiosError.request) {
      return new ApiError({
        message:
          'Не удалось связаться с сервером. Проверьте интернет-соединение.',
        status: null,
        details: responseData,
        isUserError: false,
      });
    }

    return new ApiError({
      message: backendMessage || fallbackMessage,
      status: null,
      details: responseData,
      isUserError: false,
    });
  }

  if (error instanceof Error) {
    return new ApiError({
      message: error.message || fallbackMessage,
      status: null,
      details: error,
      isUserError: false,
    });
  }

  return new ApiError({
    message: fallbackMessage,
    status: null,
    details: error,
    isUserError: false,
  });
}
