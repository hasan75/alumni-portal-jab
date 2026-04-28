export function formatDate(date: string | Date | null, options?: Intl.DateTimeFormatOptions): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', options || {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDateShort(date: string | Date | null): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(date: string | Date | null): string {
  if (!date) return ''
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatRelativeTime(date: string | Date | null): string {
  if (!date) return ''
  const now = new Date()
  const then = new Date(date)
  const diffMs = now.getTime() - then.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDateShort(date)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function truncate(text: string, length: number = 150): string {
  if (!text) return ''
  if (text.length <= length) return text
  return text.substring(0, length).trim() + '...'
}

export function formatSalary(min: number | null, max: number | null, currency: string = 'USD', visible: boolean = true): string {
  if (!visible) return 'Salary not disclosed'
  if (!min && !max) return 'Negotiable'
  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 })
  if (min && max) return `${formatter.format(min)} – ${formatter.format(max)}`
  if (min) return `From ${formatter.format(min)}`
  return `Up to ${formatter.format(max!)}`
}

export function formatJobType(type: string): string {
  const map: Record<string, string> = {
    full_time: 'Full Time',
    part_time: 'Part Time',
    contract: 'Contract',
    internship: 'Internship',
    freelance: 'Freelance',
  }
  return map[type] || type
}

export function formatDesignation(designation: string): string {
  const map: Record<string, string> = {
    headmaster: 'Headmaster',
    assistant_headmaster: 'Assistant Headmaster',
    senior_teacher: 'Senior Teacher',
    assistant_teacher: 'Assistant Teacher',
    physical_education_teacher: 'Physical Education Teacher',
    librarian: 'Librarian',
    office_assistant: 'Office Assistant',
    night_guard: 'Night Guard',
    peon: 'Peon / Attendant',
  }
  return map[designation] || designation
}

export function formatEmploymentStatus(status: string): string {
  const map: Record<string, string> = {
    current: 'Current',
    left: 'Left Job',
    retired: 'Retired',
    deceased: 'Deceased',
  }
  return map[status] || status
}

export function safeUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined
  const trimmed = url.trim()
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return undefined
}

export function sanitizeSearchTerm(term: string): string {
  return term.replace(/[,.()]/g, '').slice(0, 200)
}
