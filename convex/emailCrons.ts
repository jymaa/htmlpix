import { internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { workflow } from "./emailWorkflows";

export const checkReEngagement = internalMutation({
  args: {},
  handler: async (ctx) => {
    const inactiveUsers = await ctx.runQuery(internal.emailHelpers.findInactiveUsers, {});

    for (const userId of inactiveUsers) {
      await workflow.start(ctx, internal.emailWorkflows.reEngagementWorkflow, {
        userId,
      });
    }
  },
});
