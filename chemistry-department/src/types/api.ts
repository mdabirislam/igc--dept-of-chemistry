export interface ApiNotice {
  id: number;
  title: string;
  category: string;
  details: string;
  pdf: string | null;
  pdf_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiFaculty {
  id: number;
  name: string;
  designation: string;
  qualification: string;
  image: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiResource {
  id: number;
  title: string;
  type: string;
  file: string | null;
  file_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiEvent {
  id: number;
  title: string;
  date: string;
  location: string;
  details: string;
  created_at: string;
  updated_at: string;
}