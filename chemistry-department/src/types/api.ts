export interface Notice {
  id: number;
  title: string;
  category: string;
  details: string;
  pdf: string | null;
  pdf_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Faculty {
  id: number;
  name: string;
  designation: string;
  qualification: string;
  phd_subject: string;
  phd_title: string;
  description: string;
  email: string;
  phone: string;
  order: number;
  image: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Resource {
  id: number;
  title: string;
  file: string | null;
  file_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  details: string;
  image: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface HeroBanner {
  id: number;
  image: string;
  image_url: string | null;
  alt_text: string;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  head_name: string;
  head_designation: string;
  head_quote: string;
  head_message: string;
  head_image: string | null;
  head_image_url: string | null;
  address: string;
  phone: string;
  email: string;
  facebook_page_url: string;
  facebook_group_url: string;
  updated_at: string;
}

export type GalleryCategory =
  | "photo"
  | "video"
  | "wall_magazine";

export interface GalleryItem {
  id: number;
  category: GalleryCategory;
  title: string;
  description: string;
  image: string | null;
  image_url: string | null;
  video_url: string;
  date: string | null;
  created_at: string;
  updated_at: string;
}
