import { Code, Play, Copy, CheckCircle } from 'lucide-react'
import CodeBlock from '@/components/CodeBlock'

const directApiExample = `// 1. Direct API Usage - Simplest approach
// Just make HTTP calls to the facilitator

// Verify payment
const verifyResponse = await fetch('http://localhost:3000/facilitator/verify', {
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
  const settleResponse = await fetch('http://localhost:3000/facilitator/settle', {
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

const payerExample = `// 2. Payer Service - For creating payment authorizations
import { ethers } from 'ethers';

const EIP712_DOMAIN = {
  name: "USD₮0",
  version: "1", 
  chainId: 999,
  verifyingContract: "0xB8CE59FC3717ada4C02eaDF9682A9e934F625ebb"
};

const EIP712_TYPES = {
  TransferWithAuthorization: [
    { name: "from", type: "address" },
    { name: "to", type: "address" },
    { name: "value", type: "uint256" },
    { name: "validAfter", type: "uint256" },
    { name: "validBefore", type: "uint256" },
    { name: "nonce", type: "bytes32" }
  ]
};

class PayerService {
  private wallet: ethers.Wallet;

  constructor(privateKey: string) {
    const provider = new ethers.providers.JsonRpcProvider('https://rpc.hyperliquid.xyz/evm');
    this.wallet = new ethers.Wallet(privateKey, provider);
  }

  async createPaymentData(to: string, amount: string) {
    const now = Math.floor(Date.now() / 1000);
    const authorization = {
      from: this.wallet.address,
      to: to,
      value: ethers.utils.parseUnits(amount, 6).toString(),
      validAfter: now.toString(),
      validBefore: (now + 3600).toString(), // 1 hour validity
      nonce: ethers.utils.hexlify(ethers.utils.randomBytes(32))
    };

    const signature = await this.wallet._signTypedData(
      EIP712_DOMAIN,
      EIP712_TYPES,
      authorization
    );

    return { signature, authorization };
  }
}`

const receiverExample = `// 3. Receiver Service - For processing payments
class ReceiverService {
  async verifyPaymentWithFacilitator(facilitatorUrl: string, paymentData: any) {
    const response = await fetch(\`\${facilitatorUrl}/facilitator/verify\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });
    
    return response.json();
  }

  async settlePaymentWithFacilitator(facilitatorUrl: string, paymentData: any) {
    const response = await fetch(\`\${facilitatorUrl}/facilitator/settle\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payment: paymentData })
    });
    
    return response.json();
  }

  async processPayment(facilitatorUrl: string, paymentData: any) {
    try {
      // Step 1: Verify payment
      const verification = await this.verifyPaymentWithFacilitator(facilitatorUrl, paymentData);
      
      if (!verification.isValid) {
        throw new Error(\`Payment invalid: \${verification.invalidReason}\`);
      }

      // Step 2: Settle payment
      const settlement = await this.settlePaymentWithFacilitator(facilitatorUrl, paymentData);
      
      if (!settlement.success) {
        throw new Error(\`Settlement failed: \${settlement.errorReason}\`);
      }

      return settlement;
    } catch (error) {
      console.error('Payment processing failed:', error);
      throw error;
    }
  }
}`

const completeWorkflowExample = `// Complete workflow example
import { PayerService } from './payer-service';
import { ReceiverService } from './receiver-service';

async function main() {
  // Step 1: Payer creates payment
  const payer = new PayerService('payer_private_key');
  const paymentData = await payer.createPaymentData(
    '0xReceiverAddress',
    '10.0' // 10 USDT0
  );

  // Step 2: Payer sends to receiver (via your communication channel)
  await payer.sendPaymentToReceiver('https://receiver.com/api/payments', paymentData);

  // Step 3: Receiver processes payment
  const receiver = new ReceiverService(); // No private key needed!

  // Verify payment (optional)
  const verification = await receiver.verifyPaymentWithFacilitator(
    'http://localhost:3000',
    paymentData
  );

  if (verification.isValid) {
    // Settle payment (facilitator pays gas)
    const settlement = await receiver.settlePaymentWithFacilitator(
      'http://localhost:3000',
      paymentData
    );
    
    if (settlement.success) {
      console.log('Payment completed!', settlement.transaction);
    }
  }
}

main().catch(console.error);`

const errorHandlingExample = `// Error handling example
try {
  const result = await receiver.processPayment(facilitatorUrl, paymentData);
  console.log('Payment successful:', result);
} catch (error) {
  if (error.message.includes('authorization_expired')) {
    // Handle expired authorization
    console.log('Payment authorization has expired. Please request a new payment.');
  } else if (error.message.includes('Insufficient ETH')) {
    // Handle facilitator gas shortage
    console.log('Facilitator has insufficient ETH for gas. Please try again later.');
  } else if (error.message.includes('Invalid signature')) {
    // Handle signature verification failure
    console.log('Payment signature is invalid. Please verify the payment data.');
  } else {
    // Handle other errors
    console.log('Payment failed:', error.message);
  }
}`

const reactExample = `// React component example
import React, { useState } from 'react';

function PaymentProcessor({ facilitatorUrl }) {
  const [paymentData, setPaymentData] = useState(null);
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);

  const processPayment = async () => {
    if (!paymentData) return;

    setStatus('processing');
    try {
      const receiver = new ReceiverService();
      const result = await receiver.processPayment(facilitatorUrl, paymentData);
      setResult(result);
      setStatus('success');
    } catch (error) {
      setResult({ error: error.message });
      setStatus('error');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Process Payment</h2>
      
      <textarea
        value={paymentData ? JSON.stringify(paymentData, null, 2) : ''}
        onChange={(e) => setPaymentData(JSON.parse(e.target.value))}
        placeholder="Paste payment data here..."
        className="w-full h-32 p-3 border rounded-md font-mono text-sm"
      />
      
      <button
        onClick={processPayment}
        disabled={status === 'processing'}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
      >
        {status === 'processing' ? 'Processing...' : 'Process Payment'}
      </button>
      
      {result && (
        <div className="mt-4 p-3 bg-gray-100 rounded-md">
          <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}`

const nodeExample = `// Node.js server example
const express = require('express');
const { ReceiverService } = require('./receiver-service');

const app = express();
app.use(express.json());

const receiver = new ReceiverService();
const FACILITATOR_URL = process.env.FACILITATOR_URL || 'http://localhost:3000';

// Endpoint to receive payment data from payer
app.post('/api/payments', async (req, res) => {
  try {
    const paymentData = req.body;
    
    // Process payment using facilitator
    const result = await receiver.processPayment(FACILITATOR_URL, paymentData);
    
    res.json({ success: true, result });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(\`Receiver server running on port \${PORT}\`);
});`

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
        
        {/* Approach Overview */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Choose Your Integration Approach</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-blue-400 font-bold text-xs">1</span>
              </div>
              <div>
                <div className="font-medium text-white">Direct API</div>
                <div className="text-gray-400">Simple HTTP calls, no dependencies</div>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-green-400 font-bold text-xs">2</span>
              </div>
              <div>
                <div className="font-medium text-white">Service Classes</div>
                <div className="text-gray-400">Pre-built abstractions with error handling</div>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-purple-400 font-bold text-xs">3</span>
              </div>
              <div>
                <div className="font-medium text-white">Full Applications</div>
                <div className="text-gray-400">Complete React/Node.js examples</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Direct API Usage */}
      <div className="mb-16">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
            <span className="text-blue-400 font-bold text-sm">1</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Direct API Usage</h2>
        </div>
        <p className="text-gray-300 mb-6">
          The simplest approach - just make HTTP calls to the facilitator. Perfect for quick integration.
        </p>
        <CodeBlock code={directApiExample} language="typescript" title="direct-api-usage.ts" />
      </div>

      {/* Payer Service */}
      <div className="mb-16">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mr-3">
            <span className="text-green-400 font-bold text-sm">2</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Payer Service</h2>
        </div>
        <p className="text-gray-300 mb-6">
          Service class for creating payment authorizations with EIP-712 signing.
        </p>
        <CodeBlock code={payerExample} language="typescript" title="payer-service.ts" />
      </div>

      {/* Receiver Service */}
      <div className="mb-16">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mr-3">
            <span className="text-purple-400 font-bold text-sm">3</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Receiver Service</h2>
        </div>
        <p className="text-gray-300 mb-6">
          Service class for processing payments with built-in error handling.
        </p>
        <CodeBlock code={receiverExample} language="typescript" title="receiver-service.ts" />
      </div>

      {/* Complete Workflow */}
      <div className="mb-16">
        <div className="flex items-center mb-6">
          <Play className="w-6 h-6 text-primary-400 mr-3" />
          <h2 className="text-2xl font-bold text-white">Complete Workflow</h2>
        </div>
        <p className="text-gray-300 mb-6">
          End-to-end example showing how payer and receiver work together.
        </p>
        <CodeBlock code={completeWorkflowExample} language="typescript" title="complete-workflow.ts" />
      </div>

      {/* Error Handling */}
      <div className="mb-16">
        <div className="flex items-center mb-6">
          <CheckCircle className="w-6 h-6 text-primary-400 mr-3" />
          <h2 className="text-2xl font-bold text-white">Error Handling</h2>
        </div>
        <p className="text-gray-300 mb-6">
          Comprehensive error handling for different failure scenarios.
        </p>
        <CodeBlock code={errorHandlingExample} language="typescript" title="error-handling.ts" />
      </div>

      {/* React Component */}
      <div className="mb-16">
        <div className="flex items-center mb-6">
          <Code className="w-6 h-6 text-primary-400 mr-3" />
          <h2 className="text-2xl font-bold text-white">React Component</h2>
        </div>
        <p className="text-gray-300 mb-6">
          React component for processing payments in a web application.
        </p>
        <CodeBlock code={reactExample} language="jsx" title="PaymentProcessor.jsx" />
      </div>

      {/* Node.js Server */}
      <div className="mb-16">
        <div className="flex items-center mb-6">
          <Code className="w-6 h-6 text-primary-400 mr-3" />
          <h2 className="text-2xl font-bold text-white">Node.js Server</h2>
        </div>
        <p className="text-gray-300 mb-6">
          Express.js server example for receiving and processing payments.
        </p>
        <CodeBlock code={nodeExample} language="javascript" title="server.js" />
      </div>

      {/* Integration Tips */}
      <div className="bg-blue-900 border border-blue-700 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-blue-200 mb-6">Integration Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-blue-200 mb-3">For Payers</h3>
            <ul className="text-blue-300 space-y-2 text-sm">
              <li>• Always set appropriate validity periods</li>
              <li>• Use unique nonces for each payment</li>
              <li>• Implement proper error handling</li>
              <li>• Store payment data securely</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-200 mb-3">For Receivers</h3>
            <ul className="text-blue-300 space-y-2 text-sm">
              <li>• Always verify payments before settling</li>
              <li>• Implement retry mechanisms</li>
              <li>• Monitor facilitator health</li>
              <li>• Handle rate limiting gracefully</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

