import { Heading, Link, Text } from "@react-email/components";
import { BaseEmail, styles } from "./components/BaseEmail";
import React from "react";

interface MagicLinkEmailProps {
  url: string;
  brandName?: string;
  brandTagline?: string;
  brandLogoUrl?: string;
}

export default function MagicLinkEmail({ url, brandName, brandTagline, brandLogoUrl }: MagicLinkEmailProps) {
  return (
    <BaseEmail
      previewText="Connect with this magic link"
      brandName={brandName}
      brandTagline={brandTagline}
      brandLogoUrl={brandLogoUrl}
    >
      <Heading style={styles.h1}>Connect</Heading>
      <Link
        href={url}
        target="_blank"
        style={{
          ...styles.link,
          display: "block",
          marginBottom: "16px",
        }}
      >
        Click here to connect with this magic link
      </Link>
      <Text
        style={{
          ...styles.text,
          color: "#ababab",
          marginTop: "14px",
          marginBottom: "16px",
        }}
      >
        If you did not try to connect, you can ignore this email.
      </Text>
    </BaseEmail>
  );
}
