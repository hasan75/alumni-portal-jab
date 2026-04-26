export type EventType = 'reunion' | 'seminar' | 'networking' | 'workshop' | 'sports' | 'cultural' | 'general'
export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed'
export type RsvpStatus = 'going' | 'maybe' | 'not_going'

export interface Event {
  id: number
  slug: string
  title: string
  description: string | null
  content: string | null
  start_datetime: string
  end_datetime: string | null
  location_name: string | null
  location_address: string | null
  is_online: boolean
  online_meeting_url: string | null
  event_type: EventType
  batch_year: number | null
  max_attendees: number | null
  cover_image_url: string | null
  status: EventStatus
  rsvp_enabled: boolean
  rsvp_deadline: string | null
  rsvp_count: number
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface EventRsvp {
  id: number
  event_id: number
  alumni_id: string
  status: RsvpStatus
  created_at: string
}
