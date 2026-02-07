import { Heading, Text, Link, Hr } from "@react-email/components";
import { BaseEmail, styles } from "./components/BaseEmail";
import React from "react";

interface CheckInEmailProps {
  name: string;
  unsubscribeUrl?: string;
}

export default function CheckInEmail({ name, unsubscribeUrl }: CheckInEmailProps) {
  return (
    <BaseEmail
      previewText="How's your integration going?"
      unsubscribeUrl={unsubscribeUrl}
      emailCategory="marketing"
    >
      <Heading style={styles.h1}>How&apos;s it going?</Heading>
      <Text style={styles.text}>Hey {name},</Text>
      <Text style={styles.text}>
        Just checking in — have you had a chance to try the API yet?
      </Text>
      <Text style={styles.text}>
        If you hit any snags, here are the most common fixes:
      </Text>
      <Text style={styles.text}>
        <strong>Fonts not rendering?</strong> Use web-safe fonts or pass a Google Fonts URL in your
        HTML <code style={styles.code}>&lt;link&gt;</code> tag. HTMLPix loads them automatically.
      </Text>
      <Text style={styles.text}>
        <strong>Images missing?</strong> Make sure external image URLs are absolute (start with https://)
        and publicly accessible.
      </Text>
      <Text style={styles.text}>
        <strong>Need help?</strong> Reply to this email or check the{" "}
        <Link href="https://htmlpix.com/docs/faq" style={styles.link}>
          FAQ
        </Link>
        .
      </Text>

      <Hr style={{ borderColor: "#eee", margin: "24px 0" }} />
      <Text style={{ ...styles.text, color: "#898989" }}>
        <Link href="https://htmlpix.com/dashboard" style={{ ...styles.link, color: "#898989" }}>
          View your dashboard
        </Link>
      </Text>
    </BaseEmail>
  );
}
