export {
  LEGAL_AREA_IDS,
  LEGAL_AREAS,
  getLegalAreaById,
  type LegalAreaId,
  type LegalAreaDefinition,
} from './legal-areas.js';

export { BASE_DISCLAIMER, getDisclaimerForArea } from './disclaimers.js';

export {
  legalResponseSchema,
  type LegalResponse,
  riskLevelSchema,
  semaphoreSchema,
  urgencySchema,
} from './schemas/legal-response.js';