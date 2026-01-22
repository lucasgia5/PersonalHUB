import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Logo } from '@/components/Logo'
import { toast } from 'sonner'
import { Plus, Users, LogOut, User } from 'lucide-react'
import axios from 'axios'

const API = `${process.env.REACT_APP_BACKEND_URL}/api`

export function Dashboard() {
  const { user, signOut, session } = useAuth()
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddStudent, setShowAddStudent] = useState(false)
  const [newStudent, setNewStudent] = useState({
    name: '',
    age: '',
    goal: '',
    observations: '',
    initial_weight: '',
    height: '',
  })

  useEffect(() => {
    loadStudents()
  }, [])

  async function loadStudents() {
    try {
      const response = await axios.get(`${API}/students`, {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      })
      setStudents(response.data)
    } catch (error) {
      console.error('Erro ao carregar alunos:', error)
      toast.error('Erro ao carregar alunos')
    } finally {
      setLoading(false)
    }
  }

  async function handleAddStudent(e) {
    e.preventDefault()

    try {
      await axios.post(
        `${API}/students`,
        {
          ...newStudent,
          age: newStudent.age ? parseInt(newStudent.age) : null,
          initial_weight: newStudent.initial_weight ? parseFloat(newStudent.initial_weight) : null,
          height: newStudent.height ? parseFloat(newStudent.height) : null,
        },
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        }
      )

      toast.success('Aluno cadastrado com sucesso!')
      setShowAddStudent(false)
      setNewStudent({
        name: '',
        age: '',
        goal: '',
        observations: '',
        initial_weight: '',
        height: '',
      })
      loadStudents()
    } catch (error) {
      console.error('Erro ao cadastrar aluno:', error)
      toast.error('Erro ao cadastrar aluno')
    }
  }

  async function handleLogout() {
    await signOut()
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm" data-testid="dashboard-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo />
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600 hidden sm:block">{user?.email}</span>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="rounded-full border-2 border-slate-200 hover:border-blue-600 hover:text-blue-600"
                data-testid="logout-button"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Bem-vindo(a), Personal! 💪
          </h2>
          <p className="text-lg text-slate-600">Gerencie seus alunos e acompanhe a evolução de cada um</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Meus Alunos</h3>
              <span className="text-sm text-slate-500">{students.length} cadastrado{students.length !== 1 ? 's' : ''}</span>
            </div>
          </div>

          <Dialog open={showAddStudent} onOpenChange={setShowAddStudent}>
            <DialogTrigger asChild>
              <Button
                className="bg-blue-600 text-white hover:bg-blue-700 rounded-full px-6 font-semibold shadow-md hover:shadow-lg transition-all"
                data-testid="add-student-button"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Aluno
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Cadastrar Novo Aluno
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddStudent} className="space-y-4 mt-4" data-testid="add-student-form">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nome *</label>
                    <Input
                      required
                      value={newStudent.name}
                      onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                      placeholder="Nome completo"
                      className="bg-white border-2 border-slate-200 rounded-xl h-11"
                      data-testid="student-name-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Idade</label>
                    <Input
                      type="number"
                      value={newStudent.age}
                      onChange={(e) => setNewStudent({ ...newStudent, age: e.target.value })}
                      placeholder="Idade"
                      className="bg-white border-2 border-slate-200 rounded-xl h-11"
                      data-testid="student-age-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Peso Inicial (kg)</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={newStudent.initial_weight}
                      onChange={(e) => setNewStudent({ ...newStudent, initial_weight: e.target.value })}
                      placeholder="Ex: 75.5"
                      className="bg-white border-2 border-slate-200 rounded-xl h-11"
                      data-testid="student-weight-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Altura (cm)</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={newStudent.height}
                      onChange={(e) => setNewStudent({ ...newStudent, height: e.target.value })}
                      placeholder="Ex: 175"
                      className="bg-white border-2 border-slate-200 rounded-xl h-11"
                      data-testid="student-height-input"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Objetivo</label>
                  <Input
                    value={newStudent.goal}
                    onChange={(e) => setNewStudent({ ...newStudent, goal: e.target.value })}
                    placeholder="Ex: Emagrecimento, Hipertrofia..."
                    className="bg-white border-2 border-slate-200 rounded-xl h-11"
                    data-testid="student-goal-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Observações</label>
                  <Textarea
                    value={newStudent.observations}
                    onChange={(e) => setNewStudent({ ...newStudent, observations: e.target.value })}
                    placeholder="Anotações sobre o aluno..."
                    className="bg-white border-2 border-slate-200 rounded-xl"
                    rows={3}
                    data-testid="student-observations-input"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddStudent(false)}
                    className="flex-1 rounded-full border-2"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md hover:shadow-lg"
                    data-testid="submit-student-button"
                  >
                    Cadastrar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {students.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center border-2 border-slate-100" data-testid="empty-state">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Nenhum aluno cadastrado</h3>
              <p className="text-slate-600 mb-6">
                Comece cadastrando seu primeiro aluno e acompanhe a evolução dele!
              </p>
              <Button
                onClick={() => setShowAddStudent(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md hover:shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Cadastrar Primeiro Aluno
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <div
                key={student.id}
                onClick={() => navigate(`/student/${student.id}`)}
                className="bg-white border-2 border-slate-100 rounded-2xl shadow-sm p-6 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer"
                data-testid={`student-card-${student.id}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                      {student.name[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-lg">{student.name}</h3>
                      {student.age && <p className="text-sm text-slate-500">{student.age} anos</p>}
                    </div>
                  </div>
                </div>

                {student.goal && (
                  <div className="mb-3 bg-blue-50 rounded-xl p-3">
                    <span className="text-xs text-blue-600 font-medium">Objetivo:</span>
                    <p className="text-sm text-slate-900 font-medium">{student.goal}</p>
                  </div>
                )}

                <div className="flex gap-3 text-sm">
                  {student.initial_weight && (
                    <div className="flex-1 bg-slate-50 rounded-xl p-3">
                      <span className="text-xs text-slate-500 block">Peso</span>
                      <span className="font-semibold text-slate-900">{student.initial_weight} kg</span>
                    </div>
                  )}
                  {student.height && (
                    <div className="flex-1 bg-slate-50 rounded-xl p-3">
                      <span className="text-xs text-slate-500 block">Altura</span>
                      <span className="font-semibold text-slate-900">{student.height} cm</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400">
                  Última atualização: {new Date(student.updated_at).toLocaleDateString('pt-BR')}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50" data-testid="dashboard-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                PersonalHub
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600 hidden sm:block">{user?.email}</span>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="rounded-full"
                data-testid="logout-button"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Bem-vindo(a), Personal! 💪
          </h2>
          <p className="text-slate-600">Gerencie seus alunos e acompanhe a evolução de cada um</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-slate-900">Meus Alunos</h3>
            <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {students.length}
            </span>
          </div>

          <Dialog open={showAddStudent} onOpenChange={setShowAddStudent}>
            <DialogTrigger asChild>
              <Button
                className="bg-blue-600 text-white hover:bg-blue-700 rounded-full px-6 py-2 font-medium transition-all active:scale-95"
                data-testid="add-student-button"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Aluno
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Cadastrar Novo Aluno
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddStudent} className="space-y-4 mt-4" data-testid="add-student-form">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nome *</label>
                    <Input
                      required
                      value={newStudent.name}
                      onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                      placeholder="Nome completo"
                      className="bg-slate-50"
                      data-testid="student-name-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Idade</label>
                    <Input
                      type="number"
                      value={newStudent.age}
                      onChange={(e) => setNewStudent({ ...newStudent, age: e.target.value })}
                      placeholder="Idade"
                      className="bg-slate-50"
                      data-testid="student-age-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Peso Inicial (kg)</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={newStudent.initial_weight}
                      onChange={(e) => setNewStudent({ ...newStudent, initial_weight: e.target.value })}
                      placeholder="Ex: 75.5"
                      className="bg-slate-50"
                      data-testid="student-weight-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Altura (cm)</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={newStudent.height}
                      onChange={(e) => setNewStudent({ ...newStudent, height: e.target.value })}
                      placeholder="Ex: 175"
                      className="bg-slate-50"
                      data-testid="student-height-input"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Objetivo</label>
                  <Input
                    value={newStudent.goal}
                    onChange={(e) => setNewStudent({ ...newStudent, goal: e.target.value })}
                    placeholder="Ex: Emagrecimento, Hipertrofia..."
                    className="bg-slate-50"
                    data-testid="student-goal-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Observações</label>
                  <Textarea
                    value={newStudent.observations}
                    onChange={(e) => setNewStudent({ ...newStudent, observations: e.target.value })}
                    placeholder="Anotações sobre o aluno..."
                    className="bg-slate-50"
                    rows={3}
                    data-testid="student-observations-input"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddStudent(false)}
                    className="flex-1 rounded-full"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-full"
                    data-testid="submit-student-button"
                  >
                    Cadastrar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {students.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-slate-100" data-testid="empty-state">
            <div className="max-w-md mx-auto">
              <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Nenhum aluno cadastrado</h3>
              <p className="text-slate-600 mb-6">
                Comece cadastrando seu primeiro aluno e acompanhe a evolução dele!
              </p>
              <Button
                onClick={() => setShowAddStudent(true)}
                className="bg-blue-600 hover:bg-blue-700 rounded-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Cadastrar Primeiro Aluno
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <div
                key={student.id}
                onClick={() => navigate(`/student/${student.id}`)}
                className="bg-white border border-slate-100 rounded-xl shadow-sm p-6 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer"
                data-testid={`student-card-${student.id}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                      {student.name[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{student.name}</h3>
                      {student.age && <p className="text-sm text-slate-500">{student.age} anos</p>}
                    </div>
                  </div>
                </div>

                {student.goal && (
                  <div className="mb-3">
                    <span className="text-xs text-slate-500">Objetivo:</span>
                    <p className="text-sm text-slate-700 font-medium">{student.goal}</p>
                  </div>
                )}

                <div className="flex gap-3 text-sm">
                  {student.initial_weight && (
                    <div className="flex-1 bg-slate-50 rounded-lg p-2">
                      <span className="text-xs text-slate-500 block">Peso</span>
                      <span className="font-semibold text-slate-900">{student.initial_weight} kg</span>
                    </div>
                  )}
                  {student.height && (
                    <div className="flex-1 bg-slate-50 rounded-lg p-2">
                      <span className="text-xs text-slate-500 block">Altura</span>
                      <span className="font-semibold text-slate-900">{student.height} cm</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
                  Última atualização: {new Date(student.updated_at).toLocaleDateString('pt-BR')}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
