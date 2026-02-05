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
      previewText="Connexion avec ce lien magique"
      brandName={brandName}
      brandTagline={brandTagline}
      brandLogoUrl={brandLogoUrl}
    >
      <Heading style={styles.h1}>Connexion</Heading>
      <Link
        href={url}
        target="_blank"
        style={{
          ...styles.link,
          display: "block",
          marginBottom: "16px",
        }}
      >
        Cliquez ici pour vous connecter avec ce lien magique
      </Link>
      <Text
        style={{
          ...styles.text,
          color: "#ababab",
          marginTop: "14px",
          marginBottom: "16px",
        }}
      >
        Si vous n&apos;avez pas essayé de vous connecter, vous pouvez ignorer cet email.
      </Text>
    </BaseEmail>
  );
}
