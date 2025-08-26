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
  matricNumber?: string | null
  firstName: string
  lastName: string
  gender: "Male" | "Female";
  email: string
  phoneNumber: string
  profileStrength: number;
  // password: string
  createdAt: string
  updatedAt: string
  isActive: boolean
  lastLogin?: string | null
  roles: string[]
  userProfile?: UserProfile | null
}

export interface UserProfile {
  id: string;
  cohortId: string;
  userId: string;
  title: string;
  dateOfBirth: string;
  address: string;
  stateOfResidence: string;
  country: string;
  maritalStatus: string;
  salvationStatus: string;
  salvationStory: string;
  gogMembershipStatus: boolean;
  gogMembershipYear: string;
  classCommitmentStatus: boolean;
  assignmentCommitmentStatus: boolean;
  reasonForJoining: string;
  churchName: string;
  occupation: string;
  profilePicture: string;
  createdAt: string;
  updatedAt: string;
  refereeName: string;
  refereePhoneNumber: string;
  refereeEmail: string;
  refereeRelationship: string;
  consentCheck: boolean;
}

export interface UserDataResponse {
  user: User;
  userProfile?: UserProfile
  accessToken: string;
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
  matricNumber?: string
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

export interface ActiveUserResponse {
  status: string
  message: string
  data: User[]
}