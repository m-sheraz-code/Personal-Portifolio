export type PortfolioStatus = 'draft' | 'published';
export type ServiceStatus = 'draft' | 'published';

export interface Portfolio {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  tech_stack: string[];
  featured_image: string | null;
  gallery_images: string[];
  live_url: string | null;
  github_url: string | null;
  order_index: number;
  status: PortfolioStatus;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  short_description: string | null;
  description: string | null;
  icon: string | null;
  order_index: number;
  status: ServiceStatus;
  created_at: string;
  updated_at: string;
}

export interface PortfolioFormData {
  title: string;
  slug: string;
  description: string;
  tech_stack: string[];
  featured_image: string | null;
  gallery_images: string[];
  live_url: string;
  github_url: string;
  status: PortfolioStatus;
}

export interface ServiceFormData {
  title: string;
  short_description: string;
  description: string;
  icon: string;
  status: ServiceStatus;
}

export interface ReorderItem {
  id: string;
  order_index: number;
}

export interface DashboardStats {
  totalPortfolios: number;
  publishedPortfolios: number;
  draftPortfolios: number;
  totalServices: number;
  publishedServices: number;
  draftServices: number;
}
