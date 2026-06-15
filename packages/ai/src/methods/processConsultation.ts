import { getDisclaimerForArea } from '@lexai/shared';
import { XaiApiError, callGrokCompletion, parseLegalResponseFromGrok } from '../clients/xai-client.js';
import { shouldUseLiveGrok } from '../config/grok-routing.js';
import { buildIntelligentMockResponse } from './intelligent-mock.js';
import { logAiEvent } from '../lib/ai-logger.js';
import { getCachedResponse, setCachedResponse } from '../lib/response-cache.js';
import { classifyQuery } from '../orchestrator/classifyQuery.js';
import { selectAgent } from '../orchestrator/selectAgent.js';
import { loadSystemPrompt } from '../prompts/loader.js';
import type {
  ConsultationExecutionMode,
  ConsultationInput,
  ConsultationResult,
  OrchestratorConfig,
} from '../orchestrator/types.js';

/**
 * Procesa una consulta jurídica.
 *
 * Flujo:
 * 1. classifyQuery + selectAgent + loadSystemPrompt
 * 2. Caché → respuesta previa (live o mock)
 * 3. Sin apiKey o XAI_FORCE_MOCK → intelligent mock
 * 4. Routing de coste → consultas simples usan mock aunque haya créditos
 * 5. Si apiKey → callGrokCompletion (live)
 * 6. Si Grok falla → intelligent fallback
 *
 * Activación live: XAI_API_KEY en .env
 * Ahorro de coste: XAI_FORCE_MOCK=true o routing automático por complejidad
 */
export async function processConsultation(
  input: ConsultationInput,
  config: OrchestratorConfig,
): Promise<ConsultationResult> {
  const start = Date.now();

  const classification = classifyQuery(input.query, input.legalArea);
  const agent = selectAgent(classification);

  const cached = getCachedResponse(input.query, agent.areaId);
  if (cached) {
    logAiEvent({
      event: 'consultation_cache_hit',
      mode: 'mock',
      caseId: input.caseId,
      areaId: agent.areaId,
    });
    return {
      areaId: agent.areaId,
      agentId: agent.agentId,
      modelUsed: 'cache',
      processingMs: Date.now() - start,
      executionMode: 'mock',
      response: { ...cached, disclaimer: getDisclaimerForArea(agent.areaId) },
    };
  }

  if (!config.apiKey) {
    return buildLocalResult(agent, classification.confidence, start, input, 'mock');
  }

  const routing = shouldUseLiveGrok(input.query);
  if (!routing.useLiveGrok) {
    logAiEvent({
      event: 'consultation_routing_mock',
      mode: 'mock',
      caseId: input.caseId,
      areaId: agent.areaId,
      error: routing.reason,
    });
    return buildLocalResult(agent, classification.confidence, start, input, 'mock');
  }

  const systemPrompt = await loadSystemPrompt(agent.areaId);
  const historyMessages =
    input.history?.map((m) => ({
      role: m.role,
      content: m.content,
    })) ?? [];

  logAiEvent({
    event: 'consultation_live_start',
    mode: 'live',
    model: config.heavyModel,
    caseId: input.caseId,
    areaId: agent.areaId,
  });

  try {
    const grokResult = await callGrokCompletion({
      apiKey: config.apiKey,
      model: config.heavyModel,
      systemPrompt,
      messages: [...historyMessages, { role: 'user', content: input.query }],
    });

    const legalResponse = parseLegalResponseFromGrok(grokResult.content);
    const processingMs = Date.now() - start;
    const response = {
      ...legalResponse,
      disclaimer: getDisclaimerForArea(agent.areaId),
    };

    setCachedResponse(input.query, agent.areaId, response);

    logAiEvent({
      event: 'consultation_live_complete',
      mode: 'live',
      model: grokResult.model,
      caseId: input.caseId,
      areaId: agent.areaId,
      processingMs,
    });

    return {
      areaId: agent.areaId,
      agentId: agent.agentId,
      modelUsed: grokResult.model,
      processingMs,
      executionMode: 'live',
      response,
    };
  } catch (error) {
    const reason =
      error instanceof XaiApiError
        ? error.message
        : error instanceof Error
          ? error.message
          : 'Error desconocido en Grok';

    logAiEvent({
      event: 'consultation_fallback',
      mode: 'fallback',
      model: config.heavyModel,
      caseId: input.caseId,
      areaId: agent.areaId,
      error: reason.slice(0, 200),
      fallback: true,
      processingMs: Date.now() - start,
    });

    const local = buildLocalResult(agent, classification.confidence, start, input, 'fallback', reason);
    setCachedResponse(input.query, agent.areaId, local.response);
    return {
      ...local,
      executionMode: 'fallback',
      fallbackReason: reason,
      modelUsed: 'lexai-local-fallback',
    };
  }
}

function buildLocalResult(
  agent: ReturnType<typeof selectAgent>,
  confidence: number,
  startMs: number,
  input: ConsultationInput,
  mode: ConsultationExecutionMode,
  fallbackReason?: string,
): ConsultationResult {
  logAiEvent({
    event: mode === 'mock' ? 'consultation_intelligent_mock' : 'consultation_intelligent_fallback',
    mode,
    caseId: input.caseId,
    areaId: agent.areaId,
  });

  const response = buildIntelligentMockResponse({
    query: input.query,
    areaId: agent.areaId,
    agent,
    mode,
    classificationConfidence: confidence,
    ...(fallbackReason ? { fallbackReason } : {}),
  });

  return {
    areaId: agent.areaId,
    agentId: agent.agentId,
    modelUsed: mode === 'fallback' ? 'lexai-local-fallback' : 'lexai-local',
    processingMs: Date.now() - startMs,
    executionMode: mode,
    ...(fallbackReason ? { fallbackReason } : {}),
    response,
  };
}