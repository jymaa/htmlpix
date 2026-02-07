import { Heading, Text, Link, Hr } from "@react-email/components";
import { BaseEmail, styles } from "./components/BaseEmail";
import React from "react";

interface ReEngagementEmailProps {
  name: string;
  unsubscribeUrl?: string;
}

export default function ReEngagementEmail({ name, unsubscribeUrl }: ReEngagementEmailProps) {
  return (
    <BaseEmail
      previewText="Your HTMLPix API key is still active"
      unsubscribeUrl={unsubscribeUrl}
      emailCategory="marketing"
    >
      <Heading style={styles.h1}>Your API key is still active</Heading>
      <Text style={styles.text}>Hey {name},</Text>
      <Text style={styles.text}>
        We noticed you haven&apos;t made any renders in a while. Your API key and account
        are still active — nothing has changed.
      </Text>
      <Text style={styles.text}>
        If you ran into issues, we&apos;d love to help. Here are a few things that might be useful:
      </Text>
      <Text style={styles.text}>
        <Link href="https://htmlpix.com/docs/quickstart" style={styles.link}>
          Quickstart guide
        </Link>
        {" — "}get up and running in under 5 minutes.
      </Text>
      <Text style={styles.text}>
        <Link href="https://htmlpix.com/docs/examples" style={styles.link}>
          Code examples
        </Link>
        {" — "}copy-paste recipes for common use cases.
      </Text>
      <Text style={styles.text}>
        Or just reply to this email — we read every one.
      </Text>

      <Hr style={{ borderColor: "#eee", margin: "24px 0" }} />
      <Text style={{ ...styles.text, color: "#898989" }}>
        <Link href="https://htmlpix.com/api-keys" style={{ ...styles.link, color: "#898989" }}>
          View your API keys
        </Link>
      </Text>
    </BaseEmail>
  );
}
