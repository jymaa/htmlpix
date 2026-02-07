import { Heading, Text, Link, Hr } from "@react-email/components";
import { BaseEmail, styles } from "./components/BaseEmail";
import React from "react";

interface FirstRenderSuccessEmailProps {
  name: string;
  unsubscribeUrl?: string;
}

export default function FirstRenderSuccessEmail({ name, unsubscribeUrl }: FirstRenderSuccessEmailProps) {
  return (
    <BaseEmail
      previewText="Your first render worked!"
      unsubscribeUrl={unsubscribeUrl}
      emailCategory="transactional"
    >
      <Heading style={styles.h1}>Your first render worked!</Heading>
      <Text style={styles.text}>Hey {name},</Text>
      <Text style={styles.text}>
        Your first HTML-to-image render just completed successfully. You&apos;re all set up.
      </Text>
      <Text style={styles.text}>
        A few ideas for what to build next:
      </Text>
      <Text style={styles.text}>
        <strong>Open Graph images</strong> — generate dynamic social preview cards for every page
        on your site.
      </Text>
      <Text style={styles.text}>
        <strong>PDF-style reports</strong> — render styled HTML as high-res PNGs for reports,
        invoices, or certificates.
      </Text>
      <Text style={styles.text}>
        <strong>Email images</strong> — create complex layouts as images to sidestep email client
        rendering quirks.
      </Text>

      <Hr style={{ borderColor: "#eee", margin: "24px 0" }} />
      <Text style={{ ...styles.text, color: "#898989" }}>
        <Link href="https://htmlpix.com/docs/examples" style={{ ...styles.link, color: "#898989" }}>
          See more examples
        </Link>
        {" • "}
        <Link href="https://htmlpix.com/dashboard" style={{ ...styles.link, color: "#898989" }}>
          Dashboard
        </Link>
      </Text>
    </BaseEmail>
  );
}
