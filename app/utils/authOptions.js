import CredentialsProvider from "next-auth/providers/credentials";
import apiEndpointCalls from './apiCalls/apiEndpointCalls'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Either email, username, phone number or password is required");
        }
        
        try {
          const response = await apiEndpointCalls.signIn(credentials)
          if (response.status === "success") {
            return response.data
          } else {
            throw new Error(response.message)
          }
          return response.data
        } catch (error) {
          console.error("error occurred: ", error)
          throw new Error(`error occurred: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    })
  ],
  pages: {
    signIn: "/auth/login"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token = {
          ...token,
          accessToken: user.accessToken,
          ...user
        }
      }
      console.log("token: ", token)
      return token
    },

    async session({ session, token }) {
      session.user = {
        id: token.id,
        username: token.username,
        uniqueId: token.uniqueId,
        matricNumber: token.matricNumber,
        firstName: token.firstName,
        lastName: token.lastName,
        gender: token.gender,
        email: token.email,
        phoneNumber: token.phoneNumber,
        createdAt: token.createdAt,
        updatedAt: token.updatedAt,
        isActive: token.isActive,
        lastLogin: token.lastLogin,
        roles: token.roles
      };
      session.token = token.accessToken
      console.log("session: ", session)
      return session
    }
  }
}