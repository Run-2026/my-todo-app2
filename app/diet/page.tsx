'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { DietLog, FoodSuggestion } from '@/types'
import { Plus, Trash2, Coffee, Sun, Sunset, Moon, Flame, Search, Utensils, Sparkles, Loader2 } from 'lucide-react'
import { format } from 'date-fns'

const mealConfig = {
  breakfast: { icon: <Sun className="w-5 h-5 text-yellow-500" />, label: '早餐', color: 'bg-yellow-50 border-yellow-200' },
  lunch: { icon: <Sunset className="w-5 h-5 text-orange-500" />, label: '午餐', color: 'bg-orange-50 border-orange-200' },
  dinner: { icon: <Moon className="w-5 h-5 text-indigo-500" />, label: '晚餐', color: 'bg-indigo-50 border-indigo-200' },
  snack: { icon: <Coffee className="w-5 h-5 text-purple-500" />, label: '加餐', color: 'bg-purple-50 border-purple-200' },
}

const builtInCalories: Record<string, number> = {
  '米饭': 116, '馒头': 223, '面条': 110, '小米粥': 46, '红薯': 86, '玉米': 112,
  '全麦面包': 247, '燕麦片': 389, '包子': 226, '饺子': 240, '油条': 386,
  '鸡胸肉': 165, '牛肉': 250, '鸡蛋': 155, '三文鱼': 208, '豆腐': 76,
  '猪瘦肉': 143, '虾仁': 48, '带鱼': 127, '鸡腿': 181, '羊肉': 203,
  '西兰花': 34, '菠菜': 23, '胡萝卜': 41, '番茄': 18, '黄瓜': 16,
  '生菜': 15, '芹菜': 16, '土豆': 81, '白菜': 13, '茄子': 23,
  '苹果': 52, '香蕉': 89, '橙子': 47, '草莓': 32, '葡萄': 45,
  '西瓜': 31, '猕猴桃': 61, '芒果': 60, '牛油果': 160, '蓝莓': 57,
  '牛奶': 54, '酸奶': 70, '豆浆': 14, '橙汁': 45, '可乐': 42,
  '咖啡': 2, '奶茶': 80, '绿茶': 1, '椰汁': 51,
  '坚果': 607, '黑巧克力': 546, '核桃': 654, '腰果': 553, '杏仁': 579,
  '披萨': 266, '汉堡': 295, '炸鸡': 260, '薯条': 312, '方便面': 473,
  '蛋糕': 347, '饼干': 433, '冰淇淋': 207, '薯片': 536,
}

function estimateCalories(foodName: string): number {
  const name = foodName.trim()
  if (builtInCalories[name]) return builtInCalories[name]
  for (const [key, cal] of Object.entries(builtInCalories)) {
    if (name.includes(key) || key.includes(name)) return cal
  }
  if (name.includes('肉') || name.includes('鱼') || name.includes('虾') || name.includes('鸡') || name.includes('鸭')) return 180
  if (name.includes('菜') || name.includes('瓜') || name.includes('菇')) return 30
  if (name.includes('果') || name.includes('莓') || name.includes('桃')) return 55
  if (name.includes('奶') || name.includes('浆') || name.includes('汁')) return 60
  if (name.includes('面') || name.includes('粉') || name.includes('饼')) return 220
  if (name.includes('饭') || name.includes('粥') || name.includes('米')) return 120
  if (name.includes('炸') || name.includes('烤') || name.includes('炒')) return 280
  return 150
}

export default function DietPage() {
  const [dietLogs, setDietLogs] = useState<DietLog[]>([])
  const [foodSuggestions, setFoodSuggestions] = useState<FoodSuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [calculating, setCalculating] = useState(false)
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

    const insertData = {
      meal_type: newLog.meal_type,
      food_name: newLog.food_name,
      calories: newLog.calories,
      date: selectedDate,
    }

    const { data, error } = await supabase
      .from('diet_logs')
      .insert([insertData as any])
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

  function autoCalculate() {
    if (!newLog.food_name.trim()) return
    setCalculating(true)
    setTimeout(() => {
      const cal = estimateCalories(newLog.food_name)
      setNewLog({ ...newLog, calories: Math.round(cal * 1.5) })
      setCalculating(false)
    }, 300)
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
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={newLog.calories || ''}
                    onChange={e => setNewLog({ ...newLog, calories: parseInt(e.target.value) || 0 })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="手动输入"
                    required
                  />
                  <button
                    type="button"
                    onClick={autoCalculate}
                    disabled={!newLog.food_name.trim() || calculating}
                    className="flex items-center space-x-1 px-3 py-2 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition disabled:opacity-50 whitespace-nowrap"
                    title="根据食物名智能计算热量"
                  >
                    {calculating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>智能计算</span>
                  </button>
                </div>
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
                  placeholder="搜索或输入食物名称，点击「智能计算」自动算热量"
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