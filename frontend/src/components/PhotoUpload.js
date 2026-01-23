import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Camera, Upload } from 'lucide-react'
import { toast } from 'sonner'

export function PhotoUpload({ userId, studentId, currentPhotoUrl, onPhotoUploaded }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentPhotoUrl || null)

  async function handleFileChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem')
      return
    }

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Imagem muito grande. Máximo 5MB')
      return
    }

    setUploading(true)

    try {
      // Preview local
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)

      // Upload para Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/${studentId}_${Date.now()}.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('student-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('student-photos')
        .getPublicUrl(fileName)

      // Callback com a URL
      if (onPhotoUploaded) {
        onPhotoUploaded(publicUrl)
      }

      toast.success('Foto enviada com sucesso!')
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      toast.error('Erro ao enviar foto')
      setPreview(currentPhotoUrl)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700">Foto do Aluno</label>
      
      {preview && (
        <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-slate-200">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div>
        <input
          type="file"
          id="photo-upload"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />
        <label htmlFor="photo-upload">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer rounded-full"
            disabled={uploading}
            onClick={() => document.getElementById('photo-upload').click()}
          >
            {uploading ? (
              <>Enviando...</>
            ) : (
              <>
                <Camera className="w-4 h-4 mr-2" />
                {preview ? 'Trocar Foto' : 'Adicionar Foto'}
              </>
            )}
          </Button>
        </label>
      </div>
    </div>
  )
}
