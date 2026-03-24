function parseEventPayload(event) {
  if (!event || typeof event !== 'object') {
    return {};
  }

  if (!Object.prototype.hasOwnProperty.call(event, 'body')) {
    return event;
  }

  if (typeof event.body === 'string') {
    try {
      return JSON.parse(event.body);
    } catch {
      return {};
    }
  }

  return event.body && typeof event.body === 'object' ? event.body : {};
}

function getRequestId(event, payload = parseEventPayload(event)) {
  return (
    payload?._trustedContext?.requestId ||
    event?.headers?.['x-request-id'] ||
    event?.headers?.['X-Request-Id'] ||
    event?.requestContext?.requestId ||
    `aws-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  );
}

function serializeError(error) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    value: String(error),
  };
}

function writeLog(level, message, meta = {}) {
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...meta,
  };

  const serialized = JSON.stringify(entry);

  if (level === 'error') {
    console.error(serialized);
    return;
  }

  if (level === 'warn') {
    console.warn(serialized);
    return;
  }

  console.log(serialized);
}

const logger = {
  info: (message, meta) => writeLog('info', message, meta),
  warn: (message, meta) => writeLog('warn', message, meta),
  error: (message, meta) => writeLog('error', message, meta),
};

module.exports = {
  logger,
  parseEventPayload,
  getRequestId,
  serializeError,
};