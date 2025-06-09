
export type UserRole = 'admin' | 'user' | 'editor';

export interface UserRoleRecord {
  id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
}

