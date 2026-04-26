export function useImageUpload() {
  const supabase = useSupabaseClient()
  const uploading = ref(false)
  const progress = ref(0)
  const error = ref<string | null>(null)

  function generatePath(prefix: string, fileName: string): string {
    const timestamp = Date.now()
    const sanitized = fileName.replace(/[^a-zA-Z0-9._-]/g, '_')
    return `${prefix}/${timestamp}-${sanitized}`
  }

  function getPublicUrl(bucket: string, path: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  }

  async function upload(
    file: File,
    bucket: string,
    prefix: string,
    options?: { maxSizeMB?: number; accept?: string },
  ): Promise<{ url: string | null; error: string | null }> {
    const maxSize = (options?.maxSizeMB ?? 5) * 1024 * 1024

    if (file.size > maxSize) {
      return { url: null, error: `File size exceeds ${options?.maxSizeMB ?? 5}MB limit` }
    }

    if (options?.accept && options.accept !== 'image/*') {
      const allowed = options.accept.split(',').map(t => t.trim())
      if (!allowed.some(t => file.type.startsWith(t.replace('*', '')))) {
        return { url: null, error: `File type ${file.type} is not allowed` }
      }
    }
    else if (!file.type.startsWith('image/')) {
      return { url: null, error: 'Only image files are allowed' }
    }

    uploading.value = true
    progress.value = 0
    error.value = null

    try {
      const path = generatePath(prefix, file.name)

      progress.value = 20

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: true, contentType: file.type })

      if (uploadError) {
        error.value = uploadError.message
        return { url: null, error: uploadError.message }
      }

      progress.value = 90

      const url = getPublicUrl(bucket, path)
      progress.value = 100

      return { url, error: null }
    }
    catch (e: any) {
      const msg = e?.message || 'Upload failed'
      error.value = msg
      return { url: null, error: msg }
    }
    finally {
      uploading.value = false
    }
  }

  async function remove(
    bucket: string,
    filePath: string,
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error: removeError } = await supabase.storage
        .from(bucket)
        .remove([filePath])

      if (removeError) {
        return { success: false, error: removeError.message }
      }
      return { success: true, error: null }
    }
    catch (e: any) {
      return { success: false, error: e?.message || 'Failed to remove file' }
    }
  }

  function extractPathFromUrl(url: string, bucket: string): string | null {
    const marker = `/storage/v1/object/public/${bucket}/`
    const idx = url.indexOf(marker)
    if (idx === -1) return null
    return url.substring(idx + marker.length)
  }

  return {
    uploading,
    progress,
    error,
    upload,
    remove,
    getPublicUrl,
    generatePath,
    extractPathFromUrl,
  }
}
