'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface CodeBlockProps {
  code: string
  language?: string
  title?: string
}

export default function CodeBlock({ code, language = 'typescript', title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative">
      {title && (
        <div className="bg-gray-700 text-gray-200 px-4 py-2 text-sm font-medium rounded-t-lg border-b border-gray-600">
          {title}
        </div>
      )}
      <div className="relative group">
        <div className={`${title ? 'rounded-b-lg' : 'rounded-lg'} overflow-hidden`}>
          <SyntaxHighlighter
            language={language}
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              background: '#1f2937',
              fontSize: '0.875rem',
              lineHeight: '1.5',
              padding: '1rem',
            }}
            showLineNumbers={false}
            wrapLines={true}
            wrapLongLines={true}
          >
            {code}
          </SyntaxHighlighter>
        </div>
        <button
          onClick={handleCopy}
          className="absolute top-4 right-4 p-2 bg-gray-600 hover:bg-gray-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4 text-gray-200" />
          )}
        </button>
      </div>
    </div>
  )
}
