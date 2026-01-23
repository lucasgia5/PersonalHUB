import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown } from 'lucide-react'

export function WeightEvolutionChart({ evolutions, goal }) {
  if (!evolutions || evolutions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border-2 border-slate-100 p-8 text-center">
        <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500 mb-4">Nenhuma evolução registrada ainda</p>
        <p className="text-sm text-slate-400">Adicione o primeiro registro para visualizar o gráfico</p>
      </div>
    )
  }

  // Ordenar por data e preparar dados
  const sortedData = [...evolutions]
    .filter(e => e.current_weight)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(e => ({
      date: new Date(e.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      peso: parseFloat(e.current_weight)
    }))

  if (sortedData.length === 0) {
    return (
      <div className="bg-white rounded-2xl border-2 border-slate-100 p-8 text-center">
        <p className="text-slate-500">Nenhum peso registrado nas evoluções</p>
      </div>
    )
  }

  const firstWeight = sortedData[0].peso
  const lastWeight = sortedData[sortedData.length - 1].peso
  const diff = lastWeight - firstWeight
  const diffPercent = ((diff / firstWeight) * 100).toFixed(1)

  // Detectar meta baseada no objetivo
  let goalType = null
  if (goal) {
    const goalLower = goal.toLowerCase()
    if (goalLower.includes('perda') || goalLower.includes('emagrec') || 
        goalLower.includes('cut') || goalLower.includes('definir') || 
        goalLower.includes('seca')) {
      goalType = 'reduction'
    } else if (goalLower.includes('massa') || goalLower.includes('ganho') || 
               goalLower.includes('bulk') || goalLower.includes('hipertrofia') || 
               goalLower.includes('aument')) {
      goalType = 'gain'
    }
  }

  return (
    <div className="space-y-6">
      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <p className="text-sm text-blue-600 font-medium mb-1">Peso Inicial</p>
          <p className="text-2xl font-bold text-slate-900">{firstWeight} kg</p>
        </div>
        
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <p className="text-sm text-green-600 font-medium mb-1">Peso Atual</p>
          <p className="text-2xl font-bold text-slate-900">{lastWeight} kg</p>
        </div>
        
        <div className={`rounded-xl p-4 border ${
          diff > 0 
            ? 'bg-orange-50 border-orange-200' 
            : 'bg-emerald-50 border-emerald-200'
        }`}>
          <p className={`text-sm font-medium mb-1 ${
            diff > 0 ? 'text-orange-600' : 'text-emerald-600'
          }`}>
            Variação
          </p>
          <div className="flex items-center gap-2">
            {diff > 0 ? (
              <TrendingUp className="w-5 h-5 text-orange-600" />
            ) : (
              <TrendingDown className="w-5 h-5 text-emerald-600" />
            )}
            <p className="text-2xl font-bold text-slate-900">
              {diff > 0 ? '+' : ''}{diff.toFixed(1)} kg
            </p>
            <span className="text-sm text-slate-600">({diffPercent}%)</span>
          </div>
        </div>
      </div>

      {/* Meta baseada no objetivo */}
      {goalType && (
        <div className={`rounded-xl p-4 border-2 ${
          goalType === 'reduction' 
            ? 'bg-blue-50 border-blue-300' 
            : 'bg-purple-50 border-purple-300'
        }`}>
          <p className={`text-sm font-semibold ${
            goalType === 'reduction' ? 'text-blue-700' : 'text-purple-700'
          }`}>
            {goalType === 'reduction' ? '🎯 Meta: Redução de Peso' : '🎯 Meta: Ganho de Massa'}
          </p>
          <p className="text-sm text-slate-600 mt-1">
            {goalType === 'reduction' 
              ? diff < 0 ? '✅ Progresso positivo!' : '⚠️ Peso aumentou' 
              : diff > 0 ? '✅ Progresso positivo!' : '⚠️ Peso diminuiu'}
          </p>
        </div>
      )}

      {/* Gráfico */}
      <div className="bg-white rounded-2xl border-2 border-slate-100 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Evolução do Peso</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sortedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="date" 
              stroke="#64748b"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#64748b"
              style={{ fontSize: '12px' }}
              domain={['dataMin - 2', 'dataMax + 2']}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                padding: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="peso" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
