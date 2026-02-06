import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { isAccountLocked, recordLoginAttempt, getRemainingLockoutTime, logAudit } from './audit'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Неверные учётные данные')
        }

        // Check if account is locked due to too many failed attempts
        const locked = await isAccountLocked(credentials.email)
        if (locked) {
          const remainingMinutes = await getRemainingLockoutTime(credentials.email)
          throw new Error(`Аккаунт временно заблокирован. Попробуйте через ${remainingMinutes} мин.`)
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) {
          await recordLoginAttempt(credentials.email, false)
          throw new Error('Неверные учётные данные')
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          await recordLoginAttempt(credentials.email, false)
          await logAudit({
            userEmail: credentials.email,
            action: 'LOGIN_FAILED',
            details: { reason: 'Invalid password' },
          })
          throw new Error('Неверные учётные данные')
        }

        // Successful login
        await recordLoginAttempt(credentials.email, true)
        await logAudit({
          userId: user.id,
          userEmail: user.email,
          action: 'LOGIN',
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
}
