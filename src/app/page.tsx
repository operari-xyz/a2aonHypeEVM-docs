import { ArrowRight, Shield, Zap, Users, Code, CheckCircle, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import CodeBlock from '@/components/CodeBlock'
import FeatureCard from '@/components/FeatureCard'
import APICard from '@/components/APICard'

const features = [
  {
    icon: Shield,
    title: 'No Private Key Sharing',
    description: 'Receivers never expose private keys - secure EIP-712 signature verification',
  },
  {
    icon: Zap,
    title: 'No ETH Required',
    description: 'Receivers don\'t need ETH for gas - facilitator pays all transaction costs',
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
    description: 'Execute a payment authorization using facilitator\'s wallet',
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
    description: 'Get facilitator\'s gas balance and cost estimate',
    color: 'yellow' as const,
    href: '/api#facilitator-gas-estimate',
  },
]

const quickStartCode = `// Step 1: Payer creates payment
const payer = new PayerService('payer_private_key');
const paymentData = await payer.createPaymentData(
  '0xReceiverAddress',
  '10.0' // 10 USDT0
);

// Step 2: Receiver processes payment (no private key needed!)
const receiver = new ReceiverService();

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
            <code className="bg-dark-800/50 text-purple-300 px-3 py-1 rounded-lg text-sm border border-purple-500/30 backdrop-blur-sm">transferWithAuthorization</code>{' '}
            with <strong className="text-purple-400">facilitator-paid gas fees</strong>
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
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 border border-blue-500/30">
                  <Users className="w-10 h-10 text-blue-400" />
                </div>
                <h3 className="font-semibold text-white text-lg mb-2">Payer</h3>
                <p className="text-sm text-gray-300">Signs authorization</p>
              </div>
              <ArrowRight className="w-8 h-8 text-gray-400 hidden lg:block animate-float" />
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 border border-green-500/30">
                  <Users className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="font-semibold text-white text-lg mb-2">Receiver</h3>
                <p className="text-sm text-gray-300">Receives payment</p>
              </div>
              <ArrowRight className="w-8 h-8 text-gray-400 hidden lg:block animate-float" />
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 border border-purple-500/30">
                  <Zap className="w-10 h-10 text-purple-400" />
                </div>
                <h3 className="font-semibold text-white text-lg mb-2">Facilitator</h3>
                <p className="text-sm text-gray-300">Pays gas & executes</p>
              </div>
              <ArrowRight className="w-8 h-8 text-gray-400 hidden lg:block animate-float" />
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 border border-yellow-500/30">
                  <Shield className="w-10 h-10 text-yellow-400" />
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
              className="inline-flex items-center text-purple-400 hover:text-purple-300 font-medium text-lg group"
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
              <div className="text-3xl font-bold text-purple-400 mb-3 group-hover:text-purple-300 transition-colors duration-300">6 Decimals</div>
              <div className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">Like USDC standard</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-bold text-purple-400 mb-3 group-hover:text-purple-300 transition-colors duration-300">Chain ID: 999</div>
              <div className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">HyperEVM Network</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-bold text-purple-400 mb-3 group-hover:text-purple-300 transition-colors duration-300">EIP-3009</div>
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
