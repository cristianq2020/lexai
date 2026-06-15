import { legalResponseSchema, type LegalResponse } from '@lexai/shared';
import { logAiEvent } from '../lib/ai-logger.js';

export interface GrokMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GrokCompletionParams {
  apiKey: string;
  model: string;
  systemPrompt: string;
  messages: GrokMessage[];
  temperature?: number;
  apiBase?: string;
  timeoutMs?: number;
}

export class XaiApiError extends Error {
  constructor(
    message: string,
    readonly statusCode?: number,
  ) {
    super(message);
    this.name = 'XaiApiError';
  }
}

/**
 * Cliente xAI Grok — llamado solo cuando XAI_API_KEY está configurada.
 *
 * Conexión: POST {XAI_API_BASE}/chat/completions
 * Respuesta esperada: JSON con LegalResponse (response_format: json_object)
 *
 * Sin clave válida, processConsultation() usa modo mock automáticamente.
 */
export async function callGrokCompletion(
  params: GrokCompletionParams,
): Promise<{ content: string; model: string }> {
  const apiBase = params.apiBase ?? process.env['XAI_API_BASE'] ?? 'https://api.x.ai/v1';
  const timeoutMs = params.timeoutMs ?? 90_000;

  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  const start = Date.now();

  try {
    const response = await fetch(`${apiBase}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.apiKey}`,
      },
      body: JSON.stringify({
        model: params.model,
        messages: [
          { role: 'system', content: params.systemPrompt },
          ...params.messages,
        ],
        temperature: params.temperature ?? 0.2,
        response_format: { type: 'json_object' },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      const sanitized = errorText.slice(0, 500);
      logAiEvent({
        event: 'grok_request_failed',
        model: params.model,
        error: `HTTP ${String(response.status)}`,
        processingMs: Date.now() - start,
      });
      throw new XaiApiError(`xAI API error ${String(response.status)}: ${sanitized}`, response.status);
    }

    const data = (await response.json()) as {
      model: string;
      choices: { message: { content: string } }[];
    };

    const content = data.choices[0]?.message.content;
    if (!content) {
      throw new XaiApiError('xAI API returned empty response');
    }

    logAiEvent({
      event: 'grok_request_success',
      model: data.model,
      mode: 'live',
      processingMs: Date.now() - start,
    });

    return { content, model: data.model };
  } catch (error) {
    if (error instanceof XaiApiError) {
      throw error;
    }

    const message = error instanceof Error ? error.message : 'Unknown xAI error';
    logAiEvent({
      event: 'grok_request_error',
      model: params.model,
      error: message,
      processingMs: Date.now() - start,
    });
    throw new XaiApiError(message);
  } finally {
    clearTimeout(timeout);
  }
}

export function parseLegalResponseFromGrok(raw: string): LegalResponse {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new XaiApiError('Grok response is not valid JSON');
  }

  const result = legalResponseSchema.safeParse(parsed);
  if (!result.success) {
    throw new XaiApiError(
      `Grok response failed LegalResponse validation: ${result.error.issues[0]?.message ?? 'unknown'}`,
    );
  }

  return result.data;
}