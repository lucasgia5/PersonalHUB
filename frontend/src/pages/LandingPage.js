import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Dumbbell, Check, Users, Calendar, TrendingUp, FileText, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import axios from 'axios'

const API = `${process.env.REACT_APP_BACKEND_URL}/api`

export function LandingPage() {
  const navigate = useNavigate()
  const [checkoutLoading, setCheckoutLoading] = useState(null)
  const [planEmails, setPlanEmails] = useState({
    monthly: '',
    semester: '',
    annual: ''
  })
  const [faqOpen, setFaqOpen] = useState(null)

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleEmailChange = (planType, value) => {
    setPlanEmails(prev => ({
      ...prev,
      [planType]: value
    }))
  }

  async function handleCheckout(planType) {
    const email = planEmails[planType]
    
    if (!email || !email.includes('@')) {
      toast.error('Digite um email válido')
      return
    }

    setCheckoutLoading(planType)
    try {
      const response = await axios.post(`${API}/create-checkout`, {
        plan_type: planType,
        email: email.trim()
      })
      window.location.href = response.data.checkout_url
    } catch (error) {
      console.error('Erro ao criar checkout:', error)
      toast.error('Erro ao processar pagamento. Tente novamente.')
      setCheckoutLoading(null)
    }
  }

  const faqs = [
    {
      question: 'Posso cancelar quando quiser?',
      answer: 'Sim! Você pode cancelar sua assinatura a qualquer momento, sem multa ou burocracia. Seu acesso permanece ativo até o fim do período pago.'
    },
    {
      question: 'Meus dados ficam seguros?',
      answer: 'Absolutamente! Utilizamos criptografia de ponta e armazenamento seguro no Supabase. Seus dados e dos seus alunos estão protegidos com as melhores práticas de segurança.'
    },
    {
      question: 'Posso usar no celular?',
      answer: 'Sim! O PersonalHub é totalmente responsivo e funciona perfeitamente em smartphones, tablets e computadores. Acesse de qualquer lugar!'
    },
    {
      question: 'Preciso ter muitos alunos?',
      answer: 'Não! O PersonalHub é ideal tanto para quem está começando quanto para quem já tem muitos alunos. Você pode cadastrar alunos ilimitados em qualquer plano.'
    },
    {
      question: 'Como funciona o acesso após pagar?',
      answer: 'Após a confirmação do pagamento, você receberá um link para criar sua conta. É super rápido! Em menos de 2 minutos você já estará cadastrando seus primeiros alunos.'
    }
  ]

  const plans = [
    {
      name: 'Mensal',
      price: 'R$ 50',
      period: '/mês',
      total: 'Total: R$ 50,00',
      type: 'monthly',
      badge: null,
      features: [
        'Alunos ilimitados',
        'Rotina semanal',
        'Histórico de treinos',
        'Registro de cardio',
        'Evolução do aluno',
        'Suporte por email'
      ]
    },
    {
      name: 'Semestral',
      price: 'R$ 45',
      period: '/mês',
      total: 'Total: R$ 270,00',
      type: 'semester',
      badge: 'Economize R$ 30',
      features: [
        'Alunos ilimitados',
        'Rotina semanal',
        'Histórico de treinos',
        'Registro de cardio',
        'Evolução do aluno',
        'Suporte prioritário'
      ]
    },
    {
      name: 'Anual',
      price: 'R$ 40',
      period: '/mês',
      total: 'Total: R$ 480,00',
      type: 'annual',
      badge: 'Melhor custo-benefício',
      badgeColor: 'green',
      features: [
        'Alunos ilimitados',
        'Rotina semanal',
        'Histórico de treinos',
        'Registro de cardio',
        'Evolução do aluno',
        'Suporte VIP'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50" data-testid="landing-header">
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
              <Button
                variant="ghost"
                onClick={() => navigate('/login')}
                className="hidden sm:inline-flex"
                data-testid="header-login-button"
              >
                Entrar
              </Button>
              <Button
                onClick={() => scrollToSection('planos')}
                className="bg-blue-600 hover:bg-blue-700 rounded-full"
                data-testid="header-plans-button"
              >
                Ver Planos
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight"
              style={{ fontFamily: 'Manrope, sans-serif' }}
              data-testid="hero-title"
            >
              Organize seus alunos.<br />
              Prove resultados.<br />
              Economize tempo.
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed">
              PersonalHub é um sistema profissional para personal trainers gerenciarem alunos, treinos, cardio e evolução em um só lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => scrollToSection('planos')}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 rounded-full text-lg px-8 py-6"
                data-testid="hero-cta-primary"
              >
                Assinar Agora
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                onClick={() => scrollToSection('funcionalidades')}
                size="lg"
                variant="outline"
                className="rounded-full text-lg px-8 py-6"
                data-testid="hero-cta-secondary"
              >
                Ver Funcionalidades
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* O que você resolve */}
      <section id="funcionalidades" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 
              className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4"
              style={{ fontFamily: 'Manrope, sans-serif' }}
            >
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-lg text-slate-600">
              Pare de usar planilhas, WhatsApp e cadernos. Tenha tudo organizado profissionalmente.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: 'Gestão de Alunos',
                description: 'Cadastre alunos ilimitados com dados completos: idade, objetivo, peso, altura e observações importantes.'
              },
              {
                icon: Calendar,
                title: 'Planejamento Semanal',
                description: 'Monte a rotina semanal de cada aluno. Visualize segunda a domingo e vincule treinos aos dias da semana.'
              },
              {
                icon: Dumbbell,
                title: 'Registro de Treinos',
                description: 'Adicione exercícios realizados com séries, repetições, carga e descanso. Acompanhe o histórico completo.'
              },
              {
                icon: TrendingUp,
                title: 'Histórico por Exercício',
                description: 'Veja a evolução de cada exercício ao longo do tempo. Registre peso, séries e reps de cada treino realizado.'
              },
              {
                icon: FileText,
                title: 'Cardio e Evolução',
                description: 'Registre cardio (esteira, bike, etc) com duração e intensidade. Acompanhe evolução de peso e performance.'
              },
              {
                icon: Check,
                title: 'Dados Seguros',
                description: 'Seus dados e dos seus alunos ficam protegidos com criptografia. Cada personal acessa apenas suas informações.'
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-slate-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
                data-testid={`feature-${index}`}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Planos */}
      <section id="planos" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 
              className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4"
              style={{ fontFamily: 'Manrope, sans-serif' }}
            >
              Escolha seu plano
            </h2>
            <p className="text-lg text-slate-600">
              Sem taxa de setup. Cancele quando quiser. Alunos ilimitados.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl p-8 border-2 ${
                  plan.badgeColor === 'green' 
                    ? 'border-green-500 shadow-xl scale-105' 
                    : 'border-slate-200 shadow-sm'
                } hover:shadow-lg transition-all relative`}
                data-testid={`plan-${plan.type}`}
              >
                {plan.badge && (
                  <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 ${
                    plan.badgeColor === 'green' ? 'bg-green-500' : 'bg-blue-500'
                  } text-white px-4 py-1 rounded-full text-sm font-medium`}>
                    {plan.badge}
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                    <span className="text-slate-600">{plan.period}</span>
                  </div>
                  <p className="text-sm text-slate-500">{plan.total}</p>
                </div>

                <div className="mb-6">
                  <input
                    type="email"
                    placeholder="Seu email"
                    value={planEmails[plan.type]}
                    onChange={(e) => handleEmailChange(plan.type, e.target.value)}
                    onBlur={(e) => handleEmailChange(plan.type, e.target.value.trim())}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                    data-testid={`email-input-${plan.type}`}
                  />
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleCheckout(plan.type)}
                  disabled={checkoutLoading === plan.type || !planEmails[plan.type]}
                  className={`w-full rounded-full py-6 ${
                    plan.badgeColor === 'green'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                  data-testid={`checkout-button-${plan.type}`}
                >
                  {checkoutLoading === plan.type ? 'Processando...' : 'Assinar Agora'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 
              className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4"
              style={{ fontFamily: 'Manrope, sans-serif' }}
            >
              Dúvidas Frequentes
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-slate-50 rounded-xl overflow-hidden"
                data-testid={`faq-${index}`}
              >
                <button
                  onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                  className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-slate-100 transition-colors"
                >
                  <span className="font-semibold text-slate-900">{faq.question}</span>
                  <ChevronRight 
                    className={`w-5 h-5 text-slate-400 transition-transform ${
                      faqOpen === index ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                {faqOpen === index && (
                  <div className="px-6 pb-4 text-slate-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  PersonalHub
                </h3>
              </div>
              <p className="text-slate-400">
                Sistema profissional para personal trainers
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Política de Privacidade</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contato</h4>
              <ul className="space-y-2 text-slate-400">
                <li>suporte@personalhub.com</li>
                <li>WhatsApp: (11) 99999-9999</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>&copy; 2025 PersonalHub. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
