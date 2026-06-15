import type { LegalAreaId } from './legal-areas.js';
import { getLegalAreaById } from './legal-areas.js';

const BASE_DISCLAIMER =
  'La información proporcionada por LexAI tiene carácter de orientación jurídica general ' +
  'y no constituye asesoramiento legal vinculante ni relación abogado-cliente. ' +
  'Para decisiones con consecuencias legales significativas, consulte con un abogado colegiado.';

const STRICT_DISCLAIMERS: Partial<Record<LegalAreaId, string>> = {
  penal:
    BASE_DISCLAIMER +
    ' En materia penal, LexAI no sustituye la defensa técnica de un abogado. ' +
    'No confíe decisiones sobre su libertad o derechos fundamentales únicamente a esta herramienta.',
  fiscal:
    BASE_DISCLAIMER +
    ' En materia fiscal, LexAI no proporciona asesoramiento fiscal vinculante ni sustituye ' +
    'a un asesor fiscal colegiado. Las obligaciones tributarias requieren revisión profesional.',
};

export function getDisclaimerForArea(areaId: LegalAreaId): string {
  const area = getLegalAreaById(areaId);
  if (area?.strictDisclaimer && STRICT_DISCLAIMERS[areaId]) {
    return STRICT_DISCLAIMERS[areaId] ?? BASE_DISCLAIMER;
  }
  return BASE_DISCLAIMER;
}

export { BASE_DISCLAIMER };