import GoogleProvider from 'next-auth/providers/google';
import NextAuth, { NextAuthOptions } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import SessionUser from '../../interface/sessionUser'; // Adjust the import path as needed
import bcrypt from 'bcrypt'; // Import bcrypt for password hashing
import jwt from 'jsonwebtoken'; // Import jsonwebtoken for token signing

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            profile(profile: any): SessionUser {
                if (!profile.sub) {
                    throw new Error('Profile id is missing in Google OAuth profile response');
                }
                const sessionUser: SessionUser = {
                    id: profile.sub,
                    name: `${profile.given_name} ${profile.family_name}`,
                    email: profile.email,
                    image: profile.picture,
                };
                return sessionUser;
            },
        }),
    ],
    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                // If user object is available (on sign-in)
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email ?? '' },
                });

                if (!existingUser) {
                    // Create a new user if they don't exist
                    const hashedPassword = await bcrypt.hash('', 10); // Hash an empty password
                    const newUser = await prisma.user.create({
                        data: {
                            userName: user.name ?? '',
                            email: user.email ?? '',
                            userImage: user.image,
                            roleId: 2,
                            firstName: user.name?.split(' ')[0] ?? '',
                            lastName: user.name?.split(' ')[1] ?? '',
                            password: hashedPassword,
                        },
                    });
                    // Create an account record for OAuth provider
                    await prisma.account.create({
                        data: {
                            userId: newUser.userId, // Reference to the newly created user
                            roleId: 2,
                            type: 'oauth',
                            provider: 'google',
                            providerAccountId: user.id,
                        },
                    });

                    // Sign a custom JWT token
                    const tokenPayload = { userId: newUser.userId, email: newUser.email, roleId: 2 };
                    const secret = process.env.JWT_SECRET as string; // Ensure your secret is set in the environment variables
                    const customToken = jwt.sign(tokenPayload, secret, { expiresIn: '5h' });

                    // Assign custom token and user details to the token
                    token.customToken = customToken;
                    token.id = newUser.userId;
                    token.name = user.name;
                    token.email = user.email;
                    token.image = user.image;

                } else {
                    // Update the user's information if needed
                    await prisma.user.update({
                        where: { email: user.email ?? '' },
                        data: {
                            userImage: user.image,
                        },
                    });

                    // Sign a custom JWT token
                    const tokenPayload = { userId: existingUser.userId, email: existingUser.email, roleId: 2 };
                    const secret = process.env.JWT_SECRET as string; // Ensure your secret is set in the environment variables
                    const customToken = jwt.sign(tokenPayload, secret, { expiresIn: '5h' });

                    // Assign existing user details to the token
                    token.customToken = customToken;
                    token.id = existingUser.userId;
                    token.name = existingUser.userName;
                    token.email = existingUser.email;
                    token.image = existingUser.userImage;
                }
            }

            return token; // Return the modified token
        },

        session: async ({ session, token }) => {
            if (!session.user) return session;

            const { id, image, email, role, name, customToken } = token;
            Object.assign(session.user, {
                id,
                image,
                email,
                role: role ?? 2,
                name,
                customToken,
            });

            return session;
        },
        async redirect({ baseUrl }) {
            return `${baseUrl}`; // Redirect to the base URL
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
