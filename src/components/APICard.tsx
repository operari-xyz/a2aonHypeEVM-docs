import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface APICardProps {
  method: string
  path: string
  title: string
  description: string
  color: 'blue' | 'green' | 'gray' | 'yellow' | 'red' | 'purple' | 'pink'
  href?: string
  onClick?: () => void
}

const colorClasses = {
  blue: 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-300 border border-blue-500/30',
  green: 'bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-300 border border-green-500/30',
  gray: 'bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-300 border border-gray-500/30',
  yellow: 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-300 border border-yellow-500/30',
  red: 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-300 border border-red-500/30',
  purple: 'bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-300 border border-purple-500/30',
  pink: 'bg-gradient-to-r from-pink-500/20 to-pink-600/20 text-pink-300 border border-pink-500/30',
}

export default function APICard({ method, path, title, description, color, href, onClick }: APICardProps) {
  const cardContent = (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${colorClasses[color]} backdrop-blur-sm`}>
            {method}
          </span>
          <code className="text-sm font-mono text-gray-100 bg-dark-700/50 px-2 py-1 rounded border border-gray-600/50">{path}</code>
        </div>
        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-200" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-100 transition-colors duration-300">{title}</h3>
      <p className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors duration-300 leading-relaxed">{description}</p>
    </>
  )

  if (href) {
    return (
      <Link href={href} className="block">
        <div className="api-endpoint cursor-pointer group hover:scale-105 transition-all duration-300">
          {cardContent}
        </div>
      </Link>
    )
  }

  return (
    <div 
      className="api-endpoint cursor-pointer group hover:scale-105 transition-all duration-300" 
      onClick={onClick}
    >
      {cardContent}
    </div>
  )
}
