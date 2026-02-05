import { query, mutation } from "./_generated/server";
import { components } from "./_generated/api";
import { v } from "convex/values";

export const hasCompletedOnboarding = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    // Query Better Auth user table via component adapter
    // userId here is actually the _id of the user document from Better Auth
    const user = await ctx.runQuery(components.betterAuth.adapter.findOne, {
      model: "user",
      where: [{ field: "_id", value: userId }],
    });

    return { completed: user?.onboardingCompleted === true };
  },
});

export const completeOnboarding = mutation({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    // Update Better Auth user with onboardingCompleted flag
    // userId here is actually the _id of the user document from Better Auth
    await ctx.runMutation(components.betterAuth.adapter.updateOne, {
      input: {
        model: "user",
        where: [{ field: "_id", value: userId }],
        update: { onboardingCompleted: true },
      },
    });

    return { success: true };
  },
});
