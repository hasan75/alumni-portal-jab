export type CurrentStatus = 'studying' | 'working' | 'business' | 'studying_and_working' | 'other'

export interface AlumniProfile {
  id: string
  email: string
  full_name: string
  display_name: string | null
  avatar_url: string | null
  cover_photo_url: string | null
  student_id: string | null
  batch_year: number | null
  department: string | null
  degree: string | null
  graduation_year: number | null
  date_of_birth: string | null
  gender: string | null
  phone: string | null
  city: string | null
  country: string | null
  current_status: CurrentStatus | null
  featured_education_summary: string | null
  featured_work_summary: string | null
  linkedin_url: string | null
  facebook_url: string | null
  portfolio_url: string | null
  bio: string | null
  skills: string[] | null
  show_email: boolean
  show_phone: boolean
  show_dob: boolean
  status: 'pending' | 'active' | 'suspended' | 'rejected'
  is_verified: boolean
  approved_by: string | null
  approved_at: string | null
  created_at: string
  updated_at: string
}

export interface AlumniEducation {
  id: number
  alumni_id: string
  institution: string
  degree: string | null
  field_of_study: string | null
  start_year: number | null
  end_year: number | null
  is_current: boolean
  is_featured: boolean
  description: string | null
  url: string | null
  created_at: string
}

export interface AlumniWorkExperience {
  id: number
  alumni_id: string
  company: string
  job_title: string
  location: string | null
  start_date: string | null
  end_date: string | null
  is_current: boolean
  is_featured: boolean
  description: string | null
  url: string | null
  industry: string | null
  created_at: string
}

export interface SocialPlatform {
  slug: string
  name: string
  icon: string
  base_url: string | null
  color: string | null
  placeholder: string | null
  is_active: boolean
  sort_order: number
}

export interface SocialLink {
  id: number
  entity_type: string
  entity_id: string
  platform_slug: string
  url: string
  username: string | null
  is_verified: boolean
  is_primary: boolean
  sort_order: number
}

export interface Batch {
  id: number
  year: number
  label: string | null
  description: string | null
  member_count: number
  is_active: boolean
}
