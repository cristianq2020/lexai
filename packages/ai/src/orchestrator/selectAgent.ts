import { getLegalAreaById, type LegalAreaId } from '@lexai/shared';
import type { ClassificationResult } from './types.js';

export interface SelectedAgent {
  areaId: LegalAreaId;
  agentId: string;
  agentName: string;
  systemPromptFile: string;
  strictDisclaimer: boolean;
  classification: ClassificationResult;
}

export function selectAgent(classification: ClassificationResult): SelectedAgent {
  const area = getLegalAreaById(classification.areaId);

  if (!area) {
    throw new Error(`Área legal no válida: ${classification.areaId}`);
  }

  return {
    areaId: classification.areaId,
    agentId: area.id,
    agentName: area.agentName,
    systemPromptFile: `${area.id}.system.md`,
    strictDisclaimer: area.strictDisclaimer,
    classification,
  };
}