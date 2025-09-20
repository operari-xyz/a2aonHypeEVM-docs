// Facilitator API Configuration
export const FACILITATOR_URL = process.env.NEXT_PUBLIC_FACILITATOR_URL || 'http://localhost:5050'
// export const FACILITATOR_URL = process.env.NEXT_PUBLIC_FACILITATOR_URL || 'https://a2aonhypeevm.onrender.com'

// API Endpoints
export const API_ENDPOINTS = {
  VERIFY: `${FACILITATOR_URL}/facilitator/verify`,
  SETTLE: `${FACILITATOR_URL}/facilitator/settle`,
  HEALTH: `${FACILITATOR_URL}/facilitator/health`,
  GAS_ESTIMATE: `${FACILITATOR_URL}/facilitator/gas-estimate`,
  FACILITATOR_INFO: `${FACILITATOR_URL}/facilitator/facilitator-info`,
  AI: `${FACILITATOR_URL}/facilitator/ai`,
} as const
