import { Code, Play, Copy, CheckCircle } from 'lucide-react'
import CodeBlock from '@/components/CodeBlock'
import { FACILITATOR_URL } from '@/lib/config'

const directApiExample = `// 1. Direct API Usage - Simplest approach
// Just make HTTP calls to the facilitator

// Verify payment
const verifyResponse = await fetch('${FACILITATOR_URL}/facilitator/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    signature: "0x...", // EIP-712 signature from payer
    authorization: {
      from: "0xPayerAddress",
      to: "0xReceiverAddress",
      value: "10000000", // 10 USDT0 (6 decimals)
      validAfter: "1757710504",
      validBefore: "1757714704", 
      nonce: "0x..."
    }
  })
});

const verification = await verifyResponse.json();

// Settle payment if valid
if (verification.isValid) {
  const settleResponse = await fetch('${FACILITATOR_URL}/facilitator/settle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      payment: {
        signature: "0x...",
        authorization: { /* same as above */ }
      }
    })
  });
  
  const settlement = await settleResponse.json();
  console.log('Payment completed!', settlement.transaction);
}`

const curlExample = `# 2. cURL Examples - Works with any language

# Verify payment
curl -X POST ${FACILITATOR_URL}/facilitator/verify \\
  -H "Content-Type: application/json" \\
  -d '{
    "signature": "0x...",
    "authorization": {
      "from": "0xPayerAddress",
      "to": "0xReceiverAddress",
      "value": "10000000",
      "validAfter": "1757710504",
      "validBefore": "1757714704",
      "nonce": "0x..."
    }
  }'

# Settle payment
curl -X POST ${FACILITATOR_URL}/facilitator/settle \\
  -H "Content-Type: application/json" \\
  -d '{
    "payment": {
      "signature": "0x...",
      "authorization": {
        "from": "0xPayerAddress",
        "to": "0xReceiverAddress",
        "value": "10000000",
        "validAfter": "1757710504",
        "validBefore": "1757714704",
        "nonce": "0x..."
      }
    }
  }'`

const pythonExample = `# 3. Python Example
import requests
import json

FACILITATOR_URL = "${FACILITATOR_URL}"

def verify_payment(payment_data):
    response = requests.post(
        f"{FACILITATOR_URL}/facilitator/verify",
        headers={"Content-Type": "application/json"},
        json=payment_data
    )
    return response.json()

def settle_payment(payment_data):
    response = requests.post(
        f"{FACILITATOR_URL}/facilitator/settle",
        headers={"Content-Type": "application/json"},
        json={"payment": payment_data}
    )
    return response.json()

# Usage
payment_data = {
    "signature": "0x...",
    "authorization": {
        "from": "0xPayerAddress",
        "to": "0xReceiverAddress",
        "value": "10000000",
        "validAfter": "1757710504",
        "validBefore": "1757714704",
        "nonce": "0x..."
    }
}

# Verify first (optional)
verification = verify_payment(payment_data)
if verification["isValid"]:
    # Then settle
    settlement = settle_payment(payment_data)
    print("Payment completed!", settlement["transaction"])`

const errorHandlingExample = `# 4. Error Handling
try {
  const verification = await fetch('${FACILITATOR_URL}/facilitator/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentData)
  });
  
  const result = await verification.json();
  
  if (!result.isValid) {
    console.log('Payment invalid:', result.invalidReason);
    return;
  }
  
  // Proceed with settlement...
} catch (error) {
  console.log('Request failed:', error.message);
}`

export default function ExamplesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          Code Examples
        </h1>
        <p className="text-xl text-gray-300 mb-6">
          Examples from simple to complex - choose the approach that fits your needs
        </p>
        
        {/* Simple API Overview */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Simple API Integration</h2>
          <p className="text-gray-300 text-sm mb-4">
            The facilitator is just 2 HTTP endpoints. Choose your preferred language and make direct API calls.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-blue-400 font-bold text-xs">1</span>
              </div>
              <div>
                <div className="font-medium text-white">JavaScript/TypeScript</div>
                <div className="text-gray-400">fetch() API calls</div>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-green-400 font-bold text-xs">2</span>
              </div>
              <div>
                <div className="font-medium text-white">cURL/Command Line</div>
                <div className="text-gray-400">Works with any language</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* JavaScript/TypeScript */}
      <div className="mb-16">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
            <span className="text-blue-400 font-bold text-sm">1</span>
          </div>
          <h2 className="text-2xl font-bold text-white">JavaScript/TypeScript</h2>
        </div>
        <p className="text-gray-300 mb-6">
          Simple fetch() calls to the facilitator API endpoints.
        </p>
        <CodeBlock code={directApiExample} language="typescript" title="javascript-example.js" />
      </div>

      {/* cURL Examples */}
      <div className="mb-16">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mr-3">
            <span className="text-green-400 font-bold text-sm">2</span>
          </div>
          <h2 className="text-2xl font-bold text-white">cURL Examples</h2>
        </div>
        <p className="text-gray-300 mb-6">
          Command-line examples that work with any programming language.
        </p>
        <CodeBlock code={curlExample} language="bash" title="curl-examples.sh" />
      </div>

      {/* Python Example */}
      <div className="mb-16">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mr-3">
            <span className="text-purple-400 font-bold text-sm">3</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Python Example</h2>
        </div>
        <p className="text-gray-300 mb-6">
          Python implementation using the requests library.
        </p>
        <CodeBlock code={pythonExample} language="python" title="python-example.py" />
      </div>

      {/* Error Handling */}
      <div className="mb-16">
        <div className="flex items-center mb-6">
          <CheckCircle className="w-6 h-6 text-primary-400 mr-3" />
          <h2 className="text-2xl font-bold text-white">Error Handling</h2>
        </div>
        <p className="text-gray-300 mb-6">
          Basic error handling for API calls.
        </p>
        <CodeBlock code={errorHandlingExample} language="typescript" title="error-handling.js" />
      </div>

      {/* Integration Tips */}
      <div className="bg-blue-900 border border-blue-700 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-blue-200 mb-6">Integration Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-blue-200 mb-3">API Usage</h3>
            <ul className="text-blue-300 space-y-2 text-sm">
              <li>• Always verify payments before settling</li>
              <li>• Handle HTTP errors gracefully</li>
              <li>• Check response status codes</li>
              <li>• Implement retry logic for network issues</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-200 mb-3">Best Practices</h3>
            <ul className="text-blue-300 space-y-2 text-sm">
              <li>• Use HTTPS in production</li>
              <li>• Set appropriate timeouts</li>
              <li>• Log API responses for debugging</li>
              <li>• Monitor facilitator health endpoint</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

