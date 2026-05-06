export type JobType = 'full_time' | 'part_time' | 'contract' | 'internship' | 'freelance'
export type JobStatus = 'draft' | 'published' | 'closed' | 'archived' | 'pending_review'

export interface JobCategory {
  id: number
  code: string
  name: string
  icon: string | null
  display_order: number
}

export interface Job {
  id: number
  slug: string
  title: string
  company: string
  company_logo_url: string | null
  cover_image_url: string | null
  company_website: string | null
  category_id: number | null
  category?: JobCategory
  description: string | null
  requirements: string | null
  benefits: string | null
  location: string | null
  is_remote: boolean
  job_type: JobType
  salary_min: number | null
  salary_max: number | null
  salary_currency: string
  is_salary_visible: boolean
  apply_url: string | null
  apply_email: string | null
  application_deadline: string | null
  status: JobStatus
  is_featured: boolean
  view_count: number
  additional_photos: string[]
  posted_by: string | null
  alumni_posted: boolean
  created_at: string
  updated_at: string
}
