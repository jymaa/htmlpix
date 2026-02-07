import { Heading, Text, Link, Section, Hr } from "@react-email/components";
import { BaseEmail, styles } from "./components/BaseEmail";
import React from "react";

interface UsageWarning75EmailProps {
  name: string;
  currentUsage: number;
  monthlyLimit: number;
  plan: string;
  unsubscribeUrl?: string;
}

export default function UsageWarning75Email({
  name,
  currentUsage,
  monthlyLimit,
  plan,
  unsubscribeUrl,
}: UsageWarning75EmailProps) {
  return (
    <BaseEmail
      previewText="You've used 75% of your monthly renders"
      unsubscribeUrl={unsubscribeUrl}
      emailCategory="usage_alerts"
    >
      <Heading style={styles.h1}>75% of your renders used</Heading>
      <Text style={styles.text}>Hey {name},</Text>
      <Text style={styles.text}>
        You&apos;ve used <strong>{currentUsage.toLocaleString()}</strong> of your{" "}
        <strong>{monthlyLimit.toLocaleString()}</strong> monthly renders on the {plan} plan.
      </Text>
      <Text style={styles.text}>
        At this pace, you may hit your limit before the month ends. You have a few options:
      </Text>
      <Text style={styles.text}>
        <strong>Optimize:</strong> Use content-hash caching to avoid re-rendering identical content.
      </Text>
      {plan === "free" && (
        <Text style={styles.text}>
          <strong>Upgrade:</strong> The Starter plan gives you 1,000 renders/month.
        </Text>
      )}

      <Hr style={{ borderColor: "#eee", margin: "24px 0" }} />
      <Text style={{ ...styles.text, color: "#898989" }}>
        <Link href="https://htmlpix.com/dashboard" style={{ ...styles.link, color: "#898989" }}>
          View usage
        </Link>
        {plan === "free" && (
          <>
            {" • "}
            <Link href="https://htmlpix.com/pricing" style={{ ...styles.link, color: "#898989" }}>
              View plans
            </Link>
          </>
        )}
      </Text>
    </BaseEmail>
  );
}
