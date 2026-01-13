import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Dumbbell } from 'lucide-react'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await signIn(email, password)

    if (error) {
      toast.error('Email ou senha inválidos')
    } else {
      toast.success('Login realizado com sucesso!')
      navigate('/dashboard')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1745329532608-bbda3b742e00?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTJ8MHwxfHNlYXJjaHwxfHxwZXJzb25hbCUyMHRyYWluZXIlMjBneW0lMjB3b3Jrb3V0fGVufDB8fHx8MTc2ODMzMjIyM3ww&ixlib=rb-4.1.0&q=85"
          alt="Personal trainer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent" />
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 mb-4">
              <Dumbbell className="w-8 h-8 text-white" data-testid="login-logo-icon" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Manrope, sans-serif' }} data-testid="login-title">
              PersonalHub
            </h1>
            <p className="text-slate-600">Acesse sua conta profissional</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8 border border-slate-100">
            <form onSubmit={handleLogin} className="space-y-6" data-testid="login-form">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg h-11"
                  data-testid="login-email-input"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  Senha
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg h-11"
                  data-testid="login-password-input"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-full px-6 py-2 font-medium transition-all active:scale-95 h-11"
                disabled={loading}
                data-testid="login-submit-button"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                Teste: teste@gmail.com / teste
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
