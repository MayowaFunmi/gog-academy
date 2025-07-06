// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      uniqueId: string;
      matricNumber?: string;
      firstName: string;
      lastName: string;
      gender: "Male" | "Female";
      email: string;
      phoneNumber: string;
      password: string;
      createdAt: string;
      updatedAt: string;
      isActive: boolean;
      lastLogin?: string | null;
      roles: string[];
    };
    token: string;
  }
}
