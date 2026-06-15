import { resolveXaiConfig } from '../config/xai-config.js';
import { analyzeDocument } from '../methods/analyzeDocument.js';
import { generateLegalDocument } from '../methods/generateLegalDocument.js';
import { processConsultation } from '../methods/processConsultation.js';
import { classifyQuery } from './classifyQuery.js';
import { selectAgent } from './selectAgent.js';
import type {
  ConsultationInput,
  ConsultationResult,
  DocumentAnalysisInput,
  DocumentAnalysisResult,
  LegalDocumentInput,
  LegalDocumentResult,
  OrchestratorConfig,
} from './types.js';

function buildDefaultConfig(): OrchestratorConfig {
  const resolved = resolveXaiConfig();
  const config: OrchestratorConfig = {
    heavyModel: resolved.heavyModel,
    volumeModel: resolved.volumeModel,
  };

  if (resolved.apiKey) {
    config.apiKey = resolved.apiKey;
  }

  return config;
}

export class LexAIOrchestrator {
  private readonly config: OrchestratorConfig;

  constructor(config: Partial<OrchestratorConfig> = {}) {
    this.config = { ...buildDefaultConfig(), ...config };
  }

  classifyQuery(query: string, hintArea?: ConsultationInput['legalArea']) {
    return classifyQuery(query, hintArea);
  }

  selectAgent(classification: ReturnType<typeof classifyQuery>) {
    return selectAgent(classification);
  }

  async processConsultation(input: ConsultationInput): Promise<ConsultationResult> {
    return processConsultation(input, this.config);
  }

  async analyzeDocument(input: DocumentAnalysisInput): Promise<DocumentAnalysisResult> {
    return analyzeDocument(input, this.config);
  }

  async generateLegalDocument(input: LegalDocumentInput): Promise<LegalDocumentResult> {
    return generateLegalDocument(input, this.config);
  }
}

export function createOrchestrator(config?: Partial<OrchestratorConfig>): LexAIOrchestrator {
  return new LexAIOrchestrator(config);
}