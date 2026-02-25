import { whopSdk, isWhopEnabled } from "./whop-sdk";
import { storage } from "../storage";
import { InsertStoredMember, MembershipStatus } from "@shared/schema";

const DEFAULT_COMMISSION_AMOUNT = 500; // $5.00 (50% of $10)

interface MembershipSyncResult {
  synced: number;
  newMembers: number;
  updatedMembers: number;
  commissionsProcessed: number;
  errors: string[];
}

function extractProfilePictureUrl(profilePicture: any): string | null {
  if (!profilePicture) return null;

  let profilePicUrl: string | null = null;
  if (typeof profilePicture === 'string') {
    profilePicUrl = profilePicture;
  } else if (typeof profilePicture === 'object') {
    profilePicUrl = profilePicture.url || profilePicture.image_url || null;
  }

  if (profilePicUrl && profilePicUrl.includes('/plain/')) {
    const lastPlainIndex = profilePicUrl.lastIndexOf('/plain/');
    const extractedUrl = profilePicUrl.substring(lastPlainIndex + 7);
    if (extractedUrl.startsWith('http')) {
      profilePicUrl = extractedUrl;
    }
  }

  return profilePicUrl;
}

/**
 * Sync memberships for an admin
 * 
 * NOTE: This function is DISABLED because whopSdk.memberships.list() returns 403 errors
 * due to permission restrictions in the Whop API for multi-tenant apps.
 * 
 * Members are now captured during payment processing via:
 * - /api/credits/process-payment endpoint (stores member in database)
 * - Whop webhooks for membership events
 * 
 * This function is kept for backwards compatibility but returns early.
 */
export async function syncMembershipsForCompany(
  adminCompanyId: string,
  adminUserId: string,
  commissionAmount: number = DEFAULT_COMMISSION_AMOUNT
): Promise<MembershipSyncResult> {
  const result: MembershipSyncResult = {
    synced: 0,
    newMembers: 0,
    updatedMembers: 0,
    commissionsProcessed: 0,
    errors: [],
  };

  // DISABLED: Whop memberships.list() API returns 403 for multi-tenant apps
  // Members are tracked via payment processing instead
  console.log(`[MembershipSync] Sync DISABLED - memberships are tracked via payment processing`);
  console.log(`[MembershipSync] Admin ${adminUserId} should use stored members from database`);

  return result;
}

async function processCommissionForMember(
  membershipId: string,
  adminUserId: string,
  customerUserId: string | undefined,
  commissionAmount: number
): Promise<boolean> {
  try {
    const existingMember = await storage.getStoredMemberByMembershipId(membershipId);
    if (existingMember?.commissionProcessed) {
      console.log(`[MembershipSync] Commission already processed for ${membershipId}`);
      return false;
    }

    const paymentId = `membership_${membershipId}`;
    const hasProcessed = await storage.hasProcessedPayment(paymentId, adminUserId);
    if (hasProcessed) {
      console.log(`[MembershipSync] Commission already recorded for ${membershipId}`);
      await storage.markMemberCommissionProcessed(membershipId);
      return false;
    }

    await storage.recordCommissionPayment({
      id: `comm_${membershipId}_${Date.now()}`,
      paymentId,
      adminUserId,
      amount: commissionAmount,
      commissionAmount,
      customerUserId: customerUserId || null,
      customerEmail: null,
    });

    await storage.markMemberCommissionProcessed(membershipId);

    console.log(`[MembershipSync] Commission of ${commissionAmount} added for admin ${adminUserId} from membership ${membershipId}`);
    return true;
  } catch (error) {
    console.error(`[MembershipSync] Error processing commission for ${membershipId}:`, error);
    return false;
  }
}

export async function syncAllAdminMemberships(commissionAmount: number = DEFAULT_COMMISSION_AMOUNT): Promise<Map<string, MembershipSyncResult>> {
  const results = new Map<string, MembershipSyncResult>();

  try {
    const admins = await storage.getAllAdmins();
    console.log(`[MembershipSync] Starting sync for ${admins.length} admins`);

    for (const admin of admins) {
      if (!admin.companyId) {
        console.log(`[MembershipSync] Skipping admin ${admin.userId} - no company ID`);
        continue;
      }

      const result = await syncMembershipsForCompany(admin.companyId, admin.userId, commissionAmount);
      results.set(admin.userId, result);
    }
  } catch (error) {
    console.error(`[MembershipSync] Error syncing all admin memberships:`, error);
  }

  return results;
}

let syncIntervalId: NodeJS.Timeout | null = null;

export function startMembershipSyncPolling(intervalMs: number = 5 * 60 * 1000): void {
  if (syncIntervalId) {
    console.log("[MembershipSync] Polling already running");
    return;
  }

  console.log(`[MembershipSync] Starting polling with interval ${intervalMs}ms`);

  syncAllAdminMemberships().catch(err => {
    console.error("[MembershipSync] Initial sync error:", err);
  });

  syncIntervalId = setInterval(() => {
    syncAllAdminMemberships().catch(err => {
      console.error("[MembershipSync] Scheduled sync error:", err);
    });
  }, intervalMs);
}

export function stopMembershipSyncPolling(): void {
  if (syncIntervalId) {
    clearInterval(syncIntervalId);
    syncIntervalId = null;
    console.log("[MembershipSync] Polling stopped");
  }
}
