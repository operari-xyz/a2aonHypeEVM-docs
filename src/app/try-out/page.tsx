"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Send,
  Wallet,
  Loader2,
  CheckCircle,
  AlertCircle,
  XCircle,
  Bot,
  Zap,
} from "lucide-react";
import {
  AIAPIClient,
  PaymentObject,
  APIResponse,
  convertToSmallestUnits,
} from "@/lib/ai-client";
import { ethers } from "ethers";

export default function TryOutPage() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<APIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletConnecting, setWalletConnecting] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("0.1"); // Default 0.1 USDT0
  const [isRabbyAvailable, setIsRabbyAvailable] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [signing, setSigning] = useState(false);

  // Test prompts for HyperEVM
  const testPrompts = [
    "What is HyperEVM and how does it work?",
    "Explain USDT0 token and its features on HyperEVM",
    "How do I deploy a smart contract on HyperEVM?",
    "What are the gas fees like on HyperEVM compared to Ethereum?",
  ];

  // Initialize API client
  const aiClient = React.useMemo(() => new AIAPIClient(), []);

  // Check if Rabby wallet is available (client-side only)
  useEffect(() => {
    setMounted(true);

    // More robust Rabby detection that bypasses conflicts
    const detectRabby = () => {
      if (typeof window === "undefined") return false;

      // Method 1: Check if ethereum provider is Rabby
      if (window.ethereum?.isRabby) return true;

      // Method 2: Check for Rabby-specific properties
      if ((window as any).rabby) return true;
      if ((window as any).rabbyWallet) return true;

      // Method 3: Check for Rabby in extensions (if accessible)
      try {
        if ((window.ethereum as any)?.providers) {
          return (window.ethereum as any).providers.some(
            (provider: any) => provider.isRabby
          );
        }
      } catch (e) {
        // Ignore errors
      }

      // Method 4: Check for Rabby-specific methods
      if (window.ethereum && typeof window.ethereum.request === "function") {
        try {
          // Try to detect Rabby by checking for specific methods
          return (
            !!(window.ethereum as any).isRabby ||
            !!(window.ethereum as any).isRabbyWallet ||
            !!(window.ethereum as any).rabby
          );
        } catch (e) {
          // Ignore errors
        }
      }

      return false;
    };

    const isRabby = detectRabby();
    setIsRabbyAvailable(isRabby);


    // Check if wallet is already connected
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
           if (accounts && accounts.length > 0) {
             setWalletAddress(accounts[0]);
             setWalletConnected(true);
           }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
    };

    checkWalletConnection();
  }, []);

  // Listen for wallet account changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
       if (accounts.length > 0) {
         setWalletAddress(accounts[0]);
         setWalletConnected(true);
       } else {
         setWalletAddress(null);
         setWalletConnected(false);
       }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, []);

  // Helper function to get wallet provider
  const getWalletProvider = useCallback(() => {
    if (typeof window === "undefined") return null;
    return window.ethereum;
  }, []);

  const connectWallet = useCallback(async () => {
    if (!isRabbyAvailable) {
      alert(
        "Wallet not available. Please install a wallet like MetaMask or Rabby."
      );
      return;
    }

    setWalletConnecting(true);
    try {
      const provider = getWalletProvider();

      if (!provider) {
        throw new Error("No wallet provider found.");
      }

      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });

       if (accounts && accounts.length > 0) {
         setWalletAddress(accounts[0]);
         setWalletConnected(true);
       }
    } catch (error) {
      console.error("❌ Wallet connection error:", error);
      if (error instanceof Error && error.message.includes("User rejected")) {
        alert("Wallet connection was rejected. Please try again.");
      } else {
        alert(
          "Failed to connect wallet. Please make sure your wallet is unlocked and try again."
        );
      }
    } finally {
      setWalletConnecting(false);
    }
  }, [isRabbyAvailable, getWalletProvider]);

  const disconnectWallet = useCallback(() => {
    setWalletAddress(null);
    setWalletConnected(false);
  }, []);

  function formatNonce(nonce: string | number): string {
    let n =
      typeof nonce === "number" ? nonce.toString(16) : nonce.replace(/^0x/, "");
    n = n.padStart(64, "0"); // 32 bytes = 64 hex chars
    return "0x" + n;
  }

  // Helper function for real EIP-3009 wallet signing
  const signWithWallet = useCallback(
    async (authorization: any): Promise<string | null> => {
      const provider = getWalletProvider();

      if (!provider) {
        console.error("❌ No wallet provider available for signing");
        return null;
      }

      setSigning(true);
      try {
        // Ensure wallet is unlocked
        const currentAccounts = await provider.request({
          method: "eth_requestAccounts",
        });
        if (!currentAccounts || currentAccounts.length === 0) {
          alert(
            "No wallet accounts found. Please unlock your wallet and try again."
          );
          return null;
        }

        const actualAddress = currentAccounts[0];

        // Verify address match
        if (actualAddress.toLowerCase() !== authorization.from.toLowerCase()) {
          alert(
            `Wallet address mismatch. Please reconnect your wallet.\nCurrent: ${actualAddress}\nExpected: ${authorization.from}`
          );
          return null;
        }

         // EIP-712 domain and types - fetch from contract on-chain
         const USDT0_ADDRESS = "0xB8CE59FC3717ada4C02eaDF9682A9e934F625ebb";
         
         // Create a provider to fetch contract info
         const rpcProvider = new ethers.JsonRpcProvider('https://rpc.hyperliquid.xyz/evm');
         
         // Fetch domain info from contract on-chain
         let domainName = "USD₮0"; // fallback
         let domainVersion = "1"; // fallback
         
         try {
           // Try to fetch domain info from contract
           const contract = new ethers.Contract(USDT0_ADDRESS, [
             "function name() view returns (string)",
             "function version() view returns (string)",
             "function DOMAIN_SEPARATOR() view returns (bytes32)"
           ], rpcProvider);
           
           try {
             domainName = await contract.name();
           } catch (e) {
             // Use fallback
           }
           
           try {
             domainVersion = await contract.version();
           } catch (e) {
             // Use fallback
           }
         } catch (contractError) {
           // Use fallback values
         }

         const domain = {
           name: domainName,
           version: domainVersion,
           chainId: 999,
           verifyingContract: USDT0_ADDRESS,
         };

        const types = {
          TransferWithAuthorization: [
            { name: "from", type: "address" },
            { name: "to", type: "address" },
            { name: "value", type: "uint256" },
            { name: "validAfter", type: "uint256" },
            { name: "validBefore", type: "uint256" },
            { name: "nonce", type: "bytes32" },
          ],
        };
        
        // For RPC fallback, include EIP712Domain
        const typesWithDomain = {
          EIP712Domain: [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' },
          ],
          TransferWithAuthorization: [
            { name: "from", type: "address" },
            { name: "to", type: "address" },
            { name: "value", type: "uint256" },
            { name: "validAfter", type: "uint256" },
            { name: "validBefore", type: "uint256" },
            { name: "nonce", type: "bytes32" },
          ],
        };

        // Ensure addresses are properly checksummed
        const checksumFrom = ethers.getAddress(authorization.from);
        const checksumTo = ethers.getAddress(authorization.to);

        // Use checksummed addresses and proper types
        const message = {
          from: checksumFrom,
          to: checksumTo,
          value: authorization.value.toString(),
          validAfter: authorization.validAfter.toString(),
          validBefore: authorization.validBefore.toString(),
          nonce: formatNonce(authorization.nonce),
        };

        // Prepare the signing data
        const signingData = {
          domain,
          types,
          primaryType: "TransferWithAuthorization",
          message,
        };

        let signature: string;

         try {
           // Use signer's _signTypedData to ensure address and signature source can't diverge
           const walletSigner = new ethers.BrowserProvider(provider).getSigner();
           const signer = await walletSigner;
           
           signature = await signer.signTypedData(domain, types, message);
         } catch (signerError) {
           // Fallback to RPC method if signer method fails
           const rpcSigningData = {
             domain,
             types: typesWithDomain, // Use types with EIP712Domain for RPC
             primaryType: "TransferWithAuthorization",
             message,
           };
           
           signature = await provider.request({
             method: "eth_signTypedData_v4",
             params: [actualAddress, JSON.stringify(rpcSigningData)],
           });
         }


        return signature;
      } catch (error) {
        console.error("Signing error:", error);
        if (error instanceof Error && error.message.includes("User rejected")) {
          alert("Payment signature was rejected. Please try again.");
        } else if (
          error instanceof Error &&
          error.message.includes("chainId")
        ) {
          alert(
            "Please switch your wallet to HyperEVM network (Chain ID: 999)"
          );
        } else if (
          error instanceof Error &&
          error.message.includes("Signature address mismatch")
        ) {
          alert("Wallet address mismatch. Please reconnect your wallet.");
        } else {
          // Show the actual error message for debugging
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          alert(
            `Signing failed: ${errorMessage}\n\nPlease check console for details.`
          );
        }
        return null;
      } finally {
        setSigning(false);
      }
    },
    [getWalletProvider]
  );

  const generatePaymentObject =
    useCallback(async (): Promise<PaymentObject | null> => {
      if (!window.ethereum) {
        alert("No wallet available");
        return null;
      }

      try {
        // Get the wallet provider
        const provider = getWalletProvider();

        if (!provider) {
          alert(
            "No wallet provider found. Please make sure your wallet is installed."
          );
          return null;
        }

        // Get the wallet address
        const currentAccounts = await provider.request({
          method: "eth_accounts",
        });
        if (!currentAccounts || currentAccounts.length === 0) {
          alert("No wallet accounts found. Please connect your wallet.");
          return null;
        }

        const actualAddress = currentAccounts[0];

        // Update the stored wallet address if needed
        if (actualAddress.toLowerCase() !== walletAddress?.toLowerCase()) {
          setWalletAddress(actualAddress);
          setWalletConnected(true);
        }

        // Use the receiver address (where payment actually goes) - match backend exactly
        const receiverAddress = "0xA15e55079e01267676157869B1D0A3026aC280Ee";

        // Convert USDT0 amount to smallest units (6 decimals)
        const value = convertToSmallestUnits(paymentAmount);

        // Generate nonce exactly like backend: ethers.utils.hexlify(ethers.utils.randomBytes(32))
        const nonce = ethers.hexlify(ethers.randomBytes(32)); // Same as ethers.utils.hexlify(ethers.utils.randomBytes(32)) in v6
        const now = Math.floor(Date.now() / 1000);

        // Use the SAME timing as backend: validAfter = now
        const validAfter = now; // Match backend exactly
        const validBefore = now + 3600; // 1 hour from now

        // Create authorization object with proper types
        const authorization = {
          from: actualAddress, // Use the actual wallet address
          to: receiverAddress, // Use receiver address (where payment goes) - match backend
          value: value, // Keep as string for JSON serialization (will be converted to BigInt in EIP-712)
          validAfter: validAfter, // Keep as number for uint256
          validBefore: validBefore, // Keep as number for uint256
          nonce: nonce, // Keep as hex string for bytes32
        };

        const signature = await signWithWallet(authorization);

        if (!signature) {
          alert("Failed to get signature from wallet");
          return null;
        }

        // Create the payment object
        const paymentObject = {
          signature,
          authorization: {
            from: authorization.from,
            to: authorization.to,
            value: authorization.value.toString(),
            validAfter: authorization.validAfter.toString(),
            validBefore: authorization.validBefore.toString(),
            nonce: authorization.nonce,
          },
        };

        return paymentObject;
      } catch (error) {
        alert(
          `Failed to generate payment: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
        return null;
      }
    }, [walletAddress, paymentAmount, signWithWallet, getWalletProvider]);

  const callAI = useCallback(async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse(null);

    try {
      let payment: PaymentObject | null = null;

      if (walletConnected) {
        payment = await generatePaymentObject();
        if (!payment) {
          setResponse({
            success: false,
            error: "Failed to generate payment",
            timestamp: new Date().toISOString(),
          });
          setLoading(false);
          return;
        }
      }

      // Use the API client instead of direct fetch
      const apiResponse = await aiClient.callAI(
        prompt.trim(),
        payment || undefined
      );
      setResponse(apiResponse);
    } catch (error) {
      setResponse({
        success: false,
        error: `Network error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  }, [prompt, walletConnected, generatePaymentObject, aiClient]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    callAI();
  };

  const handleTestPromptClick = (prompt: string) => {
    setPrompt(prompt);
  };

  return (
    <div className="min-h-screen bg-dark-950 overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4">
            <div className="flex items-center space-x-3 mb-4 sm:mb-0">
              <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg">
                <Bot className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                  Try Out AI API
                </h1>
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <span className="text-gray-400 text-sm sm:text-base">
                    Powered by
                  </span>
                  <div className="flex items-center space-x-1 bg-gray-800 px-2 py-1 rounded-lg">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-sm flex items-center justify-center">
                      <span className="text-white text-xs font-bold">AI</span>
                    </div>
                    <span className="text-white font-semibold text-sm sm:text-base">
                      OpenAI
                    </span>
                  </div>
                  <span className="text-gray-400 text-sm sm:text-base">
                    • USDT0 Payment Required
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-dark-800/50 border border-gray-700/50 rounded-xl p-4 sm:p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              <span className="text-yellow-400 font-semibold text-sm sm:text-base">
                Real-time AI Processing
              </span>
            </div>
            <p className="text-gray-300 text-xs sm:text-sm text-center">
              Connect your wallet to pay with USDT0 and get AI responses powered
              by OpenAI. Minimum payment: 0.1 USDT0 per request.
            </p>
          </div>
        </div>

        {/* Wallet Connection */}
        <div className="bg-dark-800/50 border border-gray-700/50 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white">
                  Wallet Connection
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm">
                  {!mounted
                    ? "Loading..."
                    : walletConnected
                    ? `Connected: ${walletAddress?.slice(
                        0,
                        6
                      )}...${walletAddress?.slice(-4)}`
                    : "Connect your wallet to make payments"}
                </p>
              </div>
            </div>

            {!walletConnected ? (
              <button
                onClick={connectWallet}
                disabled={!mounted || !isRabbyAvailable || walletConnecting}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                {walletConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : !mounted ? (
                  <span>Loading...</span>
                ) : (
                  <span>
                    {isRabbyAvailable ? "Connect Wallet" : "Install Wallet"}
                  </span>
                )}
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                  <span className="text-green-400 font-medium text-sm sm:text-base">
                    Connected
                  </span>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="px-3 py-1 text-xs bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>

          {walletConnected && (
            <div className="mt-4 pt-4 border-t border-gray-700/50">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Payment Amount (USDT0)
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  value={paymentAmount}
                  readOnly
                  min="0.1"
                  step="0.1"
                  className="flex-1 px-3 py-2 bg-dark-700/50 border border-gray-600/50 rounded-lg text-gray-400 cursor-not-allowed text-sm"
                  placeholder="0.1"
                />
                <span className="text-gray-400 text-sm">USDT0</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Minimum: 0.1 USDT0</p>
            </div>
          )}
        </div>

        {/* AI Interface */}
        <div className="bg-dark-800/50 border border-gray-700/50 rounded-xl p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ask the AI anything
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="What would you like to know? Ask me anything..."
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-dark-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
                rows={3}
                disabled={loading}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>OpenAI GPT</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Real-time</span>
                </div>
                {walletConnected && (
                  <div className="flex items-center space-x-1">
                    <Wallet className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{paymentAmount} USDT0</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || signing || !prompt.trim()}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                {signing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing Payment...</span>
                  </>
                ) : loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Request</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Test Prompts */}
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-700/50">
            <div className="flex items-center space-x-2 mb-3">
              <Zap className="w-4 h-4 text-yellow-400" />
              <h4 className="text-sm font-medium text-gray-300">
                Quick Test Prompts
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {testPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleTestPromptClick(prompt)}
                  className="text-left px-3 py-2 bg-dark-700/50 hover:bg-dark-700 border border-gray-600/50 hover:border-gray-500 rounded-lg text-gray-300 hover:text-white transition-all duration-200 text-xs sm:text-sm"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Response Display */}
          {response && (
            <div className="mt-8 pt-6 border-t border-gray-700/50">
              <div className="flex items-center space-x-2 mb-4">
                {response.success ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
                <h3 className="text-lg font-semibold text-white">
                  {response.success ? "AI Response" : "Error"}
                </h3>
              </div>

              {response.success ? (
                <div className="space-y-4">
                  <div className="bg-dark-700/50 border border-gray-600/50 rounded-lg p-4">
                    <p className="text-gray-300 whitespace-pre-wrap">
                      {response.data}
                    </p>
                  </div>

                  <div className="bg-dark-700/30 border border-gray-600/30 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-400 mb-3">
                      Payment Status
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">Verified:</span>
                        <span
                          className={
                            response.paymentStatus.verified
                              ? "text-green-400"
                              : "text-red-400"
                          }
                        >
                          {response.paymentStatus.verified ? "Yes" : "No"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">Settled:</span>
                        <span
                          className={
                            response.paymentStatus.settled
                              ? "text-green-400"
                              : "text-red-400"
                          }
                        >
                          {response.paymentStatus.settled ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>
                    {response.paymentStatus.transactionHash && (
                      <div className="mt-3 pt-3 border-t border-gray-600/30">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-400">
                            Transaction Hash
                          </span>
                        </div>
                        <div className="bg-dark-800/50 border border-gray-600/30 rounded-lg p-3">
                          <code className="text-blue-300 text-xs break-all font-mono">
                            {response.paymentStatus.transactionHash}
                          </code>
                        </div>
                        <div className="mt-2 flex space-x-2">
                          <button
                            onClick={() =>
                              navigator.clipboard.writeText(
                                response.paymentStatus.transactionHash!
                              )
                            }
                            className="px-2 py-1 text-xs bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
                          >
                            Copy
                          </button>
                          <a
                            href={`https://etherscan.io/tx/${response.paymentStatus.transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors"
                          >
                            View on Etherscan
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-red-400 font-medium break-words">
                        {response.error}
                      </p>
                      {"message" in response && response.message && (
                        <div className="mt-2">
                          <details className="text-red-300 text-sm">
                            <summary className="cursor-pointer hover:text-red-200">
                              Show Details
                            </summary>
                            <div className="mt-2 p-3 bg-red-900/30 rounded border max-h-40 overflow-y-auto">
                              <pre className="text-xs whitespace-pre-wrap break-words">
                                {response.message}
                              </pre>
                            </div>
                          </details>
                        </div>
                      )}
                      <p className="text-red-200 text-xs mt-2">
                        {new Date(response.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-500 px-4">
          <p>
            This demo uses the USDT0 Facilitator API with OpenAI integration.
            Payments are processed on HyperEVM using EIP-3009
            transferWithAuthorization.
          </p>
        </div>
      </div>
    </div>
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: {
      isRabby?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (
        event: string,
        callback: (...args: any[]) => void
      ) => void;
    };
    rabby?: {
      isRabby?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (
        event: string,
        callback: (...args: any[]) => void
      ) => void;
    };
    rabbyWallet?: {
      isRabby?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (
        event: string,
        callback: (...args: any[]) => void
      ) => void;
    };
  }
}

