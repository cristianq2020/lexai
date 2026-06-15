import {
  LEGAL_AREA_IDS,
  LEGAL_AREAS,
  type LegalAreaId,
} from '@lexai/shared';
import type { ClassificationResult } from './types.js';

const AREA_KEYWORDS: Record<LegalAreaId, readonly string[]> = {
  laboral: [
    'despido',
    'trabajo',
    'empleado',
    'empresa',
    'nómina',
    'nomina',
    'contrato laboral',
    'ere',
    'erte',
    'acoso laboral',
    'horas extra',
    'smac',
    'finiquito',
    'indemnización',
    'convenio colectivo',
  ],
  civil: [
    'contrato',
    'arrendamiento',
    'alquiler',
    'responsabilidad civil',
    'daños',
    'deuda',
    'código civil',
    'propiedad',
    'herencia',
    'testamento',
  ],
  penal: [
    'denuncia',
    'delito',
    'penal',
    'fiscalía',
    'detención',
    'prisión',
    'robo',
    'hurto',
    'agresión',
    'violencia',
    'cárcel',
  ],
  familia: [
    'divorcio',
    'custodia',
    'pensión alimentos',
    'separación',
    'matrimonio',
    'menor',
    'régimen visitas',
    'violencia género',
    'pareja de hecho',
  ],
  fiscal: [
    'hacienda',
    'aeat',
    'irpf',
    'iva',
    'impuesto',
    'fiscal',
    'declaración',
    'liquidación',
    'sanción tributaria',
    'modelo 100',
  ],
  trafico: [
    'multa',
    'tráfico',
    'trafico',
    'dgt',
    'carnet',
    'puntos',
    'radar',
    'accidente',
    'seguridad vial',
    'alcohol',
  ],
  consumidor: [
    'consumidor',
    'reclamación',
    'garantía',
    'devolución',
    'cláusula abusiva',
    'banco',
    'tarjeta',
    'compra online',
    'odr',
  ],
  mercantil: [
    'sociedad',
    'mercantil',
    'socio',
    'administrador',
    'concurso',
    'quiebra',
    'factura',
    'empresa',
    'lsc',
    'junta',
  ],
  extranjeria: [
    'extranjería',
    'extranjeria',
    'nie',
    'residencia',
    'nacionalidad',
    'visado',
    'arraigo',
    'asilo',
    'expulsión',
    'maec',
  ],
};

function scoreArea(query: string, areaId: LegalAreaId): number {
  const normalized = query.toLowerCase();
  const keywords = AREA_KEYWORDS[areaId];
  let score = 0;

  for (const keyword of keywords) {
    if (normalized.includes(keyword)) {
      score += keyword.split(' ').length > 1 ? 3 : 1;
    }
  }

  const area = LEGAL_AREAS.find((a) => a.id === areaId);
  if (area) {
    for (const law of area.legislation) {
      if (normalized.includes(law.toLowerCase())) {
        score += 2;
      }
    }
  }

  return score;
}

export function classifyQuery(
  query: string,
  hintArea?: LegalAreaId,
): ClassificationResult {
  const scores = LEGAL_AREA_IDS.map((areaId) => ({
    areaId,
    score: scoreArea(query, areaId),
  })).sort((a, b) => b.score - a.score);

  const top = scores[0];
  const second = scores[1];

  if (!top || top.score === 0) {
    const fallback = hintArea ?? 'civil';
    return {
      areaId: fallback,
      confidence: hintArea ? 0.6 : 0.35,
      reasoning:
        'No se detectaron keywords jurídicas claras. Se asigna área por defecto o hint del expediente.',
      secondaryAreas: [],
    };
  }

  const maxScore = top.score;
  const confidence = Math.min(0.95, 0.4 + maxScore * 0.08);

  const secondaryAreas = scores
    .slice(1, 3)
    .filter((s) => s.score > 0 && s.score >= maxScore * 0.5)
    .map((s) => s.areaId);

  if (hintArea && hintArea !== top.areaId && top.score < 3) {
    return {
      areaId: hintArea,
      confidence: 0.65,
      reasoning: `Área del expediente (${hintArea}) priorizada por baja señal en clasificación automática.`,
      secondaryAreas: [top.areaId],
    };
  }

  return {
    areaId: top.areaId,
    confidence,
    reasoning: `Clasificación por keywords: ${top.areaId} (score ${String(top.score)})${
      second ? `, segundo candidato: ${second.areaId} (${String(second.score)})` : ''
    }`,
    secondaryAreas,
  };
}