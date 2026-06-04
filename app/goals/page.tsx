'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Goal } from '@/types'
import { Plus, Trash2, CheckCircle2, Circle, Calendar } from 'lucide-react'

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    type: 'short' as 'long' | 'short',
    deadline: '',
  })

  useEffect(() => {
    fetchGoals()
  }, [])

  async function fetchGoals() {
    const { data } = await supabase
      .from('goals')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setGoals(data)
    setLoading(false)
  }

  async function addGoal(e: React.FormEvent) {
    e.preventDefault()
    if (!newGoal.title.trim()) return

    const { data, error } = await supabase
      .from('goals')
      .insert([newGoal])
      .select()

    if (!error && data) {
      setGoals([data[0], ...goals])
      setNewGoal({ title: '', description: '', type: 'short', deadline: '' })
      setShowForm(false)
    }
  }

  async function toggleStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === 'active' ? 'completed' : 'active'
    const { error } = await supabase
      .from('goals')
      .update({ status: newStatus })
      .eq('id', id)

    if (!error) {
      setGoals(goals.map(g => g.id === id ? { ...g, status: newStatus } : g))
    }
  }

  async function deleteGoal(id: string) {
    const { error } = await supabase.from('goals').delete().eq('id', id)
    if (!error) {
      setGoals(goals.filter(g => g.id !== id))
    }
  }

  if (loading) return <div className="p-8 text-center">加载中...</div>

  const activeGoals = goals.filter(g => g.status === 'active')
  const completedGoals = goals.filter(g => g.status === 'completed')

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">目标管理</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
        >
          <Plus className="w-5 h-5" />
          <span>新建目标</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={addGoal} className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">新建目标</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">目标名称</label>
              <input
                type="text"
                value={newGoal.title}
                onChange={e => setNewGoal({ ...newGoal, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="例如：三个月减重5kg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
              <textarea
                value={newGoal.description}
                onChange={e => setNewGoal({ ...newGoal, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="具体计划..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">类型</label>
                <select
                  value={newGoal.type}
                  onChange={e => setNewGoal({ ...newGoal, type: e.target.value as 'long' | 'short' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="short">短期目标</option>
                  <option value="long">长期目标</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">截止日期</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={newGoal.deadline}
                    onChange={e => setNewGoal({ ...newGoal, deadline: e.target.value })}
                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                保存
              </button>
            </div>
          </div>
        </form>
      )}

      {/* 进行中的目标 */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Circle className="w-5 h-5 text-primary-500 mr-2" />
          进行中 ({activeGoals.length})
        </h2>
        {activeGoals.length === 0 ? (
          <p className="text-gray-500 text-center py-8">暂无进行中的目标</p>
        ) : (
          <div className="space-y-3">
            {activeGoals.map(goal => (
              <div key={goal.id} className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <button
                  onClick={() => toggleStatus(goal.id, goal.status)}
                  className="mt-1 mr-3 text-gray-400 hover:text-primary-500 transition"
                >
                  <Circle className="w-5 h-5" />
                </button>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                  {goal.description && <p className="text-gray-600 text-sm mt-1">{goal.description}</p>}
                  <div className="flex items-center space-x-3 mt-2 text-sm text-gray-500">
                    <span className={`px-2 py-0.5 rounded ${goal.type === 'long' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                      {goal.type === 'long' ? '长期' : '短期'}
                    </span>
                    {goal.deadline && <span>截止：{goal.deadline}</span>}
                  </div>
                </div>
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="text-gray-400 hover:text-red-500 transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 已完成的目标 */}
      {completedGoals.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
            已完成 ({completedGoals.length})
          </h2>
          <div className="space-y-3">
            {completedGoals.map(goal => (
              <div key={goal.id} className="flex items-start p-4 border border-gray-200 rounded-lg opacity-60">
                <button
                  onClick={() => toggleStatus(goal.id, goal.status)}
                  className="mt-1 mr-3 text-green-500"
                >
                  <CheckCircle2 className="w-5 h-5" />
                </button>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 line-through">{goal.title}</h3>
                  <div className="flex items-center space-x-3 mt-2 text-sm text-gray-500">
                    <span className={`px-2 py-0.5 rounded ${goal.type === 'long' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                      {goal.type === 'long' ? '长期' : '短期'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="text-gray-400 hover:text-red-500 transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
