import { Heading, Text, Link, Hr } from "@react-email/components";
import { BaseEmail, styles } from "./components/BaseEmail";
import React from "react";

interface CancellationFeedbackEmailProps {
  name: string;
  plan: string;
  unsubscribeUrl?: string;
}

export default function CancellationFeedbackEmail({
  name,
  plan,
  unsubscribeUrl,
}: CancellationFeedbackEmailProps) {
  return (
    <BaseEmail
      previewText="We're sorry to see you go"
      unsubscribeUrl={unsubscribeUrl}
      emailCategory="transactional"
    >
      <Heading style={styles.h1}>Sorry to see you go</Heading>
      <Text style={styles.text}>Hey {name},</Text>
      <Text style={styles.text}>
        We see you&apos;ve cancelled your {plan} plan. Your subscription will remain active
        until the end of your current billing period — you won&apos;t lose access immediately.
      </Text>
      <Text style={styles.text}>
        If you have a moment, we&apos;d genuinely appreciate knowing why. Just reply to this
        email with a sentence or two — it helps us improve.
      </Text>
      <Text style={styles.text}>Common reasons we hear:</Text>
      <Text style={styles.text}>
        - Not using it enough to justify the cost{"\n"}
        - Missing a feature I needed{"\n"}
        - Found an alternative{"\n"}
        - Just testing it out
      </Text>
      <Text style={styles.text}>
        If you change your mind, you can resubscribe anytime from your{" "}
        <Link href="https://htmlpix.com/settings" style={styles.link}>
          settings page
        </Link>
        .
      </Text>

      <Hr style={{ borderColor: "#eee", margin: "24px 0" }} />
      <Text style={{ ...styles.text, color: "#898989", fontSize: "13px" }}>
        After your subscription ends, you&apos;ll be moved to the free tier (50 renders/month).
        Your API keys and data will be preserved.
      </Text>
    </BaseEmail>
  );
}
