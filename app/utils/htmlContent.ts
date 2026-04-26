export function extractStorageImagesFromHtml(html: string, bucket: string): string[] {
  if (!html) return []
  const marker = `/storage/v1/object/public/${bucket}/`
  const urls: string[] = []
  const regex = /<img[^>]+src="([^"]*)"[^>]*>/gi
  let match
  while ((match = regex.exec(html)) !== null) {
    if (match[1].includes(marker)) {
      urls.push(match[1])
    }
  }
  return urls
}

export async function deleteOrphanedImages(
  initialImages: string[],
  currentImages: string[],
  bucket: string,
) {
  const { remove, extractPathFromUrl } = useImageUpload()
  const currentSet = new Set(currentImages)
  const orphaned = initialImages.filter(url => !currentSet.has(url))

  for (const url of orphaned) {
    const path = extractPathFromUrl(url, bucket)
    if (path) {
      await remove(bucket, path)
    }
  }
}
