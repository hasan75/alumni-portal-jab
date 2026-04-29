# Alumni Portal — Feature List

A comprehensive overview of all features available across every user type and section of the portal.

---

## User Types

| Role | Description |
|------|-------------|
| **Visitor** | Unauthenticated browser — public pages only |
| **Member (Alumni)** | Registered and approved alumni — full portal access |
| **Admin** | Staff/moderator — full content and member management |

---

## Visitor (Public) Features

### Landing Page
- Hero section with institution branding and call-to-action
- Featured news articles preview
- Upcoming events preview
- Featured job postings
- Featured current staff/teachers
- Testimonials section

### News & Articles
- Browse all published articles
- Filter articles by category
- Read full article with author info, reading time, and tags
- Article view count tracking

### Events (Public Listing)
- Browse upcoming published events
- View event detail page (date, location, description, type)

### Jobs (Public Listing)
- Browse published job postings
- Filter by category, job type, and remote status
- View full job detail (company, requirements, salary range, application link)
- Job view count tracking

### Teachers & Staff
- View featured current staff directory with photos, designation, and subject

### Authentication
- Register a new alumni account (email, password, basic info)
- Log in to the member portal
- Forgot password / reset password via email link
- Email confirmation on registration

---

## Member (Alumni) Features

> Requires approved account. Access to all public features plus the following.

### Profile Management
- Edit personal info: full name, display name, bio, city, country, gender, date of birth, phone
- Upload and change avatar and cover photo
- Set current status: Studying · Working · Running a Business · Studying & Working · Other
- Privacy controls: independently toggle visibility of email, phone, and date of birth to other alumni

### Education Records
- Add multiple education entries (institution, degree, field, start/end year, description, link)
- Mark an entry as currently ongoing (`is_current`)
- Set one entry as the **featured** education shown on directory cards
- Edit and delete individual education records

### Work Experience
- Add multiple work entries (company, job title, location, industry, dates, description)
- Mark a position as currently held
- Set one entry as the **featured** work experience shown on directory cards
- Edit and delete individual work records

### Social Links
- Connect LinkedIn, Facebook, and GitHub / portfolio URL
- Links appear on public profile and directory cards

### Alumni Directory
- Browse paginated directory of all active alumni (24 per page)
- Search by name or company
- Filter by graduation batch year
- View any alumni's public profile: bio, featured education/work, social links

### Social Feed
- **General feed** — posts visible to all members
- **Batch feed** — posts scoped to a specific graduation year (e.g. only Class of 2015 members see them)
- Create text posts (up to 2,000 characters) with up to 4 images
- React to posts: Like · Love · Celebrate · Support (toggle reaction, one per post)
- Comment on posts with nested/threaded replies
- Content moderation: posts and comments are screened automatically

### Events
- Browse upcoming and past published events with filters
- View full event detail: date, time, venue, online meeting link, description
- **RSVP** to events: Going · Maybe · Not Going
- Update or remove your RSVP
- See total RSVP count per event

### Jobs
- Browse job board with category, job type, and remote filters
- View full job posting with requirements, salary, and application method
- Apply via external link or email

### News
- Read all published articles
- Filter by category and tags

### Pending State
- After registration, members land on a waiting screen until an admin approves the account

---

## Admin Features

> Accessed via `/admin`. Separate login flow. Full access to all content and member data.

### Dashboard
- At-a-glance stats: pending approvals, active members, upcoming events, published articles, open jobs, posts this week
- Quick-action links to key management pages

### Member Management (`/admin/members`)
- List all alumni with search (name/email) and status filter: Pending · Active · Suspended · Rejected
- Paginated list (25 per page)
- **Bulk approve** selected pending members
- **Reject** a member (removes account and profile)
- **Suspend** a member (blocks login, retains data)
- View full member detail page with all profile, education, and work data

### Events Management (`/admin/events`)
- List all events with status filter: Draft · Published · Cancelled · Completed
- Create new event with:
  - Title, slug, description, rich content
  - Start and end date/time
  - Event type: Reunion · Seminar · Networking · Workshop · Sports · Cultural · General
  - Location (physical address or online meeting URL)
  - Batch targeting (restrict to a specific graduation year or open to all)
  - Max attendees and RSVP deadline
  - Cover image upload
- Edit existing events
- Change status (publish, cancel, mark as completed)
- Delete events

### News / Articles Management (`/admin/news`)
- List all articles with status filter: Draft · Published · Archived
- Create new article with:
  - Title, subtitle, excerpt
  - Rich text content editor
  - Featured image and OG image upload
  - Category and tags (multi-select)
  - Author name, bio, avatar, and optional linked alumni profile
  - SEO meta title and description
  - Reading time
  - Mark as **Featured** or **Breaking**
- Edit existing articles
- Publish, archive, or revert to draft
- Delete articles

### Jobs Management (`/admin/jobs`)
- List all jobs with status filter: Draft · Published · Closed · Archived
- Create new job with:
  - Title, company name, company logo and website
  - Job category, job type: Full-time · Part-time · Contract · Internship · Freelance
  - Description, requirements, benefits (rich text)
  - Location, remote toggle
  - Salary range and currency (with option to hide salary)
  - Application method: external URL or email
  - Application deadline
  - Cover image upload
  - Mark as **Featured**
- Edit existing jobs
- Publish, close, or archive jobs
- Delete jobs

### Feed Moderation (`/admin/feed`)
- View all feed posts across all members with status filter: Published · Hidden · Removed
- **Hide** a post (removes from feeds, retains data)
- **Remove** a post with a logged reason
- View post content, author, and timestamps

### Staff Management (`/admin/staff`)
- List all staff members with designation and employment status filters
- Create new staff member with:
  - Name, designation, subject, phone, bio
  - Employment status: Current · Left · Retired · Deceased
  - Joining year
  - Photo upload
  - Sort order and **Featured** toggle (featured staff appear on the public page)
- Edit and delete staff records

### Batch Management (`/admin/batches`)
- List all graduation batches with member counts
- Create, edit, and activate/deactivate batches
- Batch labels used across directory, feed, and events

### Audit Log (`/admin/audit-log`)
- Full tamper-evident trail of every create, update, and delete action
- Filter by action type, admin user, table name, or keyword search
- Records: who made the change, what changed (old vs new values), timestamp, and IP address

### Site Settings (`/admin/settings`)
- Configure global site branding: app name, institution name, tagline, primary color, logo

---

## Cross-Cutting Technical Features

### Security & Access Control
- Row-level security (RLS) on all database tables
- Separate middleware guards for member and admin routes
- Service-role-only server routes for sensitive operations (registration, member actions)
- Content moderation on all user-generated text (posts, comments)

### Data Integrity
- Automatic slug generation for events, articles, and jobs
- Denormalized counters kept in sync via database triggers (RSVP count, reaction count, comment count, batch member count)
- Auto-selection of featured education/work if none is explicitly set

### File Uploads
- Supabase Storage buckets per content type: profiles, articles, jobs, events, feed, staff
- Client-side validation: 5 MB size limit, image types only
- Timestamped file paths to avoid collisions

### Performance
- Static prerender for the landing page (`/`)
- SWR caching for news (30 min), events (15 min), and jobs (30 min)
- Pagination throughout (12–25 items depending on context)
- Indexed database queries on status, batch year, and date fields

### Accessibility & UX
- Reduced-motion support for all CSS animations
- Skeleton loading states shaped like real content
- Empty states with icon, heading, and CTA — never plain text
- Mobile-first responsive layouts
