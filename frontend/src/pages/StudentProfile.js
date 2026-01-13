import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { ArrowLeft, Plus, Dumbbell, Activity, TrendingUp, Trash2, Calendar } from 'lucide-react'
import axios from 'axios'

const API = `${process.env.REACT_APP_BACKEND_URL}/api`

export function StudentProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { session } = useAuth()
  const [student, setStudent] = useState(null)
  const [workouts, setWorkouts] = useState([])
  const [cardios, setCardios] = useState([])
  const [evolutions, setEvolutions] = useState([])
  const [loading, setLoading] = useState(true)

  const [showAddWorkout, setShowAddWorkout] = useState(false)
  const [showAddCardio, setShowAddCardio] = useState(false)
  const [showAddEvolution, setShowAddEvolution] = useState(false)
  const [showExercises, setShowExercises] = useState(false)
  const [showExerciseHistory, setShowExerciseHistory] = useState(false)
  const [selectedWorkout, setSelectedWorkout] = useState(null)
  const [selectedExercise, setSelectedExercise] = useState(null)
  const [exercises, setExercises] = useState([])
  const [exerciseHistory, setExerciseHistory] = useState([])

  const [newWorkout, setNewWorkout] = useState({ name: '' })
  const [newExercise, setNewExercise] = useState({ name: '', sets: '', reps: '', weight: '', rest: '' })
  const [newCardio, setNewCardio] = useState({ equipment: 'esteira', duration: '', intensity: 'moderado', observations: '' })
  const [newEvolution, setNewEvolution] = useState({ date: new Date().toISOString().split('T')[0], current_weight: '', observations: '', performance: '' })
  const [newHistory, setNewHistory] = useState({ date: new Date().toISOString().split('T')[0], weight: '', sets: '', reps: '', observations: '' })

  useEffect(() => {
    loadStudent()
    loadWorkouts()
    loadCardios()
    loadEvolutions()
  }, [id])

  async function loadStudent() {
    try {
      const response = await axios.get(`${API}/students`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      })
      const foundStudent = response.data.find((s) => s.id === id)
      setStudent(foundStudent)
    } catch (error) {
      console.error('Erro ao carregar aluno:', error)
      toast.error('Erro ao carregar dados do aluno')
    } finally {
      setLoading(false)
    }
  }

  async function loadWorkouts() {
    try {
      const response = await axios.get(`${API}/workouts?student_id=${id}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      })
      setWorkouts(response.data)
    } catch (error) {
      console.error('Erro ao carregar treinos:', error)
    }
  }

  async function loadCardios() {
    try {
      const response = await axios.get(`${API}/cardio?student_id=${id}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      })
      setCardios(response.data)
    } catch (error) {
      console.error('Erro ao carregar cardios:', error)
    }
  }

  async function loadEvolutions() {
    try {
      const response = await axios.get(`${API}/evolution?student_id=${id}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      })
      setEvolutions(response.data)
    } catch (error) {
      console.error('Erro ao carregar evoluções:', error)
    }
  }

  async function loadExercises(workoutId) {
    try {
      const response = await axios.get(`${API}/exercises?workout_id=${workoutId}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      })
      setExercises(response.data)
    } catch (error) {
      console.error('Erro ao carregar exercícios:', error)
    }
  }

  async function loadExerciseHistory(exerciseId) {
    try {
      const response = await axios.get(`${API}/exercise-history?exercise_id=${exerciseId}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      })
      setExerciseHistory(response.data)
    } catch (error) {
      console.error('Erro ao carregar histórico:', error)
    }
  }

  async function handleAddWorkout(e) {
    e.preventDefault()
    try {
      await axios.post(
        `${API}/workouts`,
        { ...newWorkout, student_id: id },
        { headers: { Authorization: `Bearer ${session?.access_token}` } }
      )
      toast.success('Treino criado com sucesso!')
      setShowAddWorkout(false)
      setNewWorkout({ name: '' })
      loadWorkouts()
    } catch (error) {
      console.error('Erro ao criar treino:', error)
      toast.error('Erro ao criar treino')
    }
  }

  async function handleAddExercise(e) {
    e.preventDefault()
    try {
      await axios.post(
        `${API}/exercises`,
        {
          ...newExercise,
          workout_id: selectedWorkout,
          sets: newExercise.sets ? parseInt(newExercise.sets) : null,
        },
        { headers: { Authorization: `Bearer ${session?.access_token}` } }
      )
      toast.success('Exercício adicionado!')
      setNewExercise({ name: '', sets: '', reps: '', weight: '', rest: '' })
      loadExercises(selectedWorkout)
    } catch (error) {
      console.error('Erro ao adicionar exercício:', error)
      toast.error('Erro ao adicionar exercício')
    }
  }

  async function handleDeleteExercise(exerciseId) {
    try {
      await axios.delete(`${API}/exercises/${exerciseId}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      })
      toast.success('Exercício excluído!')
      loadExercises(selectedWorkout)
    } catch (error) {
      console.error('Erro ao excluir exercício:', error)
      toast.error('Erro ao excluir exercício')
    }
  }

  async function handleAddCardio(e) {
    e.preventDefault()
    try {
      await axios.post(
        `${API}/cardio`,
        {
          ...newCardio,
          student_id: id,
          duration: newCardio.duration ? parseInt(newCardio.duration) : null,
        },
        { headers: { Authorization: `Bearer ${session?.access_token}` } }
      )
      toast.success('Cardio adicionado!')
      setShowAddCardio(false)
      setNewCardio({ equipment: 'esteira', duration: '', intensity: 'moderado', observations: '' })
      loadCardios()
    } catch (error) {
      console.error('Erro ao adicionar cardio:', error)
      toast.error('Erro ao adicionar cardio')
    }
  }

  async function handleAddEvolution(e) {
    e.preventDefault()
    try {
      await axios.post(
        `${API}/evolution`,
        {
          ...newEvolution,
          student_id: id,
          current_weight: newEvolution.current_weight ? parseFloat(newEvolution.current_weight) : null,
        },
        { headers: { Authorization: `Bearer ${session?.access_token}` } }
      )
      toast.success('Evolução registrada!')
      setShowAddEvolution(false)
      setNewEvolution({ date: new Date().toISOString().split('T')[0], current_weight: '', observations: '', performance: '' })
      loadEvolutions()
    } catch (error) {
      console.error('Erro ao registrar evolução:', error)
      toast.error('Erro ao registrar evolução')
    }
  }

  async function handleAddHistory(e) {
    e.preventDefault()
    try {
      await axios.post(
        `${API}/exercise-history`,
        {
          ...newHistory,
          exercise_id: selectedExercise,
          sets: newHistory.sets ? parseInt(newHistory.sets) : null,
        },
        { headers: { Authorization: `Bearer ${session?.access_token}` } }
      )
      toast.success('Registro adicionado ao histórico!')
      setNewHistory({ date: new Date().toISOString().split('T')[0], weight: '', sets: '', reps: '', observations: '' })
      loadExerciseHistory(selectedExercise)
    } catch (error) {
      console.error('Erro ao adicionar histórico:', error)
      toast.error('Erro ao adicionar histórico')
    }
  }

  function openExercises(workoutId) {
    setSelectedWorkout(workoutId)
    loadExercises(workoutId)
    setShowExercises(true)
  }

  function openExerciseHistory(exercise) {
    setSelectedExercise(exercise.id)
    loadExerciseHistory(exercise.id)
    setShowExerciseHistory(true)
  }

  if (loading || !student) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Dumbbell className="w-12 h-12 text-blue-600 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="mr-4"
              data-testid="back-to-dashboard-button"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl">
              {student.name[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                {student.name}
              </h1>
              <p className="text-slate-600">{student.age ? `${student.age} anos` : 'Idade não informada'}</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="w-full justify-start bg-white border border-slate-200 p-1 rounded-lg mb-6">
            <TabsTrigger value="info" className="flex-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md" data-testid="tab-info">
              Dados
            </TabsTrigger>
            <TabsTrigger value="workout" className="flex-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md" data-testid="tab-workout">
              Treino
            </TabsTrigger>
            <TabsTrigger value="evolution" className="flex-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md" data-testid="tab-evolution">
              Evolução
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
              <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Informações do Aluno
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-slate-500 block mb-1">Objetivo</label>
                  <p className="text-slate-900 font-medium">{student.goal || 'Não informado'}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-500 block mb-1">Peso Inicial</label>
                  <p className="text-slate-900 font-medium">{student.initial_weight ? `${student.initial_weight} kg` : 'Não informado'}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-500 block mb-1">Altura</label>
                  <p className="text-slate-900 font-medium">{student.height ? `${student.height} cm` : 'Não informado'}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-500 block mb-1">Cadastrado em</label>
                  <p className="text-slate-900 font-medium">{new Date(student.created_at).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
              {student.observations && (
                <div className="mt-6">
                  <label className="text-sm text-slate-500 block mb-1">Observações</label>
                  <p className="text-slate-700">{student.observations}</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="workout">
            <div className="space-y-6">
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowAddWorkout(true)}
                  className="bg-blue-600 hover:bg-blue-700 rounded-full"
                  data-testid="create-workout-button"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Treino
                </Button>
                <Button
                  onClick={() => setShowAddCardio(true)}
                  className="bg-green-600 hover:bg-green-700 rounded-full"
                  data-testid="add-cardio-button"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Cardio
                </Button>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-blue-600" />
                  Treinos
                </h3>
                {workouts.length === 0 ? (
                  <div className="bg-white rounded-xl p-8 text-center border border-slate-100">
                    <p className="text-slate-500">Nenhum treino criado ainda</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {workouts.map((workout) => (
                      <div
                        key={workout.id}
                        onClick={() => openExercises(workout.id)}
                        className="bg-white rounded-xl p-4 border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer"
                        data-testid={`workout-card-${workout.id}`}
                      >
                        <h4 className="font-semibold text-slate-900">{workout.name}</h4>
                        <p className="text-sm text-slate-500 mt-1">
                          Criado em {new Date(workout.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  Cardio
                </h3>
                {cardios.length === 0 ? (
                  <div className="bg-white rounded-xl p-8 text-center border border-slate-100">
                    <p className="text-slate-500">Nenhum cardio registrado</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl divide-y border border-slate-100">
                    {cardios.map((cardio) => (
                      <div key={cardio.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-slate-900 capitalize">{cardio.equipment}</p>
                            <p className="text-sm text-slate-600 mt-1">
                              {cardio.duration} min • {cardio.intensity}
                            </p>
                            {cardio.observations && (
                              <p className="text-sm text-slate-500 mt-1">{cardio.observations}</p>
                            )}
                          </div>
                          <span className="text-xs text-slate-400">
                            {new Date(cardio.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="evolution">
            <div>
              <Button
                onClick={() => setShowAddEvolution(true)}
                className="bg-blue-600 hover:bg-blue-700 rounded-full mb-6"
                data-testid="add-evolution-button"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Registro
              </Button>

              {evolutions.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center border border-slate-100">
                  <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">Nenhuma evolução registrada</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl divide-y border border-slate-100">
                  {evolutions.map((evo) => (
                    <div key={evo.id} className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-blue-600" />
                          <span className="font-semibold text-slate-900">
                            {new Date(evo.date).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        {evo.current_weight && (
                          <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                            {evo.current_weight} kg
                          </span>
                        )}
                      </div>
                      {evo.performance && (
                        <div className="mb-2">
                          <span className="text-sm text-slate-500">Performance:</span>
                          <p className="text-slate-700">{evo.performance}</p>
                        </div>
                      )}
                      {evo.observations && (
                        <div>
                          <span className="text-sm text-slate-500">Observações:</span>
                          <p className="text-slate-700">{evo.observations}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Modal Criar Treino */}
      <Dialog open={showAddWorkout} onOpenChange={setShowAddWorkout}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Novo Treino</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddWorkout} className="space-y-4" data-testid="create-workout-form">
            <div>
              <label className="block text-sm font-medium mb-2">Nome do Treino *</label>
              <Input
                required
                value={newWorkout.name}
                onChange={(e) => setNewWorkout({ name: e.target.value })}
                placeholder="Ex: Treino A - Peito e Tríceps"
                data-testid="workout-name-input"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowAddWorkout(false)} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700" data-testid="submit-workout-button">
                Criar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Exercícios do Treino */}
      <Dialog open={showExercises} onOpenChange={setShowExercises}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Exercícios do Treino</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <form onSubmit={handleAddExercise} className="bg-slate-50 rounded-lg p-4 space-y-3" data-testid="add-exercise-form">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  required
                  placeholder="Nome do exercício *"
                  value={newExercise.name}
                  onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                  data-testid="exercise-name-input"
                />
                <Input
                  placeholder="Séries"
                  type="number"
                  value={newExercise.sets}
                  onChange={(e) => setNewExercise({ ...newExercise, sets: e.target.value })}
                  data-testid="exercise-sets-input"
                />
                <Input
                  placeholder="Repetições"
                  value={newExercise.reps}
                  onChange={(e) => setNewExercise({ ...newExercise, reps: e.target.value })}
                  data-testid="exercise-reps-input"
                />
                <Input
                  placeholder="Carga"
                  value={newExercise.weight}
                  onChange={(e) => setNewExercise({ ...newExercise, weight: e.target.value })}
                  data-testid="exercise-weight-input"
                />
                <Input
                  placeholder="Descanso"
                  value={newExercise.rest}
                  onChange={(e) => setNewExercise({ ...newExercise, rest: e.target.value })}
                  data-testid="exercise-rest-input"
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" data-testid="submit-exercise-button">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Exercício
              </Button>
            </form>

            <div className="space-y-2">
              {exercises.length === 0 ? (
                <p className="text-center text-slate-500 py-8">Nenhum exercício adicionado</p>
              ) : (
                exercises.map((ex) => (
                  <div
                    key={ex.id}
                    className="bg-white border rounded-lg p-4 hover:border-blue-200 transition-all"
                    data-testid={`exercise-item-${ex.id}`}
                  >
                    <div className="flex justify-between items-start">
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => openExerciseHistory(ex)}
                      >
                        <h4 className="font-semibold text-slate-900">{ex.name}</h4>
                        <p className="text-sm text-slate-600 mt-1">
                          {ex.sets && `${ex.sets} séries`}
                          {ex.reps && ` × ${ex.reps} reps`}
                          {ex.weight && ` • ${ex.weight}`}
                          {ex.rest && ` • Descanso: ${ex.rest}`}
                        </p>
                        <p className="text-xs text-blue-600 mt-2">Clique para ver histórico</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteExercise(ex.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        data-testid={`delete-exercise-${ex.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Histórico de Exercício */}
      <Dialog open={showExerciseHistory} onOpenChange={setShowExerciseHistory}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Histórico do Exercício</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <form onSubmit={handleAddHistory} className="bg-slate-50 rounded-lg p-4 space-y-3" data-testid="add-history-form">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="date"
                  required
                  value={newHistory.date}
                  onChange={(e) => setNewHistory({ ...newHistory, date: e.target.value })}
                  data-testid="history-date-input"
                />
                <Input
                  placeholder="Carga"
                  value={newHistory.weight}
                  onChange={(e) => setNewHistory({ ...newHistory, weight: e.target.value })}
                  data-testid="history-weight-input"
                />
                <Input
                  placeholder="Séries"
                  type="number"
                  value={newHistory.sets}
                  onChange={(e) => setNewHistory({ ...newHistory, sets: e.target.value })}
                  data-testid="history-sets-input"
                />
                <Input
                  placeholder="Repetições"
                  value={newHistory.reps}
                  onChange={(e) => setNewHistory({ ...newHistory, reps: e.target.value })}
                  data-testid="history-reps-input"
                />
              </div>
              <Textarea
                placeholder="Observações"
                value={newHistory.observations}
                onChange={(e) => setNewHistory({ ...newHistory, observations: e.target.value })}
                rows={2}
                data-testid="history-observations-input"
              />
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" data-testid="submit-history-button">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Registro
              </Button>
            </form>

            <div className="space-y-2">
              {exerciseHistory.length === 0 ? (
                <p className="text-center text-slate-500 py-8">Nenhum registro no histórico</p>
              ) : (
                exerciseHistory.map((hist) => (
                  <div key={hist.id} className="bg-white border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-slate-900">
                        {new Date(hist.date).toLocaleDateString('pt-BR')}
                      </span>
                      {hist.weight && (
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm">
                          {hist.weight}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600">
                      {hist.sets && `${hist.sets} séries`}
                      {hist.reps && ` × ${hist.reps} reps`}
                    </p>
                    {hist.observations && (
                      <p className="text-sm text-slate-500 mt-2">{hist.observations}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Adicionar Cardio */}
      <Dialog open={showAddCardio} onOpenChange={setShowAddCardio}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Cardio</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddCardio} className="space-y-4" data-testid="add-cardio-form">
            <div>
              <label className="block text-sm font-medium mb-2">Equipamento *</label>
              <Select
                value={newCardio.equipment}
                onValueChange={(value) => setNewCardio({ ...newCardio, equipment: value })}
              >
                <SelectTrigger data-testid="cardio-equipment-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="esteira">Esteira</SelectItem>
                  <SelectItem value="bike">Bike</SelectItem>
                  <SelectItem value="elíptico">Elíptico</SelectItem>
                  <SelectItem value="corda">Corda</SelectItem>
                  <SelectItem value="escada">Escada</SelectItem>
                  <SelectItem value="livre">Livre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tempo (minutos)</label>
                <Input
                  type="number"
                  value={newCardio.duration}
                  onChange={(e) => setNewCardio({ ...newCardio, duration: e.target.value })}
                  placeholder="30"
                  data-testid="cardio-duration-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Intensidade</label>
                <Select
                  value={newCardio.intensity}
                  onValueChange={(value) => setNewCardio({ ...newCardio, intensity: value })}
                >
                  <SelectTrigger data-testid="cardio-intensity-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="leve">Leve</SelectItem>
                    <SelectItem value="moderado">Moderado</SelectItem>
                    <SelectItem value="intenso">Intenso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Observações</label>
              <Textarea
                value={newCardio.observations}
                onChange={(e) => setNewCardio({ ...newCardio, observations: e.target.value })}
                placeholder="Anotações sobre o cardio..."
                rows={3}
                data-testid="cardio-observations-input"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowAddCardio(false)} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700" data-testid="submit-cardio-button">
                Adicionar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Adicionar Evolução */}
      <Dialog open={showAddEvolution} onOpenChange={setShowAddEvolution}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Evolução</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddEvolution} className="space-y-4" data-testid="add-evolution-form">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Data *</label>
                <Input
                  type="date"
                  required
                  value={newEvolution.date}
                  onChange={(e) => setNewEvolution({ ...newEvolution, date: e.target.value })}
                  data-testid="evolution-date-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Peso Atual (kg)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={newEvolution.current_weight}
                  onChange={(e) => setNewEvolution({ ...newEvolution, current_weight: e.target.value })}
                  placeholder="75.5"
                  data-testid="evolution-weight-input"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Performance</label>
              <Textarea
                value={newEvolution.performance}
                onChange={(e) => setNewEvolution({ ...newEvolution, performance: e.target.value })}
                placeholder="Como foi o desempenho do aluno?"
                rows={2}
                data-testid="evolution-performance-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Observações</label>
              <Textarea
                value={newEvolution.observations}
                onChange={(e) => setNewEvolution({ ...newEvolution, observations: e.target.value })}
                placeholder="Observações gerais..."
                rows={2}
                data-testid="evolution-observations-input"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowAddEvolution(false)} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700" data-testid="submit-evolution-button">
                Salvar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
