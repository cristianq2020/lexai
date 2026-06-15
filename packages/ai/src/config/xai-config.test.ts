import { describe, expect, it } from 'vitest';
import { isXaiLiveConfigured, resolveXaiConfig } from './xai-config.js';

describe('resolveXaiConfig', () => {
  it('returns mock when key is missing', () => {
    const config = resolveXaiConfig({});
    expect(config.mode).toBe('mock');
    expect(config.apiKey).toBeUndefined();
  });

  it('returns mock for placeholder key', () => {
    const config = resolveXaiConfig({ XAI_API_KEY: 'xai-your-api-key-here' });
    expect(config.mode).toBe('mock');
  });

  it('returns live for valid-looking key', () => {
    const config = resolveXaiConfig({ XAI_API_KEY: 'xai-test-key-abcdefghijklmnop' });
    expect(config.mode).toBe('live');
    expect(config.apiKey).toBe('xai-test-key-abcdefghijklmnop');
  });

  it('uses custom model env vars', () => {
    const config = resolveXaiConfig({
      XAI_HEAVY_MODEL: 'grok-custom',
      XAI_VOLUME_MODEL: 'grok-fast',
    });
    expect(config.heavyModel).toBe('grok-custom');
    expect(config.volumeModel).toBe('grok-fast');
  });
});

describe('isXaiLiveConfigured', () => {
  it('reflects resolved mode', () => {
    expect(isXaiLiveConfigured({})).toBe(false);
    expect(isXaiLiveConfigured({ XAI_API_KEY: 'xai-real-key-1234567890' })).toBe(true);
  });
});