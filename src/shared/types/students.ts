export interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  class: string;
  avatar?: string;
  onlineStatus: 'online' | 'offline';
  productivityScore: number; // 0-100
  lastActive: string; // ISO timestamp
  createdAt: string;
  updatedAt: string;
}

export interface StudentsListParams {
  page?: number;
  limit?: number;
  search?: string;
  class?: string;
  status?: 'online' | 'offline' | 'all';
  productivityMin?: number;
  productivityMax?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface StudentsListResponse {
  students: Student[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export type SortField = 'name' | 'class' | 'productivityScore' | 'lastActive';
export type SortOrder = 'asc' | 'desc';
