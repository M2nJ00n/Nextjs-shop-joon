import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import KakaoProvider from 'next-auth/providers/kakao'
import NaverProvider from 'next-auth/providers/naver'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from '@/db/mongoClient'
import dbConnect from '@/db/dbConnect'
import User from '@/db/models/user'
import bcrypt from 'bcryptjs'

const handler = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID || '',
      clientSecret: process.env.KAKAO_CLIENT_SECRET || '',
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID || '',
      clientSecret: process.env.NAVER_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error('Please provide email and password')
        }

        await dbConnect()
        
        // Find user by email
        const user = await User.findOne({ email: credentials.username })
        if (!user || !user.password) {
          throw new Error('No user found or password missing')
        }

        // Compare password
        const isMatch = await bcrypt.compare(credentials.password, user.password)
        if (!isMatch) {
          throw new Error('Invalid password')
        }

        return {
          id: user._id.toString(),
          name: user.nickname,
          email: user.email,
          role: user.user_type,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth?type=login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(session.user as any).role = token.role
      }
      return session
    },
  },
})

export { handler as GET, handler as POST }
