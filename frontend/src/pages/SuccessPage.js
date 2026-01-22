import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { CheckCircle, Loader2 } from 'lucide-react'
import { Logo } from '@/components/Logo'
import axios from 'axios'
import { toast } from 'sonner'

const API = `${process.env.REACT_APP_BACKEND_URL}/api`

export function SuccessPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [paymentData, setPaymentData] = useState(null)
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    verifyPayment()
  }, [sessionId])

  async function verifyPayment() {
    if (!sessionId) {
      toast.error('Sessão inválida')
      navigate('/')
      return
    }

    try {
      const response = await axios.get(`${API}/verify-payment/${sessionId}`)
      setPaymentData(response.data)
    } catch (error) {
      console.error('Erro ao verificar pagamento:', error)
      toast.error('Erro ao verificar pagamento')
      setTimeout(() => navigate('/'), 3000)
    } finally {
      setLoading(false)
    }
  }

  function handleCreateAccount() {
    if (paymentData) {
      navigate(`/signup?token=${paymentData.token}&email=${paymentData.email}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Verificando seu pagamento...</p>
        </div>
      </div>
    )
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-slate-600 mb-4">Pagamento não encontrado</p>
          <Button onClick={() => navigate('/')}>Voltar para início</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-100 p-8 md:p-12 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-blue-600" />
          </div>
          
          <h1 
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
            style={{ fontFamily: 'Manrope, sans-serif' }}
            data-testid="success-title"
          >
            Pagamento Confirmado! 🎉
          </h1>
          
          <p className="text-lg text-slate-600 mb-8">
            Obrigado por assinar o PersonalPlanner! Agora você pode criar sua conta e começar a gerenciar seus alunos.
          </p>

          <div className="bg-blue-50 rounded-xl p-6 mb-8 text-left border border-blue-200">
            <h3 className="font-semibold text-slate-900 mb-3">Detalhes da compra:</h3>
            <div className="space-y-2">
              <p className="text-slate-700">
                <span className="font-medium">Email:</span> {paymentData.email}
              </p>
              <p className="text-slate-700">
                <span className="font-medium">Plano:</span> {
                  paymentData.plan_type === 'monthly' ? 'Mensal (R$ 50/mês)' :
                  paymentData.plan_type === 'semester' ? 'Semestral (R$ 45/mês)' :
                  'Anual (R$ 40/mês)'
                }
              </p>
            </div>
          </div>

          <Button
            onClick={handleCreateAccount}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all font-semibold"
            data-testid="create-account-button"
          >
            Criar Minha Conta Agora
          </Button>

          <p className="text-sm text-slate-500 mt-6">
            Você receberá um email de confirmação em breve
          </p>
        </div>
      </div>
    </div>
  )
}
