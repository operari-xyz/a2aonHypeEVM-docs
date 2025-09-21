import { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
}

export default function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="feature-card group">
      <div className="flex items-center mb-4">
        <div className="w-14 h-14 bg-gradient-to-br from-gray-600/20 to-gray-700/20 rounded-xl flex items-center justify-center mr-4 group-hover:from-gray-600/30 group-hover:to-gray-700/30 transition-all duration-300">
          <Icon className="w-7 h-7 text-gray-300 group-hover:text-gray-200 transition-colors duration-300" />
        </div>
        <h3 className="text-lg font-semibold text-white group-hover:text-gray-100 transition-colors duration-300">{title}</h3>
      </div>
      <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300 leading-relaxed">{description}</p>
    </div>
  )
}
