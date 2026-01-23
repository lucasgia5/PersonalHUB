import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Logo } from '@/components/Logo'
import axios from 'axios'
import { toast } from 'sonner'

const API = `${process.env.REACT_APP_BACKEND_URL}/api`

export function SignupPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: searchParams.get('email') || '',
    password: '',
    confirmPassword: ''
  })
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      toast.error('Para criar conta, escolha um plano')
      setTimeout(() => navigate('/#planos'), 2000)
    }
  }, [token, navigate])

  async function handleSubmit(e) {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas não coincidem')
      return
    }

    if (formData.password.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres')
      return
    }

    setLoading(true)
    try {
      await axios.post(`${API}/signup`, {
        email: formData.email,
        password: formData.password,
        token: token
      })

      toast.success('Conta criada com sucesso!')
      setTimeout(() => navigate('/login'), 2000)
    } catch (error) {
      console.error('Erro ao criar conta:', error)
      const message = error.response?.data?.detail || 'Erro ao criar conta'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return null
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block mb-6">
            <Logo />
          </div>
          <h1 
            className="text-3xl font-bold text-slate-900 mb-2" 
            style={{ fontFamily: 'Manrope, sans-serif' }}
            data-testid="signup-title"
          >
            Criar Sua Conta
          </h1>
          <p className="text-slate-600">
            Último passo para começar a usar o PersonalPlanner
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 border-2 border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6" data-testid="signup-form">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled
                className="bg-slate-100 border-2 border-slate-200 rounded-xl h-12"
                data-testid="signup-email-input"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Senha (mínimo 6 caracteres)
              </label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
                placeholder="••••••••"
                className="bg-white border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl h-12"
                data-testid="signup-password-input"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                Confirmar Senha
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                minLength={6}
                placeholder="••••••••"
                className="bg-white border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl h-12"
                data-testid="signup-confirm-password-input"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full py-6 font-semibold shadow-md hover:shadow-lg transition-all"
              disabled={loading}
              data-testid="signup-submit-button"
            >
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </Button>
          </form>

          <p className="text-sm text-slate-500 text-center mt-6">
            Ao criar sua conta, você concorda com nossos{' '}
            <a href="#" className="text-blue-600 hover:underline font-medium">Termos de Uso</a>
          </p>
        </div>
      </div>
    </div>
  )
}
