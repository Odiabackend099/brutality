import { getAdminService } from '@/lib/services/admin-service'

export interface Usage {
  minutesUsed: number
  minutesQuota: number
  plan: string
  remaining: number
}

export async function getUsage(userId: string): Promise<Usage> {
  const adminService = getAdminService()
  return await adminService.getUserUsage(userId)
}

export async function assertWithinQuota(userId: string, secondsNeeded: number) {
  const usage = await getUsage(userId)
  const minutesNeeded = Math.ceil(secondsNeeded / 60)
  
  if (usage.remaining < minutesNeeded) {
    throw new Error('Quota exceeded. Please upgrade your plan.')
  }
  
  return true
}

export async function addUsage(
  userId: string,
  agentId: string,
  usage: {
    seconds: number
    kind: 'tts' | 'inference'
    costCents?: number
    meta?: Record<string, any>
  }
) {
  const adminService = getAdminService()
  await adminService.updateUserUsage(userId, agentId, usage)
}

