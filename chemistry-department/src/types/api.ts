export interface Notice {
  id: string;
  title: string;
  description?: string;
  category: string;
  date: string;
  time: string;
  pdfUrl?: string;
  createdAt: string;
}

export interface FacultyMember {
  id: string;
  name: string;
  designation: string;
  image?: string;
  email?: string;
  phone?: string;
}

export interface Resource {
  id: string;
  title: string;
  type: string;
  description?: string;
  fileUrl?: string;
  date: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  location?: string;
}