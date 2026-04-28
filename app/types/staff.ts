export type StaffDesignation =
  | 'headmaster'
  | 'assistant_headmaster'
  | 'senior_teacher'
  | 'assistant_teacher'
  | 'physical_education_teacher'
  | 'librarian'
  | 'office_assistant'
  | 'night_guard'
  | 'peon'

export type EmploymentStatus = 'current' | 'left' | 'retired' | 'deceased'

export interface StaffMember {
  id: number
  name: string
  designation: StaffDesignation
  employment_status: EmploymentStatus
  photo_url: string | null
  phone: string | null
  subject: string | null
  joining_year: number | null
  sort_order: number
  is_featured: boolean
  bio: string | null
  created_at: string
  updated_at: string
}
