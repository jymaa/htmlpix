# Stripe Billing Verification Checklist

## Preconditions

- Stripe webhook endpoint points to `/stripe/webhook` for the target Convex deployment.
- Webhook includes at least:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.paid`
  - `invoice.payment_failed`
- Price IDs are configured:
  - `STRIPE_STARTER_PRICE_ID` (or fallback `NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID`)
  - `STRIPE_PRO_PRICE_ID` (or fallback `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID`)
  - `STRIPE_SCALE_PRICE_ID` (or fallback `NEXT_PUBLIC_STRIPE_SCALE_PRICE_ID`)

## Manual Test Matrix

1. Free -> Starter checkout
- Start from a user on free quota.
- Purchase Starter via checkout.
- Verify quota row: `plan=starter`, `monthlyLimit=1000`, active subscription metadata.

2. Starter -> Pro via customer portal
- Use Manage Billing portal and upgrade Starter to Pro.
- Return to settings and wait for background reconcile.
- Verify quota row: `plan=pro`, `monthlyLimit=3000`.

3. Pro -> Scale via customer portal
- Upgrade Pro to Scale in portal.
- Verify quota row: `plan=scale`, `monthlyLimit=10000`.

4. Downgrade/cancel at period end
- Set cancel at period end in portal.
- Verify `cancelAtPeriodEnd=true` and cancellation email workflow triggers once.
- Verify status remains usable until `currentPeriodEnd`.

5. Payment failure then recovery
- Trigger `invoice.payment_failed`.
- Verify `stripeSubscriptionStatus=past_due`.
- Trigger `invoice.paid`.
- Verify `stripeSubscriptionStatus=active` and period end update.

6. Webhook retry/out-of-order tolerance
- Replay same subscription webhook event multiple times.
- Verify no duplicate quota rows and idempotent final state.

7. Unknown/unconfigured price ID
- Emit subscription update with a price not in configured allowlist.
- Verify plan/monthlyLimit do not change and log contains `BILLING_UNMAPPED_PRICE`.

8. Checkout anti-abuse
- Attempt checkout for an unsupported price ID.
- Verify action rejects request.
- Attempt checkout while user already has active/trialing subscription.
- Verify action rejects and requires portal flow.

## Acceptance Criteria

- Entitlement (`plan`, `monthlyLimit`) only changes for mapped Stripe price IDs.
- Duplicate quotas are collapsed deterministically per user.
- Subscription sync can resolve by subscription, explicit user ID, or stripe customer mapping.
- Unknown price IDs never grant increased entitlement.
- API responds with `402` for `SUBSCRIPTION_INACTIVE`.
