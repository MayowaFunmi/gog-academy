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
  password?: string;
  profileStrength: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  lastLogin?: string | null;
  roles: UserRole[];
  userProfile?: UserProfile;
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
  gogMembershipYear: string;
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
  gogMembershipYear: string;
  previouslyApplied: boolean;
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
}

export interface ConsentData {
  consentCheck: boolean;
}

export interface SelectInputOption {
  label: string;
  value: string | number;
}

export interface ProfileForm
  extends BioData,
    SalvationData,
    MembershipData,
    ReferenceData,
    ConsentData {}

export interface ProfileResponse {
  status: string;
  message: string;
  data: UserProfile;
}

export const LOCAL_STORAGE_KEYS = {
  bioData: "profile_bioData",
  salvationData: "profile_salvationData",
  membershipData: "profile_membershipData",
  referenceData: "profile_referenceData",
  consentData: "profile_consentData",
};

export const STEP_KEYS: Record<number, keyof typeof LOCAL_STORAGE_KEYS> = {
  0: "bioData",
  1: "salvationData",
  2: "membershipData",
  3: "referenceData",
  4: "consentData",
};

export const STEP_FIELDS: Record<number, (keyof ProfileForm)[]> = {
  0: [
    "title",
    "dateOfBirth",
    "address",
    "stateOfResidence",
    "country",
    "maritalStatus",
    "occupation",
  ],
  1: ["salvationStatus", "salvationStory"],
  2: [
    "gogMembershipStatus",
    "gogMembershipYear",
    "previouslyApplied",
    "classCommitmentStatus",
    "assignmentCommitmentStatus",
    "reasonForJoining",
    "churchName",
  ],
  3: [
    "refereeName",
    "refereePhoneNumber",
    "refereeEmail",
    "refereeRelationship",
  ],
  4: ["consentCheck"],
};
