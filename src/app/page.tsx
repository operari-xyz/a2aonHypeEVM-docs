import { ArrowRight, Shield, Zap, Users, Code, CheckCircle, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import CodeBlock from '@/components/CodeBlock'
import FeatureCard from '@/components/FeatureCard'
import APICard from '@/components/APICard'
import { FACILITATOR_URL } from '@/lib/config'

const features = [
  {
    icon: Shield,
    title: 'No Private Key Sharing',
    description: 'Receivers never expose private keys - secure EIP-712 signature verification',
  },
  {
    icon: Zap,
    title: 'No ETH Required',
    description: 'Receivers deposit need ETH for gas - facilitator pays all transaction costs',
  },
  {
    icon: Users,
    title: 'Seamless UX',
    description: 'Simple API calls for payment processing with comprehensive error handling',
  },
  {
    icon: Code,
    title: 'Easy Integration',
    description: 'RESTful API with JSON responses - integrate with any programming language',
  },
]

const apiEndpoints = [
  {
    method: 'POST',
    path: '/facilitator/verify',
    title: 'Verify Payment',
    description: 'Verify a payment authorization without executing it',
    color: 'blue' as const,
    href: '/api#facilitator-verify',
  },
  {
    method: 'POST',
    path: '/facilitator/settle',
    title: 'Settle Payment',
    description: 'Execute a payment authorization using facilitator&apos;s wallet',
    color: 'green' as const,
    href: '/api#facilitator-settle',
  },
  {
    method: 'GET',
    path: '/facilitator/health',
    title: 'Health Check',
    description: 'Check service health status and availability',
    color: 'gray' as const,
    href: '/api#facilitator-health',
  },
  {
    method: 'GET',
    path: '/facilitator/gas-estimate',
    title: 'Gas Estimate',
    description: 'Get facilitator&apos;s gas balance and cost estimate',
    color: 'yellow' as const,
    href: '/api#facilitator-gas-estimate',
  },
]

const quickStartCode = `// Simple API Usage - Direct HTTP calls to facilitator

// Step 1: Verify payment (optional but recommended)
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

// Step 2: Settle payment (facilitator pays gas)
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

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto container-padding">
      {/* Hero Section */}
      <div className="text-center section-padding">
        <div className="animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            HyperEVM USDT0
            <span className="text-gradient block mt-2">Facilitator</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Enable seamless USDT0 transfers between agents using EIP-3009{' '}
            <code className="bg-dark-800/50 text-gray-300 px-3 py-1 rounded-lg text-sm border border-gray-500/30 backdrop-blur-sm">transferWithAuthorization</code>{' '}
            with <strong className="text-gray-300">facilitator-paid gas fees</strong>
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up animate-stagger-1">
            <Link
              href="/api"
              className="button-primary inline-flex items-center group"
            >
              View API Documentation
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link
              href="/examples"
              className="button-secondary inline-flex items-center group"
            >
              See Examples
              <ExternalLink className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            </Link>
          </div>
        </div>
      </div>

      {/* Key Benefits */}
      <div className="section-padding">
        <div className="animate-fade-in-up animate-stagger-2">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
            Key Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${0.1 * (index + 1)}s` }}>
                <FeatureCard {...feature} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Architecture Diagram */}
      <div className="section-padding">
        <div className="animate-fade-in-up animate-stagger-3">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
            How It Works
          </h2>
          <div className="card">
            <div className="flex flex-col lg:flex-row items-center justify-between space-y-12 lg:space-y-0 lg:space-x-8">
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-500/20 to-gray-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 border border-gray-500/30">
                  <Users className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="font-semibold text-white text-lg mb-2">Payer</h3>
                <p className="text-sm text-gray-300">Signs authorization</p>
              </div>
              <ArrowRight className="w-8 h-8 text-gray-400 hidden lg:block animate-float" />
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-600/20 to-gray-700/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 border border-gray-600/30">
                  <Users className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="font-semibold text-white text-lg mb-2">Receiver</h3>
                <p className="text-sm text-gray-300">Receives payment</p>
              </div>
              <ArrowRight className="w-8 h-8 text-gray-400 hidden lg:block animate-float" />
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-700/20 to-gray-800/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 border border-gray-700/30">
                  <Zap className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="font-semibold text-white text-lg mb-2">Facilitator</h3>
                <p className="text-sm text-gray-300">Pays gas & executes</p>
              </div>
              <ArrowRight className="w-8 h-8 text-gray-400 hidden lg:block animate-float" />
              <div className="text-center group">
                   <div className="w-20 h-20 bg-gradient-to-br from-gray-700/20 to-gray-800/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 border border-gray-700/30">
                  <Shield className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="font-semibold text-white text-lg mb-2">HyperEVM</h3>
                <p className="text-sm text-gray-300">USDT0 transfer</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start */}
      <div className="section-padding">
        <div className="animate-fade-in-up animate-stagger-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
            Quick Start
          </h2>
          <div className="card">
            <CodeBlock code={quickStartCode} language="typescript" />
          </div>
        </div>
      </div>

      {/* Integration Guide */}
      <div className="section-padding">
        <div className="animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
            Simple Integration
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="card text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gray-500/20 rounded-2xl flex items-center justify-center mr-4">
                  <Code className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Just 2 API Endpoints</h3>
              </div>
              <p className="text-gray-300 mb-8 text-lg">
                The facilitator is a simple API service. Make HTTP calls to verify and settle payments.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-gray-500/20 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-gray-400 font-bold text-sm">1</span>
                    </div>
                    <h4 className="font-semibold text-white">Verify Payment</h4>
                  </div>
                  <p className="text-gray-400 text-sm">Check if payment is valid before settling</p>
                  <code className="text-gray-400 text-xs">POST /facilitator/verify</code>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-gray-500/20 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-gray-400 font-bold text-sm">2</span>
                    </div>
                    <h4 className="font-semibold text-white">Settle Payment</h4>
                  </div>
                  <p className="text-gray-400 text-sm">Execute the payment (facilitator pays gas)</p>
                  <code className="text-gray-400 text-xs">POST /facilitator/settle</code>
                </div>
              </div>
              <div className="mt-8">
                <p className="text-gray-400 text-sm">
                  <strong>Works with any language:</strong> JavaScript, Python, cURL, or any HTTP client
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* API Endpoints Preview */}
      <div className="section-padding">
        <div className="animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
            API Endpoints
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {apiEndpoints.map((endpoint, index) => (
              <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${0.1 * (index + 1)}s` }}>
                <APICard {...endpoint} />
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/api"
              className="inline-flex items-center text-gray-300 hover:text-gray-100 font-medium text-lg group"
            >
              View Complete API Reference
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>
      </div>

      {/* Specifications */}
      <div className="section-padding">
        <div className="card animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-gradient">
            USDT0 Specifications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="text-3xl font-bold text-gray-300 mb-3 group-hover:text-gray-100 transition-colors duration-300">6 Decimals</div>
              <div className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">Like USDC standard</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-bold text-gray-300 mb-3 group-hover:text-gray-100 transition-colors duration-300">Chain ID: 999</div>
              <div className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">HyperEVM Network</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-bold text-gray-300 mb-3 group-hover:text-gray-100 transition-colors duration-300">EIP-3009</div>
              <div className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">Transfer with Authorization</div>
            </div>
          </div>
          <div className="mt-12 text-center">
            <div className="text-sm text-gray-400">
              Contract: <code className="bg-dark-700/50 px-3 py-2 rounded-lg border border-gray-600/50 backdrop-blur-sm">0xB8CE59FC3717ada4C02eaDF9682A9e934F625ebb</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
