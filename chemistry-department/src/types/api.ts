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
  created_at: string;
  updated_at: string;
}