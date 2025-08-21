// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";
import { UserProfile } from "./auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      uniqueId: string;
      matricNumber?: string | null;
      firstName: string;
      lastName: string;
      gender: "Male" | "Female";
      email: string;
      phoneNumber: string;
      profileStrength: number;
      // password: string;
      createdAt: string;
      updatedAt: string;
      isActive: boolean;
      lastLogin?: string | null;
      roles: string[];
      userProfile?: UserProfile | null
    };
    token: string;
    expires: string
  }
}
