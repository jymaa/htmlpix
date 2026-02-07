import { query, mutation } from "./_generated/server";
import { components, internal } from "./_generated/api";
import { workflow } from "./emailWorkflows";

export const hasCompletedOnboarding = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const userId = identity.subject;

    const user = await ctx.runQuery(components.betterAuth.adapter.findOne, {
      model: "user",
      where: [{ field: "_id", value: userId }],
    });
    if (!user) throw new Error("Account not found");

    return { completed: user?.onboardingCompleted === true };
  },
});

export const completeOnboarding = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const userId = identity.subject;

    const user = await ctx.runQuery(components.betterAuth.adapter.findOne, {
      model: "user",
      where: [{ field: "_id", value: userId }],
    });
    if (!user) throw new Error("Account not found");

    await ctx.runMutation(components.betterAuth.adapter.updateOne, {
      input: {
        model: "user",
        where: [{ field: "_id", value: userId }],
        update: { onboardingCompleted: true },
      },
    });

    // Start welcome email workflow
    await workflow.start(ctx, internal.emailWorkflows.welcomeWorkflow, { userId });

    return { success: true };
  },
});
