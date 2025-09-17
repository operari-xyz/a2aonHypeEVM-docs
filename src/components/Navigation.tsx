'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Zap, BookOpen, Code, Shield, Settings } from 'lucide-react'

const navigation = [
  { name: 'Overview', href: '/', icon: BookOpen },
  { name: 'API Reference', href: '/api', icon: Code },
  { name: 'Examples', href: '/examples', icon: Code },
  // { name: 'Security', href: '/security', icon: Shield },
  // { name: 'Deployment', href: '/deployment', icon: Settings },
]

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="bg-dark-900/80 backdrop-blur-md border-b border-gray-700/50 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex-shrink-0 shadow-lg group-hover:shadow-purple-500/25 transition-all duration-200 group-hover:scale-105">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white whitespace-nowrap group-hover:text-purple-400 transition-colors duration-200">
                USDT0 Facilitator
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`nav-link flex-row ${isActive ? 'active' : ''}`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Link>
              )
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="text-gray-300 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark-800/90 backdrop-blur-md border-t border-gray-700/50">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`nav-link flex items-center ${isActive ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="w-4 h-4 mr-2 flex-shrink-0" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}
