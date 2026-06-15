export { resolveXaiConfig, isXaiLiveConfigured } from './config/xai-config.js';
export { shouldUseLiveGrok } from './config/grok-routing.js';
export { buildIntelligentMockResponse } from './methods/intelligent-mock.js';
export { getCacheStats, clearResponseCache } from './lib/response-cache.js';
export type { ResolvedXaiConfig, XaiRuntimeMode } from './config/xai-config.js';
export { LexAIOrchestrator, createOrchestrator } from './orchestrator/LexAIOrchestrator.js';
export { classifyQuery } from './orchestrator/classifyQuery.js';
export { selectAgent } from './orchestrator/selectAgent.js';
export { processConsultation } from './methods/processConsultation.js';
export { analyzeDocument } from './methods/analyzeDocument.js';
export { generateLegalDocument } from './methods/generateLegalDocument.js';
export { loadSystemPrompt, clearPromptCache } from './prompts/loader.js';
export type {
  ClassificationResult,
  ConsultationExecutionMode,
  ConsultationInput,
  ConsultationResult,
  DocumentAnalysisInput,
  DocumentAnalysisResult,
  LegalDocumentInput,
  LegalDocumentResult,
  OrchestratorConfig,
  ClauseAnalysis,
} from './orchestrator/types.js';
export type { SelectedAgent } from './orchestrator/selectAgent.js';