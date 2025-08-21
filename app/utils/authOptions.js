import CredentialsProvider from "next-auth/providers/credentials";
import apiEndpointCalls from "./apiCalls/apiEndpointCalls";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error(
            "Either email, username, phone number or password is required"
          );
        }

        try {
          const response = await apiEndpointCalls.signIn(credentials);
          if (response.status === "success") {
            return {
              ...response.data.user,
              userProfile: response.data.user.userProfile ?? null,
              accessToken: response.data.token, // <-- this is critical
            };
          } else {
            throw new Error(response.message);
          }
        } catch (error) {
          console.error("error occurred: ", error);
          throw new Error(
            `error occurred: ${error instanceof Error ? error.message : String(error)
            }`
          );
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      // console.log(`token before: ${JSON.stringify(token, null, 2)}`);
      // console.log(`user before: ${JSON.stringify(user, null, 2)}`);
      if (user) {
        return {
          ...token,
          id: user.id,
          username: user.username,
          uniqueId: user.uniqueId,
          matricNumber: user.matricNumber,
          firstName: user.firstName,
          lastName: user.lastName,
          gender: user.gender,
          email: user.email,
          phoneNumber: user.phoneNumber,
          profileStrength: user.profileStrength,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          roles: user.roles,
          accessToken: user.accessToken,
          userProfile: user.userProfile ?? null
        };
      }

      if (trigger === "update") {
        try {
          const response = await apiEndpointCalls.getUserById(token.id)
          token.userProfile = response.data.userProfile ?? null;
        } catch (error) {
          console.error("Failed to refresh profile:", error);
        }
      }
      // console.log(`token after: ${JSON.stringify(token, null, 2)}`);
      // console.log(`user after: ${JSON.stringify(user, null, 2)}`);
      return token;
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
        profileStrength: token.profileStrength,
        createdAt: token.createdAt,
        updatedAt: token.updatedAt,
        isActive: token.isActive,
        lastLogin: token.lastLogin,
        roles: token.roles,
        userProfile: token.userProfile ?? null
      };
      session.token = token.accessToken;
      return session;
    },
  },
};
