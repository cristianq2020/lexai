import { describe, expect, it } from 'vitest';
import { classifyQuery } from './classifyQuery.js';

describe('classifyQuery', () => {
  it('clasifica consultas laborales', () => {
    const result = classifyQuery('Me han despedido sin preaviso ni indemnización');
    expect(result.areaId).toBe('laboral');
    expect(result.confidence).toBeGreaterThan(0.4);
  });

  it('clasifica consultas penales', () => {
    const result = classifyQuery('Quiero poner una denuncia por agresión');
    expect(result.areaId).toBe('penal');
  });

  it('respeta hint del expediente con baja señal', () => {
    const result = classifyQuery('Tengo una duda general', 'fiscal');
    expect(result.areaId).toBe('fiscal');
  });

  it('detecta extranjería', () => {
    const result = classifyQuery('Necesito renovar mi NIE y solicitar residencia');
    expect(result.areaId).toBe('extranjeria');
  });
});