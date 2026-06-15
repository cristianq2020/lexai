import { getDisclaimerForArea } from '@lexai/shared';
import { selectAgent } from '../orchestrator/selectAgent.js';
import { classifyQuery } from '../orchestrator/classifyQuery.js';
import { loadSystemPrompt } from '../prompts/loader.js';
import type {
  LegalDocumentInput,
  LegalDocumentResult,
  OrchestratorConfig,
} from '../orchestrator/types.js';

/**
 * Genera un escrito jurídico en HTML semántico.
 * Skeleton: prepara agente y metadata para PDF.
 */
export async function generateLegalDocument(
  input: LegalDocumentInput,
  config: OrchestratorConfig,
): Promise<LegalDocumentResult> {
  const classification = classifyQuery(input.context, input.legalArea);
  const agent = selectAgent(classification);
  const systemPrompt = await loadSystemPrompt(agent.areaId);

  if (!config.apiKey) {
    return buildPlaceholderDocument(agent.areaId, input);
  }

  // TODO(SA-3-integration): Grok Heavy para redacción + validación legal
  void systemPrompt;
  void config.heavyModel;

  return buildPlaceholderDocument(agent.areaId, input);
}

function buildPlaceholderDocument(
  areaId: ReturnType<typeof selectAgent>['areaId'],
  input: LegalDocumentInput,
): LegalDocumentResult {
  const disclaimer = getDisclaimerForArea(areaId);

  return {
    title: `Borrador: ${input.type}`,
    htmlContent: `<article class="lexai-document">
  <header><h1>Borrador — ${input.type}</h1></header>
  <section><p>Escrito pendiente de generación IA. Configure XAI_API_KEY.</p></section>
  <footer><p><em>${disclaimer}</em></p></footer>
</article>`,
    metadata: {
      type: input.type,
      caseId: input.caseId,
      areaId,
      status: 'skeleton',
    },
    legalResponse: {
      diagnostico: 'Generación de escrito en modo skeleton.',
      derechos: [],
      plazos: [],
      riesgo: { nivel: 'bajo', score: 2, semaforo: 'verde' },
      accionesRecomendadas: [],
      legislacionCitada: [],
      jurisprudencia: [],
      confidenceScore: 0.2,
      disclaimer,
      irac: {
        issue: 'Escrito pendiente',
        rule: 'N/A',
        application: 'N/A',
        conclusion: 'N/A',
      },
    },
  };
}