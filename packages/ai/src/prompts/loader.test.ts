import { describe, expect, it } from 'vitest';
import { getPromptDir, loadSystemPrompt } from './loader.js';

describe('loadSystemPrompt', () => {
  it('carga el prompt laboral desde disco', async () => {
    const prompt = await loadSystemPrompt('laboral');
    expect(prompt.length).toBeGreaterThan(5000);
    expect(prompt).toContain('IRAC');
    expect(prompt).toContain('LegalResponse');
  });

  it('resuelve directorio de prompts', () => {
    expect(getPromptDir()).toContain('prompts');
  });
});