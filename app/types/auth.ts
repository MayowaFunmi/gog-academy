export interface Role {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}
export interface UserRole {
  id: string
  userId: string
  roleId: string
  // role: Role

}
export interface User {
  id: string
  username: string
  uniqueId: string
  matricNumber?: string
  firstName: string
  lastName: string
  gender: "Male" | "Female";
  email: string
  phoneNumber: string
  password: string
  createdAt: string
  updatedAt: string
  isActive: boolean
  lastLogin?: string | null
  roles: string[]
}

export interface UserDataResponse {
  user: User;
  token: string;
}

export interface GenericResponse<T = unknown> {
  status: string;
  message: string;
  data?: T | null;
}

export interface AuthResponse extends GenericResponse<UserDataResponse> {
  data: UserDataResponse;
}

export interface RegisterFields {
  username: string
  firstName: string
  lastName: string
  gender: string
  email: string
  role: string
  phoneNumber: string
  password: string
}

export interface LoginFields {
  username: string
  password: string
}