type ToastFn = (props: {
  title: string;
  description?: string;
  variant?: 'destructive';
}) => unknown;

const REQUEST_ID_PATTERN = /requestId:\s*([A-Za-z0-9-]+)/i;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function extractRequestId(value: unknown): string | undefined {
  if (typeof value === 'string') {
    return value.match(REQUEST_ID_PATTERN)?.[1];
  }

  if (value instanceof Error) {
    return value.message.match(REQUEST_ID_PATTERN)?.[1];
  }

  if (!isRecord(value)) {
    return undefined;
  }

  const directRequestId = value.requestId;
  if (typeof directRequestId === 'string' && directRequestId.length > 0) {
    return directRequestId;
  }

  for (const key of ['message', 'error', 'details']) {
    const nested = value[key];
    const nestedRequestId = extractRequestId(nested);
    if (nestedRequestId) {
      return nestedRequestId;
    }
  }

  return undefined;
}

export function getErrorMessage(value: unknown, fallback = 'An unexpected error occurred.'): string {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }

  if (value instanceof Error && value.message.trim().length > 0) {
    return value.message;
  }

  if (isRecord(value)) {
    for (const key of ['error', 'message', 'details']) {
      const nested = value[key];
      if (typeof nested === 'string' && nested.trim().length > 0) {
        return nested;
      }
    }
  }

  return fallback;
}

export function formatErrorDescription(value: unknown, fallback = 'An unexpected error occurred.'): string {
  const message = getErrorMessage(value, fallback);
  const requestId = extractRequestId(value);

  if (!requestId || REQUEST_ID_PATTERN.test(message)) {
    return message;
  }

  return `${message} (requestId: ${requestId})`;
}

export function showErrorToast(
  toast: ToastFn,
  title: string,
  value: unknown,
  fallback = 'An unexpected error occurred.'
) {
  toast({
    variant: 'destructive',
    title,
    description: formatErrorDescription(value, fallback),
  });
}