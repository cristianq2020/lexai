import type { LegalAreaId } from '@lexai/shared';
import type { LegalResponse } from '@lexai/shared';

export interface ClassificationResult {
  areaId: LegalAreaId;
  confidence: number;
  reasoning: string;
  secondaryAreas: LegalAreaId[];
}

export interface ConsultationInput {
  query: string;
  caseId: string;
  legalArea?: LegalAreaId;
  history?: { role: 'user' | 'assistant'; content: string }[] | undefined;
  documentContext?: string[] | undefined;
}

export type ConsultationExecutionMode = 'live' | 'mock' | 'fallback';

export interface ConsultationResult {
  areaId: LegalAreaId;
  agentId: string;
  response: LegalResponse;
  modelUsed: string;
  processingMs: number;
  /** Modo real de ejecución (puede diferir del intento si Grok falla) */
  executionMode: ConsultationExecutionMode;
  /** Presente cuando executionMode === 'fallback' */
  fallbackReason?: string;
}

export interface DocumentAnalysisInput {
  documentId: string;
  content: string;
  legalArea?: LegalAreaId;
  filename?: string;
}

export interface ClauseAnalysis {
  id: string;
  text: string;
  riskScore: number;
  semaphore: 'rojo' | 'amarillo' | 'verde';
  summary: string;
  recommendation: string;
}

export interface DocumentAnalysisResult {
  riskScore: number;
  semaphore: 'rojo' | 'amarillo' | 'verde';
  summary: string;
  clauses: ClauseAnalysis[];
  legalResponse: LegalResponse;
}

export interface LegalDocumentInput {
  caseId: string;
  type: string;
  context: string;
  legalArea: LegalAreaId;
  additionalInstructions?: string;
}

export interface LegalDocumentResult {
  htmlContent: string;
  title: string;
  metadata: Record<string, string>;
  legalResponse: LegalResponse;
}

export interface OrchestratorConfig {
  heavyModel: string;
  volumeModel: string;
  apiKey?: string | undefined;
}