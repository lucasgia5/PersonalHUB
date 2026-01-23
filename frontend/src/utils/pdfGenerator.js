import jsPDF from 'jspdf'

export function generateStudentPDF(student, workouts, cardios, evolutions) {
  const doc = new jsPDF()
  
  // Configurações
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  let yPos = 20

  // Cabeçalho
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('PersonalPlanner', margin, yPos)
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Relatório gerado em: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth - margin - 60, yPos)
  
  yPos += 15

  // Linha divisória
  doc.setDrawColor(59, 130, 246)
  doc.setLineWidth(0.5)
  doc.line(margin, yPos, pageWidth - margin, yPos)
  yPos += 10

  // Dados do Aluno
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Dados do Aluno', margin, yPos)
  yPos += 8

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text(`Nome: ${student.name}`, margin, yPos)
  yPos += 6
  
  if (student.age) {
    doc.text(`Idade: ${student.age} anos`, margin, yPos)
    yPos += 6
  }
  
  if (student.goal) {
    doc.text(`Objetivo: ${student.goal}`, margin, yPos)
    yPos += 6
  }

  if (student.initial_weight) {
    doc.text(`Peso Inicial: ${student.initial_weight} kg`, margin, yPos)
    yPos += 6
  }

  if (student.height) {
    doc.text(`Altura: ${student.height} cm`, margin, yPos)
    yPos += 6
  }

  if (student.observations) {
    doc.setFontSize(10)
    const lines = doc.splitTextToSize(`Observações: ${student.observations}`, pageWidth - 2 * margin)
    doc.text(lines, margin, yPos)
    yPos += lines.length * 5 + 3
  }

  yPos += 5

  // Evolução de Peso
  if (evolutions && evolutions.length > 0) {
    const sortedEvolutions = [...evolutions]
      .filter(e => e.current_weight)
      .sort((a, b) => new Date(a.date) - new Date(b.date))

    if (sortedEvolutions.length > 0) {
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('Evolução de Peso', margin, yPos)
      yPos += 7

      const firstWeight = sortedEvolutions[0].current_weight
      const lastWeight = sortedEvolutions[sortedEvolutions.length - 1].current_weight
      const diff = (lastWeight - firstWeight).toFixed(1)
      const firstDate = new Date(sortedEvolutions[0].date)
      const lastDate = new Date(sortedEvolutions[sortedEvolutions.length - 1].date)
      const daysDiff = Math.floor((lastDate - firstDate) / (1000 * 60 * 60 * 24))

      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      doc.text(`Primeiro peso: ${firstWeight} kg (${firstDate.toLocaleDateString('pt-BR')})`, margin, yPos)
      yPos += 6
      doc.text(`Último peso: ${lastWeight} kg (${lastDate.toLocaleDateString('pt-BR')})`, margin, yPos)
      yPos += 6
      doc.text(`Variação: ${diff > 0 ? '+' : ''}${diff} kg em ${daysDiff} dias`, margin, yPos)
      yPos += 10
    }
  }

  // Últimos Treinos
  if (workouts && workouts.length > 0) {
    const recentWorkouts = workouts
      .filter(w => w.date)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)

    if (recentWorkouts.length > 0) {
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('Últimos Treinos', margin, yPos)
      yPos += 7

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      
      recentWorkouts.forEach((workout, index) => {
        const date = new Date(workout.date).toLocaleDateString('pt-BR')
        doc.text(`${index + 1}. ${workout.name} - ${date}`, margin + 5, yPos)
        yPos += 5
      })
      yPos += 5
    }
  }

  // Últimos Cardios
  if (cardios && cardios.length > 0) {
    const recentCardios = cardios
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5)

    if (recentCardios.length > 0 && yPos < 250) {
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('Últimos Cardios', margin, yPos)
      yPos += 7

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      
      recentCardios.forEach((cardio, index) => {
        const date = cardio.date 
          ? new Date(cardio.date).toLocaleDateString('pt-BR')
          : new Date(cardio.created_at).toLocaleDateString('pt-BR')
        const duration = cardio.duration ? `${cardio.duration} min` : ''
        const intensity = cardio.intensity ? `(${cardio.intensity})` : ''
        doc.text(`${index + 1}. ${cardio.equipment} - ${date} ${duration} ${intensity}`, margin + 5, yPos)
        yPos += 5
      })
    }
  }

  // Rodapé
  doc.setFontSize(8)
  doc.setTextColor(100)
  doc.text('PersonalPlanner - Sistema Profissional para Personal Trainers', pageWidth / 2, 285, { align: 'center' })

  // Salvar
  doc.save(`relatorio_${student.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`)
}
