import { prisma } from './prisma'
import { Prisma } from '@prisma/client'

interface AuditLogParams {
  userId?: string
  userEmail?: string
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'LOGIN_FAILED'
  entityType?: string
  entityId?: string
  details?: Prisma.InputJsonValue
  ipAddress?: string
  userAgent?: string
}

export async function logAudit(params: AuditLogParams) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId,
        userEmail: params.userEmail,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        details: params.details,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
      },
    })
  } catch (error) {
    console.error('Failed to create audit log:', error)
  }
}

// Brute-force protection
const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_DURATION_MINUTES = 15

export async function recordLoginAttempt(
  email: string,
  success: boolean,
  ipAddress?: string,
  userAgent?: string
) {
  try {
    await prisma.loginAttempt.create({
      data: {
        email,
        success,
        ipAddress,
        userAgent,
      },
    })

    // Clean up old attempts (older than 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    await prisma.loginAttempt.deleteMany({
      where: {
        createdAt: { lt: oneDayAgo },
      },
    })
  } catch (error) {
    console.error('Failed to record login attempt:', error)
  }
}

export async function isAccountLocked(email: string): Promise<boolean> {
  try {
    const lockoutTime = new Date(Date.now() - LOCKOUT_DURATION_MINUTES * 60 * 1000)

    const recentFailedAttempts = await prisma.loginAttempt.count({
      where: {
        email,
        success: false,
        createdAt: { gte: lockoutTime },
      },
    })

    return recentFailedAttempts >= MAX_LOGIN_ATTEMPTS
  } catch (error) {
    console.error('Failed to check account lock status:', error)
    return false
  }
}

export async function getRemainingLockoutTime(email: string): Promise<number> {
  try {
    const lockoutTime = new Date(Date.now() - LOCKOUT_DURATION_MINUTES * 60 * 1000)

    const lastFailedAttempt = await prisma.loginAttempt.findFirst({
      where: {
        email,
        success: false,
        createdAt: { gte: lockoutTime },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!lastFailedAttempt) return 0

    const unlockTime = new Date(lastFailedAttempt.createdAt.getTime() + LOCKOUT_DURATION_MINUTES * 60 * 1000)
    const remainingMs = unlockTime.getTime() - Date.now()

    return Math.max(0, Math.ceil(remainingMs / 60000))
  } catch {
    return 0
  }
}
