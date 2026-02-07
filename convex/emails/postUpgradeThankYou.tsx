import { Heading, Text, Link, Hr } from "@react-email/components";
import { BaseEmail, styles } from "./components/BaseEmail";
import React from "react";

interface PostUpgradeThankYouEmailProps {
  name: string;
  plan: string;
  monthlyLimit: number;
  unsubscribeUrl?: string;
}

export default function PostUpgradeThankYouEmail({
  name,
  plan,
  monthlyLimit,
  unsubscribeUrl,
}: PostUpgradeThankYouEmailProps) {
  return (
    <BaseEmail
      previewText={`You're on ${plan} — here's what just unlocked`}
      unsubscribeUrl={unsubscribeUrl}
      emailCategory="transactional"
    >
      <Heading style={styles.h1}>You&apos;re on the {plan} plan</Heading>
      <Text style={styles.text}>Hey {name},</Text>
      <Text style={styles.text}>
        Thank you for upgrading! Here&apos;s what you now have access to:
      </Text>
      <Text style={styles.text}>
        <strong>{monthlyLimit.toLocaleString()} renders/month</strong> — that&apos;s your new
        limit. Your counter has been updated.
      </Text>
      <Text style={styles.text}>
        <strong>Priority rendering</strong> — paid plans get faster queue priority.
      </Text>
      <Text style={styles.text}>
        <strong>Image storage</strong> — rendered images are stored and accessible via URL for 30 days.
      </Text>
      <Text style={styles.text}>
        Your existing API keys work exactly the same — no code changes needed.
      </Text>

      <Hr style={{ borderColor: "#eee", margin: "24px 0" }} />
      <Text style={{ ...styles.text, color: "#898989" }}>
        <Link href="https://htmlpix.com/dashboard" style={{ ...styles.link, color: "#898989" }}>
          View your dashboard
        </Link>
        {" • "}
        <Link href="https://htmlpix.com/settings" style={{ ...styles.link, color: "#898989" }}>
          Manage subscription
        </Link>
      </Text>
    </BaseEmail>
  );
}
