import { profanity } from '@2toad/profanity'

interface ModerationResult {
  allowed: boolean
  reason?: string
}

export function moderateContent(text: string): ModerationResult {
  if (profanity.exists(text)) {
    return { allowed: false, reason: 'This content contains inappropriate language and cannot be posted.' }
  }
  return { allowed: true }
}
