export interface AiLogEntry {
  event: string;
  mode?: string;
  model?: string;
  caseId?: string;
  areaId?: string;
  processingMs?: number;
  error?: string;
  fallback?: boolean;
}

/**
 * Logging estructurado del motor IA.
 * No registra API keys ni contenido de consultas (PII).
 */
export function logAiEvent(entry: AiLogEntry): void {
  if (process.env['NODE_ENV'] === 'test') {
    return;
  }

  console.info(
    JSON.stringify({
      level: 'info',
      component: 'lexai-ai',
      ts: new Date().toISOString(),
      ...entry,
    }),
  );
}