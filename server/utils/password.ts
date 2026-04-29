import type { RefinementCtx } from 'zod'

export const PASSWORD_RULES = [
  { key: 'minLength', label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { key: 'uppercase', label: 'At least 1 uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { key: 'lowercase', label: 'At least 1 lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { key: 'number', label: 'At least 1 number', test: (p: string) => /[0-9]/.test(p) },
  { key: 'special', label: 'At least 1 special character', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
] as const

export function validatePassword(password: string): { valid: boolean, message: string | null } {
  const failed = PASSWORD_RULES.find(r => !r.test(password))
  return failed ? { valid: false, message: failed.label } : { valid: true, message: null }
}

export function zodPasswordRefinement(password: string, ctx: RefinementCtx) {
  const result = validatePassword(password)
  if (!result.valid) {
    ctx.addIssue({ code: 'custom', message: result.message! })
  }
}
