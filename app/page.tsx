import Link from 'next/link';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>DPO Global | Web3 Swap Generator for Digital Asset Securities</title>
        <meta name="description" content="Generate compliant Web3 token swap interfaces for the DPO ecosystem on Arbitrum. Perfect for SMEs raising capital through digital asset securities." />
        <meta name="keywords" content="DPO Global, Web3 swap, Arbitrum, digital asset securities, tokenization, SME financing, blockchain" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          {/* Header with DPO branding */}
          <div className="bg-black text-white p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">
                <span className="text-green-400">DPO</span> Swap Generator
              </h1>
              <span className="text-sm bg-green-500 px-3 py-1 rounded-full">Arbitrum Network</span>
            </div>
            <p className="mt-2 text-gray-300">
              Powered by DPO Global's Layer II Blockchain Ecosystem
            </p>
          </div>

          {/* Main content */}
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Generate Compliant Token Swap Interfaces
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Create ready-to-deploy code for secure digital asset security swaps on the DPO ecosystem. 
              Our generator helps SMEs and investors comply with regulatory standards while providing 
              seamless access to capital markets through blockchain technology.
            </p>
            
            <div className="flex justify-center space-x-4 mb-10">
              <Link 
                href="/generate"
                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                Generate Swap Code
              </Link>
              <Link 
                href="/learn"
                className="px-8 py-3 border border-green-600 text-green-600 font-medium rounded-lg transition-all duration-300 hover:bg-green-50"
              >
                Learn About DPO
              </Link>
            </div>
            
            {/* Features grid */}
            <div className="mt-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">
                DPO Ecosystem Advantages
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <div className="flex items-center mb-3">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-800">Regulatory Compliance</h4>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Built-in compliance with SEC Transfer Agent standards and DTCC compatibility for digital asset securities.
                  </p>
                </div>

                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <div className="flex items-center mb-3">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-800">SME Financing</h4>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Bridge the $5.2 trillion SME financing gap with our decentralized capital raising platform.
                  </p>
                </div>

                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <div className="flex items-center mb-3">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-800">ERC-20 on Arbitrum</h4>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Leverage Layer 2 scaling with our DPO Tokens built on Arbitrum Network for fast, low-cost transactions.
                  </p>
                </div>

                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <div className="flex items-center mb-3">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-800">Institutional Backing</h4>
                  </div>
                  <p className="text-gray-600 text-sm">
                    DPO Tokens are backed by gold, silver, and real estate assets, providing tangible value.
                  </p>
                </div>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-center text-gray-500 text-sm uppercase tracking-wider mb-6">
                Trusted By SMEs Worldwide
              </h3>
              <div className="flex flex-wrap justify-center gap-8 items-center">
                <span className="text-gray-700 font-medium">13% Annual Returns</span>
                <span className="text-gray-700 font-medium">40% Profit Sharing</span>
                <span className="text-gray-700 font-medium">KYC/AML Compliant</span>
                <span className="text-gray-700 font-medium">Banking License</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}