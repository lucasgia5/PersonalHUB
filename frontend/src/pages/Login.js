import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Logo } from '@/components/Logo'
import { toast } from 'sonner'

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
    <div className="min-h-screen flex bg-white">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <Logo className="h-16 brightness-0 invert mb-8" />
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Bem-vindo ao PersonalPlanner
          </h1>
          <p className="text-xl text-blue-100">
            Gerencie seus alunos, treinos e evolução em um só lugar
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-block lg:hidden mb-6">
              <Logo />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Manrope, sans-serif' }} data-testid="login-title">
              Entrar na sua conta
            </h1>
            <p className="text-slate-600">Acesse o painel profissional</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 border-2 border-slate-100">
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
                  className="bg-white border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl h-12"
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
                  className="bg-white border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl h-12"
                  data-testid="login-password-input"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-full px-6 py-3 font-semibold text-base transition-all active:scale-95 h-12 shadow-md hover:shadow-lg"
                disabled={loading}
                data-testid="login-submit-button"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
