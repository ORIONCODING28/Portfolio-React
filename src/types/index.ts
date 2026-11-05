export type Theme = 'dark' | 'light';
export type Language = 'it' | 'en';

export interface Project {
  status?: 'published' | 'draft';
  collaboration?: 'team' | 'personal';
  media?: { desktop?: string; mobile?: string; domain?: string; desktopVideo?: string; mobileVideo?: string; desktopPoster?: string; mobilePoster?: string };
  id?: number;
  title: string;
  slug: string;
  description: string;
  long_description?: string;
  short_description: string;
  image?: string;
  technologies: string;
  live_url?: string;
  project_url?: string;
  github_url?: string;
  category: string;
  featured: boolean;
  completed_date?: Date | string;
  order: number;
  features?: string[];
  created_at?: Date | string;
  updated_at?: Date | string;
}

export const CATEGORY_CHOICES = [
  { value: 'all', label: 'Tutti i Progetti' },
  { value: 'full stack', label: 'Full Stack' },
  { value: 'web development', label: 'Web Development' },
  { value: 'mobile', label: 'Mobile' }
];

export interface Skill {
  id?: number;
  name: string;
  category: 'frontend' | 'backend' | 'mobile' | 'database' | 'devops' | 'tools' | 'frameworks';
  proficiency: number; // 1-100 percentage
  icon: string;
  order: number;
  category_order: number;
}

export const SKILL_CATEGORIES = [
  { value: 'frontend', label: 'Front-end' },
  { value: 'backend', label: 'Back-end' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'database', label: 'Database' },
  { value: 'frameworks', label: 'Frameworks' },
  { value: 'tools', label: 'Tools & DevOps' }
];

export interface Experience {
  id?: number;
  title: string;
  company: string;
  location: string;
  description: string;
  start_date: Date | string;
  end_date?: Date | string;
  is_current: boolean;
  order: number;
}

export interface Education {
  id?: number;
  title: string;
  institution: string;
  hours?: number;
  description?: string;
  order: number;
}

export interface Certification {
  id?: number;
  title: string;
  issuing_organization: string;
  issue_date: Date | string;
  image?: string;
  certificate_image?: string;
  credential_url?: string;
  verification_url?: string;
  description?: string;
  order: number;
  badge?: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface SiteSettings {
  site_title: string;
  site_description: string;
  author_bio?: string;
  author_image?: string;
  homepage_image?: string;
  cv_file?: string;
  email?: string;
  location?: string;
  social_links?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    [key: string]: string | undefined;
  };
}

