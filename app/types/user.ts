export interface UserResponse {
  status: string;
  message: string;
  data: User;
}

export interface User {
  id: string;
  username: string;
  uniqueId: string;
  matricNumber?: string | null;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  lastLogin?: string | null;
  roles: UserRole[];
  userProfile: UserProfile;
}

export interface UserRole {
  id: string;
  userId: string;
  roleId: string;
  createdAt: string;
  updatedAt: string;
  role: Role;
}

export interface Role {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
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
  gogMembershipDate: string;
  classCommitmentStatus: boolean;
  assignmentCommitmentStatus: boolean;
  reasonForJoining: string;
  churchName: string;
  occupation: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
  refereeName: string;
  refereePhoneNumber: string;
  refereeEmail: string;
  refereeRelationship: string;
  consentCheck: boolean;
}

export interface BioData {
  title: string;
  dateOfBirth: string;
  address: string;
  stateOfResidence?: string;
  country: string;
  maritalStatus: string;
  occupation: string;
}

export interface SalvationData {
  salvationStatus: string;
  salvationStory: string;
}

export interface MembershipData {
  gogMembershipStatus: boolean;
  gogMembershipDate: string;
  previouslyApplied: boolean
  classCommitmentStatus: boolean;
  assignmentCommitmentStatus: boolean;
  reasonForJoining: string;
  churchName: string;
}

export interface ReferenceData {
  refereeName: string;
  refereePhoneNumber: string;
  refereeEmail: string;
  refereeRelationship: string;
  consentCheck: boolean;
};

export interface SelectInputOption {
  label: string;
  value: string | number;
}