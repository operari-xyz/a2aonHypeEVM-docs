import { Server, Container, Cloud, Monitor, Settings, CheckCircle, AlertCircle } from 'lucide-react'
import CodeBlock from '@/components/CodeBlock'

const deploymentOptions = [
  {
    icon: Container,
    title: 'Docker Deployment',
    description: 'Containerized deployment with Docker',
    features: ['Easy scaling', 'Consistent environment', 'Portable across platforms']
  },
  {
    icon: Server,
    title: 'PM2 Deployment',
    description: 'Process management with PM2',
    features: ['Process monitoring', 'Auto-restart', 'Load balancing']
  },
  {
    icon: Cloud,
    title: 'Cloud Deployment',
    description: 'Deploy to cloud platforms',
    features: ['Auto-scaling', 'Managed services', 'High availability']
  }
]

const dockerExample = `# Dockerfile
FROM node:18-alpine

# Create non-root user for security
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

const dockerComposeExample = `# docker-compose.yml
version: '3.8'

services:
  facilitator:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - RPC_URL=https://rpc.hyperliquid.xyz/evm
      - USDT0_ADDRESS=0xB8CE59FC3717ada4C02eaDF9682A9e934F625ebb
      - FACILITATOR_PRIVATE_KEY=\${FACILITATOR_PRIVATE_KEY}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/facilitator/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - facilitator
    restart: unless-stopped`

const pm2Example = `# ecosystem.config.js
module.exports = {
  apps: [{
    name: 'facilitator',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
      RPC_URL: 'https://rpc.hyperliquid.xyz/evm',
      USDT0_ADDRESS: '0xB8CE59FC3717ada4C02eaDF9682A9e934F625ebb',
      FACILITATOR_PRIVATE_KEY: process.env.FACILITATOR_PRIVATE_KEY
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
}`

const nginxConfig = `# nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream facilitator {
        server facilitator:3000;
    }

    server {
        listen 80;
        server_name your-domain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        location / {
            proxy_pass http://facilitator;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Rate limiting
        location /facilitator/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://facilitator;
        }
    }

    # Rate limiting zones
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
}`

const environmentExample = `# Production environment variables
NODE_ENV=production
PORT=3000

# HyperEVM Configuration
RPC_URL=https://rpc.hyperliquid.xyz/evm
CHAIN_ID=999

# USDT0 Contract
USDT0_ADDRESS=0xB8CE59FC3717ada4C02eaDF9682A9e934F625ebb

# Facilitator Wallet (REQUIRED)
FACILITATOR_PRIVATE_KEY=your_production_private_key_here

# Security Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
SENSITIVE_RATE_LIMIT_MAX_REQUESTS=10

# Monitoring
LOG_LEVEL=info
ENABLE_METRICS=true

# Health Check
HEALTH_CHECK_INTERVAL=30000`

const monitoringScript = `#!/bin/bash
# monitoring.sh - Health monitoring script

FACILITATOR_URL="http://localhost:3000"
LOG_FILE="/var/log/facilitator-monitor.log"

check_health() {
    local response=$(curl -s -o /dev/null -w "%{http_code}" "$FACILITATOR_URL/facilitator/health")
    
    if [ "$response" = "200" ]; then
        echo "$(date): Health check passed" >> "$LOG_FILE"
        return 0
    else
        echo "$(date): Health check failed - HTTP $response" >> "$LOG_FILE"
        return 1
    fi
}

check_balance() {
    local balance=$(curl -s "$FACILITATOR_URL/facilitator/facilitator-info" | jq -r '.ethBalance')
    local threshold="0.01"
    
    if (( $(echo "$balance < $threshold" | bc -l) )); then
        echo "$(date): WARNING - Low ETH balance: $balance" >> "$LOG_FILE"
        # Send alert notification here
    fi
}

# Run checks
check_health
check_balance`

const deploymentSteps = [
  {
    title: 'Prepare Environment',
    steps: [
      'Install Node.js 18+ and npm',
      'Clone the repository',
      'Install dependencies with `npm install`',
      'Configure environment variables',
      'Build the application with `npm run build`'
    ]
  },
  {
    title: 'Docker Deployment',
    steps: [
      'Create Dockerfile and docker-compose.yml',
      'Build Docker image with `docker build -t facilitator .`',
      'Run container with `docker-compose up -d`',
      'Verify deployment with health check endpoint',
      'Configure reverse proxy (nginx) if needed'
    ]
  },
  {
    title: 'PM2 Deployment',
    steps: [
      'Install PM2 globally with `npm install -g pm2`',
      'Create ecosystem.config.js file',
      'Start application with `pm2 start ecosystem.config.js`',
      'Save PM2 configuration with `pm2 save`',
      'Set up PM2 startup with `pm2 startup`'
    ]
  },
  {
    title: 'Production Setup',
    steps: [
      'Configure SSL certificates',
      'Set up domain and DNS',
      'Configure firewall rules',
      'Set up monitoring and logging',
      'Configure backup strategies'
    ]
  }
]

export default function DeploymentPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          Deployment Guide
        </h1>
        <p className="text-xl text-gray-300">
          Complete deployment guide for the HyperEVM USDT0 Facilitator service
        </p>
      </div>

      {/* Deployment Options */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-white mb-8">Deployment Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {deploymentOptions.map((option, index) => (
            <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg hover:shadow-xl hover:border-gray-600 transition-all duration-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-900 rounded-lg flex items-center justify-center mr-4">
                  <option.icon className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">{option.title}</h3>
              </div>
              <p className="text-gray-300 mb-4">{option.description}</p>
              <ul className="space-y-1">
                {option.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Docker Deployment */}
      <div className="mb-16">
        <div className="flex items-center mb-6">
          <Container className="w-6 h-6 text-primary-400 mr-3" />
          <h2 className="text-2xl font-bold text-white">Docker Deployment</h2>
        </div>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Dockerfile</h3>
            <CodeBlock code={dockerExample} language="dockerfile" title="Dockerfile" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Docker Compose</h3>
            <CodeBlock code={dockerComposeExample} language="yaml" title="docker-compose.yml" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Nginx Configuration</h3>
            <CodeBlock code={nginxConfig} language="nginx" title="nginx.conf" />
          </div>
        </div>
      </div>

      {/* PM2 Deployment */}
      <div className="mb-16">
        <div className="flex items-center mb-6">
          <Server className="w-6 h-6 text-primary-400 mr-3" />
          <h2 className="text-2xl font-bold text-white">PM2 Deployment</h2>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">PM2 Configuration</h3>
          <CodeBlock code={pm2Example} language="javascript" title="ecosystem.config.js" />
        </div>
      </div>

      {/* Environment Configuration */}
      <div className="mb-16">
        <div className="flex items-center mb-6">
          <Settings className="w-6 h-6 text-primary-400 mr-3" />
          <h2 className="text-2xl font-bold text-white">Environment Configuration</h2>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Production Environment Variables</h3>
          <CodeBlock code={environmentExample} language="bash" title=".env.production" />
        </div>
      </div>

      {/* Monitoring */}
      <div className="mb-16">
        <div className="flex items-center mb-6">
          <Monitor className="w-6 h-6 text-primary-400 mr-3" />
          <h2 className="text-2xl font-bold text-white">Monitoring & Health Checks</h2>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Health Monitoring Script</h3>
            <CodeBlock code={monitoringScript} language="bash" title="monitoring.sh" />
          </div>

          <div className="bg-blue-900 border border-blue-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-200 mb-4">Monitoring Endpoints</h3>
            <div className="space-y-2 text-blue-300">
              <div><code className="bg-blue-800 px-1 rounded">GET /facilitator/health</code> - Service health status</div>
              <div><code className="bg-blue-800 px-1 rounded">GET /facilitator/gas-estimate</code> - Gas balance and estimates</div>
              <div><code className="bg-blue-800 px-1 rounded">GET /facilitator/facilitator-info</code> - Facilitator wallet info</div>
            </div>
          </div>
        </div>
      </div>

      {/* Deployment Steps */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-white mb-8">Step-by-Step Deployment</h2>
        <div className="space-y-8">
          {deploymentSteps.map((section, index) => (
            <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-white mb-4">{section.title}</h3>
              <ol className="space-y-2">
                {section.steps.map((step, stepIndex) => (
                  <li key={stepIndex} className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary-900 text-primary-400 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                      {stepIndex + 1}
                    </span>
                    <span className="text-gray-300">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>

      {/* Production Checklist */}
      <div className="bg-green-900 border border-green-700 rounded-lg p-8">
        <div className="flex items-center mb-6">
          <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
          <h2 className="text-2xl font-bold text-green-200">Production Deployment Checklist</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-green-200 mb-4">Before Deployment</h3>
            <ul className="space-y-2 text-green-300">
              <li>☐ Environment variables configured</li>
              <li>☐ SSL certificates installed</li>
              <li>☐ Domain and DNS configured</li>
              <li>☐ Firewall rules set up</li>
              <li>☐ Monitoring configured</li>
              <li>☐ Backup strategy implemented</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-200 mb-4">After Deployment</h3>
            <ul className="space-y-2 text-green-300">
              <li>☐ Health checks passing</li>
              <li>☐ SSL certificate valid</li>
              <li>☐ API endpoints responding</li>
              <li>☐ Monitoring alerts configured</li>
              <li>☐ Load testing completed</li>
              <li>☐ Documentation updated</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-white mb-8">Troubleshooting</h2>
        <div className="space-y-6">
          <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-200 mb-2">Common Issues</h3>
            <div className="space-y-2 text-yellow-300 text-sm">
              <div><strong>Container won't start:</strong> Check environment variables and port conflicts</div>
              <div><strong>Health check failing:</strong> Verify facilitator ETH balance and RPC connectivity</div>
              <div><strong>Rate limiting issues:</strong> Check nginx configuration and rate limit settings</div>
              <div><strong>SSL certificate errors:</strong> Verify certificate validity and nginx configuration</div>
            </div>
          </div>
          
          <div className="bg-red-900 border border-red-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-200 mb-2">Critical Issues</h3>
            <div className="space-y-2 text-red-300 text-sm">
              <div><strong>Insufficient ETH balance:</strong> Add ETH to facilitator wallet immediately</div>
              <div><strong>Private key exposure:</strong> Rotate keys and update environment variables</div>
              <div><strong>RPC endpoint down:</strong> Switch to backup RPC endpoint</div>
              <div><strong>High error rates:</strong> Check logs and consider scaling resources</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
