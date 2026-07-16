export function logInfo(message: string, context: Record<string, unknown> = {}) {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level: 'INFO',
    message,
    ...context
  }));
}
