import { describe, expect, it } from 'vitest';
import { buildIntelligentMockResponse } from './intelligent-mock.js';

const mockClassification = {
  areaId: 'laboral' as const,
  confidence: 0.7,
  reasoning: 'test',
  secondaryAreas: [],
};

const mockAgent = {
  areaId: 'laboral' as const,
  agentId: 'laboral',
  agentName: 'Dra. Elena Vargas',
  systemPromptFile: 'laboral.system.md',
  strictDisclaimer: false,
  classification: mockClassification,
};

describe('buildIntelligentMockResponse', () => {
  it('generates rich laboral response for despido query', () => {
    const result = buildIntelligentMockResponse({
      query: 'Me han despedido sin carta de despido ni indemnización',
      areaId: 'laboral',
      agent: mockAgent,
      mode: 'mock',
      classificationConfidence: 0.7,
    });

    expect(result.diagnostico).toContain('despido');
    expect(result.plazos.length).toBeGreaterThan(0);
    expect(result.accionesRecomendadas.length).toBeGreaterThanOrEqual(3);
    expect(result.legislacionCitada.length).toBeGreaterThan(0);
    expect(result.disclaimer.length).toBeGreaterThan(20);
    expect(result.irac.issue.length).toBeGreaterThan(5);
    expect(result.confidenceScore).toBeGreaterThan(0.5);
  });

  it('includes fallback note when mode is fallback', () => {
    const result = buildIntelligentMockResponse({
      query: 'Liquidación de IVA de Hacienda',
      areaId: 'fiscal',
      agent: {
        ...mockAgent,
        areaId: 'fiscal',
        agentId: 'fiscal',
        systemPromptFile: 'fiscal.system.md',
        strictDisclaimer: true,
        classification: { ...mockClassification, areaId: 'fiscal' },
      },
      mode: 'fallback',
      classificationConfidence: 0.6,
      fallbackReason: 'No credits',
    });

    expect(result.diagnostico).toContain('Grok');
    expect(result.riesgo.semaforo).toBe('rojo');
  });

  it('generates generic response for unknown topics', () => {
    const result = buildIntelligentMockResponse({
      query: 'Tengo una duda general sobre mi situación',
      areaId: 'civil',
      agent: {
        ...mockAgent,
        areaId: 'civil',
        agentId: 'civil',
        systemPromptFile: 'civil.system.md',
        classification: { ...mockClassification, areaId: 'civil' },
      },
      mode: 'mock',
      classificationConfidence: 0.4,
    });

    expect(result.derechos.length).toBeGreaterThan(0);
    expect(result.accionesRecomendadas.length).toBeGreaterThanOrEqual(3);
  });
});