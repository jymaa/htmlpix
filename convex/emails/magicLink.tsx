import { Heading, Link, Text, Section, Hr } from "@react-email/components";
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
      previewText="Sign in to HTMLPix"
      brandName={brandName}
      brandTagline={brandTagline}
      brandLogoUrl={brandLogoUrl}
    >
      <Heading style={styles.h1}>Sign in to HTMLPix</Heading>
      <Text style={styles.text}>
        Click the button below to sign in to your account. This link expires in 10 minutes.
      </Text>

      <Link
        href={url}
        target="_blank"
        style={{
          display: "block",
          backgroundColor: "#ff4d00",
          color: "#fff",
          padding: "14px 24px",
          borderRadius: "6px",
          fontFamily: styles.text.fontFamily,
          fontSize: "14px",
          fontWeight: "bold",
          textDecoration: "none",
          textAlign: "center",
          margin: "32px 0",
        }}
      >
        Sign in
      </Link>

      <Hr style={{ borderColor: "#eee", margin: "24px 0" }} />
      <Text style={{ ...styles.text, color: "#898989", fontSize: "13px" }}>
        If you didn&apos;t request this email, you can safely ignore it.
      </Text>
    </BaseEmail>
  );
}
