import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '健康生活系统',
  description: '管理你的目标、日程、饮食和健康建议',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <nav className="bg-primary-600 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold">🌿 健康生活</span>
              </div>
              <div className="flex space-x-4">
                <a href="/" className="px-3 py-2 rounded-md hover:bg-primary-700 transition">仪表盘</a>
                <a href="/goals" className="px-3 py-2 rounded-md hover:bg-primary-700 transition">目标</a>
                <a href="/schedule" className="px-3 py-2 rounded-md hover:bg-primary-700 transition">日程</a>
                <a href="/diet" className="px-3 py-2 rounded-md hover:bg-primary-700 transition">饮食</a>
                <a href="/tips" className="px-3 py-2 rounded-md hover:bg-primary-700 transition">建议</a>
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  )
}
