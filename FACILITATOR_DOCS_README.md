# HyperEVM USDT0 Facilitator - Complete Documentation

A comprehensive documentation for the HyperEVM USDT0 Custom Facilitator service that enables agent-to-agent USDT0 transactions using EIP-3009 `transferWithAuthorization` with **facilitator-paid gas fees**.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Key Features](#key-features)
4. [Prerequisites](#prerequisites)
5. [Installation & Setup](#installation--setup)
6. [API Documentation](#api-documentation)
7. [Usage Examples](#usage-examples)
8. [Integration Guide](#integration-guide)
9. [Security Considerations](#security-considerations)
10. [Deployment](#deployment)
11. [Monitoring & Maintenance](#monitoring--maintenance)
12. [Troubleshooting](#troubleshooting)

## 🎯 Overview

The HyperEVM USDT0 Facilitator is a custom service that enables seamless USDT0 transfers between agents without requiring receivers to hold ETH or expose private keys. The facilitator acts as a trusted intermediary that pays gas fees and executes transfers on behalf of receivers.

### What It Does

- **Enables USDT0 transfers** using EIP-3009 `transferWithAuthorization`
- **Pays gas fees** from facilitator's wallet (receivers don't need ETH)
- **Verifies payment authorizations** before execution
- **Provides REST API** for easy integration
- **Includes rate limiting** and security features
- **Supports concurrent requests** from multiple receivers

### Key Benefits

- ✅ **No private key sharing** - Receivers never expose private keys
- ✅ **No ETH required** - Receivers don't need ETH for gas
- ✅ **Seamless UX** - Simple API calls for payment processing
- ✅ **Secure** - EIP-712 signature verification
- ✅ **Rate limited** - Built-in protection against abuse
- ✅ **Concurrent** - Multiple receivers can process payments simultaneously

## 🏗️ Architecture

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌─────────────┐
│    Payer    │───▶│   Receiver   │───▶│ Facilitator │───▶│ HyperEVM    │
│             │    │              │    │             │    │ (USDT0)     │
│ - Signs     │    │ - Receives   │    │ - Verifies  │    │             │
│   auth      │    │   payment    │    │ - Pays gas  │    │ - Executes  │
│ - Sends     │    │ - Calls API  │    │ - Executes  │    │   transfer  │
│   data      │    │              │    │   transfer  │    │             │
└─────────────┘    └──────────────┘    └─────────────┘    └─────────────┘
```

### Workflow

1. **Payer** creates EIP-712 signed authorization
2. **Payer** sends payment data to **Receiver** via communication channel
3. **Receiver** calls `/verify` endpoint (optional but recommended)
4. **Receiver** calls `/settle` endpoint (no private key needed)
5. **Facilitator** pays gas fees and executes transfer
6. **USDT0** is transferred from payer to receiver

## 🔧 Key Features

### Core Functionality
- **EIP-712 Signature Verification** - Secure payment authorization
- **Gas Fee Management** - Facilitator pays all gas costs
- **Payment Validation** - Comprehensive authorization checks
- **Transaction Execution** - Automated USDT0 transfers
- **Rate Limiting** - Protection against API abuse

### API Features
- **RESTful API** - Easy integration with any language
- **JSON Responses** - Structured data format
- **Error Handling** - Comprehensive error messages
- **Health Checks** - Service monitoring endpoints
- **Gas Estimation** - Real-time gas cost information

### Security Features
- **No Private Key Exposure** - Receivers never share private keys
- **Signature Verification** - EIP-712 cryptographic validation
- **Rate Limiting** - Prevents API abuse
- **Input Validation** - Comprehensive request validation
- **Error Sanitization** - Safe error responses

## 📋 Prerequisites

### System Requirements
- **Node.js** 18+ 
- **TypeScript** 5.2+
- **Access to HyperEVM RPC** (https://rpc.hyperliquid.xyz/evm)
- **Facilitator ETH Balance** (for gas payments)

### Environment Requirements
- **USDT0 Contract Address**: `0xB8CE59FC3717ada4C02eaDF9682A9e934F625ebb`
- **Chain ID**: 999 (HyperEVM)
- **Facilitator Private Key** (for gas payments)

## 🚀 Installation & Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd agent-facilitator
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file:

```env
# HyperEVM Configuration
RPC_URL=https://rpc.hyperliquid.xyz/evm
CHAIN_ID=999

# USDT0 Contract
USDT0_ADDRESS=0xB8CE59FC3717ada4C02eaDF9682A9e934F625ebb

# Server Configuration
PORT=3000
NODE_ENV=development

# Facilitator Wallet (REQUIRED - pays gas fees)
FACILITATOR_PRIVATE_KEY=your_facilitator_private_key_here
```

### 4. Build and Start

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/facilitator
```

### Authentication
No authentication required - the facilitator is designed for public use.

### Rate Limiting
- **General Endpoints**: 100 requests per 15 minutes per IP
- **Sensitive Endpoints**: 10 requests per minute per IP

### Endpoints

#### 1. POST /verify

Verify a payment authorization without executing it.

**Request Body:**
```json
{
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
```

**Response:**
```json
{
  "isValid": true,
  "payer": "0x...",
  "gasEstimate": {
    "facilitatorEthBalance": "0.1",
    "estimatedGasCost": "0.002",
    "hasEnoughEth": true
  }
}
```

**Error Response:**
```json
{
  "isValid": false,
  "invalidReason": "authorization_expired",
  "payer": "0x..."
}
```

#### 2. POST /settle

Execute a payment authorization using facilitator's wallet.

**Request Body:**
```json
{
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
}
```

**Response:**
```json
{
  "success": true,
  "transaction": "0x...",
  "payer": "0x...",
  "receiver": "0x...",
  "amount": "1000000",
  "blockNumber": 12345,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "errorReason": "Insufficient ETH for gas",
  "payer": "0x...",
  "receiver": "0x...",
  "amount": "1000000",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### 3. GET /health

Check service health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### 4. GET /gas-estimate

Get facilitator's gas balance and cost estimate.

**Response:**
```json
{
  "facilitatorEthBalance": "0.1",
  "estimatedGasCost": "0.002",
  "hasEnoughEth": true
}
```

#### 5. GET /facilitator-info

Get facilitator wallet information.

**Response:**
```json
{
  "address": "0x...",
  "ethBalance": "0.1",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 💻 Usage Examples

### Complete Workflow Example

```typescript
import { PayerExample } from './examples/payer-example';
import { ReceiverExample } from './examples/receiver-example';

// Step 1: Payer creates payment
const payer = new PayerExample('payer_private_key');
const paymentData = await payer.createPaymentData(
  '0xReceiverAddress',
  '10.0' // 10 USDT0
);

// Step 2: Payer sends to receiver (via your communication channel)
await payer.sendPaymentToReceiver('https://receiver.com/api/payments', paymentData);

// Step 3: Receiver processes payment
const receiver = new ReceiverExample(); // No private key needed!

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
```

### Payer Implementation

```typescript
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
}
```

### Receiver Implementation

```typescript
class ReceiverService {
  async processPayment(facilitatorUrl: string, paymentData: any) {
    // Step 1: Verify payment
    const verifyResponse = await fetch(`${facilitatorUrl}/facilitator/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });
    
    const verification = await verifyResponse.json();
    
    if (!verification.isValid) {
      throw new Error(`Payment invalid: ${verification.invalidReason}`);
    }

    // Step 2: Settle payment
    const settleResponse = await fetch(`${facilitatorUrl}/facilitator/settle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payment: paymentData })
    });
    
    const settlement = await settleResponse.json();
    
    if (!settlement.success) {
      throw new Error(`Settlement failed: ${settlement.errorReason}`);
    }

    return settlement;
  }
}
```

### cURL Examples

```bash
# Verify payment
curl -X POST http://localhost:3000/facilitator/verify \
  -H "Content-Type: application/json" \
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
  }'

# Settle payment
curl -X POST http://localhost:3000/facilitator/settle \
  -H "Content-Type: application/json" \
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
  }'

# Check health
curl http://localhost:3000/facilitator/health

# Get gas estimate
curl http://localhost:3000/facilitator/gas-estimate
```

## 🔗 Integration Guide

### For Payers

1. **Create Payment Authorization**
   - Use EIP-712 domain and types provided
   - Sign authorization with payer's private key
   - Include validity period and unique nonce

2. **Send to Receiver**
   - Use your communication channel (API, messaging, etc.)
   - Include both signature and authorization data
   - Handle receiver's response appropriately

### For Receivers

1. **Receive Payment Data**
   - Accept payment data from payer
   - Validate data format and structure
   - Store for processing

2. **Call Facilitator API**
   - Use `/verify` endpoint to check validity (optional)
   - Use `/settle` endpoint to execute transfer
   - Handle responses and errors appropriately

3. **Update Your System**
   - Process successful payments
   - Update user balances
   - Send notifications
   - Handle failed payments

### Error Handling

```typescript
try {
  const result = await receiver.processPayment(facilitatorUrl, paymentData);
  // Handle success
} catch (error) {
  if (error.message.includes('authorization_expired')) {
    // Handle expired authorization
  } else if (error.message.includes('Insufficient ETH')) {
    // Handle facilitator gas shortage
  } else {
    // Handle other errors
  }
}
```

## 🔒 Security Considerations

### For Facilitators

1. **Private Key Security**
   - Store facilitator private key securely
   - Use environment variables or secure key management
   - Never commit private keys to version control

2. **Gas Management**
   - Monitor facilitator ETH balance
   - Set up alerts for low balance
   - Consider automatic top-up mechanisms

3. **Rate Limiting**
   - Configure appropriate rate limits
   - Monitor for abuse patterns
   - Implement IP blocking if necessary

### For Receivers

1. **Payment Validation**
   - Always verify payments before processing
   - Check authorization validity periods
   - Validate payer addresses

2. **Error Handling**
   - Implement proper error handling
   - Log failed payments for analysis
   - Implement retry mechanisms where appropriate

3. **Data Security**
   - Secure storage of payment data
   - Implement proper access controls
   - Regular security audits

## 🚀 Deployment

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

```bash
# Build image
docker build -t hyevm-facilitator .

# Run container
docker run -p 3000:3000 \
  -e RPC_URL=https://rpc.hyperliquid.xyz/evm \
  -e USDT0_ADDRESS=0xB8CE59FC3717ada4C02eaDF9682A9e934F625ebb \
  -e FACILITATOR_PRIVATE_KEY=your_private_key \
  hyevm-facilitator
```

### PM2 Deployment

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start dist/index.js --name facilitator

# Save PM2 configuration
pm2 save
pm2 startup
```

### Environment Variables

```env
# Production environment
NODE_ENV=production
PORT=3000
RPC_URL=https://rpc.hyperliquid.xyz/evm
USDT0_ADDRESS=0xB8CE59FC3717ada4C02eaDF9682A9e934F625ebb
FACILITATOR_PRIVATE_KEY=your_production_private_key
```

## 📊 Monitoring & Maintenance

### Health Monitoring

```bash
# Check service health
curl http://localhost:3000/facilitator/health

# Check facilitator balance
curl http://localhost:3000/facilitator/facilitator-info
```

### Logging

The service includes comprehensive logging for:
- API requests and responses
- Payment processing events
- Error conditions
- Gas estimation results

### Metrics to Monitor

1. **Service Health**
   - Uptime and availability
   - Response times
   - Error rates

2. **Payment Processing**
   - Successful transactions
   - Failed transactions
   - Processing times

3. **Gas Management**
   - Facilitator ETH balance
   - Gas cost trends
   - Low balance alerts

### Maintenance Tasks

1. **Regular Monitoring**
   - Check facilitator ETH balance daily
   - Monitor error logs
   - Review rate limiting effectiveness

2. **Updates**
   - Keep dependencies updated
   - Monitor for security patches
   - Test updates in staging environment

## 🔧 Troubleshooting

### Common Issues

#### 1. "Insufficient ETH for gas"
**Cause**: Facilitator wallet has insufficient ETH balance
**Solution**: Add ETH to facilitator wallet

#### 2. "Invalid signature"
**Cause**: EIP-712 signature verification failed
**Solution**: Check payer's signing implementation

#### 3. "Authorization expired"
**Cause**: Payment authorization is past validBefore time
**Solution**: Payer needs to create new authorization

#### 4. "Rate limit exceeded"
**Cause**: Too many requests from same IP
**Solution**: Implement exponential backoff

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
DEBUG=true
```

### Support

For technical support:
1. Check logs for error details
2. Verify environment configuration
3. Test with health endpoints
4. Review rate limiting status

## 📝 Additional Notes

### USDT0 Specifications
- **Decimals**: 6 (like USDC)
- **Contract**: `0xB8CE59FC3717ada4C02eaDF9682A9e934F625ebb`
- **Chain**: HyperEVM (Chain ID: 999)

### EIP-712 Configuration
- **Domain Name**: "USD₮0"
- **Version**: "1"
- **Chain ID**: 999
- **Verifying Contract**: USDT0 contract address

### Gas Considerations
- **Estimated Gas**: ~100,000 gas units per transfer
- **Gas Price**: Dynamic based on network conditions
- **Facilitator Responsibility**: Pays all gas costs

### Best Practices
1. **Always verify payments** before settling
2. **Monitor facilitator balance** regularly
3. **Implement proper error handling**
4. **Use HTTPS in production**
5. **Keep dependencies updated**

---

This documentation provides comprehensive coverage of the HyperEVM USDT0 Facilitator service. For additional support or questions, please refer to the codebase examples or create an issue in the repository.
