// ================= TEXT UTILITIES =================
export const countWords = (text: string): number => {
  if (!text || typeof text !== 'string') return 0
  
  // Remove extra whitespace, split by spaces, and filter out empty strings
  return text
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .filter(word => word.length > 0).length
}

export const formatWordCount = (count: number): string => {
  if (count === 0) return '0 words'
  if (count === 1) return '1 word'
  
  // Format large numbers with commas
  return `${count.toLocaleString()} words`
}

// ================= FILE SIZE UTILITIES =================
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export const getFileSizeFromFile = (file: File): number => {
  return file.size
}

// ================= DOCUMENT UTILITIES =================
export interface DocumentStats {
  wordCount: number
  fileSize: number
  formattedWordCount: string
  formattedFileSize: string
}

export const getDocumentStats = (text: string, fileSize?: number): DocumentStats => {
  const wordCount = countWords(text)
  const size = fileSize || 0
  
  return {
    wordCount,
    fileSize: size,
    formattedWordCount: formatWordCount(wordCount),
    formattedFileSize: formatFileSize(size)
  }
}

// ================= TEXT PREVIEW UTILITIES =================
export const getTextPreview = (text: string, maxLength: number = 150): string => {
  if (!text || text.length <= maxLength) return text
  
  // Find the last space before the max length to avoid cutting words
  const truncated = text.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  
  if (lastSpace > maxLength * 0.7) {
    return truncated.substring(0, lastSpace) + '...'
  }
  
  return truncated + '...'
}