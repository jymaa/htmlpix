import { Heading, Text, Link, Section, Hr } from "@react-email/components";
import { BaseEmail, styles } from "./components/BaseEmail";
import React from "react";

interface UsageLimit100EmailProps {
  name: string;
  monthlyLimit: number;
  plan: string;
  unsubscribeUrl?: string;
}

export default function UsageLimit100Email({
  name,
  monthlyLimit,
  plan,
  unsubscribeUrl,
}: UsageLimit100EmailProps) {
  return (
    <BaseEmail
      previewText="You've reached your render limit"
      unsubscribeUrl={unsubscribeUrl}
      emailCategory="usage_alerts"
    >
      <Heading style={styles.h1}>Render limit reached</Heading>
      <Text style={styles.text}>Hey {name},</Text>
      <Text style={styles.text}>
        You&apos;ve used all <strong>{monthlyLimit.toLocaleString()}</strong> renders on your {plan} plan
        this month. New render requests will be rejected until your limit resets.
      </Text>
      {plan === "free" ? (
        <>
          <Text style={styles.text}>
            Upgrade to keep rendering — the Starter plan ($9/mo) gives you 1,000 renders.
          </Text>
          <Section style={{ textAlign: "center", margin: "32px 0" }}>
            <Link
              href="https://htmlpix.com/pricing"
              style={{
                backgroundColor: "#ff4d00",
                color: "#fff",
                padding: "12px 24px",
                borderRadius: "6px",
                fontFamily: styles.text.fontFamily,
                fontSize: "14px",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              Upgrade now
            </Link>
          </Section>
        </>
      ) : (
        <Text style={styles.text}>
          Your limit resets at the start of your next billing period. Need more capacity?{" "}
          <Link href="https://htmlpix.com/settings" style={styles.link}>
            Manage your plan
          </Link>
          .
        </Text>
      )}

      <Hr style={{ borderColor: "#eee", margin: "24px 0" }} />
      <Text style={{ ...styles.text, color: "#898989" }}>
        <Link href="https://htmlpix.com/dashboard" style={{ ...styles.link, color: "#898989" }}>
          View usage
        </Link>
      </Text>
    </BaseEmail>
  );
}
