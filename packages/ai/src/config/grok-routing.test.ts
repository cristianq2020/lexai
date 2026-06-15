import { describe, expect, it } from 'vitest';
import { shouldUseLiveGrok } from './grok-routing.js';

describe('shouldUseLiveGrok', () => {
  it('routes simple queries to mock', () => {
    const decision = shouldUseLiveGrok('¿Cuál es el plazo para reclamar?');
    expect(decision.useLiveGrok).toBe(false);
  });

  it('routes complex queries to live', () => {
    const decision = shouldUseLiveGrok(
      'Necesito preparar un recurso de apelación por concurrencia de normas y prescripción en un litigio complejo con múltiples demandados',
    );
    expect(decision.useLiveGrok).toBe(true);
  });

  it('respects XAI_FORCE_MOCK', () => {
    const prev = process.env['XAI_FORCE_MOCK'];
    process.env['XAI_FORCE_MOCK'] = 'true';
    const decision = shouldUseLiveGrok('recurso de casación complejo');
    expect(decision.useLiveGrok).toBe(false);
    if (prev === undefined) delete process.env['XAI_FORCE_MOCK'];
    else process.env['XAI_FORCE_MOCK'] = prev;
  });
});