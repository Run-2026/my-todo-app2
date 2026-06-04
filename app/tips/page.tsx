'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { DailyTip } from '@/types'
import { Lightbulb, Heart, Sparkles, RefreshCw } from 'lucide-react'

const categories = {
  general: { icon: <Sparkles className="w-5 h-5 text-yellow-500" />, label: '综合', color: 'bg-yellow-50' },
  饮食: { icon: <Heart className="w-5 h-5 text-green-500" />, label: '饮食', color: 'bg-green-50' },
  运动: { icon: <Sparkles className="w-5 h-5 text-blue-500" />, label: '运动', color: 'bg-blue-50' },
  睡眠: { icon: <Heart className="w-5 h-5 text-indigo-500" />, label: '睡眠', color: 'bg-indigo-50' },
  健康: { icon: <Lightbulb className="w-5 h-5 text-primary-500" />, label: '健康', color: 'bg-primary-50' },
  放松: { icon: <Heart className="w-5 h-5 text-purple-500" />, label: '放松', color: 'bg-purple-50' },
  心理健康: { icon: <Heart className="w-5 h-5 text-pink-500" />, label: '心理', color: 'bg-pink-50' },
}

export default function TipsPage() {
  const [tips, setTips] = useState<DailyTip[]>([])
  const [todayTip, setTodayTip] = useState<DailyTip | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTips()
  }, [])

  async function fetchTips() {
    const { data } = await supabase.from('daily_tips').select('*')
    if (data) {
      setTips(data)
      const dayIndex = new Date().getDate() % data.length
      setTodayTip(data[dayIndex])
    }
    setLoading(false)
  }

  async function refreshTip() {
    const { data } = await supabase.from('daily_tips').select('*')
    if (data && data.length > 0) {
      const random = data[Math.floor(Math.random() * data.length)]
      setTodayTip(random)
    }
  }

  function getCategoryInfo(category: string) {
    return categories[category as keyof typeof categories] || categories.general
  }

  if (loading) return <div className="p-8 text-center">加载中...</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">每日健康建议</h1>

      {/* 今日建议卡片 */}
      {todayTip && (
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-8 text-white mb-8 shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="bg-white/20 rounded-full p-3">
                <Lightbulb className="w-8 h-8" />
              </div>
              <div>
                <p className="text-primary-100 text-sm mb-1">今日建议</p>
                <h2 className="text-xl font-bold leading-relaxed">{todayTip.content}</h2>
                <span className="inline-block mt-3 px-3 py-1 bg-white/20 rounded-full text-sm">
                  {getCategoryInfo(todayTip.category).label}
                </span>
              </div>
            </div>
            <button
              onClick={refreshTip}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition"
              title="换一条"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* 所有建议 */}
      <h2 className="text-lg font-bold text-gray-900 mb-4">更多建议</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tips.map(tip => {
          const cat = getCategoryInfo(tip.category)
          return (
            <div key={tip.id} className={`${cat.color} rounded-xl border border-gray-200 p-5 hover:shadow-md transition`}>
              <div className="flex items-start space-x-3">
                {cat.icon}
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{tip.category}</span>
                  <p className="text-gray-900 mt-1">{tip.content}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
