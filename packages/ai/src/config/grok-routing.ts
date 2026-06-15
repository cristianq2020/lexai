/**
 * Enrutamiento de coste: decide si una consulta merece llamada live a Grok.
 * Reduce gasto cuando hay créditos limitados.
 */

const COMPLEXITY_KEYWORDS = [
  'concurrencia',
  'jurisprudencia',
  'recurso',
  'apelación',
  'casación',
  'nulidad',
  'prescripción',
  'caducidad',
  'múltiple',
  'complejo',
  'varios',
  'litigio',
  'demanda',
  'contencioso',
];

const SIMPLE_KEYWORDS = [
  'qué es',
  'que es',
  'cuánto',
  'cuanto',
  'plazo',
  'cómo se',
  'como se',
  'información',
  'orientación',
];

export interface GrokRoutingDecision {
  useLiveGrok: boolean;
  reason: string;
  complexityScore: number;
}

export function shouldUseLiveGrok(
  query: string,
  options?: { forceMock?: boolean; minComplexityScore?: number },
): GrokRoutingDecision {
  if (options?.forceMock || process.env['XAI_FORCE_MOCK'] === 'true') {
    return { useLiveGrok: false, reason: 'XAI_FORCE_MOCK activo', complexityScore: 0 };
  }

  const normalized = query.toLowerCase();
  const minScore = options?.minComplexityScore ?? 2;

  let complexityScore = 0;

  for (const kw of COMPLEXITY_KEYWORDS) {
    if (normalized.includes(kw)) complexityScore += 2;
  }

  if (query.length > 500) complexityScore += 2;
  if (query.length > 1500) complexityScore += 2;

  for (const kw of SIMPLE_KEYWORDS) {
    if (normalized.includes(kw)) complexityScore -= 1;
  }

  if (query.length < 80) complexityScore -= 1;

  complexityScore = Math.max(0, complexityScore);

  const useLiveGrok = complexityScore >= minScore;

  return {
    useLiveGrok,
    reason: useLiveGrok
      ? `Consulta compleja (score ${String(complexityScore)}) — usar Grok live`
      : `Consulta simple (score ${String(complexityScore)}) — motor local suficiente`,
    complexityScore,
  };
}