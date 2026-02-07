import { Heading, Text, Link, Section, Hr } from "@react-email/components";
import { BaseEmail, styles } from "./components/BaseEmail";
import React from "react";

interface UpgradeNudgeEmailProps {
  name: string;
  remaining: number;
  unsubscribeUrl?: string;
}

export default function UpgradeNudgeEmail({ name, remaining, unsubscribeUrl }: UpgradeNudgeEmailProps) {
  return (
    <BaseEmail
      previewText={`You've got ${remaining} free renders left`}
      unsubscribeUrl={unsubscribeUrl}
      emailCategory="marketing"
    >
      <Heading style={styles.h1}>Your free renders</Heading>
      <Text style={styles.text}>Hey {name},</Text>
      <Text style={styles.text}>
        You have <strong>{remaining} renders</strong> left on your free plan this month.
      </Text>
      <Text style={styles.text}>
        If your project is picking up, the Starter plan gives you 1,000 renders/month
        for $9 — that&apos;s less than a cent per image.
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
          View plans
        </Link>
      </Section>

      <Hr style={{ borderColor: "#eee", margin: "24px 0" }} />
      <Text style={{ ...styles.text, color: "#898989", fontSize: "13px" }}>
        No pressure — the free tier resets every month.
      </Text>
    </BaseEmail>
  );
}
