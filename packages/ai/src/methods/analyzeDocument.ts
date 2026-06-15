import { getDisclaimerForArea } from '@lexai/shared';
import { classifyQuery } from '../orchestrator/classifyQuery.js';
import { selectAgent } from '../orchestrator/selectAgent.js';
import { loadSystemPrompt } from '../prompts/loader.js';
import type {
  DocumentAnalysisInput,
  DocumentAnalysisResult,
  OrchestratorConfig,
} from '../orchestrator/types.js';

/**
 * Analiza un documento cláusula por cláusula.
 * Skeleton: prepara agente y estructura de salida.
 */
export async function analyzeDocument(
  input: DocumentAnalysisInput,
  config: OrchestratorConfig,
): Promise<DocumentAnalysisResult> {
  const classification = classifyQuery(input.content.slice(0, 2000), input.legalArea);
  const agent = selectAgent(classification);
  const systemPrompt = await loadSystemPrompt(agent.areaId);

  if (!config.apiKey) {
    return buildPlaceholderAnalysis(agent.areaId, input);
  }

  // TODO(SA-3-integration): Grok 4.3 para análisis voluminoso + chunking
  void systemPrompt;
  void config.volumeModel;

  return buildPlaceholderAnalysis(agent.areaId, input);
}

function buildPlaceholderAnalysis(
  areaId: ReturnType<typeof selectAgent>['areaId'],
  input: DocumentAnalysisInput,
): DocumentAnalysisResult {
  const disclaimer = getDisclaimerForArea(areaId);

  return {
    riskScore: 5,
    semaphore: 'amarillo',
    summary: `Análisis pendiente para "${input.filename ?? input.documentId}". Configure XAI_API_KEY.`,
    clauses: [],
    legalResponse: {
      diagnostico: 'Análisis documental en modo skeleton.',
      derechos: [],
      plazos: [],
      riesgo: { nivel: 'medio', score: 5, semaforo: 'amarillo' },
      accionesRecomendadas: [
        { prioridad: 1, accion: 'Activar integración xAI para análisis de cláusulas' },
      ],
      legislacionCitada: [],
      jurisprudencia: [],
      confidenceScore: 0.3,
      disclaimer,
      irac: {
        issue: 'Documento pendiente de análisis',
        rule: 'N/A',
        application: 'N/A',
        conclusion: 'N/A',
      },
    },
  };
}