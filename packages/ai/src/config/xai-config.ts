/** Placeholders que nunca deben activar modo live */
const PLACEHOLDER_KEYS = new Set([
  '',
  'xai-your-api-key-here',
  'your-xai-api-key',
  'changeme',
]);

export type XaiRuntimeMode = 'live' | 'mock';

export interface ResolvedXaiConfig {
  mode: XaiRuntimeMode;
  apiKey?: string;
  heavyModel: string;
  volumeModel: string;
  apiBase: string;
}

/**
 * Resuelve configuración xAI desde variables de entorno.
 *
 * Activación live: establecer XAI_API_KEY con una clave real en .env
 * Sin cambios de código ni de frontend.
 */
export function resolveXaiConfig(
  env: NodeJS.ProcessEnv = process.env,
): ResolvedXaiConfig {
  const rawKey = env['XAI_API_KEY']?.trim();
  const heavyModel = env['XAI_HEAVY_MODEL'] ?? 'grok-4.3';
  const volumeModel = env['XAI_VOLUME_MODEL'] ?? 'grok-4.3';
  const apiBase = env['XAI_API_BASE'] ?? 'https://api.x.ai/v1';

  const isValidKey =
    rawKey !== undefined &&
    rawKey.length > 0 &&
    !PLACEHOLDER_KEYS.has(rawKey) &&
    rawKey.length > 10 &&
    rawKey.startsWith('xai-');

  if (isValidKey) {
    return {
      mode: 'live',
      apiKey: rawKey,
      heavyModel,
      volumeModel,
      apiBase,
    };
  }

  return {
    mode: 'mock',
    heavyModel,
    volumeModel,
    apiBase,
  };
}

export function isXaiLiveConfigured(env: NodeJS.ProcessEnv = process.env): boolean {
  return resolveXaiConfig(env).mode === 'live';
}