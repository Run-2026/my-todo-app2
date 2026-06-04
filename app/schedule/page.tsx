'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Schedule } from '@/types'
import { Plus, Trash2, Clock, Utensils, Dumbbell, Moon, Briefcase, Coffee } from 'lucide-react'

const typeIcons = {
  diet: <Utensils className="w-5 h-5 text-orange-500" />,
  exercise: <Dumbbell className="w-5 h-5 text-green-500" />,
  sleep: <Moon className="w-5 h-5 text-indigo-500" />,
  work: <Briefcase className="w-5 h-5 text-blue-500" />,
  relax: <Coffee className="w-5 h-5 text-purple-500" />,
}

const typeLabels = {
  diet: '饮食',
  exercise: '运动',
  sleep: '睡眠',
  work: '工作',
  relax: '放松',
}

const typeColors = {
  diet: 'bg-orange-50 border-orange-200',
  exercise: 'bg-green-50 border-green-200',
  sleep: 'bg-indigo-50 border-indigo-200',
  work: 'bg-blue-50 border-blue-200',
  relax: 'bg-purple-50 border-purple-200',
}

const weekDays = ['日', '一', '二', '三', '四', '五', '六']

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newSchedule, setNewSchedule] = useState({
    title: '',
    type: 'exercise' as Schedule['type'],
    start_time: '08:00',
    end_time: '09:00',
    days_of_week: [1, 2, 3, 4, 5] as number[],
  })

  useEffect(() => {
    fetchSchedules()
  }, [])

  async function fetchSchedules() {
    const { data } = await supabase.from('schedules').select('*').order('start_time')
    if (data) setSchedules(data)
    setLoading(false)
  }

  async function addSchedule(e: React.FormEvent) {
    e.preventDefault()
    if (!newSchedule.title.trim()) return

    const { data, error } = await supabase
      .from('schedules')
      .insert([{
        title: newSchedule.title,
        type: newSchedule.type,
        start_time: newSchedule.start_time,
        end_time: newSchedule.end_time,
        days_of_week: newSchedule.days_of_week,
      }])
      .select()

    if (!error && data) {
      setSchedules([...schedules, data[0]])
      setNewSchedule({
        title: '',
        type: 'exercise',
        start_time: '08:00',
        end_time: '09:00',
        days_of_week: [1, 2, 3, 4, 5],
      })
      setShowForm(false)
    }
  }

  async function deleteSchedule(id: string) {
    const { error } = await supabase.from('schedules').delete().eq('id', id)
    if (!error) setSchedules(schedules.filter(s => s.id !== id))
  }

  function toggleDay(day: number) {
    const days = newSchedule.days_of_week.includes(day)
      ? newSchedule.days_of_week.filter(d => d !== day)
      : [...newSchedule.days_of_week, day]
    setNewSchedule({ ...newSchedule, days_of_week: days.sort() })
  }

  if (loading) return <div className="p-8 text-center">加载中...</div>

  // 按时间排序
  const sortedSchedules = [...schedules].sort((a, b) => a.start_time.localeCompare(b.start_time))

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">日程安排</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
        >
          <Plus className="w-5 h-5" />
          <span>添加日程</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={addSchedule} className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">新日程</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">活动名称</label>
              <input
                type="text"
                value={newSchedule.title}
                onChange={e => setNewSchedule({ ...newSchedule, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="例如：晨跑、瑜伽、晚餐"
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">类型</label>
                <select
                  value={newSchedule.type}
                  onChange={e => setNewSchedule({ ...newSchedule, type: e.target.value as Schedule['type'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="diet">饮食</option>
                  <option value="exercise">运动</option>
                  <option value="sleep">睡眠</option>
                  <option value="work">工作</option>
                  <option value="relax">放松</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">开始时间</label>
                <input
                  type="time"
                  value={newSchedule.start_time}
                  onChange={e => setNewSchedule({ ...newSchedule, start_time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">结束时间</label>
                <input
                  type="time"
                  value={newSchedule.end_time}
                  onChange={e => setNewSchedule({ ...newSchedule, end_time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">重复日期</label>
              <div className="flex space-x-2">
                {weekDays.map((day, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleDay(i)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition ${
                      newSchedule.days_of_week.includes(i)
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
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

      <div className="space-y-4">
        {sortedSchedules.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">还没有日程安排，添加一个吧！</p>
          </div>
        ) : (
          sortedSchedules.map(schedule => (
            <div key={schedule.id} className={`rounded-xl border p-5 ${typeColors[schedule.type]}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {typeIcons[schedule.type]}
                  <div>
                    <h3 className="font-semibold text-gray-900">{schedule.title}</h3>
                    <div className="flex items-center space-x-2 mt-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{schedule.start_time} - {schedule.end_time}</span>
                      <span className="text-gray-400">|</span>
                      <span>{typeLabels[schedule.type]}</span>
                    </div>
                    <div className="flex items-center space-x-1 mt-2">
                      {weekDays.map((day, i) => (
                        <span
                          key={i}
                          className={`w-6 h-6 rounded text-xs flex items-center justify-center ${
                            schedule.days_of_week.includes(i)
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-200 text-gray-400'
                          }`}
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteSchedule(schedule.id)}
                  className="text-gray-400 hover:text-red-500 transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
