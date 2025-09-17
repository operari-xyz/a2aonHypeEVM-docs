import { Shield, Lock, AlertTriangle, CheckCircle, Eye, Key, Zap } from 'lucide-react'
import CodeBlock from '@/components/CodeBlock'

const securityFeatures = [
  {
    icon: Lock,
    title: 'EIP-712 Signature Verification',
    description: 'Cryptographic validation ensures payment authenticity and prevents tampering',
    details: 'All payment authorizations are signed using EIP-712 standard with the USDT0 contract domain'
  },
  {
    icon: Eye,
    title: 'No Private Key Exposure',
    description: 'Receivers never need to share or expose their private keys',
    details: 'The facilitator handles all blockchain interactions on behalf of receivers'
  },
  {
    icon: Key,
    title: 'Secure Key Management',
    description: 'Facilitator private keys are stored securely and never exposed',
    details: 'Private keys should be stored in environment variables or secure key management systems'
  },
  {
    icon: Zap,
    title: 'Rate Limiting',
    description: 'Built-in protection against API abuse and DDoS attacks',
    details: 'Configurable rate limits prevent excessive requests from single sources'
  }
]

const bestPractices = [
  {
    category: 'For Facilitators',
    practices: [
      'Store facilitator private key securely using environment variables',
      'Never commit private keys to version control',
      'Use secure key management systems in production',
      'Monitor facilitator ETH balance regularly',
      'Set up alerts for low balance conditions',
      'Implement proper logging and monitoring',
      'Use HTTPS in production environments',
      'Regularly update dependencies for security patches'
    ]
  },
  {
    category: 'For Receivers',
    practices: [
      'Always verify payments before processing',
      'Validate authorization validity periods',
      'Check payer addresses against known good addresses',
      'Implement proper error handling and logging',
      'Use HTTPS for all API communications',
      'Implement retry mechanisms with exponential backoff',
      'Monitor for suspicious payment patterns',
      'Regularly audit payment processing logic'
    ]
  },
  {
    category: 'For Payers',
    practices: [
      'Use secure random number generation for nonces',
      'Set appropriate validity periods for authorizations',
      'Never reuse nonces across different payments',
      'Store payment data securely before transmission',
      'Implement proper error handling',
      'Use secure communication channels',
      'Validate receiver addresses before sending',
      'Monitor payment status and handle failures'
    ]
  }
]

const securityCodeExample = `// Secure payment verification
class SecurePaymentProcessor {
  private readonly FACILITATOR_URL: string;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000; // 1 second

  constructor(facilitatorUrl: string) {
    this.FACILITATOR_URL = facilitatorUrl;
  }

  async verifyPaymentSecurely(paymentData: any): Promise<boolean> {
    try {
      // Validate input data
      if (!this.validatePaymentData(paymentData)) {
        throw new Error('Invalid payment data structure');
      }

      // Check authorization validity
      if (!this.isAuthorizationValid(paymentData.authorization)) {
        throw new Error('Authorization has expired or is invalid');
      }

      // Verify with facilitator with retry logic
      const verification = await this.verifyWithRetry(paymentData);
      
      return verification.isValid;
    } catch (error) {
      console.error('Payment verification failed:', error);
      return false;
    }
  }

  private validatePaymentData(data: any): boolean {
    return data && 
           data.signature && 
           data.authorization &&
           data.authorization.from &&
           data.authorization.to &&
           data.authorization.value &&
           data.authorization.validAfter &&
           data.authorization.validBefore &&
           data.authorization.nonce;
  }

  private isAuthorizationValid(auth: any): boolean {
    const now = Math.floor(Date.now() / 1000);
    return now >= parseInt(auth.validAfter) && now <= parseInt(auth.validBefore);
  }

  private async verifyWithRetry(paymentData: any, attempt = 1): Promise<any> {
    try {
      const response = await fetch(\`\${this.FACILITATOR_URL}/facilitator/verify\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
      }

      return await response.json();
    } catch (error) {
      if (attempt < this.MAX_RETRIES) {
        console.log(\`Verification attempt \${attempt} failed, retrying...\`);
        await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * attempt));
        return this.verifyWithRetry(paymentData, attempt + 1);
      }
      throw error;
    }
  }
}`

const environmentSecurityExample = `# .env file - NEVER commit this to version control
# Facilitator Configuration
FACILITATOR_PRIVATE_KEY=0x1234567890abcdef...
RPC_URL=https://rpc.hyperliquid.xyz/evm
USDT0_ADDRESS=0xB8CE59FC3717ada4C02eaDF9682A9e934F625ebb

# Server Configuration
NODE_ENV=production
PORT=3000

# Security Configuration
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
SENSITIVE_RATE_LIMIT_MAX_REQUESTS=10

# Monitoring
LOG_LEVEL=info
ENABLE_METRICS=true`

const dockerSecurityExample = `# Dockerfile with security best practices
FROM node:18-alpine

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy application code
COPY --chown=nextjs:nodejs . .

# Build application
RUN npm run build

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:3000/facilitator/health || exit 1

# Start application
CMD ["npm", "start"]`

export default function SecurityPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          Security Considerations
        </h1>
        <p className="text-xl text-gray-300">
          Comprehensive security guidelines and best practices for the USDT0 Facilitator
        </p>
      </div>

      {/* Security Features */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-white mb-8">Security Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {securityFeatures.map((feature, index) => (
            <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg hover:shadow-xl hover:border-gray-600 transition-all duration-200">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-primary-900 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300 mb-3">{feature.description}</p>
                  <p className="text-sm text-gray-400">{feature.details}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Best Practices */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-white mb-8">Security Best Practices</h2>
        <div className="space-y-8">
          {bestPractices.map((category, index) => (
            <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-white mb-4">{category.category}</h3>
              <ul className="space-y-2">
                {category.practices.map((practice, practiceIndex) => (
                  <li key={practiceIndex} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{practice}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Secure Implementation Example */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-white mb-8">Secure Implementation Example</h2>
        <p className="text-gray-300 mb-6">
          Example of a secure payment processor with proper validation, error handling, and retry logic.
        </p>
        <CodeBlock code={securityCodeExample} language="typescript" title="secure-payment-processor.ts" />
      </div>

      {/* Environment Security */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-white mb-8">Environment Security</h2>
        <p className="text-gray-300 mb-6">
          Secure configuration and environment variable management.
        </p>
        <CodeBlock code={environmentSecurityExample} language="bash" title=".env" />
      </div>

      {/* Docker Security */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-white mb-8">Docker Security</h2>
        <p className="text-gray-300 mb-6">
          Secure Docker configuration with non-root user and health checks.
        </p>
        <CodeBlock code={dockerSecurityExample} language="dockerfile" title="Dockerfile" />
      </div>

      {/* Security Checklist */}
      <div className="bg-red-900 border border-red-700 rounded-lg p-8">
        <div className="flex items-center mb-6">
          <AlertTriangle className="w-6 h-6 text-red-400 mr-3" />
          <h2 className="text-2xl font-bold text-red-200">Security Checklist</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-red-200 mb-4">Before Deployment</h3>
            <ul className="space-y-2 text-red-300">
              <li>☐ Private keys stored securely</li>
              <li>☐ Environment variables configured</li>
              <li>☐ HTTPS enabled in production</li>
              <li>☐ Rate limiting configured</li>
              <li>☐ Monitoring and logging enabled</li>
              <li>☐ Dependencies updated</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-200 mb-4">Ongoing Security</h3>
            <ul className="space-y-2 text-red-300">
              <li>☐ Regular security audits</li>
              <li>☐ Monitor for suspicious activity</li>
              <li>☐ Keep dependencies updated</li>
              <li>☐ Review access logs</li>
              <li>☐ Test backup and recovery</li>
              <li>☐ Update security policies</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Common Security Issues */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-white mb-8">Common Security Issues</h2>
        <div className="space-y-6">
          <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-200 mb-2">Private Key Exposure</h3>
            <p className="text-yellow-300 text-sm">
              Never hardcode private keys in source code or commit them to version control. 
              Always use environment variables or secure key management systems.
            </p>
          </div>
          
          <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-200 mb-2">Insufficient Input Validation</h3>
            <p className="text-yellow-300 text-sm">
              Always validate payment data structure and authorization validity before processing. 
              Implement proper error handling for invalid inputs.
            </p>
          </div>
          
          <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-200 mb-2">Missing Rate Limiting</h3>
            <p className="text-yellow-300 text-sm">
              Implement appropriate rate limiting to prevent API abuse and DDoS attacks. 
              Monitor for unusual request patterns.
            </p>
          </div>
          
          <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-200 mb-2">Insecure Communication</h3>
            <p className="text-yellow-300 text-sm">
              Always use HTTPS in production environments. Never send sensitive data over unencrypted connections.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
