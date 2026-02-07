import { WorkflowManager } from "@convex-dev/workflow";
import { components, internal } from "./_generated/api";
import { v } from "convex/values";

export const workflow = new WorkflowManager(components.workflow, {
  workpoolOptions: {
    retryActionsByDefault: true,
    defaultRetryBehavior: {
      maxAttempts: 3,
      initialBackoffMs: 1000,
      base: 2,
    },
  },
});

const DAY_MS = 24 * 60 * 60 * 1000;

// Welcome sequence: Day 0, 2, 5, 10
export const welcomeWorkflow = workflow.define({
  args: { userId: v.string() },
  handler: async (step, { userId }): Promise<void> => {
    await step.runMutation(internal.emailHelpers.ensureEmailPreferences, { userId });

    await step.runAction(internal.emailActions.sendWelcomeEmail, { userId });

    await step.runAction(internal.emailActions.sendQuickStartTipsEmail, { userId }, { runAfter: 2 * DAY_MS });

    await step.runAction(internal.emailActions.sendCheckInEmail, { userId }, { runAfter: 3 * DAY_MS });

    await step.runAction(internal.emailActions.sendUpgradeNudgeEmail, { userId }, { runAfter: 5 * DAY_MS });
  },
});

// Post-upgrade sequence: Day 0, 3
export const postUpgradeWorkflow = workflow.define({
  args: { userId: v.string() },
  handler: async (step, { userId }): Promise<void> => {
    await step.runMutation(internal.emailHelpers.ensureEmailPreferences, { userId });

    await step.runAction(internal.emailActions.sendPostUpgradeThankYouEmail, { userId });

    await step.runAction(
      internal.emailActions.sendPostUpgradeProTipsEmail,
      { userId },
      { runAfter: 3 * DAY_MS }
    );
  },
});

// First render: immediate
export const firstRenderWorkflow = workflow.define({
  args: { userId: v.string() },
  handler: async (step, { userId }): Promise<void> => {
    await step.runMutation(internal.emailHelpers.ensureEmailPreferences, { userId });
    await step.runAction(internal.emailActions.sendFirstRenderEmail, { userId });
  },
});

// Usage 75% warning: immediate
export const usage75Workflow = workflow.define({
  args: { userId: v.string() },
  handler: async (step, { userId }): Promise<void> => {
    await step.runMutation(internal.emailHelpers.ensureEmailPreferences, { userId });
    await step.runAction(internal.emailActions.sendUsageWarning75Email, { userId });
  },
});

// Usage 100% limit: immediate
export const usage100Workflow = workflow.define({
  args: { userId: v.string() },
  handler: async (step, { userId }): Promise<void> => {
    await step.runMutation(internal.emailHelpers.ensureEmailPreferences, { userId });
    await step.runAction(internal.emailActions.sendUsageLimit100Email, { userId });
  },
});

// Re-engagement: immediate (triggered by cron for each user)
export const reEngagementWorkflow = workflow.define({
  args: { userId: v.string() },
  handler: async (step, { userId }): Promise<void> => {
    await step.runMutation(internal.emailHelpers.ensureEmailPreferences, { userId });
    await step.runAction(internal.emailActions.sendReEngagementEmail, { userId });
  },
});

// Cancellation: immediate
export const cancellationWorkflow = workflow.define({
  args: { userId: v.string() },
  handler: async (step, { userId }): Promise<void> => {
    await step.runMutation(internal.emailHelpers.ensureEmailPreferences, { userId });
    await step.runAction(internal.emailActions.sendCancellationFeedbackEmail, { userId });
  },
});
