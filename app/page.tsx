'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Goal, DietLog, DailyTip } from '@/types'
import { Target, Calendar, Utensils, Lightbulb, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export default function Dashboard() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [dietLogs, setDietLogs] = useState<DietLog[]>([])
  const [todayTip, setTodayTip] = useState<DailyTip | null>(null)
  const [todayCalories, setTodayCalories] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    const today = format(new Date(), 'yyyy-MM-dd')
    
    // 获取活跃目标
    const { data: goalsData } = await supabase
      .from('goals')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(5)
    
    // 获取今日饮食
    const { data: dietData } = await supabase
      .from('diet_logs')
      .select('*')
      .eq('date', today)
      .order('created_at', { ascending: true })
    
    // 获取随机每日建议
    const { data: tipsData } = await supabase
      .from('daily_tips')
      .select('*')
    
    if (goalsData) setGoals(goalsData)
    if (dietData) {
      setDietLogs(dietData)
      const total = dietData.reduce((sum, item) => sum + item.calories, 0)
      setTodayCalories(total)
    }
    if (tipsData && tipsData.length > 0) {
      // 根据日期选择一条，这样每天显示同一条
      const dayIndex = new Date().getDate() % tipsData.length
      setTodayTip(tipsData[dayIndex])
    }
    
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">加载中...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {format(new Date(), 'MM月dd日 EEEE', { locale: zhCN })}
        </h1>
        <p className="text-gray-600 mt-1">开启健康的一天吧！</p>
      </div>

      {/* 快捷卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          icon={<Target className="w-6 h-6 text-blue-500" />}
          title="目标"
          value={`${goals.length} 个进行中`}
          href="/goals"
          color="bg-blue-50"
        />
        <DashboardCard
          icon={<Calendar className="w-6 h-6 text-green-500" />}
          title="日程"
          value="查看今日安排"
          href="/schedule"
          color="bg-green-50"
        />
        <DashboardCard
          icon={<Utensils className="w-6 h-6 text-orange-500" />}
          title="今日热量"
          value={`${todayCalories} kcal`}
          href="/diet"
          color="bg-orange-50"
        />
        <DashboardCard
          icon={<Lightbulb className="w-6 h-6 text-yellow-500" />}
          title="健康建议"
          value="查看今日建议"
          href="/tips"
          color="bg-yellow-50"
        />
      </div>

      {/* 每日建议 */}
      {todayTip && (
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white mb-8 shadow-lg">
          <div className="flex items-start space-x-3">
            <Lightbulb className="w-6 h-6 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg mb-1">今日健康建议</h3>
              <p className="text-primary-100">{todayTip.content}</p>
            </div>
          </div>
        </div>
      )}

      {/* 今日饮食概览 */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">今日饮食</h2>
        {dietLogs.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            还没有记录今天的饮食，
            <Link href="/diet" className="text-primary-600 hover:underline">去记录</Link>
          </p>
        ) : (
          <div className="space-y-3">
            {dietLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    log.meal_type === 'breakfast' ? 'bg-yellow-100 text-yellow-800' :
                    log.meal_type === 'lunch' ? 'bg-green-100 text-green-800' :
                    log.meal_type === 'dinner' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {log.meal_type === 'breakfast' ? '早餐' :
                     log.meal_type === 'lunch' ? '午餐' :
                     log.meal_type === 'dinner' ? '晚餐' : '加餐'}
                  </span>
                  <span className="font-medium">{log.food_name}</span>
                </div>
                <span className="text-gray-600">{log.calories} kcal</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-3 border-t">
              <span className="font-semibold text-gray-900">今日总计</span>
              <span className="font-bold text-primary-600 text-lg">{todayCalories} kcal</span>
            </div>
          </div>
        )}
      </div>

      {/* 活跃目标 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">进行中的目标</h2>
          <Link href="/goals" className="text-primary-600 hover:underline text-sm flex items-center">
            查看全部 <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        {goals.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            还没有设定目标，
            <Link href="/goals" className="text-primary-600 hover:underline">去创建</Link>
          </p>
        ) : (
          <div className="space-y-3">
            {goals.map((goal) => (
              <div key={goal.id} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <div className={`w-2 h-12 rounded-full mr-4 ${
                  goal.type === 'long' ? 'bg-blue-500' : 'bg-green-500'
                }`} />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {goal.type === 'long' ? '长期目标' : '短期目标'}
                    {goal.deadline && ` · 截止 ${goal.deadline}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function DashboardCard({
  icon,
  title,
  value,
  href,
  color,
}: {
  icon: React.ReactNode
  title: string
  value: string
  href: string
  color: string
}) {
  return (
    <Link href={href}>
      <div className={`${color} rounded-xl p-6 hover:shadow-md transition cursor-pointer`}>
        <div className="flex items-center justify-between mb-3">
          {icon}
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        <p className="text-gray-900 font-bold text-lg mt-1">{value}</p>
      </div>
    </Link>
  )
}
