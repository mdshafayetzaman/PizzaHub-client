export async function uploadImageToImgBB(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY
  if (!apiKey) {
    throw new Error('Missing NEXT_PUBLIC_IMGBB_API_KEY. Add your ImgBB API key to upload images.')
  }

  const formData = new FormData()
  formData.append('image', file)

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: 'POST',
    body: formData,
  })

  const payload = await response.json().catch(() => null)
  if (!response.ok || !payload?.success) {
    const message = payload?.error?.message || 'Image upload failed.'
    throw new Error(message)
  }

  const url = payload?.data?.display_url || payload?.data?.url
  if (!url) throw new Error('Image upload did not return a URL.')
  return url as string
}
