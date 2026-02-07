import "./polyfills";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { render } from "@react-email/components";
import React from "react";
import { sendEmailHelper } from "./email";

import WelcomeEmail from "./emails/welcome";
import QuickStartTipsEmail from "./emails/quickStartTips";
import CheckInEmail from "./emails/checkIn";
import UpgradeNudgeEmail from "./emails/upgradeNudge";
import PostUpgradeThankYouEmail from "./emails/postUpgradeThankYou";
import PostUpgradeProTipsEmail from "./emails/postUpgradeProTips";
import FirstRenderSuccessEmail from "./emails/firstRenderSuccess";
import UsageWarning75Email from "./emails/usageWarning75";
import UsageLimit100Email from "./emails/usageLimit100";
import ReEngagementEmail from "./emails/reEngagement";
import CancellationFeedbackEmail from "./emails/cancellationFeedback";

function buildUnsubscribeUrl(token: string, category: string): string {
  const siteUrl = process.env.CONVEX_SITE_URL || "https://htmlpix.com";
  return `${siteUrl}/unsubscribe?token=${token}&category=${category}`;
}

export const sendWelcomeEmail = internalAction({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const canSend = await ctx.runQuery(internal.emailHelpers.canSendEmail, {
      userId,
      category: "transactional",
    });
    if (!canSend) return;

    const wasSent = await ctx.runQuery(internal.emailHelpers.wasEmailSent, {
      userId,
      emailType: "welcome",
    });
    if (wasSent) return;

    const userInfo = await ctx.runQuery(internal.emailHelpers.getUserInfo, { userId });
    if (!userInfo) return;

    const token = await ctx.runQuery(internal.emailHelpers.getUnsubscribeToken, { userId });
    const html = await render(
      React.createElement(WelcomeEmail, {
        name: userInfo.name,
        unsubscribeUrl: token ? buildUnsubscribeUrl(token, "transactional") : undefined,
      })
    );

    await sendEmailHelper(ctx, {
      to: userInfo.email,
      subject: "Welcome to HTMLPix — your API key is ready",
      html,
    });

    await ctx.runMutation(internal.emailHelpers.recordEmailSent, {
      userId,
      emailType: "welcome",
    });
  },
});

export const sendQuickStartTipsEmail = internalAction({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const canSend = await ctx.runQuery(internal.emailHelpers.canSendEmail, {
      userId,
      category: "marketing",
    });
    if (!canSend) return;

    const wasSent = await ctx.runQuery(internal.emailHelpers.wasEmailSent, {
      userId,
      emailType: "quick_start_tips",
    });
    if (wasSent) return;

    const userInfo = await ctx.runQuery(internal.emailHelpers.getUserInfo, { userId });
    if (!userInfo) return;

    const token = await ctx.runQuery(internal.emailHelpers.getUnsubscribeToken, { userId });
    const html = await render(
      React.createElement(QuickStartTipsEmail, {
        name: userInfo.name,
        unsubscribeUrl: token ? buildUnsubscribeUrl(token, "marketing") : undefined,
      })
    );

    await sendEmailHelper(ctx, {
      to: userInfo.email,
      subject: "3 things most devs miss in HTMLPix",
      html,
    });

    await ctx.runMutation(internal.emailHelpers.recordEmailSent, {
      userId,
      emailType: "quick_start_tips",
    });
  },
});

export const sendCheckInEmail = internalAction({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const canSend = await ctx.runQuery(internal.emailHelpers.canSendEmail, {
      userId,
      category: "marketing",
    });
    if (!canSend) return;

    const wasSent = await ctx.runQuery(internal.emailHelpers.wasEmailSent, {
      userId,
      emailType: "check_in",
    });
    if (wasSent) return;

    const userInfo = await ctx.runQuery(internal.emailHelpers.getUserInfo, { userId });
    if (!userInfo) return;

    const token = await ctx.runQuery(internal.emailHelpers.getUnsubscribeToken, { userId });
    const html = await render(
      React.createElement(CheckInEmail, {
        name: userInfo.name,
        unsubscribeUrl: token ? buildUnsubscribeUrl(token, "marketing") : undefined,
      })
    );

    await sendEmailHelper(ctx, {
      to: userInfo.email,
      subject: "How's your integration going?",
      html,
    });

    await ctx.runMutation(internal.emailHelpers.recordEmailSent, {
      userId,
      emailType: "check_in",
    });
  },
});

export const sendUpgradeNudgeEmail = internalAction({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    // Only send if still on free plan
    const planInfo = await ctx.runQuery(internal.emailHelpers.getUserPlan, { userId });
    if (planInfo.plan !== "free") return;

    const canSend = await ctx.runQuery(internal.emailHelpers.canSendEmail, {
      userId,
      category: "marketing",
    });
    if (!canSend) return;

    const wasSent = await ctx.runQuery(internal.emailHelpers.wasEmailSent, {
      userId,
      emailType: "upgrade_nudge",
    });
    if (wasSent) return;

    const userInfo = await ctx.runQuery(internal.emailHelpers.getUserInfo, { userId });
    if (!userInfo) return;

    const remaining = planInfo.monthlyLimit - planInfo.currentUsage;
    const token = await ctx.runQuery(internal.emailHelpers.getUnsubscribeToken, { userId });
    const html = await render(
      React.createElement(UpgradeNudgeEmail, {
        name: userInfo.name,
        remaining: Math.max(0, remaining),
        unsubscribeUrl: token ? buildUnsubscribeUrl(token, "marketing") : undefined,
      })
    );

    await sendEmailHelper(ctx, {
      to: userInfo.email,
      subject: `You've got ${Math.max(0, remaining)} free renders left`,
      html,
    });

    await ctx.runMutation(internal.emailHelpers.recordEmailSent, {
      userId,
      emailType: "upgrade_nudge",
    });
  },
});

export const sendPostUpgradeThankYouEmail = internalAction({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const wasSent = await ctx.runQuery(internal.emailHelpers.wasEmailSent, {
      userId,
      emailType: "post_upgrade_thank_you",
    });
    if (wasSent) return;

    const userInfo = await ctx.runQuery(internal.emailHelpers.getUserInfo, { userId });
    if (!userInfo) return;

    const planInfo = await ctx.runQuery(internal.emailHelpers.getUserPlan, { userId });
    const token = await ctx.runQuery(internal.emailHelpers.getUnsubscribeToken, { userId });
    const html = await render(
      React.createElement(PostUpgradeThankYouEmail, {
        name: userInfo.name,
        plan: planInfo.plan,
        monthlyLimit: planInfo.monthlyLimit,
        unsubscribeUrl: token ? buildUnsubscribeUrl(token, "transactional") : undefined,
      })
    );

    await sendEmailHelper(ctx, {
      to: userInfo.email,
      subject: `You're on ${planInfo.plan} — here's what just unlocked`,
      html,
    });

    await ctx.runMutation(internal.emailHelpers.recordEmailSent, {
      userId,
      emailType: "post_upgrade_thank_you",
    });
  },
});

export const sendPostUpgradeProTipsEmail = internalAction({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const canSend = await ctx.runQuery(internal.emailHelpers.canSendEmail, {
      userId,
      category: "product_updates",
    });
    if (!canSend) return;

    const wasSent = await ctx.runQuery(internal.emailHelpers.wasEmailSent, {
      userId,
      emailType: "post_upgrade_pro_tips",
    });
    if (wasSent) return;

    const userInfo = await ctx.runQuery(internal.emailHelpers.getUserInfo, { userId });
    if (!userInfo) return;

    const planInfo = await ctx.runQuery(internal.emailHelpers.getUserPlan, { userId });
    const token = await ctx.runQuery(internal.emailHelpers.getUnsubscribeToken, { userId });
    const html = await render(
      React.createElement(PostUpgradeProTipsEmail, {
        name: userInfo.name,
        plan: planInfo.plan,
        unsubscribeUrl: token ? buildUnsubscribeUrl(token, "product_updates") : undefined,
      })
    );

    await sendEmailHelper(ctx, {
      to: userInfo.email,
      subject: `Get the most out of your ${planInfo.plan} plan`,
      html,
    });

    await ctx.runMutation(internal.emailHelpers.recordEmailSent, {
      userId,
      emailType: "post_upgrade_pro_tips",
    });
  },
});

export const sendFirstRenderEmail = internalAction({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const wasSent = await ctx.runQuery(internal.emailHelpers.wasEmailSent, {
      userId,
      emailType: "first_render",
    });
    if (wasSent) return;

    const userInfo = await ctx.runQuery(internal.emailHelpers.getUserInfo, { userId });
    if (!userInfo) return;

    const token = await ctx.runQuery(internal.emailHelpers.getUnsubscribeToken, { userId });
    const html = await render(
      React.createElement(FirstRenderSuccessEmail, {
        name: userInfo.name,
        unsubscribeUrl: token ? buildUnsubscribeUrl(token, "transactional") : undefined,
      })
    );

    await sendEmailHelper(ctx, {
      to: userInfo.email,
      subject: "Your first render worked!",
      html,
    });

    await ctx.runMutation(internal.emailHelpers.recordEmailSent, {
      userId,
      emailType: "first_render",
    });
  },
});

export const sendUsageWarning75Email = internalAction({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const canSend = await ctx.runQuery(internal.emailHelpers.canSendEmail, {
      userId,
      category: "usage_alerts",
    });
    if (!canSend) return;

    // Monthly dedup key
    const now = new Date();
    const emailType = `usage_75_${now.getFullYear()}_${now.getMonth() + 1}`;

    const wasSent = await ctx.runQuery(internal.emailHelpers.wasEmailSent, {
      userId,
      emailType,
    });
    if (wasSent) return;

    const userInfo = await ctx.runQuery(internal.emailHelpers.getUserInfo, { userId });
    if (!userInfo) return;

    const planInfo = await ctx.runQuery(internal.emailHelpers.getUserPlan, { userId });
    const token = await ctx.runQuery(internal.emailHelpers.getUnsubscribeToken, { userId });
    const html = await render(
      React.createElement(UsageWarning75Email, {
        name: userInfo.name,
        currentUsage: planInfo.currentUsage,
        monthlyLimit: planInfo.monthlyLimit,
        plan: planInfo.plan,
        unsubscribeUrl: token ? buildUnsubscribeUrl(token, "usage_alerts") : undefined,
      })
    );

    await sendEmailHelper(ctx, {
      to: userInfo.email,
      subject: "You've used 75% of your monthly renders",
      html,
    });

    await ctx.runMutation(internal.emailHelpers.recordEmailSent, {
      userId,
      emailType,
    });
  },
});

export const sendUsageLimit100Email = internalAction({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const canSend = await ctx.runQuery(internal.emailHelpers.canSendEmail, {
      userId,
      category: "usage_alerts",
    });
    if (!canSend) return;

    const now = new Date();
    const emailType = `usage_100_${now.getFullYear()}_${now.getMonth() + 1}`;

    const wasSent = await ctx.runQuery(internal.emailHelpers.wasEmailSent, {
      userId,
      emailType,
    });
    if (wasSent) return;

    const userInfo = await ctx.runQuery(internal.emailHelpers.getUserInfo, { userId });
    if (!userInfo) return;

    const planInfo = await ctx.runQuery(internal.emailHelpers.getUserPlan, { userId });
    const token = await ctx.runQuery(internal.emailHelpers.getUnsubscribeToken, { userId });
    const html = await render(
      React.createElement(UsageLimit100Email, {
        name: userInfo.name,
        monthlyLimit: planInfo.monthlyLimit,
        plan: planInfo.plan,
        unsubscribeUrl: token ? buildUnsubscribeUrl(token, "usage_alerts") : undefined,
      })
    );

    await sendEmailHelper(ctx, {
      to: userInfo.email,
      subject: "You've reached your render limit",
      html,
    });

    await ctx.runMutation(internal.emailHelpers.recordEmailSent, {
      userId,
      emailType,
    });
  },
});

export const sendReEngagementEmail = internalAction({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const canSend = await ctx.runQuery(internal.emailHelpers.canSendEmail, {
      userId,
      category: "marketing",
    });
    if (!canSend) return;

    const userInfo = await ctx.runQuery(internal.emailHelpers.getUserInfo, { userId });
    if (!userInfo) return;

    const token = await ctx.runQuery(internal.emailHelpers.getUnsubscribeToken, { userId });
    const html = await render(
      React.createElement(ReEngagementEmail, {
        name: userInfo.name,
        unsubscribeUrl: token ? buildUnsubscribeUrl(token, "marketing") : undefined,
      })
    );

    await sendEmailHelper(ctx, {
      to: userInfo.email,
      subject: "Your HTMLPix API key is still active",
      html,
    });

    await ctx.runMutation(internal.emailHelpers.recordEmailSent, {
      userId,
      emailType: "re_engagement",
    });
  },
});

export const sendCancellationFeedbackEmail = internalAction({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const wasSent = await ctx.runQuery(internal.emailHelpers.wasEmailSent, {
      userId,
      emailType: "cancellation_feedback",
    });
    if (wasSent) return;

    const userInfo = await ctx.runQuery(internal.emailHelpers.getUserInfo, { userId });
    if (!userInfo) return;

    const planInfo = await ctx.runQuery(internal.emailHelpers.getUserPlan, { userId });
    const token = await ctx.runQuery(internal.emailHelpers.getUnsubscribeToken, { userId });
    const html = await render(
      React.createElement(CancellationFeedbackEmail, {
        name: userInfo.name,
        plan: planInfo.plan,
        unsubscribeUrl: token ? buildUnsubscribeUrl(token, "transactional") : undefined,
      })
    );

    await sendEmailHelper(ctx, {
      to: userInfo.email,
      subject: "We're sorry to see you go",
      html,
    });

    await ctx.runMutation(internal.emailHelpers.recordEmailSent, {
      userId,
      emailType: "cancellation_feedback",
    });
  },
});
