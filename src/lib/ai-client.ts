// AI API Client based on FRONTEND_INTEGRATION.md
import { API_ENDPOINTS } from './config'

export interface PaymentObject {
  signature: string;
  authorization: {
    from: string;
    to: string;
    value: string;
    validAfter: string;
    validBefore: string;
    nonce: string;
  };
}

export interface AIRequest {
  prompt: string;
  payment?: PaymentObject;
}

export interface AIResponse {
  success: true;
  data: string;
  paymentStatus: {
    verified: boolean;
    settled: boolean;
    transactionHash?: string;
  };
  timestamp: string;
}

export interface PaymentRequiredResponse {
  success: false;
  error: "Payment required";
  message: "This service requires payment to process your request";
  timestamp: string;
}

export interface InvalidPaymentResponse {
  success: false;
  error: "Invalid payment signature" | "Invalid payment format" | "Insufficient payment amount";
  message: string;
  timestamp: string;
}

export interface ServerErrorResponse {
  success: false;
  error: string;
  timestamp: string;
}

export type APIResponse = AIResponse | PaymentRequiredResponse | InvalidPaymentResponse | ServerErrorResponse;

export class AIAPIClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || API_ENDPOINTS.AI.replace('/facilitator/ai', '');
  }

  async callAI(prompt: string, payment?: PaymentObject): Promise<APIResponse> {
    try {
      const requestBody = {
        prompt,
        payment
      };
      
      console.log('🚀 Sending AI request to:', API_ENDPOINTS.AI);
      console.log('📤 Request body:', JSON.stringify(requestBody, null, 2));
      
      const response = await fetch(API_ENDPOINTS.AI, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

      const data = await response.json();
      console.log('📥 Response data:', JSON.stringify(data, null, 2));
      
      if (!response.ok) {
        console.error('❌ API Error:', response.status, data);
      }
      
      return data;
    } catch (error) {
      console.error('❌ Network error:', error);
      return {
        success: false,
        error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Helper method to handle different response types
  handleResponse(response: APIResponse) {
    if (response.success) {
      // AI processing successful
      console.log('AI Response:', response.data);
      console.log('Payment Status:', response.paymentStatus);
      return { type: 'success', data: response };
    } else {
      // Handle different error types
      switch (response.error) {
        case 'Payment required':
          return { type: 'payment_required', message: response.message };
        case 'Invalid payment signature':
        case 'Invalid payment format':
          return { type: 'invalid_payment', message: response.message };
        default:
          return { type: 'error', message: response.error };
      }
    }
  }
}

// Utility functions for payment generation
export const generateNonce = (): string => {
  return Math.random().toString(16).substring(2, 15);
};

export const generatePaymentObject = async (
  from: string,
  to: string,
  value: string,
  signature: string
): Promise<PaymentObject> => {
  const nonce = generateNonce();
  const now = Math.floor(Date.now() / 1000);
  
  return {
    signature,
    authorization: {
      from,
      to,
      value,
      validAfter: now.toString(),
      validBefore: (now + 3600).toString(), // 1 hour validity
      nonce: `0x${nonce}`
    }
  };
};

// Convert USDT0 amount to smallest units (6 decimals)
export const convertToSmallestUnits = (amount: string): string => {
  return Math.floor(parseFloat(amount) * 1000000).toString();
};
