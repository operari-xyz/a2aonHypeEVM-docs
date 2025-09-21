'use client'

import { CheckCircle, AlertCircle, Clock, Zap, Shield } from 'lucide-react'
import CodeBlock from '@/components/CodeBlock'
import APICard from '@/components/APICard'
import { FACILITATOR_URL } from '@/lib/config'

const endpoints = [
  {
    method: 'POST',
    path: '/facilitator/verify',
    title: 'Verify Payment',
    description: 'Verify a payment authorization without executing it',
    color: 'blue' as const,
  },
  {
    method: 'POST',
    path: '/facilitator/settle',
    title: 'Settle Payment',
    description: 'Execute a payment authorization using facilitator&apos;s wallet',
    color: 'green' as const,
  },
  {
    method: 'GET',
    path: '/facilitator/health',
    title: 'Health Check',
    description: 'Check service health status and availability',
    color: 'gray' as const,
  },
  {
    method: 'GET',
    path: '/facilitator/gas-estimate',
    title: 'Gas Estimate',
    description: 'Get facilitator&apos;s gas balance and cost estimate',
    color: 'yellow' as const,
  },
  {
    method: 'GET',
    path: '/facilitator/facilitator-info',
    title: 'Facilitator Info',
    description: 'Get facilitator wallet information',
    color: 'purple' as const,
  },
]

const verifyRequestExample = `{
  "signature": "0x...",
  "authorization": {
    "from": "0x...",
    "to": "0x...",
    "value": "1000000",
    "validAfter": "1757710504",
    "validBefore": "1757714704",
    "nonce": "0x..."
  }
}`

const verifyResponseExample = `{
  "isValid": true,
  "payer": "0x...",
  "gasEstimate": {
    "facilitatorEthBalance": "0.1",
    "estimatedGasCost": "0.002",
    "hasEnoughEth": true
  }
}`

const settleRequestExample = `{
  "payment": {
    "signature": "0x...",
    "authorization": {
      "from": "0x...",
      "to": "0x...",
      "value": "1000000",
      "validAfter": "1757710504",
      "validBefore": "1757714704",
      "nonce": "0x..."
    }
  }
}`

const settleResponseExample = `{
  "success": true,
  "transaction": "0x...",
  "payer": "0x...",
  "receiver": "0x...",
  "amount": "1000000",
  "blockNumber": 12345,
  "timestamp": "2024-01-15T10:30:00.000Z"
}`

const healthResponseExample = `{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z"
}`

const gasEstimateResponseExample = `{
  "facilitatorEthBalance": "0.1",
  "estimatedGasCost": "0.002",
  "hasEnoughEth": true
}`

const facilitatorInfoResponseExample = `{
  "address": "0x...",
  "ethBalance": "0.1",
  "timestamp": "2024-01-15T10:30:00.000Z"
}`

export default function APIPage() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          API Reference
        </h1>
        <p className="text-xl text-gray-300">
          Complete API documentation for the HyperEVM USDT0 Facilitator service
        </p>
      </div>

      {/* Base URL */}
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">Base URL</h2>
        <p className="text-gray-300 mb-4">
          All API endpoints are prefixed with <code className="bg-gray-700 px-1 rounded">/facilitator</code>
        </p>
        <code className="text-gray-300 font-mono">{FACILITATOR_URL}/facilitator</code>
      </div>

      {/* Rate Limiting */}
      <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-6 mb-12">
        <div className="flex items-center mb-2">
          <Clock className="w-5 h-5 text-yellow-400 mr-2" />
          <h2 className="text-lg font-semibold text-yellow-200">Rate Limiting</h2>
        </div>
        <ul className="text-yellow-300 text-sm space-y-1">
          <li>• <strong>General Endpoints:</strong> 100 requests per 15 minutes per IP</li>
          <li>• <strong>Sensitive Endpoints:</strong> 10 requests per minute per IP</li>
        </ul>
      </div>

      {/* Authentication */}
      <div className="bg-green-900 border border-green-700 rounded-lg p-6 mb-12">
        <div className="flex items-center mb-2">
          <Shield className="w-5 h-5 text-green-400 mr-2" />
          <h2 className="text-lg font-semibold text-green-200">Authentication</h2>
        </div>
        <p className="text-green-300 text-sm">
          No authentication required - the facilitator is designed for public use.
      </p>
      </div>

      {/* Quick Usage */}
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 mb-12">
        <div className="flex items-center mb-4">
          <Zap className="w-5 h-5 text-gray-400 mr-2" />
          <h2 className="text-lg font-semibold text-gray-200">Quick Usage</h2>
        </div>
        <p className="text-gray-300 text-sm mb-4">
          The facilitator is just 2 simple API endpoints. Here&apos;s how to use them:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium text-gray-200 mb-2">1. Verify Payment (Optional)</div>
            <div className="text-gray-300">Check if payment is valid before settling</div>
          </div>
          <div>
            <div className="font-medium text-gray-200 mb-2">2. Settle Payment</div>
            <div className="text-gray-300">Execute the payment (facilitator pays gas)</div>
          </div>
        </div>
      </div>

      {/* Endpoints Overview */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Endpoints Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {endpoints.map((endpoint, index) => (
            <APICard 
              key={index} 
              {...endpoint} 
              onClick={() => scrollToSection(endpoint.path.replace('/', '').replace('/', '-'))}
            />
          ))}
        </div>
      </div>

      {/* Detailed Endpoint Documentation */}
      <div className="space-y-16">
        {/* Verify Endpoint */}
        <div id="facilitator-verify" className="api-endpoint">
          <div className="flex items-center mb-6">
            <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded text-sm font-medium mr-4">
              POST
            </span>
            <code className="text-lg font-mono text-white">/facilitator/verify</code>
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-4">Verify Payment</h3>
          <p className="text-gray-300 mb-6">
            Verify a payment authorization without executing it. This endpoint allows you to check 
            if a payment is valid before attempting to settle it.
          </p>

          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium text-white mb-3">Request Body</h4>
              <CodeBlock code={verifyRequestExample} language="json" />
            </div>

            <div>
              <h4 className="text-lg font-medium text-white mb-3">Response</h4>
              <CodeBlock code={verifyResponseExample} language="json" />
            </div>

            <div>
              <h4 className="text-lg font-medium text-white mb-3">Error Response</h4>
              <CodeBlock 
                code={`{
  "isValid": false,
  "invalidReason": "authorization_expired",
  "payer": "0x..."
}`} 
                language="json" 
              />
            </div>
          </div>
        </div>

        {/* Settle Endpoint */}
        <div id="facilitator-settle" className="api-endpoint">
          <div className="flex items-center mb-6">
            <span className="bg-green-900 text-green-300 px-3 py-1 rounded text-sm font-medium mr-4">
              POST
            </span>
            <code className="text-lg font-mono text-white">/facilitator/settle</code>
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-4">Settle Payment</h3>
          <p className="text-gray-300 mb-6">
            Execute a payment authorization using facilitator&apos;s wallet. The facilitator will pay 
            all gas fees and execute the USDT0 transfer.
          </p>

          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium text-white mb-3">Request Body</h4>
              <CodeBlock code={settleRequestExample} language="json" />
            </div>

            <div>
              <h4 className="text-lg font-medium text-white mb-3">Response</h4>
              <CodeBlock code={settleResponseExample} language="json" />
            </div>

            <div>
              <h4 className="text-lg font-medium text-white mb-3">Error Response</h4>
              <CodeBlock 
                code={`{
  "success": false,
  "errorReason": "Insufficient ETH for gas",
  "payer": "0x...",
  "receiver": "0x...",
  "amount": "1000000",
  "timestamp": "2024-01-15T10:30:00.000Z"
}`} 
                language="json" 
              />
            </div>
          </div>
        </div>

        {/* Health Endpoint */}
        <div id="facilitator-health" className="api-endpoint">
          <div className="flex items-center mb-6">
            <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded text-sm font-medium mr-4">
              GET
            </span>
            <code className="text-lg font-mono text-white">/facilitator/health</code>
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-4">Health Check</h3>
          <p className="text-gray-300 mb-6">
            Check service health status and availability.
          </p>

          <div>
            <h4 className="text-lg font-medium text-white mb-3">Response</h4>
            <CodeBlock code={healthResponseExample} language="json" />
          </div>
        </div>

        {/* Gas Estimate Endpoint */}
        <div id="facilitator-gas-estimate" className="api-endpoint">
          <div className="flex items-center mb-6">
            <span className="bg-yellow-900 text-yellow-300 px-3 py-1 rounded text-sm font-medium mr-4">
              GET
            </span>
            <code className="text-lg font-mono text-white">/facilitator/gas-estimate</code>
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-4">Gas Estimate</h3>
          <p className="text-gray-300 mb-6">
            Get facilitator&apos;s gas balance and cost estimate for transactions.
          </p>

          <div>
            <h4 className="text-lg font-medium text-white mb-3">Response</h4>
            <CodeBlock code={gasEstimateResponseExample} language="json" />
          </div>
        </div>

        {/* Facilitator Info Endpoint */}
        <div id="facilitator-facilitator-info" className="api-endpoint">
          <div className="flex items-center mb-6">
            <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded text-sm font-medium mr-4">
              GET
            </span>
            <code className="text-lg font-mono text-white">/facilitator/facilitator-info</code>
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-4">Facilitator Info</h3>
          <p className="text-gray-300 mb-6">
            Get facilitator wallet information including address and ETH balance.
          </p>

          <div>
            <h4 className="text-lg font-medium text-white mb-3">Response</h4>
            <CodeBlock code={facilitatorInfoResponseExample} language="json" />
          </div>
        </div>
      </div>

      {/* cURL Examples */}
      <div className="mt-16 bg-gray-800 rounded-lg p-8 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6">cURL Examples</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Verify Payment</h3>
            <CodeBlock 
              code={`curl -X POST ${FACILITATOR_URL}/facilitator/verify \\
  -H "Content-Type: application/json" \\
  -d '{
    "signature": "0x...",
    "authorization": {
      "from": "0x...",
      "to": "0x...",
      "value": "1000000",
      "validAfter": "1757710504",
      "validBefore": "1757714704",
      "nonce": "0x..."
    }
  }'`} 
              language="bash" 
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Settle Payment</h3>
            <CodeBlock 
              code={`curl -X POST ${FACILITATOR_URL}/facilitator/settle \\
  -H "Content-Type: application/json" \\
  -d '{
    "payment": {
      "signature": "0x...",
      "authorization": {
        "from": "0x...",
        "to": "0x...",
        "value": "1000000",
        "validAfter": "1757710504",
        "validBefore": "1757714704",
        "nonce": "0x..."
      }
    }
  }'`} 
              language="bash" 
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Health Check</h3>
            <CodeBlock 
              code={`curl ${FACILITATOR_URL}/facilitator/health`} 
              language="bash" 
            />
          </div>
        </div>
      </div>
    </div>
  )
}
