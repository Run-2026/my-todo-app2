'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { DietLog, FoodSuggestion } from '@/types'
import { Plus, Trash2, Coffee, Sun, Sunset, Moon, Flame, Search, Utensils } from 'lucide-react'
import { format } from 'date-fns'

const mealConfig = {
  breakfast: { icon: <Sun className="w-5 h-5 text-yellow-500" />, label: '早餐', color: 'bg-yellow-50 border-yellow-200' },
  lunch: { icon: <Sunset className="w-5 h-5 text-orange-500" />, label: '午餐', color: 'bg-orange-50 border-orange-200' },
  dinner: { icon: <Moon className="w-5 h-5 text-indigo-500" />, label: '晚餐', color: 'bg-indigo-50 border-indigo-200' },
  snack: { icon: <Coffee className="w-5 h-5 text-purple-500" />, label: '加餐', color: 'bg-purple-50 border-purple-200' },
}

export default function DietPage() {
  const [dietLogs, setDietLogs] = useState<DietLog[]>([])
  const [foodSuggestions, setFoodSuggestions] = useState<FoodSuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [newLog, setNewLog] = useState({
    meal_type: 'breakfast' as DietLog['meal_type'],
    food_name: '',
    calories: 0,
    date: format(new Date(), 'yyyy-MM-dd'),
  })

  useEffect(() => {
    fetchData()
  }, [selectedDate])

  async function fetchData() {
    setLoading(true)
    const [{ data: logs }, { data: foods }] = await Promise.all([
      supabase.from('diet_logs').select('*').eq('date', selectedDate).order('created_at'),
      supabase.from('food_suggestions').select('*').order('name'),
    ])
    if (logs) setDietLogs(logs)
    if (foods) setFoodSuggestions(foods)
    setLoading(false)
  }

  async function addLog(e: React.FormEvent) {
    e.preventDefault()
    if (!newLog.food_name.trim() || newLog.calories <= 0) return

    const { data, error } = await supabase
      .from('diet_logs')
      .insert([{ ...newLog, date: selectedDate }])
      .select()

    if (!error && data) {
      setDietLogs([...dietLogs, data[0]])
      setNewLog({ meal_type: 'breakfast', food_name: '', calories: 0, date: selectedDate })
      setShowForm(false)
    }
  }

  async function deleteLog(id: string) {
    const { error } = await supabase.from('diet_logs').delete().eq('id', id)
    if (!error) setDietLogs(dietLogs.filter(l => l.id !== id))
  }

  const todayCalories = dietLogs.reduce((sum, log) => sum + log.calories, 0)
  const filteredFoods = foodSuggestions.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  function selectFood(food: FoodSuggestion) {
    setNewLog({ ...newLog, food_name: food.name, calories: Math.round(food.calories_per_100g * 1.5) })
    setSearchQuery('')
  }

  if (loading) return <div className="p-8 text-center">加载中...</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">饮食记录</h1>
        <div className="flex items-center space-x-3">
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
          >
            <Plus className="w-5 h-5" />
            <span>记录</span>
          </button>
        </div>
      </div>

      {/* 热量概览 */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">{selectedDate} 热量摄入</p>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-bold text-gray-900">{todayCalories}</span>
              <span className="text-gray-500">kcal</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Flame className="w-8 h-8 text-orange-500" />
            <div className="text-right">
              <p className="text-sm text-gray-500">建议摄入</p>
              <p className="font-semibold text-gray-900">2000 kcal</p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 transition-all"
              style={{ width: `${Math.min((todayCalories / 2000) * 100, 100)}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {todayCalories < 2000
              ? `还可以摄入 ${2000 - todayCalories} kcal`
              : `超出建议 ${todayCalories - 2000} kcal`}
          </p>
        </div>
      </div>

      {showForm && (
        <form onSubmit={addLog} className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">添加饮食记录</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">餐次</label>
                <select
                  value={newLog.meal_type}
                  onChange={e => setNewLog({ ...newLog, meal_type: e.target.value as DietLog['meal_type'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="breakfast">早餐</option>
                  <option value="lunch">午餐</option>
                  <option value="dinner">晚餐</option>
                  <option value="snack">加餐</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">热量 (kcal)</label>
                <input
                  type="number"
                  value={newLog.calories || ''}
                  onChange={e => setNewLog({ ...newLog, calories: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">食物名称</label>
              <div className="relative">
                <input
                  type="text"
                  value={newLog.food_name}
                  onChange={e => {
                    setNewLog({ ...newLog, food_name: e.target.value })
                    setSearchQuery(e.target.value)
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="搜索或输入食物名称"
                  required
                />
                <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
              {searchQuery && filteredFoods.length > 0 && (
                <div className="mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredFoods.map(food => (
                    <button
                      key={food.id}
                      type="button"
                      onClick={() => selectFood(food)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex justify-between items-center"
                    >
                      <span>{food.name}</span>
                      <span className="text-sm text-gray-500">{food.calories_per_100g} kcal/100g</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                保存
              </button>
            </div>
          </div>
        </form>
      )}

      {/* 饮食记录列表 */}
      <div className="space-y-3">
        {dietLogs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">{selectedDate} 还没有饮食记录</p>
          </div>
        ) : (
          dietLogs.map(log => (
            <div key={log.id} className={`rounded-xl border p-4 ${mealConfig[log.meal_type].color}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {mealConfig[log.meal_type].icon}
                  <div>
                    <h3 className="font-semibold text-gray-900">{log.food_name}</h3>
                    <span className="text-sm text-gray-600">{mealConfig[log.meal_type].label}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-900">{log.calories} kcal</span>
                  <button
                    onClick={() => deleteLog(log.id)}
                    className="text-gray-400 hover:text-red-500 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
