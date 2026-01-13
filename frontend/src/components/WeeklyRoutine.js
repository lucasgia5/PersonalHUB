import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Plus, Dumbbell, Trash2 } from 'lucide-react'
import axios from 'axios'

const API = `${process.env.REACT_APP_BACKEND_URL}/api`

const DAYS = [
  { value: 0, label: 'Domingo', short: 'DOM' },
  { value: 1, label: 'Segunda', short: 'SEG' },
  { value: 2, label: 'Terça', short: 'TER' },
  { value: 3, label: 'Quarta', short: 'QUA' },
  { value: 4, label: 'Quinta', short: 'QUI' },
  { value: 5, label: 'Sexta', short: 'SEX' },
  { value: 6, label: 'Sábado', short: 'SÁB' },
]

export function WeeklyRoutine({ studentId, workouts, onExerciseClick }) {
  const { session } = useAuth()
  const [routine, setRoutine] = useState([])
  const [showAddRoutine, setShowAddRoutine] = useState(false)
  const [selectedDay, setSelectedDay] = useState(null)
  const [newRoutine, setNewRoutine] = useState({ workout_name: '', day_of_week: 1 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRoutine()
  }, [studentId])

  async function loadRoutine() {
    try {
      const response = await axios.get(`${API}/weekly-routine?student_id=${studentId}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      })
      setRoutine(response.data)
    } catch (error) {
      console.error('Erro ao carregar rotina:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddRoutine(e) {
    e.preventDefault()
    try {
      await axios.post(
        `${API}/weekly-routine`,
        {
          student_id: studentId,
          day_of_week: newRoutine.day_of_week,
          workout_name: newRoutine.workout_name,
        },
        { headers: { Authorization: `Bearer ${session?.access_token}` } }
      )
      toast.success('Treino adicionado à rotina!')
      setShowAddRoutine(false)
      setNewRoutine({ workout_name: '', day_of_week: 1 })
      loadRoutine()
    } catch (error) {
      console.error('Erro ao adicionar rotina:', error)
      toast.error('Erro ao adicionar rotina')
    }
  }

  async function handleDeleteRoutine(routineId) {
    try {
      await axios.delete(`${API}/weekly-routine/${routineId}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      })
      toast.success('Treino removido da rotina!')
      loadRoutine()
    } catch (error) {
      console.error('Erro ao excluir rotina:', error)
      toast.error('Erro ao excluir rotina')
    }
  }

  function getRoutineForDay(dayValue) {
    return routine.filter((r) => r.day_of_week === dayValue)
  }

  if (loading) {
    return <div className="text-center py-8">Carregando rotina...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Planejamento Semanal</h3>
        <Button
          onClick={() => setShowAddRoutine(true)}
          className="bg-blue-600 hover:bg-blue-700 rounded-full"
          data-testid="add-weekly-routine-button"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Treino ao Dia
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {DAYS.map((day) => {
          const dayRoutines = getRoutineForDay(day.value)
          return (
            <div
              key={day.value}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden"
              data-testid={`day-card-${day.value}`}
            >
              <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
                <h4 className="font-semibold text-slate-900">{day.label}</h4>
                <p className="text-xs text-slate-500">{day.short}</p>
              </div>
              <div className="p-3 space-y-2 min-h-[120px]">
                {dayRoutines.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-6">Descanso</p>
                ) : (
                  dayRoutines.map((r) => (
                    <div
                      key={r.id}
                      className="bg-slate-50 rounded-lg p-3 hover:bg-slate-100 transition-colors group"
                      data-testid={`routine-item-${r.id}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => {
                            const workout = workouts.find((w) => w.name === r.workout_name)
                            if (workout) {
                              onExerciseClick(workout.id)
                            }
                          }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Dumbbell className="w-3 h-3 text-blue-600" />
                            <p className="text-sm font-medium text-slate-900">{r.workout_name}</p>
                          </div>
                          <p className="text-xs text-blue-600">Clique para ver exercícios</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteRoutine(r.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
                          data-testid={`delete-routine-${r.id}`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal Adicionar Treino ao Dia */}
      <Dialog open={showAddRoutine} onOpenChange={setShowAddRoutine}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Treino à Rotina</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddRoutine} className="space-y-4" data-testid="add-routine-form">
            <div>
              <label className="block text-sm font-medium mb-2">Dia da Semana *</label>
              <Select
                value={String(newRoutine.day_of_week)}
                onValueChange={(value) => setNewRoutine({ ...newRoutine, day_of_week: parseInt(value) })}
              >
                <SelectTrigger data-testid="routine-day-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS.map((day) => (
                    <SelectItem key={day.value} value={String(day.value)}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Treino *</label>
              {workouts.length === 0 ? (
                <p className="text-sm text-slate-500">Nenhum treino disponível. Crie um treino primeiro.</p>
              ) : (
                <Select
                  value={newRoutine.workout_name}
                  onValueChange={(value) => setNewRoutine({ ...newRoutine, workout_name: value })}
                >
                  <SelectTrigger data-testid="routine-workout-select">
                    <SelectValue placeholder="Selecione um treino" />
                  </SelectTrigger>
                  <SelectContent>
                    {workouts.map((workout) => (
                      <SelectItem key={workout.id} value={workout.name}>
                        {workout.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowAddRoutine(false)} className="flex-1">
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={!newRoutine.workout_name}
                data-testid="submit-routine-button"
              >
                Adicionar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
