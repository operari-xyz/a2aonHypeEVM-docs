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
        <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mr-4 group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-300">
          <Icon className="w-7 h-7 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
        </div>
        <h3 className="text-lg font-semibold text-white group-hover:text-purple-100 transition-colors duration-300">{title}</h3>
      </div>
      <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300 leading-relaxed">{description}</p>
    </div>
  )
}
