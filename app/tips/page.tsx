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

// 静态备选建议数据，当数据库不可用时兜底
const fallbackTips: DailyTip[] = [
  { id: 'f1', content: '早餐是一天中最重要的一餐，记得吃富含蛋白质的食物！', category: '饮食', created_at: '' },
  { id: 'f2', content: '每天步行6000步以上可以显著降低心血管疾病风险。', category: '运动', created_at: '' },
  { id: 'f3', content: '睡前一小时远离电子屏幕，可以提高睡眠质量。', category: '睡眠', created_at: '' },
  { id: 'f4', content: '喝水时加一片柠檬，既补充维生素C又增加饮水量。', category: '饮食', created_at: '' },
  { id: 'f5', content: '工作45分钟后站起来伸展5分钟，保护颈椎和腰椎。', category: '健康', created_at: '' },
  { id: 'f6', content: '深呼吸三次：吸气4秒，屏息4秒，呼气6秒，立即缓解压力。', category: '放松', created_at: '' },
  { id: 'f7', content: '吃七分饱就好，给肠胃留点空间，身体会更轻松。', category: '饮食', created_at: '' },
  { id: 'f8', content: '周末安排一次户外活动，阳光是最好的情绪调节剂。', category: '心理健康', created_at: '' },
  { id: 'f9', content: '睡前泡脚15分钟，水温40°C左右，促进全身血液循环。', category: '睡眠', created_at: '' },
  { id: 'f10', content: '今天试试冥想5分钟，专注呼吸，什么也不想。', category: '放松', created_at: '' },
  { id: 'f11', content: '用白开水代替含糖饮料，一个月能减少摄入约2kg糖分。', category: '饮食', created_at: '' },
  { id: 'f12', content: '午餐后散步10分钟，比坐着刷手机更有利于消化。', category: '健康', created_at: '' },
  { id: 'f13', content: '给自己定个睡觉闹钟，到点就准备休息，规律作息比补觉更重要。', category: '睡眠', created_at: '' },
  { id: 'f14', content: '每天感恩三件小事，幸福感会悄然提升。', category: '心理健康', created_at: '' },
  { id: 'f15', content: '坚果虽好，但每天一小把就够了，热量很高哦。', category: '饮食', created_at: '' },
]

export default function TipsPage() {
  const [tips, setTips] = useState<DailyTip[]>([])
  const [todayTip, setTodayTip] = useState<DailyTip | null>(null)
  const [loading, setLoading] = useState(true)
  const [useFallback, setUseFallback] = useState(false)

  useEffect(() => {
    fetchTips()
  }, [])

  async function fetchTips() {
    try {
      const { data, error } = await supabase.from('daily_tips').select('*')
      if (error) throw error
      if (data && data.length > 0) {
        setTips(data)
        const dayIndex = new Date().getDate() % data.length
        setTodayTip(data[dayIndex])
      } else {
        loadFallback()
      }
    } catch {
      loadFallback()
    } finally {
      setLoading(false)
    }
  }

  function loadFallback() {
    setUseFallback(true)
    setTips(fallbackTips)
    const dayIndex = new Date().getDate() % fallbackTips.length
    setTodayTip(fallbackTips[dayIndex])
  }

  async function refreshTip() {
    try {
      if (!useFallback) {
        const { data, error } = await supabase.from('daily_tips').select('*')
        if (error) throw error
        if (data && data.length > 0) {
          const random = data[Math.floor(Math.random() * data.length)]
          setTodayTip(random)
          return
        }
      }
    } catch {
      // 降级到备选数据
    }
    const random = fallbackTips[Math.floor(Math.random() * fallbackTips.length)]
    setTodayTip(random)
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
